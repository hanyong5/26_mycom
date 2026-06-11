import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import { useToast } from '../../components/common/Toast'
import { checkEmailDuplicate, signUp } from '../../services/auth'
import { validateEmail, validatePassword } from '../../utils/validate'

export default function Register() {
  const navigate = useNavigate()
  const toast = useToast()
  const [form, setForm] = useState({ name: '', email: '', password: '', passwordConfirm: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [emailCheck, setEmailCheck] = useState(null) // null | 'available' | 'taken'
  const [emailChecking, setEmailChecking] = useState(false)

  function handleEmailChange(e) {
    setForm(p => ({ ...p, email: e.target.value }))
    setEmailCheck(null)
  }

  async function handleEmailCheck() {
    if (!validateEmail(form.email)) {
      setErrors(p => ({ ...p, email: '올바른 이메일 형식을 입력해주세요.' }))
      return
    }
    setErrors(p => ({ ...p, email: undefined }))
    setEmailChecking(true)
    try {
      const isDuplicate = await checkEmailDuplicate(form.email)
      setEmailCheck(isDuplicate ? 'taken' : 'available')
    } catch {
      toast('이메일 확인 중 오류가 발생했습니다.', 'error')
    } finally {
      setEmailChecking(false)
    }
  }

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = '이름을 입력해주세요.'
    if (!validateEmail(form.email)) e.email = '올바른 이메일 형식을 입력해주세요.'
    else if (emailCheck === null) e.email = '이메일 중복확인을 해주세요.'
    else if (emailCheck === 'taken') e.email = '이미 사용 중인 이메일입니다.'
    if (!validatePassword(form.password)) e.password = '비밀번호는 영문+숫자 포함 8자 이상이어야 합니다.'
    if (form.password !== form.passwordConfirm) e.passwordConfirm = '비밀번호가 일치하지 않습니다.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const data = await signUp({ email: form.email, password: form.password, name: form.name })
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push({ event: 'sign_up', method: 'email' })
      gtag('config', import.meta.env.VITE_GA_ID, { user_id: data.user.id })
      toast('회원가입이 완료되었습니다. 이메일을 확인해주세요.', 'success')
      navigate('/')
    } catch (err) {
      if (err.message?.includes('already')) toast('이미 사용 중인 이메일입니다.', 'error')
      else toast('회원가입 중 오류가 발생했습니다.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const set = key => e => setForm(p => ({ ...p, [key]: e.target.value }))

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">회원가입</h1>
        <p className="text-sm text-gray-500 text-center mb-8">새 계정을 만드세요</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="이름" placeholder="홍길동" value={form.name} onChange={set('name')} error={errors.name} />

          {/* 이메일 + 중복확인 */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">이메일</label>
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={form.email}
                  onChange={handleEmailChange}
                  className={`h-11 w-full px-3.5 rounded-lg border text-sm outline-none transition-colors
                    ${errors.email ? 'border-red-500 focus:border-red-500' : emailCheck === 'available' ? 'border-green-500 focus:border-green-500' : 'border-gray-300 focus:border-primary'}
                    focus:ring-2 ${errors.email ? 'focus:ring-red-500/15' : emailCheck === 'available' ? 'focus:ring-green-500/15' : 'focus:ring-primary/15'}`}
                />
              </div>
              <button
                type="button"
                onClick={handleEmailCheck}
                disabled={emailChecking || !form.email}
                className="shrink-0 h-11 px-3 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {emailChecking ? '확인 중...' : '중복확인'}
              </button>
            </div>
            {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
            {!errors.email && emailCheck === 'available' && (
              <p className="text-xs text-green-600">사용 가능한 이메일입니다.</p>
            )}
            {!errors.email && emailCheck === 'taken' && (
              <p className="text-xs text-red-500">이미 사용 중인 이메일입니다.</p>
            )}
          </div>

          <Input label="비밀번호" type="password" placeholder="영문+숫자 8자 이상" value={form.password} onChange={set('password')} error={errors.password} />
          <Input label="비밀번호 확인" type="password" placeholder="비밀번호 재입력" value={form.passwordConfirm} onChange={set('passwordConfirm')} error={errors.passwordConfirm} />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? '처리 중...' : '회원가입'}
          </Button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          이미 계정이 있으신가요?{' '}
          <Link to="/auth/login" className="text-primary font-medium hover:underline">로그인</Link>
        </p>
      </div>
    </div>
  )
}
