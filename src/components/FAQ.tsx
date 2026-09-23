import { useState } from 'react'
import type { ReactNode } from 'react'
import { Plus, Minus } from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { NAVY, navyAlpha, ACCENT, NAVY_DEEP, EASE } from '@/lib/theme'

interface FAQEntry {
  q: string
  a: ReactNode
}

const LINK_CLASS = 'underline underline-offset-2 hover:opacity-70 transition-opacity'

const FAQS: FAQEntry[] = [
  {
    q: 'Ваши лодки сертифицированы?',
    a: (
      <>
        Да, наши лодки имеют{' '}
        <a href="documents/certificate.pdf" target="_blank" rel="noreferrer" className={LINK_CLASS} style={{ color: ACCENT }}>
          государственный сертификат соответствия
        </a>{' '}
        и полный комплект документов для постановки на учёт в ГИМС.
      </>
    ),
  },
  {
    q: 'Какую модель лодки выбрать?',
    a: (
      <>
        Мы рекомендуем выбирать модель в зависимости от ваших задач и предпочтений. У нас есть
        ассортимент моделей для различных целей: рыбалка, охота, отдых и прочее. Свяжитесь с нами,
        и мы проконсультируем вас.{' '}
        <a href="#models" className={LINK_CLASS} style={{ color: ACCENT }}>
          Наши модели.
        </a>
      </>
    ),
  },
  {
    q: 'Из какого материала изготовлены ваши лодки?',
    a: (
      <>
        Наши лодки изготовлены из высококачественного{' '}
        <a href="#pnd" className={LINK_CLASS} style={{ color: ACCENT }}>
          полиэтилена низкого давления (ПНД)
        </a>
        , который обладает прочностью, долговечностью и устойчивостью к коррозии.
      </>
    ),
  },
  {
    q: 'Сколько человек может вместить ваша лодка?',
    a: 'Наши лодки представлены в нескольких моделях, каждая из которых рассчитана на разное количество экипажа. В зависимости от выбранной модели лодка может вместить от 2 до 5 человек, обеспечивая комфорт и безопасность для всех пассажиров.',
  },
  {
    q: 'Могу ли я приобрести лодку с мотором?',
    a: 'Да, мы предлагаем лодки в комплекте с мотором или отдельно, в зависимости от ваших потребностей и предпочтений.',
  },
  {
    q: 'Какие сервисы вы предоставляете после покупки?',
    a: (
      <>
        Мы предоставляем услуги по установке моторов, обслуживанию и ремонту лодок, а также
        консультации по эксплуатации и уходу за продукцией.{' '}
        <a href="#contact" className={LINK_CLASS} style={{ color: ACCENT }}>
          Подробнее.
        </a>
      </>
    ),
  },
  {
    q: 'Сколько времени занимает доставка лодки?',
    a: (
      <>
        Время доставки зависит от вашего местоположения и выбранного способа доставки. Обычно
        доставка занимает от нескольких дней до нескольких недель.{' '}
        <a href="#contact" className={LINK_CLASS} style={{ color: ACCENT }}>
          Подробнее.
        </a>
      </>
    ),
  },
  {
    q: 'Какие гарантии вы предоставляете на свои лодки?',
    a: (
      <>
        Мы предоставляем гарантию на наши лодки в соответствии с законодательством о
        потребительских правах. Дополнительные гарантии могут быть предоставлены по
        договорённости.{' '}
        <a href="#contact" className={LINK_CLASS} style={{ color: ACCENT }}>
          Подробнее.
        </a>
      </>
    ),
  },
  {
    q: 'Могу ли я вернуть или обменять лодку, если она не подошла?',
    a: 'Лодки не подлежат возврату или обмену, но мы можем помочь с продажей вашей лодки через наши ресурсы. Подробности можно уточнить у наших менеджеров.',
  },
  {
    q: 'Какой объём багажного отделения у вашей лодки?',
    a: 'Объём багажного отделения зависит от модели и размеров лодки. Мы рекомендуем выбирать модель с учётом ваших потребностей и объёма багажа, который вам понадобится.',
  },
]

function FAQItem({
  entry,
  isOpen,
  onToggle,
  delay,
}: {
  entry: FAQEntry
  isOpen: boolean
  onToggle: () => void
  delay: number
}) {
  return (
    <Reveal
      delay={delay}
      className="rounded-2xl bg-white overflow-hidden"
      style={{ boxShadow: '0 1px 3px rgba(29,48,69,0.08), 0 12px 32px -16px rgba(29,48,69,0.15)' }}
    >
      <button onClick={onToggle} className="w-full flex items-center justify-between gap-4 text-left p-5 sm:p-6" aria-expanded={isOpen}>
        <span className="text-base font-medium" style={{ color: NAVY }}>
          {entry.q}
        </span>
        <span
          className="flex-shrink-0 flex items-center justify-center rounded-full transition-colors"
          style={{ width: 28, height: 28, backgroundColor: isOpen ? navyAlpha(0.1) : navyAlpha(0.06) }}
        >
          {isOpen ? <Minus size={14} color={NAVY} /> : <Plus size={14} color={NAVY} />}
        </span>
      </button>
      <div style={{ display: 'grid', gridTemplateRows: isOpen ? '1fr' : '0fr', transition: `grid-template-rows 0.35s ${EASE}` }}>
        <div className="overflow-hidden">
          <p className="px-5 sm:px-6 pb-5 sm:pb-6 text-sm leading-relaxed" style={{ color: navyAlpha(0.65) }}>
            {entry.a}
          </p>
        </div>
      </div>
    </Reveal>
  )
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="py-24 sm:py-32 px-6 sm:px-8 md:px-12" style={{ backgroundColor: NAVY_DEEP }}>
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <p className="text-xs tracking-[0.3em] uppercase font-medium" style={{ color: ACCENT }}>
            Вопросы
          </p>
        </Reveal>
        <Reveal delay={80} className="mt-4 max-w-2xl">
          <h2 className="font-light uppercase leading-[1.2] text-white" style={{ fontSize: 'clamp(1.75rem, 3.6vw, 3rem)' }}>
            Часто задаваемые вопросы
          </h2>
        </Reveal>
        <Reveal delay={160} className="mt-6 max-w-2xl">
          <p className="text-base sm:text-lg leading-relaxed text-white/60">
            Собрали ответы на вопросы, которые чаще всего задают перед покупкой лодки. Не нашли
            своего — звоните, разберёмся.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
          {FAQS.map((entry, i) => (
            <FAQItem
              key={entry.q}
              entry={entry}
              delay={(i % 4) * 80}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
