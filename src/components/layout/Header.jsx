import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { signOut } from '../../services/auth'
import { useToast } from '../common/Toast'

const navItems = [
  { label: '홈', to: '/' },
  { label: '회사소개', to: '/about/overview' },
  { label: '제품소개', to: '/products' },
  { label: '게시판', to: '/board' },
  { label: '온라인문의', to: '/contact/write' },
]

export default function Header() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const close = () => setMenuOpen(false)

  async function handleSignOut() {
    try {
      await signOut()
      toast('로그아웃 되었습니다.')
      navigate('/')
    } catch {
      toast('오류가 발생했습니다.', 'error')
    }
  }

  return (
    <>
      <header className="sticky top-0 z-[200] bg-white shadow-sm">
        <div className="max-w-[1200px] mx-auto px-5 md:px-10 h-[60px] md:h-[72px] flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-primary">mycompany</Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive ? 'text-primary' : 'text-gray-700 hover:text-primary'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <Link to="/mypage" className="flex items-center gap-2 text-sm text-gray-700 hover:text-primary px-3 py-2 font-medium">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="" className="w-7 h-7 rounded-full object-cover shrink-0" />
                  ) : (
                    <span className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500 shrink-0">
                      {profile?.name?.charAt(0) || '?'}
                    </span>
                  )}
                  {profile?.name || '마이페이지'}
                </Link>
                <button onClick={handleSignOut} className="text-sm text-gray-500 hover:text-primary px-3 py-2">로그아웃</button>
              </>
            ) : (
              <>
                <Link to="/auth/login" className="text-sm font-medium text-gray-700 hover:text-primary px-3 py-2">로그인</Link>
                <Link to="/auth/register" className="text-sm font-semibold bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark">회원가입</Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button className="md:hidden p-2" onClick={() => setMenuOpen(o => !o)} aria-label="메뉴 열기">
            <span className="block w-5 h-0.5 bg-gray-700 mb-1" />
            <span className="block w-5 h-0.5 bg-gray-700 mb-1" />
            <span className="block w-5 h-0.5 bg-gray-700" />
          </button>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <div
        className={`fixed inset-0 z-[300] bg-black/40 md:hidden transition-opacity duration-300 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={close}
      />

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 z-[301] h-full w-72 bg-white shadow-2xl md:hidden
          flex flex-col transition-transform duration-300 ease-in-out
          ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 h-[60px] border-b border-gray-100 shrink-0">
          <span className="text-base font-bold text-primary">mycompany</span>
          <button onClick={close} aria-label="메뉴 닫기" className="p-2 text-gray-500 hover:text-gray-900">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* User Info */}
        {user && (
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover shrink-0" />
            ) : (
              <span className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm text-gray-500 shrink-0">
                {profile?.name?.charAt(0) || '?'}
              </span>
            )}
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{profile?.name || '-'}</p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
          </div>
        )}

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-3">
          {navItems.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              onClick={close}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-lg text-sm font-medium transition-colors mb-0.5 ${
                  isActive ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Drawer Footer */}
        <div className="px-3 py-4 border-t border-gray-100 shrink-0 flex flex-col gap-2">
          {user ? (
            <>
              <Link
                to="/mypage"
                onClick={close}
                className="block px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                마이페이지
              </Link>
              <button
                onClick={() => { handleSignOut(); close() }}
                className="w-full text-left px-4 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link
                to="/auth/login"
                onClick={close}
                className="block px-4 py-2.5 rounded-lg text-sm font-medium text-center text-primary border border-primary hover:bg-primary/5"
              >
                로그인
              </Link>
              <Link
                to="/auth/register"
                onClick={close}
                className="block px-4 py-2.5 rounded-lg text-sm font-semibold text-center bg-primary text-white hover:bg-primary-dark"
              >
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  )
}
