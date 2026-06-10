import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Pagination from '../../components/common/Pagination'
import Button from '../../components/common/Button'
import { useAuth } from '../../hooks/useAuth'
import { getPosts } from '../../services/posts'
import { formatDate } from '../../utils/format'

const PAGE_SIZE = 10

export default function BoardList() {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getPosts({ page, pageSize: PAGE_SIZE })
      .then(({ data, count }) => { setPosts(data); setCount(count) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [page])

  const totalPages = Math.ceil(count / PAGE_SIZE)

  return (
    <div className="max-w-[1200px] mx-auto px-5 md:px-10 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">게시판</h1>
          <p className="text-sm text-gray-400 mt-1">총 {count}개의 게시글</p>
        </div>
        {user && <Link to="/board/write"><Button>글쓰기</Button></Link>}
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">불러오는 중...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 text-gray-400">아직 작성된 게시글이 없습니다.</div>
      ) : (
        <div className="border-t border-gray-200">
          {posts.map((post, i) => (
            <Link key={post.id} to={`/board/${post.id}`}
              className="flex items-center gap-4 px-2 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <span className="w-10 text-center text-sm text-gray-400 shrink-0">{count - (page - 1) * PAGE_SIZE - i}</span>
              <span className="flex-1 text-sm font-medium text-gray-800 truncate">{post.title}</span>
              {post.post_likes?.[0]?.count > 0 && (
                <span className="text-xs text-red-400 shrink-0">♥ {post.post_likes[0].count}</span>
              )}
              <span className="text-xs text-gray-400 shrink-0">{post.profiles?.name}</span>
              <span className="text-xs text-gray-400 shrink-0">{formatDate(post.created_at)}</span>
            </Link>
          ))}
        </div>
      )}
      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  )
}
