import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { getProducts } from '../../services/products'
import { formatPrice } from '../../utils/format'

export default function ProductList() {
  const { profile } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProducts().then(setProducts).catch(console.error).finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-[1200px] mx-auto px-5 md:px-10 py-10">
      <div className="flex items-end justify-between mb-2">
        <h1 className="text-3xl font-bold text-gray-900">제품소개</h1>
        {profile?.role === 'admin' && (
          <Link
            to="/products/new"
            className="text-sm font-semibold bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark"
          >
            + 제품 등록
          </Link>
        )}
      </div>
      <p className="text-gray-500 mb-8">mycompany의 다양한 제품을 만나보세요.</p>

      {loading ? (
        <div className="text-center py-20 text-gray-400">불러오는 중...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-400">등록된 제품이 없습니다.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map(p => (
            <Link key={p.id} to={`/products/${p.id}`}
              className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all overflow-hidden">
              <div className="aspect-square bg-gray-100 flex items-center justify-center text-gray-300 text-4xl">
                {p.image_url
                  ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" onError={e => { e.target.style.display='none' }} />
                  : '📦'}
              </div>
              <div className="p-4">
                <p className="text-sm font-semibold text-gray-900 mb-1 truncate">{p.name}</p>
                <p className="text-sm font-bold text-primary">{formatPrice(p.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
