export function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

export function formatPrice(price) {
  if (price == null) return ''
  return price === 0 ? '무료' : `${price.toLocaleString('ko-KR')}원`
}
