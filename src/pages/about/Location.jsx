export default function Location() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">오시는 길</h2>
      <div className="bg-gray-200 rounded-2xl h-64 flex items-center justify-center text-gray-500 text-sm">
        지도 영역 (Google Maps / Kakao Map 연동)
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {[
          { icon: '📍', label: '주소', value: '서울특별시 강남구 테헤란로 123, mycompany빌딩 14층' },
          { icon: '📞', label: '대표전화', value: '02-0000-0000 (평일 09:00 ~ 18:00)' },
          { icon: '🚇', label: '지하철', value: '2호선 강남역 3번 출구 도보 5분' },
          { icon: '🚌', label: '버스', value: '강남역 정류장 하차 (간선 145, 146, 341)' },
        ].map(({ icon, label, value }) => (
          <div key={label} className="flex gap-4 p-5 border border-gray-200 rounded-xl">
            <span className="text-2xl">{icon}</span>
            <div>
              <p className="text-xs font-semibold text-gray-400 mb-1">{label}</p>
              <p className="text-sm text-gray-700">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
