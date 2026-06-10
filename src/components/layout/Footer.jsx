export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-auto">
      <div className="max-w-[1200px] mx-auto px-5 md:px-10 py-10">
        <p className="text-xl font-bold text-primary mb-1">mycompany</p>
        <p className="text-sm text-gray-500 mb-6">Above Imagination</p>
        <div className="text-xs text-gray-400 space-y-1">
          <p>(주)mycompany | 대표: 홍길동 | 사업자등록번호: 000-00-00000</p>
          <p>Tel: 02-0000-0000 | Email: info@mycompany.com</p>
          <p>서울특별시 강남구 테헤란로 123</p>
        </div>
        <p className="text-xs text-gray-400 mt-6 text-center">© 2026 mycompany. All rights reserved.</p>
      </div>
    </footer>
  )
}
