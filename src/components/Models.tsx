import { Ship, ArrowRight } from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { NAVY_DEEP, ACCENT, accentAlpha } from '@/lib/theme'

interface Model {
  name: string
  tagline: string
  specs: [string, string][]
  price: string | null
}

// Specs and prices sourced from public listings of the Vrungel.Pro lineup.
// TODO: confirm current prices/specs against the manufacturer before publishing,
// and drop in real product photography per model (image slots below are placeholders).
const MODELS: Model[] = [
  {
    name: 'K380',
    tagline: 'Компактный минимал для двоих',
    specs: [
      ['Длина', '3,8 м'],
      ['Экипаж', '2 человека'],
      ['Регистрация', 'не требуется'],
    ],
    price: null,
  },
  {
    name: 'K460 Classic',
    tagline: 'Для семьи и активной рыбалки',
    specs: [
      ['Длина', '4,6 м (5 м с кринолинами)'],
      ['Ширина', '1,85 м'],
      ['Грузоподъёмность', '440 кг'],
    ],
    price: 'от 489 000 ₽',
  },
  {
    name: 'K520 Classic',
    tagline: 'Топ линейки для больших компаний',
    specs: [
      ['Длина', '5,2 м'],
      ['Ширина', '2,2 м'],
      ['Мотор', 'до 150 л.с.'],
    ],
    price: 'от 688 000 ₽',
  },
]

function ModelCard({ model, delay }: { model: Model; delay: number }) {
  return (
    <Reveal delay={delay} className="flex flex-col h-full">
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

      <div className="flex flex-col flex-1 pt-6">
        <h3 className="text-2xl font-light text-white uppercase tracking-wide">{model.name}</h3>
        <p className="mt-1 text-sm text-white/60">{model.tagline}</p>

        <div className="mt-6 flex flex-col gap-2.5">
          {model.specs.map(([label, value]) => (
            <div key={label} className="flex items-baseline justify-between text-sm border-b border-white/10 pb-2.5">
              <span className="text-white/50">{label}</span>
              <span className="text-white font-medium">{value}</span>
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
            Три размера — один принцип
          </h2>
        </Reveal>
        <Reveal delay={160} className="mt-6 max-w-2xl">
          <p className="text-base sm:text-lg leading-relaxed text-white/60">
            От лёгкой двухместной лодки до катера для большой компании — один и тот же непотопляемый
            корпус из ПНД, разный размер под ваши задачи.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          {MODELS.map((model, i) => (
            <ModelCard key={model.name} model={model} delay={i * 120} />
          ))}
        </div>
      </div>
    </section>
  )
}
