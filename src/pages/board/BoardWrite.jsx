import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import { useToast } from '../../components/common/Toast'
import { useAuth } from '../../hooks/useAuth'
import { createPost } from '../../services/posts'

export default function BoardWrite() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const [form, setForm] = useState({ title: '', content: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  function validate() {
    const e = {}
    if (!form.title.trim()) e.title = '제목을 입력해주세요.'
    if (!form.content.trim()) e.content = '내용을 입력해주세요.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const post = await createPost({ ...form, userId: user.id })
      toast('게시글이 등록되었습니다.', 'success')
      navigate(`/board/${post.id}`)
    } catch {
      toast('등록 중 오류가 발생했습니다.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-[800px] mx-auto px-5 md:px-10 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">게시글 작성</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="제목" placeholder="제목을 입력해주세요"
          value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
          error={errors.title} />
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">내용</label>
          <textarea
            rows={12}
            placeholder="내용을 입력해주세요"
            value={form.content}
            onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
            className={`px-3.5 py-3 rounded-lg border text-sm outline-none transition-colors resize-none
              ${errors.content ? 'border-red-500' : 'border-gray-300 focus:border-primary'}
              focus:ring-2 focus:ring-primary/15`}
          />
          {errors.content && <p className="text-xs text-red-500">{errors.content}</p>}
        </div>
        <div className="flex gap-2 justify-end pt-2">
          <Button type="button" variant="ghost" onClick={() => navigate('/board')}>취소</Button>
          <Button type="submit" disabled={loading}>{loading ? '등록 중...' : '등록'}</Button>
        </div>
      </form>
    </div>
  )
}
