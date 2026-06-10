# mycompany Design System

> 기준일: 2026-06-08 | 브랜드: Visang

---

## 목차

1. [Colors](#1-colors)
2. [Typography](#2-typography)
3. [Spacing](#3-spacing)
4. [Borders & Shadows](#4-borders--shadows)
5. [Z-Index & Motion](#5-z-index--motion)
6. [Components](#6-components)
7. [Layout & Grid](#7-layout--grid)

---

## 1. Colors

### Brand

| Token | Hex | 용도 |
|-------|-----|------|
| `--color-primary` | `#0064FF` | CTA 버튼, 활성 상태, 링크 |
| `--color-primary-dark` | `#0050CC` | Hover |
| `--color-primary-light` | `#E6F0FF` | Tint 배경, 선택 상태 |
| `--color-accent` | `#FF6B00` | 액센트, 뱃지, 이벤트 |
| `--color-accent-light` | `#FFF0E6` | Accent tint 배경 |
| `--color-success` | `#00B050` | 성공, NEW 뱃지 |
| `--color-error` | `#E02020` | 오류, 에러 텍스트 |

### Neutral

| Token | Hex | 용도 |
|-------|-----|------|
| `gray-900` | `#1A1A1A` | 헤딩, Primary 텍스트 |
| `gray-800` | `#333333` | 본문, 내비게이션 |
| `gray-700` | `#555555` | Secondary 텍스트 |
| `gray-500` | `#888888` | Placeholder, 비활성 |
| `gray-400` | `#AAAAAA` | 구분선, 비활성 요소 |
| `gray-200` | `#DDDDDD` | 테두리, 입력 외곽선 |
| `gray-100` | `#F5F5F5` | 페이지·카드 배경 |
| `white` | `#FFFFFF` | 컴포넌트 배경 |

### Semantic

```
text-primary: #1A1A1A     text-secondary: #555555     text-disabled: #AAAAAA
text-link:    #0064FF     text-inverse:   #FFFFFF
bg-page:      #F5F5F5     bg-surface:     #FFFFFF      bg-overlay: rgba(0,0,0,0.5)
border-default: #DDDDDD   border-focus:   #0064FF
```

---

## 2. Typography

### Font Families

```
font-primary:   'Noto Sans KR', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif
font-secondary: 'Roboto', 'Helvetica Neue', Arial, sans-serif
font-mono:      'Courier New', Courier, monospace
```

### Font Sizes & Line Heights

| Token | px | rem | lh | 용도 |
|-------|----|-----|----|------|
| `text-xs` | 12 | 0.75 | 18px | 캡션, 뱃지 |
| `text-sm` | 13 | 0.8125 | 20px | 서브레이블 |
| `text-base` | 14 | 0.875 | 22px | 본문, 내비게이션 |
| `text-md` | 15 | 0.9375 | 24px | 강조 본문 |
| `text-lg` | 16 | 1 | 26px | 섹션 레이블 |
| `text-xl` | 18 | 1.125 | 28px | 카드 제목 |
| `text-2xl` | 20 | 1.25 | 30px | 섹션 헤딩 |
| `text-3xl` | 24 | 1.5 | 34px | 페이지 서브 헤딩 |
| `text-4xl` | 28 | 1.75 | 40px | 주요 헤딩 |
| `text-5xl` | 32 | 2 | 46px | Hero / H1 |

### Text Styles (합성)

| Style | Size | Weight | lh | Color |
|-------|------|--------|----|-------|
| `heading-h1` | 32px | 700 | 1.3 | `#1A1A1A` |
| `heading-h2` | 24px | 700 | 1.4 | `#1A1A1A` |
| `heading-h3` | 20px | 600 | 1.4 | `#1A1A1A` |
| `heading-h4` | 18px | 600 | 1.5 | `#333333` |
| `body-large` | 16px | 400 | 1.6 | `#333333` |
| `body-base` | 14px | 400 | 1.6 | `#333333` |
| `body-small` | 13px | 400 | 1.5 | `#555555` |
| `caption` | 12px | 400 | 1.4 | `#888888` |
| `nav-item` | 14px | 500 | 1 | `#333333` |
| `button-text` | 14px | 600 | 1 | `#FFFFFF` |

---

## 3. Spacing

### Scale (4px 기준)

```
space-1:  4px    space-2:  8px    space-3: 12px    space-4: 16px
space-5: 20px    space-6: 24px    space-7: 28px    space-8: 32px
space-10:40px    space-12:48px    space-16:64px    space-20:80px    space-24:96px
```

### Semantic

```
component-xs: 4px   component-sm: 8px   component-md: 16px   component-lg: 24px
section-sm: 40px    section-md: 64px    section-lg: 80px
page-horizontal: 20px (mobile) / 40px (desktop)
```

---

## 4. Borders & Shadows

### Border Radius

```
radius-sm: 4px    radius-md: 8px     radius-lg: 12px
radius-xl: 16px   radius-2xl: 20px   radius-full: 9999px
```

### Border Styles

```
border-default: 1px solid #DDDDDD    border-focus: 2px solid #0064FF
border-active:  1px solid #0064FF    border-error: 1px solid #E02020
border-card:    1px solid #EEEEEE
```

### Shadows

| Token | Value |
|-------|-------|
| `shadow-xs` | `0 1px 2px rgba(0,0,0,0.06)` |
| `shadow-sm` | `0 2px 8px rgba(0,0,0,0.08)` |
| `shadow-md` | `0 4px 16px rgba(0,0,0,0.10)` |
| `shadow-lg` | `0 8px 24px rgba(0,0,0,0.12)` |
| `shadow-xl` | `0 16px 40px rgba(0,0,0,0.15)` |
| `shadow-modal` | `0 8px 32px rgba(0,0,0,0.18)` |
| `shadow-nav` | `0 2px 4px rgba(0,0,0,0.06)` |

---

## 5. Z-Index & Motion

### Z-Index

```
z-dropdown: 100   z-sticky: 200   z-overlay: 300
z-modal:    400   z-toast:  500   z-tooltip: 600
```

### Motion

```
duration-fast: 150ms   duration-normal: 250ms   duration-slow: 400ms

ease-default: cubic-bezier(0.4, 0, 0.2, 1)
ease-out:     cubic-bezier(0, 0, 0.2, 1)
ease-spring:  cubic-bezier(0.34, 1.56, 0.64, 1)
```

---

## 6. Components

### GNB (Navigation)

```
height: 60px (mobile) / 72px (desktop)
background: #FFFFFF | shadow: shadow-nav | position: sticky top:0 | z-index: 200
padding: 0 20px (mobile) / 0 40px (desktop)
```

nav-item: `14px / 500 / #333333` → hover·active: `#0064FF` + `border-bottom: 2px solid #0064FF`

### Buttons

| Variant | BG | Color | Border | Hover |
|---------|----|----|--------|-------|
| `primary` | `#0064FF` | `#FFFFFF` | — | `#0050CC` |
| `secondary` | `#FFFFFF` | `#0064FF` | `1px solid #0064FF` | `#E6F0FF` |
| `ghost` | transparent | `#555555` | `1px solid #DDDDDD` | `#F5F5F5` |
| `text` | transparent | `#0064FF` | — | underline |
| `cta` | `#FF6B00` | `#FFFFFF` | — | `#E55F00` |

**Sizes:** `sm` 6/12px·r6 | `md` 10/20px·r8 | `lg` 14/28px·r8 | `xl` 16/32px·r10

**States:** disabled `opacity:0.4` | loading `opacity:0.7`

### Cards

**Book Card**
```
radius: 12px | border: 1px solid #EEEEEE | shadow-sm
hover: shadow-lg + translateY(-2px) | transition: 250ms ease
thumbnail: aspect-ratio 3/4 | title: 14px/600/#1A1A1A | price: 15px/700/#0064FF
```

**News Card:** `padding: 16px 20px | borderBottom: 1px solid #EEEEEE`

### Inputs

| 종류 | Height | Radius | Border |
|------|--------|--------|--------|
| Search | 44px | 22px (pill) | 2px solid #DDDDDD |
| Text | 44px | 8px | 1px solid #DDDDDD |
| Select | 44px | 8px | 1px solid #DDDDDD |

focus: `border-focus` + `box-shadow: 0 0 0 3px rgba(0,100,255,0.15)`

label: `13px/500/#333333` | helperText: `12px/#888888` | errorText: `12px/#E02020`

Checkbox: `18px / radius 4px` | Radio: `18px / radius 50%` → checked: `#0064FF`

### Badges

| Variant | BG | Color | 레이블 |
|---------|----|----|--------|
| `new` | `#00B050` | `#FFFFFF` | NEW |
| `event` | `#FF6B00` | `#FFFFFF` | — |
| `notice` | `#0064FF` | `#FFFFFF` | 공지 |
| `info` | `#E6F0FF` | `#0064FF` | 안내 |
| `grade-elementary` | `#FFF0E6` | `#FF6B00` | 초등 |
| `grade-middle` | `#E6F0FF` | `#0064FF` | 중학 |
| `grade-high` | `#F0E6FF` | `#7B00FF` | 고등 |

공통: `11px / 600 / radius 4px / padding 2px 6~8px`

### Tabs

기본: `14px/500/#888888 | border-bottom: 2px solid transparent`
활성: `14px/700/#0064FF | border-bottom: 2px solid #0064FF`

### Modal

```
overlay: rgba(0,0,0,0.5) fixed inset-0 z-400
container: #FFFFFF | radius 16px | padding 24px | maxWidth 480px
           shadow-modal | fixed center (translate -50% -50%)
header: 18px/700 | closeButton: 24px absolute top-16 right-16
```

### Toast

```
fixed bottom-24 center | z-500 | radius 8px | padding 12px 20px | 14px/500
default:#333333  success:#00B050  error:#E02020  warning:#FF6B00 — color: #FFFFFF
```

### Footer

```
background: #F5F5F5 | borderTop: 1px solid #DDDDDD | padding: 40px 20px 24px
copyright: 12px / #AAAAAA / center / marginTop 24px
```

---

## 7. Layout & Grid

### Breakpoints

| 구분 | Range | Columns | Gutter |
|------|-------|---------|--------|
| mobile | 0 ~ 767px | 4 | 16px |
| tablet | 768 ~ 1023px | 8 | 20px |
| desktop | 1024 ~ 1279px | 12 | 24px |
| wide | 1280px~ | 12 | 24px |

**Container:** `maxWidth: 1200px | margin: 0 auto | paddingX: 20px (mobile) / 40px (desktop)`

### Grid Patterns

```css
/* Book List */
mobile:  repeat(2, 1fr) gap-16px
tablet:  repeat(3, 1fr) gap-20px
desktop: repeat(4, 1fr) gap-24px

/* Brand Grid */
mobile:  repeat(3, 1fr) gap-12px
desktop: repeat(6, 1fr) gap-16px
```
