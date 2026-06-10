import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import { useToast } from '../../components/common/Toast'
import { useAuth } from '../../hooks/useAuth'
import { deleteInquiry, getAllInquiries, getMyInquiries } from '../../services/inquiries'
import { formatDate } from '../../utils/format'

const statusLabel = { pending: '접수', answered: '답변완료', closed: '종료' }
const statusColor = { pending: 'bg-yellow-100 text-yellow-700', answered: 'bg-green-100 text-green-700', closed: 'bg-gray-100 text-gray-500' }

export default function ContactMy() {
  const { user, profile } = useAuth()
  const toast = useToast()
  const isAdmin = profile?.role === 'admin'
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState(null)

  async function load() {
    try {
      const data = isAdmin ? await getAllInquiries() : await getMyInquiries(user.id)
      setInquiries(data)
    } catch {
      toast('문의 내역을 불러오지 못했습니다.', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function handleDelete() {
    try {
      await deleteInquiry(deleteTarget)
      toast('문의가 삭제되었습니다.', 'success')
      setDeleteTarget(null)
      load()
    } catch {
      toast('삭제 중 오류가 발생했습니다.', 'error')
    }
  }

  return (
    <div className="max-w-[1200px] mx-auto px-5 md:px-10 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isAdmin ? '전체 문의 내역' : '내 문의 내역'}</h1>
          <p className="text-sm text-gray-400 mt-1">총 {inquiries.length}건</p>
        </div>
        <Link to="/contact/write"><Button>문의 작성</Button></Link>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">불러오는 중...</div>
      ) : inquiries.length === 0 ? (
        <div className="text-center py-20 text-gray-400">문의 내역이 없습니다.</div>
      ) : (
        <div className="space-y-3">
          {inquiries.map(inq => (
            <div key={inq.id} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColor[inq.status]}`}>
                      {statusLabel[inq.status]}
                    </span>
                    {isAdmin && <span className="text-xs text-gray-400">{inq.profiles?.name}</span>}
                  </div>
                  <p className="font-semibold text-gray-800 truncate">{inq.title}</p>
                  <p className="text-xs text-gray-400 mt-1">{formatDate(inq.created_at)}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(inq.id)}>삭제</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        title="문의 삭제" confirmText="삭제" danger onConfirm={handleDelete}>
        이 문의를 삭제하시겠습니까?
      </Modal>
    </div>
  )
}
