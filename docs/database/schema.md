# Database Schema

> 기준일: 2026-06-09 | Supabase PostgreSQL

---

## 목차

1. [테이블 목록](#1-테이블-목록)
2. [profiles](#2-profiles)
3. [posts](#3-posts)
4. [post_likes](#4-post_likes)
5. [inquiries](#5-inquiries)
6. [products](#6-products)
7. [Storage 버킷](#7-storage-버킷)
8. [RLS 정책](#8-rls-정책)
9. [트리거](#9-트리거)
10. [마이그레이션 순서](#10-마이그레이션-순서)

---

## 1. 테이블 목록

| 테이블 | 설명 | RLS | 관계 |
|--------|------|-----|------|
| `profiles` | 회원 프로필 | ✅ | `auth.users` 1:1 |
| `posts` | 게시판 게시글 | ✅ | `profiles` N:1 |
| `post_likes` | 게시글 좋아요 | ✅ | `posts` N:1 · `profiles` N:1 |
| `inquiries` | 온라인 문의 | ✅ | `profiles` N:1 |
| `products` | 제품 목록 | ✅ | 독립 |

---

## 2. profiles

회원가입 시 `auth.users` INSERT 트리거로 자동 생성됨.

```sql
create table public.profiles (
  id         uuid         primary key references auth.users(id) on delete cascade,
  email      varchar      unique,
  name       varchar(50)  not null,
  phone      varchar(20),
  zipcode    varchar(10),
  address1   varchar(255),
  address2   varchar(255),
  role       varchar(20)  default 'user' check (role in ('user', 'admin')),
  avatar_url text,
  created_at timestamptz  default now(),
  updated_at timestamptz  default now()
);
```

### 컬럼 설명

| 컬럼 | 타입 | 필수 | 기본값 | 설명 |
|------|------|------|--------|------|
| `id` | uuid | ✅ | — | `auth.users.id` 참조 (PK) |
| `email` | varchar | — | null | 이메일 (UNIQUE, 트리거로 자동 저장) |
| `name` | varchar(50) | ✅ | — | 회원 이름 |
| `phone` | varchar(20) | — | null | 전화번호 (마이페이지에서 입력) |
| `zipcode` | varchar(10) | — | null | 우편번호 (마이페이지에서 입력) |
| `address1` | varchar(255) | — | null | 기본주소 (마이페이지에서 입력) |
| `address2` | varchar(255) | — | null | 상세주소 (마이페이지에서 입력) |
| `role` | varchar(20) | — | `'user'` | 권한: `user` \| `admin` |
| `avatar_url` | text | — | null | 프로필 이미지 URL (avatars 버킷) |
| `created_at` | timestamptz | — | `now()` | 생성일시 |
| `updated_at` | timestamptz | — | `now()` | 수정일시 |

> phone · zipcode · address1 · address2는 회원가입 시 입력하지 않고, **마이페이지 프로필 수정**에서만 입력

---

## 3. posts

```sql
create table public.posts (
  id         bigint       generated always as identity primary key,
  user_id    uuid         not null references public.profiles(id) on delete cascade,
  title      varchar(200) not null,
  content    text         not null,
  created_at timestamptz  default now(),
  updated_at timestamptz  default now()
);
```

### 컬럼 설명

| 컬럼 | 타입 | 필수 | 기본값 | 설명 |
|------|------|------|--------|------|
| `id` | bigint | ✅ | auto | PK, 자동 증가 |
| `user_id` | uuid | ✅ | — | `profiles.id` 참조 |
| `title` | varchar(200) | ✅ | — | 게시글 제목 |
| `content` | text | ✅ | — | 게시글 본문 |
| `created_at` | timestamptz | — | `now()` | 작성일시 |
| `updated_at` | timestamptz | — | `now()` | 수정일시 |

---

## 4. post_likes

게시글 좋아요. 사용자당 게시글 1개 좋아요 제한 (UNIQUE 제약).

```sql
create table public.post_likes (
  id         bigint      generated always as identity primary key,
  post_id    bigint      not null references public.posts(id) on delete cascade,
  user_id    uuid        not null references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  unique (post_id, user_id)
);
```

### 컬럼 설명

| 컬럼 | 타입 | 필수 | 기본값 | 설명 |
|------|------|------|--------|------|
| `id` | bigint | ✅ | auto | PK, 자동 증가 |
| `post_id` | bigint | ✅ | — | `posts.id` 참조 |
| `user_id` | uuid | ✅ | — | `profiles.id` 참조 |
| `created_at` | timestamptz | — | `now()` | 좋아요 일시 |

---

## 5. inquiries

```sql
create table public.inquiries (
  id         bigint       generated always as identity primary key,
  user_id    uuid         not null references public.profiles(id) on delete cascade,
  title      varchar(200) not null,
  content    text         not null,
  status     varchar(20)  default 'pending' check (status in ('pending', 'answered', 'closed')),
  created_at timestamptz  default now(),
  updated_at timestamptz  default now()
);
```

### 컬럼 설명

| 컬럼 | 타입 | 필수 | 기본값 | 설명 |
|------|------|------|--------|------|
| `id` | bigint | ✅ | auto | PK, 자동 증가 |
| `user_id` | uuid | ✅ | — | `profiles.id` 참조 |
| `title` | varchar(200) | ✅ | — | 문의 제목 |
| `content` | text | ✅ | — | 문의 내용 |
| `status` | varchar(20) | — | `'pending'` | 상태: `pending` \| `answered` \| `closed` |
| `created_at` | timestamptz | — | `now()` | 작성일시 |
| `updated_at` | timestamptz | — | `now()` | 수정일시 |

---

## 6. products

```sql
create table public.products (
  id          bigint       generated always as identity primary key,
  name        varchar(200) not null,
  description text,
  image_url   text,
  price       integer      default 0,
  is_active   boolean      default true,
  created_at  timestamptz  default now(),
  updated_at  timestamptz  default now()
);
```

### 컬럼 설명

| 컬럼 | 타입 | 필수 | 기본값 | 설명 |
|------|------|------|--------|------|
| `id` | bigint | ✅ | auto | PK, 자동 증가 |
| `name` | varchar(200) | ✅ | — | 제품명 |
| `description` | text | — | null | 제품 설명 |
| `image_url` | text | — | null | 제품 이미지 URL (products 버킷) |
| `price` | integer | — | `0` | 가격 (원) |
| `is_active` | boolean | — | `true` | 노출 여부 |
| `created_at` | timestamptz | — | `now()` | 등록일시 |
| `updated_at` | timestamptz | — | `now()` | 수정일시 |

---

## 7. Storage 버킷

| 버킷 | 공개 | 용도 | 경로 패턴 | 업로드 제한 |
|------|------|------|-----------|------------|
| `avatars` | ✅ | 회원 프로필 사진 | `{userId}/avatar.{ext}` | 2MB, 이미지만 |
| `products` | ✅ | 제품 이미지 | `{timestamp}.{ext}` | 5MB, 이미지만 |

### avatars RLS 정책

```sql
create policy "avatars_select_all" on storage.objects
  for select using (bucket_id = 'avatars');

create policy "avatars_insert_own" on storage.objects
  for insert with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "avatars_update_own" on storage.objects
  for update using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "avatars_delete_own" on storage.objects
  for delete using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
```

---

## 8. RLS 정책

### 활성화

```sql
alter table public.profiles  enable row level security;
alter table public.posts     enable row level security;
alter table public.post_likes enable row level security;
alter table public.inquiries enable row level security;
alter table public.products  enable row level security;
```

### profiles

```sql
create policy "profiles_select_all" on public.profiles
  for select using (true);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

create policy "profiles_update_admin" on public.profiles
  for update using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );
```

### posts

```sql
create policy "posts_select_all" on public.posts
  for select using (true);

create policy "posts_insert_auth" on public.posts
  for insert with check (auth.uid() = user_id);

create policy "posts_update_own" on public.posts
  for update using (
    auth.uid() = user_id or
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "posts_delete_own" on public.posts
  for delete using (
    auth.uid() = user_id or
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );
```

### post_likes

```sql
create policy "likes_select_all" on public.post_likes
  for select using (true);

create policy "likes_insert_own" on public.post_likes
  for insert with check (auth.uid() = user_id);

create policy "likes_delete_own" on public.post_likes
  for delete using (auth.uid() = user_id);
```

### inquiries

```sql
create policy "inquiries_select_own" on public.inquiries
  for select using (
    auth.uid() = user_id or
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "inquiries_insert_auth" on public.inquiries
  for insert with check (auth.uid() = user_id);

create policy "inquiries_update_own" on public.inquiries
  for update using (
    auth.uid() = user_id or
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "inquiries_delete_own" on public.inquiries
  for delete using (
    auth.uid() = user_id or
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );
```

### products

```sql
create policy "products_select_all" on public.products
  for select using (true);

create policy "products_insert_admin" on public.products
  for insert with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "products_update_admin" on public.products
  for update using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "products_delete_admin" on public.products
  for delete using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );
```

---

## 9. 트리거

### profiles 자동 생성 트리거

회원가입(`auth.users` INSERT) 시 `profiles`에 자동 행 삽입.
`new.email` 및 `raw_user_meta_data`에서 name, phone, zipcode, address1, address2를 읽어 저장.

```sql
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, phone, zipcode, address1, address2)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', ''),
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'zipcode',
    new.raw_user_meta_data->>'address1',
    new.raw_user_meta_data->>'address2'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

> 현재 회원가입 폼(`/auth/register`)은 name만 전달. phone·address는 마이페이지에서 별도 수정.

### updated_at 자동 갱신 트리거

```sql
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at_profiles  before update on public.profiles  for each row execute procedure public.handle_updated_at();
create trigger set_updated_at_posts     before update on public.posts     for each row execute procedure public.handle_updated_at();
create trigger set_updated_at_inquiries before update on public.inquiries for each row execute procedure public.handle_updated_at();
create trigger set_updated_at_products  before update on public.products  for each row execute procedure public.handle_updated_at();
```

---

## 10. 마이그레이션 순서

```
Step 1.  profiles 테이블 생성
Step 2.  posts 테이블 생성
Step 3.  inquiries 테이블 생성
Step 4.  products 테이블 생성
Step 5.  RLS 활성화 (4개 테이블)
Step 6.  RLS 정책 등록
Step 7.  handle_new_user 함수 + 트리거 생성
Step 8.  handle_updated_at 함수 + 트리거 생성 (4개 테이블)
Step 9.  profiles.email 컬럼 추가 + UNIQUE 제약
Step 10. handle_new_user 함수 업데이트 (email + phone·address 메타데이터 저장)
Step 11. avatars 스토리지 버킷 생성 + RLS 정책
Step 12. post_likes 테이블 생성 + RLS 정책
```

> Supabase MCP: `apply_migration` 으로 DDL 실행, `execute_sql` 로 데이터 조작
