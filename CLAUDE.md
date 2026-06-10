# CLAUDE.md — mycompany 프로젝트

## 문서 인덱스

| 문서 | 경로 |
|------|------|
| 요구사항 (20개 + 에지케이스) | [`docs/spec/spec-fixed.md`](docs/spec/spec-fixed.md) |
| 디자인 시스템 (토큰·컴포넌트) | [`docs/design/design-system.md`](docs/design/design-system.md) |
| DB 스키마 (테이블·RLS·트리거) | [`docs/database/schema.md`](docs/database/schema.md) |
| 작업 히스토리 | [`docs/history.md`](docs/history.md) |

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| Frontend | React 18, React Router v6, Swiper 12 |
| Styling | Tailwind CSS v3 |
| Backend / DB | Supabase (Auth · Database · Storage) |
| 언어 | JavaScript |
| 빌드 도구 | Vite |
| 패키지 매니저 | npm |

---

## IA — 라우트 구조

```
/                           홈
/about/overview             회사개요
/about/history              연혁
/about/location             오시는 길
/products                   제품 목록
/products/:id               제품 상세
/products/new       🔒👑    제품 등록 (admin)
/board                      게시글 목록
/board/:id                  게시글 상세
/board/write        🔒      게시글 작성 (로그인)
/board/:id/edit     🔒      게시글 수정 (본인)
/contact/write      🔒      문의 작성 (로그인)
/contact/my         🔒      내 문의 내역 (로그인)
/auth/login                 로그인
/auth/register              회원가입
/mypage             🔒      마이페이지 (로그인)
```

### 접근 권한

| 페이지 | 비로그인 | user | admin |
|--------|:-------:|:----:|:-----:|
| 홈 · 회사소개 · 제품 · 게시판 목록·상세 | ✅ | ✅ | ✅ |
| 게시글 작성 | ❌ | ✅ | ✅ |
| 게시글 수정·삭제 | ❌ | ✅ 본인 | ✅ 전체 |
| 문의 작성·내역 | ❌ | ✅ 본인 | ✅ 전체 |
| 마이페이지 | ❌ | ✅ | ✅ |
| 제품 등록 (`/products/new`) | ❌ | ❌ | ✅ |

> `ProtectedRoute`에 `role` prop 지원 — `<ProtectedRoute role="admin" />`

---

## 프로젝트 구조

```
src/
├── components/
│   ├── common/     # Button · Input · Modal · Pagination · Toast
│   ├── layout/     # Header(GNB+드로워) · Footer · ProtectedRoute(role 지원)
│   ├── auth/       # 로그인·회원가입 폼
│   ├── board/      # 게시글 목록·카드·에디터
│   └── contact/    # 문의 폼·내역
├── pages/
│   ├── Home.jsx
│   ├── about/      # Overview · History · Location
│   ├── products/   # ProductList · ProductDetail · ProductWrite
│   ├── board/      # BoardList(좋아요수) · BoardDetail(좋아요버튼) · BoardWrite · BoardEdit
│   ├── contact/    # ContactWrite · ContactMy
│   ├── auth/       # Login(로그인유지) · Register(이메일중복확인)
│   └── MyPage.jsx  # 탭: 나의프로필 · 게시물좋아요
├── hooks/          # useAuth(beforeunload 세션) · usePosts · useContact
├── lib/            # supabase.js  ← 단일 인스턴스
├── services/       # auth · posts(좋아요CRUD) · inquiries · products API
└── utils/          # 날짜 포맷 · 유효성 검사
```

## services 주요 함수

### services/auth.js
| 함수 | 설명 |
|------|------|
| `signUp` | 회원가입 |
| `signIn` | 로그인 |
| `signOut` | 로그아웃 |
| `checkEmailDuplicate(email)` | 이메일 중복 확인 |
| `getProfile(userId)` | 프로필 조회 |
| `updateProfile(userId, updates)` | 프로필 수정 |
| `uploadAvatar(userId, file)` | 아바타 업로드 |
| `deleteAvatar(userId)` | 아바타 삭제 |

### services/posts.js
| 함수 | 설명 |
|------|------|
| `getPosts({page, pageSize})` | 목록 조회 (좋아요수 포함) |
| `getPost(id)` | 상세 조회 |
| `createPost` / `updatePost` / `deletePost` | CRUD |
| `getLikedPosts(userId)` | 내가 좋아요한 게시물 목록 |
| `getPostLikes(postId, userId)` | 좋아요 수 + 내 좋아요 여부 |
| `likePost(postId, userId)` | 좋아요 추가 |
| `unlikePost(postId, userId)` | 좋아요 취소 |

### services/products.js
| 함수 | 설명 |
|------|------|
| `getProducts` / `getProduct(id)` | 목록·상세 조회 |
| `createProduct(data)` | 제품 등록 (admin) |
| `uploadProductImage(file)` | 제품 이미지 업로드 |

---

## Storage 버킷

| 버킷 | 공개 | 용도 | 경로 패턴 |
|------|------|------|-----------|
| `avatars` | ✅ | 회원 프로필 사진 | `{userId}/avatar.{ext}` |
| `products` | ✅ | 제품 이미지 | `{timestamp}.{ext}` |

---

## 환경변수

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> Supabase MCP 연결 완료 — `apply_migration` · `execute_sql` · `list_tables` 사용 가능

---

## 코딩 규칙

- 컴포넌트: 함수형 · Props 구조분해할당
- Supabase 호출은 `services/` 레이어에만 — 컴포넌트 직접 호출 금지
- 에러 처리: `try/catch` + toast 또는 인라인 메시지
- Tailwind 클래스는 컴포넌트 내부만 — 인라인 `style` 지양
- 민감 정보는 환경변수 관리 — 코드 하드코딩 금지
- 컬러·폰트·간격은 `docs/design/design-system.md` 토큰 기준

---

## 명령어

```bash
npm install      # 의존성 설치
npm run dev      # 개발 서버 → http://localhost:5173
npm run build    # 프로덕션 빌드
npm run preview  # 빌드 결과 미리보기
```
