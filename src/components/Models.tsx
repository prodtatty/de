import { Ship, ArrowRight } from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { ImageCarousel } from '@/components/ImageCarousel'
import { NAVY_DEEP, ACCENT, accentAlpha } from '@/lib/theme'

interface Model {
  name: string
  tagline: string
  description?: string
  specs: [string, string][]
  price: string | null
  images?: { src: string; alt: string }[]
}

// All figures below are confirmed directly against the manufacturer's own
// product cards, with real product photography for every model.
const MODELS: Model[] = [
  {
    name: 'K380',
    tagline: 'Компактный минимал для двоих',
    description: 'Не требует регистрации и наличия водительского удостоверения. Большой кокпит и хорошая остойчивость.',
    specs: [
      ['Длина', '380 см'],
      ['Ширина', '166 см'],
      ['Транец', '38 см'],
      ['Масса', '140 кг'],
      ['Мотор до', '10 л.с.'],
      ['Экипаж', '2 чел'],
    ],
    price: '189 000 ₽',
    images: [
      { src: 'images/k380/trophy.webp', alt: 'Vrungel.Pro K380 — победители соревнований' },
      { src: 'images/k380/river.webp', alt: 'Vrungel.Pro K380 на воде' },
      { src: 'images/k380/fishing.webp', alt: 'Vrungel.Pro K380 на рыбалке' },
      { src: 'images/k380/blueprint.webp', alt: 'Чертёж Vrungel.Pro K380' },
    ],
  },
  {
    name: 'K410',
    tagline: 'Килевая лодка для уверенного хода',
    description: 'Килевая лодка выполнена из 7 мм первичного ПНД (полиэтилен низкого давления) PE-100 с УФ-стабилизатором.',
    specs: [
      ['Длина', '410 см'],
      ['Ширина', '166 см'],
      ['Транец', '40 см'],
      ['Масса', '185 кг'],
      ['Мотор до', '30 л.с.'],
      ['Экипаж', '4 чел'],
    ],
    price: '239 000 ₽',
    images: [
      { src: 'images/k410/shore.webp', alt: 'Vrungel.Pro K410 на берегу' },
      { src: 'images/k410/ice.webp', alt: 'Vrungel.Pro K410 зимней рыбалкой' },
    ],
  },
  {
    name: 'K460 Classic',
    tagline: 'Для семьи и активной рыбалки',
    description:
      'Подходит для прогулок в компании или комфортного уединения. Даже с экономичным мотором демонстрирует отличные скоростные показатели.',
    specs: [
      ['Длина', '460 см'],
      ['Ширина', '185 см'],
      ['Транец', '51 см'],
      ['Масса', '276 кг'],
      ['Мотор до', '60 л.с.'],
      ['Экипаж', '4 чел'],
    ],
    price: '489 000 ₽',
    images: [
      { src: 'images/k460/cover.webp', alt: 'Vrungel.Pro K460 на производстве' },
      { src: 'images/k460/trailer.webp', alt: 'Vrungel.Pro K460 на прицепе' },
      { src: 'images/k460/action.webp', alt: 'Vrungel.Pro K460 на воде в Санкт-Петербурге' },
      { src: 'images/k460/cockpit.webp', alt: 'Кокпит Vrungel.Pro K460' },
    ],
  },
  {
    name: 'K520 Classic',
    tagline: 'Топ линейки для больших компаний',
    description:
      'Максимальный комфорт и безопасность на воде. Просторный кокпит для больших компаний. Подходит для длительных путешествий и активного отдыха.',
    specs: [
      ['Длина', '520 см'],
      ['Ширина', '220 см'],
      ['Транец', '51 см'],
      ['Масса', '410 кг'],
      ['Мотор до', '150 л.с.'],
      ['Экипаж', '5 чел'],
    ],
    price: '688 000 ₽',
    images: [
      { src: 'images/k520/action.webp', alt: 'Vrungel.Pro K520 на скорости' },
      { src: 'images/k520/fishing.webp', alt: 'Рыбалка на Vrungel.Pro K520' },
      { src: 'images/k520/docked.webp', alt: 'Vrungel.Pro K520 у берега' },
      { src: 'images/k520/blueprint.webp', alt: 'Чертёж Vrungel.Pro K520' },
    ],
  },
]

function ModelCard({ model, delay }: { model: Model; delay: number }) {
  return (
    <Reveal delay={delay} className="flex flex-col h-full">
      {model.images ? (
        <ImageCarousel images={model.images} />
      ) : (
        <div
          className="relative aspect-[4/3] rounded-2xl overflow-hidden flex items-center justify-center"
          style={{ background: `linear-gradient(150deg, ${accentAlpha(0.12)}, rgba(255,255,255,0.04))` }}
        >
          <Ship size={40} strokeWidth={1.25} color={accentAlpha(0.7)} />
          <span
            className="absolute bottom-3 right-3 text-[10px] tracking-[0.15em] uppercase px-2 py-1 rounded-full"
            style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}
          >
            Фото модели
          </span>
        </div>
      )}

      <div className="flex flex-col flex-1 pt-6">
        <h3 className="text-2xl font-light text-white uppercase tracking-wide">{model.name}</h3>
        <p className="mt-1 text-sm text-white/60">{model.tagline}</p>
        {model.description && <p className="mt-3 text-sm leading-relaxed text-white/50">{model.description}</p>}

        <div className="mt-6 grid grid-cols-2 gap-2.5">
          {model.specs.map(([label, value]) => (
            <div key={label} className="rounded-lg px-3 py-2.5" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
              <div className="text-[11px] uppercase tracking-wide text-white/40">{label}</div>
              <div className="text-sm text-white font-medium mt-0.5">{value}</div>
            </div>
          ))}
        </div>

        <div className="mt-auto pt-8 flex items-center justify-between">
          <span className="text-lg font-medium" style={{ color: ACCENT }}>
            {model.price ?? 'Цена по запросу'}
          </span>
          <a
            href="#contact"
            aria-label={`Оставить заявку на ${model.name}`}
            className="flex items-center justify-center rounded-full border border-white/25 hover:border-white transition-colors"
            style={{ width: 40, height: 40 }}
          >
            <ArrowRight size={16} className="text-white" />
          </a>
        </div>
      </div>
    </Reveal>
  )
}

export function Models() {
  return (
    <section id="models" className="py-24 sm:py-32 px-6 sm:px-8 md:px-12" style={{ backgroundColor: NAVY_DEEP }}>
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <p className="text-xs tracking-[0.3em] uppercase font-medium" style={{ color: ACCENT }}>
            Модельный ряд
          </p>
        </Reveal>
        <Reveal delay={80} className="mt-4 max-w-2xl">
          <h2
            className="font-light uppercase leading-[1.2] text-white"
            style={{ fontSize: 'clamp(1.75rem, 3.6vw, 3rem)' }}
          >
            Один принцип, разные размеры
          </h2>
        </Reveal>
        <Reveal delay={160} className="mt-6 max-w-2xl">
          <p className="text-base sm:text-lg leading-relaxed text-white/60">
            От лёгкой двухместной лодки до катера для большой компании — один и тот же непотопляемый
            корпус из ПНД, разный размер под ваши задачи.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          {MODELS.map((model, i) => (
            <ModelCard key={model.name} model={model} delay={i * 120} />
          ))}
        </div>
      </div>
    </section>
  )
}
