import { Link } from 'react-router-dom'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import Button from '../components/common/Button'

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80',
    tag: '혁신의 시작',
    title: '기술로 만드는\n더 나은 내일',
    desc: '끊임없는 연구개발로 산업의 경계를 넓히고\n새로운 가능성을 열어갑니다.',
    cta: { label: '제품 보기', to: '/products' },
  },
  {
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&q=80',
    tag: '함께하는 성장',
    title: '신뢰를 바탕으로\n고객과 함께',
    desc: '20년 이상의 업력이 증명하는 신뢰.\n고객의 성공이 곧 우리의 성공입니다.',
    cta: { label: '회사 소개', to: '/about/overview' },
  },
  {
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=80',
    tag: '미래를 향해',
    title: '지속 가능한 혁신으로\n세상을 바꿉니다',
    desc: '글로벌 시장을 선도하는 솔루션으로\n지속 가능한 미래를 설계합니다.',
    cta: { label: '문의하기', to: '/contact/write' },
  },
]

export default function Home() {
  return (
    <div>
      {/* Hero — 100vh Swiper */}
      <section className="relative" style={{ height: 'calc(100vh - 60px)' }}>
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          navigation
          pagination={{ clickable: true }}
          loop
          className="h-full"
        >
          {slides.map((slide, i) => (
            <SwiperSlide key={i}>
              <div className="relative w-full h-full overflow-hidden">
                {/* 배경 이미지 — 켄 번스 줌인 */}
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="hero-bg absolute inset-0 w-full h-full object-cover"
                />
                {/* 어두운 오버레이 */}
                <div className="absolute inset-0 bg-black/50" />
                {/* 텍스트 */}
                <div className="relative z-10 h-full flex items-center justify-center px-5">
                  <div className="text-center text-white max-w-2xl">
                    <span className="hero-tag inline-block text-sm font-medium tracking-widest text-blue-300 mb-4 uppercase">
                      {slide.tag}
                    </span>
                    <h1 className="hero-title text-4xl md:text-6xl font-bold leading-tight mb-6 whitespace-pre-line">
                      {slide.title}
                    </h1>
                    <p className="hero-desc text-blue-100 text-base md:text-lg mb-10 leading-relaxed whitespace-pre-line">
                      {slide.desc}
                    </p>
                    <Link className="hero-cta inline-block" to={slide.cta.to}>
                      <Button size="lg" className="bg-white text-primary hover:bg-blue-50 px-8">
                        {slide.cta.label}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Features */}
      <section className="py-20 px-5 bg-gray-50">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">왜 mycompany인가요?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '🚀', title: '혁신', desc: '끊임없는 연구개발로 업계를 선도하는 기술을 제공합니다.' },
              { icon: '🤝', title: '신뢰', desc: '20년 이상의 업력으로 쌓아온 신뢰를 바탕으로 함께합니다.' },
              { icon: '💡', title: '솔루션', desc: '고객 맞춤형 솔루션으로 최적의 결과를 만들어냅니다.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-8 shadow-sm text-center">
                <div className="text-4xl mb-4">{icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-5 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">게시판을 방문해보세요</h2>
        <p className="text-gray-500 mb-8">다양한 소식과 이야기를 나눠보세요.</p>
        <Link to="/board"><Button size="lg">게시판 바로가기</Button></Link>
      </section>
    </div>
  )
}
