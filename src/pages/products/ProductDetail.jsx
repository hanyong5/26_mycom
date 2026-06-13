import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProduct } from "../../services/products";
import { formatDate, formatPrice } from "../../utils/format";
import Button from "../../components/common/Button";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    getProduct(id)
      .then(setProduct)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="text-center py-20 text-gray-400">불러오는 중...</div>
    );
  if (notFound)
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 mb-4">존재하지 않는 제품입니다.</p>
        <Link to="/products">
          <Button variant="ghost">목록으로</Button>
        </Link>
      </div>
    );

  return (
    <div className="max-w-[1200px] mx-auto px-5 md:px-10 py-10">
      <Link
        to="/products"
        className="text-sm text-gray-400 hover:text-primary mb-6 inline-block"
      >
        ← 제품 목록
      </Link>
      <div className="grid md:grid-cols-2 gap-10">
        <div className="aspect-square bg-gray-100 rounded-2xl flex items-center justify-center text-gray-300 text-6xl overflow-hidden">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            "📦"
          )}
        </div>
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-2xl font-bold text-primary">
            {formatPrice(product.price)}
          </p>
          <p className="text-gray-600 leading-relaxed">
            {product.description || "제품 설명이 없습니다."}
          </p>
          <p className="text-xs text-gray-400">
            등록일: {formatDate(product.created_at)}
          </p>
          <div className="pt-4 flex flex-col md:flex-row gap-3">
            <Button
              size="lg"
              className="btn-cart w-full md:w-auto"
              onClick={() =>
                navigate("/purchase/complete", {
                  state: { productName: product.name, price: product.price },
                })
              }
            >
              구매하기
            </Button>
            <Link to="/contact/write">
              <Button
                size="lg"
                variant="ghost"
                className="w-full md:w-auto"
              >
                문의하기
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
