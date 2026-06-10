# 작업 히스토리

---

## 2026-06-08

### 1. Supabase MCP 연결

- Supabase MCP 서버 인증 및 연결 완료

---

### 2. 테이블 초기화 및 재생성

- 기존 테이블 5개 전체 삭제 후 스키마 재설계
- `profiles` · `posts` · `inquiries` · `products` 생성
- RLS 활성화 + 정책 등록
- `handle_new_user` 트리거 (auth.users → profiles 자동 생성)
- `handle_updated_at` 트리거 (4개 테이블)

---

### 3. 요구사항 설계

- `docs/spec/spec-fixed.md` 생성 — 20개 요구사항 + 20개 에지케이스 도출

---

## 2026-06-09

### 4. profiles — email 컬럼 추가

```sql
ALTER TABLE public.profiles ADD COLUMN email character varying;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_email_unique UNIQUE (email);
```

---

### 5. winoz@naver.com 계정 삭제

- `auth.users` 삭제 → `profiles` CASCADE 삭제

---

### 6. 회원가입 페이지 — 이름·이메일·비밀번호만 입력

- 전화번호·주소는 **마이페이지 프로필 수정**에서 입력하는 것으로 확정
- `Register.jsx`: 이름, 이메일, 비밀번호, 비밀번호 확인 4개 필드만 유지

---

### 7. 아바타 이미지 기능

**Storage 버킷 생성:**
```sql
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
-- avatars RLS 정책 4개 등록 (select/insert/update/delete)
```

**서비스 추가 (`services/auth.js`):**
- `uploadAvatar(userId, file)` — `avatars/{userId}/avatar.{ext}` upsert 업로드
- `deleteAvatar(userId)` — 스토리지 파일 삭제 + `profiles.avatar_url = null`

**MyPage.jsx:**
- 프로필 사진 섹션 추가 (등록 / 변경 / 삭제)
- 파일 유효성 검사: 이미지 타입, 2MB 제한

---

### 8. Header — 아바타 표시 + 모바일 드로워

**아바타 표시:**
- 데스크탑 GNB: 이름 왼쪽에 `w-7 h-7` 원형 아바타
- 모바일 드로워: `w-6 h-6` 원형 아바타
- 아바타 없을 시 이름 첫 글자 플레이스홀더

**모바일 드로워:**
- 오른쪽 슬라이드인 (translateX 트랜지션 300ms)
- 딤 오버레이 클릭 시 닫힘
- 드로워 열린 동안 body 스크롤 잠금
- 로그인 상태 시 아바타·이름·이메일 표시

---

### 9. 로그인 — 로그인 유지하기 체크박스

- `Login.jsx`: 체크박스 추가 (기본값: 체크됨)
- 미체크 시 `sessionStorage._no_persist = '1'` 저장
- `useAuth.jsx`: `beforeunload` 이벤트에서 플래그 확인 → signOut 호출
- 효과: 탭/브라우저 종료 시 세션 만료

---

### 10. handle_new_user 트리거 업데이트 (2회)

```sql
-- 1차: phone · zipcode · address1 · address2 메타데이터 지원
-- 2차: new.email → profiles.email 자동 저장 (이메일 중복확인 지원)
create or replace function public.handle_new_user() ...
```

---

### 11. admin 제품 등록 기능

**라우트 추가:** `/products/new` (admin 전용)

**서비스 추가 (`services/products.js`):**
- `uploadProductImage(file)` — `products` 버킷 업로드
- `createProduct({name, description, image_url, price, is_active})`

**신규 페이지:** `pages/products/ProductWrite.jsx`
- 이미지 업로드 (클릭 영역), 제품명, 설명, 가격, 노출 여부 입력
- 등록 후 제품 상세 페이지로 이동

**ProtectedRoute 업데이트:**
- `role` prop 추가 — admin 외 접근 시 `/`로 리다이렉트

**ProductList.jsx:**
- admin에게만 "제품 등록" 버튼 노출 (우상단)

---

### 12. 회원가입 — 이메일 중복확인 버튼

**서비스 추가 (`services/auth.js`):**
- `checkEmailDuplicate(email)` — `profiles.email` 조회 후 중복 여부 반환

**Register.jsx:**
- 이메일 필드 우측 "중복확인" 버튼
- 사용 가능: 초록 테두리 + 안내 메시지
- 중복: 빨간 메시지
- 이메일 수정 시 확인 상태 초기화
- 폼 제출 시 중복확인 미완료 → 오류 차단

---

### 13. 회원가입 완료 후 메인페이지로 이동

- `Register.jsx` navigate 경로: `/auth/login` → `/`

---

### 14. post_likes — 게시글 좋아요

**DB:**
```sql
create table public.post_likes (
  id bigint generated always as identity primary key,
  post_id bigint not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  unique (post_id, user_id)
);
-- RLS: select(전체) / insert(본인) / delete(본인)
```

**서비스 추가 (`services/posts.js`):**
- `getLikedPosts(userId)` — 내가 좋아요한 게시물 목록 (posts + profiles 조인)
- `getPostLikes(postId, userId)` — 좋아요 수 + 내 좋아요 여부
- `likePost(postId, userId)` / `unlikePost(postId, userId)`

**BoardDetail.jsx:**
- `getPost` + `getPostLikes` 병렬 호출
- 본문 하단 ♡/♥ 토글 버튼 + 카운트 (낙관적 업데이트 + 실패 시 롤백)
- 비로그인: 버튼 disabled, 카운트는 표시

**BoardList.jsx:**
- `getPosts` 쿼리에 `post_likes(count)` 집계 추가
- 좋아요 1개 이상 게시글에 ♥ N 표시

---

### 16. 홈 Hero — 100vh Swiper 슬라이더

**패키지 추가:** `swiper@12`

**Home.jsx Hero 섹션 재작성:**
- 높이: `calc(100vh - 60px)` (헤더 제외 전체 화면)
- Swiper 모듈: Autoplay(5초) · Navigation · Pagination · Loop

**슬라이드 3개 (Unsplash 무료 이미지):**

| # | 이미지 | 태그 | 제목 | CTA |
|---|--------|------|------|-----|
| 1 | 오피스 공간 | 혁신의 시작 | 기술로 만드는 더 나은 내일 | 제품 보기 |
| 2 | 팀 협업 | 함께하는 성장 | 신뢰를 바탕으로 고객과 함께 | 회사 소개 |
| 3 | 우주·기술 | 미래를 향해 | 지속 가능한 혁신으로 세상을 바꿉니다 | 문의하기 |

**애니메이션 (`src/index.css`):**
- 텍스트: `.swiper-slide-active` 진입 시 태그→제목→설명→버튼 순차 페이드업 (`heroFadeUp`, 딜레이 0.1s~0.55s)
- 배경 이미지: 켄 번스 효과 — 6초간 `scale(1) → scale(1.08)` 줌인 (`kenBurns`)
- 비활성 슬라이드 이미지는 `scale(1.08)` 대기 상태 유지

---

### 15. 마이페이지 — 탭 메뉴

- 탭 구성: **나의 프로필** | **게시물 좋아요**
- 나의 프로필: 기존 아바타 + 프로필 정보 폼
- 게시물 좋아요: 좋아요한 게시글 목록 (제목·작성자·날짜, 클릭 시 상세 이동)
- 탭 전환 시 데이터 지연 로딩
