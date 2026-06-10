const history = [
  { year: '2024', events: ['글로벌 파트너십 체결', '매출 1,000억 달성'] },
  { year: '2020', events: ['디지털 혁신 부문 대통령상 수상', '임직원 500명 돌파'] },
  { year: '2015', events: ['해외 법인 설립 (베트남)', '코스닥 상장'] },
  { year: '2010', events: ['연구개발센터 설립', '특허 100건 등록'] },
  { year: '2005', events: ['제2사옥 이전', '품질경영시스템 ISO 9001 인증'] },
  { year: '2000', events: ['(주)mycompany 법인 설립', '서울 강남구 사무소 개소'] },
]

export default function History() {
  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">연혁</h2>
      <div className="relative border-l-2 border-primary/30 pl-8 space-y-10">
        {history.map(({ year, events }) => (
          <div key={year} className="relative">
            <div className="absolute -left-[41px] w-4 h-4 bg-primary rounded-full border-2 border-white shadow" />
            <p className="text-lg font-bold text-primary mb-2">{year}</p>
            <ul className="space-y-1">
              {events.map(e => (
                <li key={e} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>{e}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
