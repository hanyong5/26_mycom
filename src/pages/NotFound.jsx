import { Link } from 'react-router-dom'
import Button from '../components/common/Button'

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center text-center px-4">
      <p className="text-8xl font-extrabold text-primary mb-4">404</p>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">페이지를 찾을 수 없습니다</h1>
      <p className="text-gray-400 text-sm mb-8">요청하신 페이지가 존재하지 않거나 이동되었습니다.</p>
      <Link to="/"><Button>홈으로 돌아가기</Button></Link>
    </div>
  )
}
