import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import { useToast } from '../../components/common/Toast'
import { createProduct, uploadProductImage } from '../../services/products'

export default function ProductWrite() {
  const navigate = useNavigate()
  const toast = useToast()
  const fileInputRef = useRef(null)

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    is_active: true,
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const set = key => e => setForm(p => ({ ...p, [key]: e.target.value }))

  function handleImageChange(e) {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast('이미지 파일만 업로드할 수 있습니다.', 'error')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast('파일 크기는 5MB 이하여야 합니다.', 'error')
      return
    }
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = '제품명을 입력해주세요.'
    if (form.price !== '' && isNaN(Number(form.price))) e.price = '올바른 숫자를 입력해주세요.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      let image_url = null
      if (imageFile) {
        image_url = await uploadProductImage(imageFile)
      }
      const product = await createProduct({
        name: form.name.trim(),
        description: form.description.trim() || null,
        image_url,
        price: form.price === '' ? 0 : Number(form.price),
        is_active: form.is_active,
      })
      toast('제품이 등록되었습니다.', 'success')
      navigate(`/products/${product.id}`)
    } catch {
      toast('제품 등록 중 오류가 발생했습니다.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-[640px] mx-auto px-5 md:px-10 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">제품 등록</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 이미지 업로드 */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">제품 이미지</label>
          <div
            className="w-full aspect-video bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors overflow-hidden"
            onClick={() => fileInputRef.current?.click()}
          >
            {imagePreview ? (
              <img src={imagePreview} alt="미리보기" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center py-8">
                <p className="text-3xl text-gray-300 mb-2">📷</p>
                <p className="text-sm text-gray-400">클릭하여 이미지 선택</p>
                <p className="text-xs text-gray-300 mt-1">JPG, PNG, GIF · 최대 5MB</p>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
          {imagePreview && (
            <button
              type="button"
              className="mt-2 text-xs text-red-400 hover:text-red-600"
              onClick={() => { setImageFile(null); setImagePreview(null); fileInputRef.current.value = '' }}
            >
              이미지 제거
            </button>
          )}
        </div>

        <Input
          label="제품명 *"
          placeholder="제품명을 입력해주세요"
          value={form.name}
          onChange={set('name')}
          error={errors.name}
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">제품 설명</label>
          <textarea
            placeholder="제품 설명을 입력해주세요"
            value={form.description}
            onChange={set('description')}
            rows={4}
            className="px-3.5 py-3 rounded-lg border border-gray-300 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15 resize-none"
          />
        </div>

        <Input
          label="가격 (원)"
          type="number"
          placeholder="0"
          min="0"
          value={form.price}
          onChange={set('price')}
          error={errors.price}
        />

        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={e => setForm(p => ({ ...p, is_active: e.target.checked }))}
            className="w-4 h-4 rounded border-gray-300 accent-primary cursor-pointer"
          />
          <span className="text-sm text-gray-700">제품 노출</span>
        </label>

        <div className="flex gap-3 pt-2">
          <Button type="button" className="flex-1 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            onClick={() => navigate('/products')}>
            취소
          </Button>
          <Button type="submit" className="flex-1" disabled={loading}>
            {loading ? '등록 중...' : '등록'}
          </Button>
        </div>
      </form>
    </div>
  )
}
