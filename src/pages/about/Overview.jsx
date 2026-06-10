import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const tabs = [
  { label: '회사개요', to: '/about/overview' },
  { label: '연혁', to: '/about/history' },
  { label: '오시는 길', to: '/about/location' },
]

export function AboutLayout() {
  return (
    <div className="max-w-[1200px] mx-auto px-5 md:px-10 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">회사소개</h1>
      <div className="flex border-b border-gray-200 mb-8">
        {tabs.map(({ label, to }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) =>
              `px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
                isActive ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-primary'
              }`
            }
          >{label}</NavLink>
        ))}
      </div>
      <Outlet />
    </div>
  )
}

export default function Overview() {
  return (
    <div className="space-y-10">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">회사 개요</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            mycompany는 2000년 설립 이래 혁신적인 기술과 서비스로 고객의 성공을 지원해온 기업입니다.
            전국 각지의 고객사와 함께 성장하며 대한민국 산업 발전에 기여하고 있습니다.
          </p>
          <p className="text-gray-600 leading-relaxed">
            우리는 고객 중심의 가치를 최우선으로 삼아, 지속가능한 혁신을 통해 더 나은 미래를 만들어갑니다.
          </p>
        </div>
        <div className="bg-primary-light rounded-2xl p-10 text-center">
          <p className="text-5xl font-extrabold text-primary mb-2">20+</p>
          <p className="text-gray-600 font-medium">년의 업력</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {[
          { label: '미션', value: '기술로 세상을 더 나은 곳으로 만든다' },
          { label: '비전', value: '아시아 최고의 혁신 기업' },
          { label: '핵심가치', value: '신뢰 · 혁신 · 협력 · 성장' },
        ].map(({ label, value }) => (
          <div key={label} className="border border-gray-200 rounded-2xl p-6">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">{label}</p>
            <p className="text-gray-800 font-semibold">{value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
