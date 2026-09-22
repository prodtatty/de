import { MessageCircle, Wrench, Package, Percent, Users } from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { NAVY_DEEP, ACCENT, EASE } from '@/lib/theme'

const FACTS = [
  { value: '4', label: 'модели в линейке' },
  { value: 'Сосновый Бор', label: 'собственное производство' },
  { value: 'ПНД PE-100', label: 'материал корпуса' },
  { value: 'ЕАЭС · ГИМС', label: 'сертификация' },
]

const REASONS = [
  {
    icon: MessageCircle,
    text: 'Консультация по выбору, эксплуатации и уходу за лодкой',
  },
  {
    icon: Wrench,
    text: 'Гарантийное обслуживание и ремонт лодок',
  },
  {
    icon: Package,
    text: 'Аксессуары и запчасти для лодок по выгодным ценам для клиентов',
  },
  {
    icon: Percent,
    text: 'Предоставление услуги тест-драйва перед покупкой лодки',
  },
  {
    icon: Users,
    text: 'Постоянная поддержка клиентов и оперативное реагирование на обращения',
  },
]

export function About() {
  return (
    <section id="about" className="py-24 sm:py-32 px-6 sm:px-8 md:px-12" style={{ backgroundColor: NAVY_DEEP }}>
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <p className="text-xs tracking-[0.3em] uppercase font-medium" style={{ color: ACCENT }}>
            О компании
          </p>
        </Reveal>
        <Reveal delay={80} className="mt-4 max-w-3xl">
          <h2
            className="font-light uppercase leading-[1.2] text-white"
            style={{ fontSize: 'clamp(1.75rem, 3.6vw, 3rem)' }}
          >
            Катера, которые делают на совесть
          </h2>
        </Reveal>

        <Reveal delay={160} className="mt-6 max-w-3xl space-y-4">
          <p className="text-base sm:text-lg leading-relaxed text-white/70">
            Vrungel.Pro — собственное производство катеров и лодок из полиэтилена низкого давления в
            Сосновом Бору, Ленинградская область. Здесь проходит весь цикл: от раскроя первичного
            листа ПНД PE-100 на фрезерном станке с ЧПУ до сборки, оснастки и проверки готового катера.
          </p>
          <p className="text-base sm:text-lg leading-relaxed text-white/70">
            Мы выбрали ПНД вместо алюминия и стеклопластика осознанно: материал не гниёт, не ржавеет,
            держит удар о камни и лёд, а при повреждении его можно сварить и отремонтировать — а не
            списывать катер целиком. Каждая модель линейки сертифицирована по техническому регламенту
            Евразийского экономического союза и готова к постановке на учёт в ГИМС.
          </p>
        </Reveal>

        <Reveal delay={240} className="mt-12 flex flex-wrap gap-x-12 gap-y-6">
          {FACTS.map((fact) => (
            <div key={fact.label}>
              <div className="text-xl sm:text-2xl font-light text-white">{fact.value}</div>
              <div className="mt-1 text-xs uppercase tracking-[0.15em] text-white/40">{fact.label}</div>
            </div>
          ))}
        </Reveal>

        <Reveal delay={300} className="mt-10">
          <a
            href="documents/certificate.pdf"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-4 rounded-2xl p-3 pr-6 hover:border-white/25 transition-colors"
            style={{ border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <img
              src="images/certificate-thumb.webp"
              alt="Сертификат соответствия ЕАЭС на лодки Vrungel.Pro"
              className="rounded-md flex-shrink-0"
              style={{ width: 72, height: 100, objectFit: 'cover', boxShadow: '0 6px 16px rgba(0,0,0,0.35)' }}
            />
            <div>
              <div className="text-sm font-medium text-white">Сертификат соответствия ЕАЭС</div>
              <div className="mt-1 text-xs text-white/45">№ RU C-RU.HA54.B.00354/25 · открыть PDF →</div>
            </div>
          </a>
        </Reveal>

        <Reveal delay={100} className="mt-20 sm:mt-24">
          <h3 className="text-xl sm:text-2xl font-light uppercase tracking-wide text-white">
            Почему выбирают Vrungel.Pro
          </h3>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {REASONS.map(({ icon: Icon, text }, i) => (
            <Reveal
              key={text}
              delay={(i % 3) * 100}
              className="rounded-2xl p-6 h-full"
              style={{ border: '1px solid rgba(255,255,255,0.1)', transition: `border-color 0.4s ${EASE}` }}
            >
              <Icon size={22} color={ACCENT} strokeWidth={1.75} />
              <p className="mt-4 text-sm leading-relaxed text-white/80">{text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
