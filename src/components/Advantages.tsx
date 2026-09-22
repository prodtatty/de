import { LifeBuoy, ShieldCheck, Sun, Thermometer, Wrench, FileCheck2 } from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { NAVY, navyAlpha, ACCENT, CREAM } from '@/lib/theme'

const ADVANTAGES = [
  {
    icon: LifeBuoy,
    title: 'Не тонет',
    text: 'Блоки плавучести держат катер на воде даже при пробое борта.',
  },
  {
    icon: ShieldCheck,
    title: 'Не боится ударов',
    text: 'Лист ПНД PE-100 толщиной от 8 мм выдерживает удары о камни, лёд и мель.',
  },
  {
    icon: Sun,
    title: 'Не выгорает',
    text: 'УФ-стабилизатор защищает корпус от солнца — цвет и прочность не меняются годами.',
  },
  {
    icon: Thermometer,
    title: 'Работает в любую погоду',
    text: 'От −15 °C до +80 °C — рыбалка и в межсезонье, и в жару.',
  },
  {
    icon: Wrench,
    title: 'Ремонтопригоден',
    text: 'В отличие от треснувшего стеклопластика, ПНД можно сварить и восстановить.',
  },
  {
    icon: FileCheck2,
    title: 'Официально',
    text: 'Сертификат Таможенного союза, постановка на учёт в ГИМС.',
  },
]

export function Advantages() {
  return (
    <section id="material" className="py-24 sm:py-32 px-6 sm:px-8 md:px-12" style={{ backgroundColor: CREAM }}>
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <p className="text-xs tracking-[0.3em] uppercase font-medium" style={{ color: ACCENT }}>
            Материал
          </p>
        </Reveal>
        <Reveal delay={80} className="mt-4 max-w-3xl">
          <h2
            className="font-light uppercase leading-[1.2]"
            style={{ fontSize: 'clamp(1.75rem, 3.6vw, 3rem)', color: NAVY }}
          >
            Корпус, который не боится воды
          </h2>
        </Reveal>
        <Reveal delay={160} className="mt-6 max-w-2xl">
          <p className="text-base sm:text-lg leading-relaxed" style={{ color: navyAlpha(0.8) }}>
            Каждый корпус формуется на собственном производстве в Сосновом Бору — от раскроя листа
            ПНД на фрезерном станке с ЧПУ до сборки готового катера.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {ADVANTAGES.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={(i % 3) * 100}>
              <div
                className="flex items-center justify-center rounded-full mb-5"
                style={{ width: 52, height: 52, backgroundColor: navyAlpha(0.06) }}
              >
                <Icon size={22} color={NAVY} strokeWidth={1.75} />
              </div>
              <h3 className="text-lg font-medium mb-2" style={{ color: NAVY }}>
                {title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: navyAlpha(0.6) }}>
                {text}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
