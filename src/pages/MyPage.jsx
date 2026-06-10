import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import { useToast } from '../components/common/Toast'
import { useAuth } from '../hooks/useAuth'
import { deleteAvatar, updateProfile, uploadAvatar } from '../services/auth'
import { getLikedPosts } from '../services/posts'
import { formatDate } from '../utils/format'

const TABS = [
  { key: 'profile', label: '나의 프로필' },
  { key: 'likes', label: '게시물 좋아요' },
]

export default function MyPage() {
  const { user, profile, refreshProfile } = useAuth()
  const toast = useToast()
  const fileInputRef = useRef(null)
  const [tab, setTab] = useState('profile')

  // 프로필 폼
  const [form, setForm] = useState({
    name: profile?.name || '',
    phone: profile?.phone || '',
    zipcode: profile?.zipcode || '',
    address1: profile?.address1 || '',
    address2: profile?.address2 || '',
  })
  const [avatarPreview, setAvatarPreview] = useState(profile?.avatar_url || null)
  const [avatarFile, setAvatarFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [avatarLoading, setAvatarLoading] = useState(false)

  // 좋아요 게시물
  const [likedPosts, setLikedPosts] = useState([])
  const [likesLoading, setLikesLoading] = useState(false)

  useEffect(() => {
    if (tab === 'likes' && user) {
      setLikesLoading(true)
      getLikedPosts(user.id)
        .then(setLikedPosts)
        .catch(() => toast('불러오는 중 오류가 발생했습니다.', 'error'))
        .finally(() => setLikesLoading(false))
    }
  }, [tab, user])

  const set = key => e => setForm(p => ({ ...p, [key]: e.target.value }))

  function handleAvatarChange(e) {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { toast('이미지 파일만 업로드할 수 있습니다.', 'error'); return }
    if (file.size > 2 * 1024 * 1024) { toast('파일 크기는 2MB 이하여야 합니다.', 'error'); return }
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  async function handleAvatarUpload() {
    if (!avatarFile) return
    setAvatarLoading(true)
    try {
      const url = await uploadAvatar(user.id, avatarFile)
      setAvatarPreview(url)
      setAvatarFile(null)
      refreshProfile()
      toast('아바타가 저장되었습니다.', 'success')
    } catch {
      toast('아바타 업로드 중 오류가 발생했습니다.', 'error')
    } finally {
      setAvatarLoading(false)
    }
  }

  async function handleAvatarDelete() {
    setAvatarLoading(true)
    try {
      await deleteAvatar(user.id)
      setAvatarPreview(null)
      setAvatarFile(null)
      refreshProfile()
      toast('아바타가 삭제되었습니다.', 'success')
    } catch {
      toast('아바타 삭제 중 오류가 발생했습니다.', 'error')
    } finally {
      setAvatarLoading(false)
    }
  }

  function handleAvatarCancel() {
    setAvatarFile(null)
    setAvatarPreview(profile?.avatar_url || null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) { toast('이름을 입력해주세요.', 'error'); return }
    setLoading(true)
    try {
      await updateProfile(user.id, form)
      refreshProfile()
      toast('프로필이 저장되었습니다.', 'success')
    } catch {
      toast('저장 중 오류가 발생했습니다.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-[600px] mx-auto px-5 md:px-10 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">마이페이지</h1>
      <p className="text-sm text-gray-400 mb-6">{user?.email}</p>

      {/* 탭 메뉴 */}
      <div className="flex border-b border-gray-200 mb-6">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              tab === t.key
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 나의 프로필 탭 */}
      {tab === 'profile' && (
        <>
          {/* 아바타 */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-4">
            <h2 className="text-base font-semibold text-gray-800 mb-5">프로필 사진</h2>
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 shrink-0">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="아바타" className="w-20 h-20 rounded-full object-cover border border-gray-200" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                    <span className="text-2xl text-gray-400 select-none">{profile?.name?.charAt(0) || '?'}</span>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                {avatarFile ? (
                  <div className="flex gap-2">
                    <Button type="button" onClick={handleAvatarUpload} disabled={avatarLoading} className="text-sm px-3 py-1.5">
                      {avatarLoading ? '저장 중...' : '저장'}
                    </Button>
                    <button type="button" onClick={handleAvatarCancel} className="text-sm px-3 py-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50">
                      취소
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="text-sm px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
                      {avatarPreview ? '사진 변경' : '사진 등록'}
                    </button>
                    {avatarPreview && (
                      <button type="button" onClick={handleAvatarDelete} disabled={avatarLoading} className="text-sm px-3 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50">
                        {avatarLoading ? '삭제 중...' : '삭제'}
                      </button>
                    )}
                  </div>
                )}
                <p className="text-xs text-gray-400">JPG, PNG, GIF · 최대 2MB</p>
              </div>
            </div>
          </div>

          {/* 프로필 정보 */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="text-base font-semibold text-gray-800 mb-5">프로필 정보</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="이름 *" value={form.name} onChange={set('name')} />
              <Input label="전화번호" type="tel" placeholder="010-0000-0000" value={form.phone} onChange={set('phone')} />
              <Input label="우편번호" placeholder="12345" value={form.zipcode} onChange={set('zipcode')} />
              <Input label="기본주소" placeholder="서울특별시 강남구 테헤란로" value={form.address1} onChange={set('address1')} />
              <Input label="상세주소" placeholder="123호" value={form.address2} onChange={set('address2')} />
              <div className="pt-2">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? '저장 중...' : '저장'}
                </Button>
              </div>
            </form>
          </div>

          {profile?.role === 'admin' && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3">
              <p className="text-xs font-semibold text-yellow-700">관리자 계정</p>
            </div>
          )}
        </>
      )}

      {/* 게시물 좋아요 탭 */}
      {tab === 'likes' && (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          {likesLoading ? (
            <div className="text-center py-16 text-gray-400 text-sm">불러오는 중...</div>
          ) : likedPosts.length === 0 ? (
            <div className="text-center py-16 text-gray-400 text-sm">좋아요한 게시물이 없습니다.</div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {likedPosts.map(post => (
                <li key={post.id}>
                  <Link
                    to={`/board/${post.id}`}
                    className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{post.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{post.profiles?.name} · {formatDate(post.created_at)}</p>
                    </div>
                    <span className="text-xs text-red-400 shrink-0 ml-4">♥</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
