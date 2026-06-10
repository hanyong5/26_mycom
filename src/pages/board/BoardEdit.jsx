import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import { useToast } from '../../components/common/Toast'
import { useAuth } from '../../hooks/useAuth'
import { getPost, updatePost } from '../../services/posts'

export default function BoardEdit() {
  const { id } = useParams()
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const [form, setForm] = useState({ title: '', content: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getPost(id).then(post => {
      if (user.id !== post.user_id && profile?.role !== 'admin') {
        toast('수정 권한이 없습니다.', 'error')
        navigate('/board')
        return
      }
      setForm({ title: post.title, content: post.content })
    }).catch(() => navigate('/board'))
  }, [id])

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
      await updatePost(id, form)
      toast('게시글이 수정되었습니다.', 'success')
      navigate(`/board/${id}`)
    } catch {
      toast('수정 중 오류가 발생했습니다.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-[800px] mx-auto px-5 md:px-10 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">게시글 수정</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="제목" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} error={errors.title} />
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">내용</label>
          <textarea rows={12} value={form.content}
            onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
            className={`px-3.5 py-3 rounded-lg border text-sm outline-none resize-none
              ${errors.content ? 'border-red-500' : 'border-gray-300 focus:border-primary'}
              focus:ring-2 focus:ring-primary/15`}
          />
          {errors.content && <p className="text-xs text-red-500">{errors.content}</p>}
        </div>
        <div className="flex gap-2 justify-end pt-2">
          <Button type="button" variant="ghost" onClick={() => navigate(`/board/${id}`)}>취소</Button>
          <Button type="submit" disabled={loading}>{loading ? '저장 중...' : '저장'}</Button>
        </div>
      </form>
    </div>
  )
}
