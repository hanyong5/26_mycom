import { Link, useLocation } from 'react-router-dom'
import { formatPrice } from '../../utils/format'
import Button from '../../components/common/Button'

export default function PurchaseComplete() {
  const { state } = useLocation()

  return (
    <div className="max-w-[600px] mx-auto px-5 py-20 text-center">
      <div className="text-6xl mb-6">✅</div>
      <h1 className="text-3xl font-bold text-gray-900 mb-3">구매가 완료되었습니다!</h1>
      {state?.productName && (
        <div className="bg-gray-50 rounded-2xl p-6 my-8 text-left space-y-2">
          <p className="text-sm text-gray-500">주문 상품</p>
          <p className="text-lg font-semibold text-gray-900">{state.productName}</p>
          {state.price != null && (
            <p className="text-xl font-bold text-primary">{formatPrice(state.price)}</p>
          )}
        </div>
      )}
      <p className="text-gray-500 mb-8">감사합니다. 주문이 정상적으로 접수되었습니다.</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/products">
          <Button size="lg" className="w-full sm:w-auto">계속 쇼핑하기</Button>
        </Link>
        <Link to="/">
          <Button size="lg" variant="ghost" className="w-full sm:w-auto">홈으로</Button>
        </Link>
      </div>
    </div>
  )
}
