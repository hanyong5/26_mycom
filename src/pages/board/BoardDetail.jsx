import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import { useToast } from '../../components/common/Toast'
import { useAuth } from '../../hooks/useAuth'
import { deletePost, getPost, getPostLikes, likePost, unlikePost } from '../../services/posts'
import { formatDate } from '../../utils/format'

export default function BoardDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const toast = useToast()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [liked, setLiked] = useState(false)
  const [likeLoading, setLikeLoading] = useState(false)

  useEffect(() => {
    Promise.all([
      getPost(id),
      getPostLikes(id, user?.id),
    ])
      .then(([postData, likesData]) => {
        setPost(postData)
        setLikeCount(likesData.count)
        setLiked(likesData.liked)
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [id, user?.id])

  const isOwner = user && post && (user.id === post.user_id || profile?.role === 'admin')

  async function handleDelete() {
    try {
      await deletePost(id)
      toast('게시글이 삭제되었습니다.', 'success')
      navigate('/board')
    } catch {
      toast('삭제 중 오류가 발생했습니다.', 'error')
    }
  }

  async function handleLike() {
    if (!user || likeLoading) return
    const next = !liked
    setLiked(next)
    setLikeCount(c => next ? c + 1 : c - 1)
    setLikeLoading(true)
    try {
      next ? await likePost(id, user.id) : await unlikePost(id, user.id)
    } catch {
      setLiked(!next)
      setLikeCount(c => next ? c - 1 : c + 1)
      toast('오류가 발생했습니다.', 'error')
    } finally {
      setLikeLoading(false)
    }
  }

  if (loading) return <div className="text-center py-20 text-gray-400">불러오는 중...</div>
  if (notFound) return (
    <div className="text-center py-20">
      <p className="text-gray-500 mb-4">존재하지 않는 게시글입니다.</p>
      <Link to="/board"><Button variant="ghost">목록으로</Button></Link>
    </div>
  )

  return (
    <div className="max-w-[800px] mx-auto px-5 md:px-10 py-10">
      <Link to="/board" className="text-sm text-gray-400 hover:text-primary mb-6 inline-block">← 목록으로</Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-3">{post.title}</h1>
      <div className="flex items-center gap-3 text-xs text-gray-400 pb-4 border-b border-gray-200 mb-6">
        <span>{post.profiles?.name}</span>
        <span>·</span>
        <span>{formatDate(post.created_at)}</span>
      </div>
      <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap min-h-[200px] mb-8">
        {post.content}
      </div>

      {/* 좋아요 버튼 */}
      <div className="flex justify-center mb-8">
        <button
          onClick={handleLike}
          disabled={!user || likeLoading}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full border text-sm font-medium transition-colors
            ${liked
              ? 'bg-red-50 border-red-300 text-red-500 hover:bg-red-100'
              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}
            disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <span className="text-base">{liked ? '♥' : '♡'}</span>
          <span>{likeCount}</span>
        </button>
      </div>

      <div className="flex gap-2 justify-end">
        <Link to="/board"><Button variant="ghost" size="sm">목록</Button></Link>
        {isOwner && (
          <>
            <Link to={`/board/${id}/edit`}><Button variant="secondary" size="sm">수정</Button></Link>
            <Button variant="danger" size="sm" onClick={() => setDeleteModal(true)}>삭제</Button>
          </>
        )}
      </div>

      <Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)}
        title="게시글 삭제" confirmText="삭제" danger onConfirm={handleDelete}>
        정말로 이 게시글을 삭제하시겠습니까? 삭제 후 복구가 불가능합니다.
      </Modal>
    </div>
  )
}
