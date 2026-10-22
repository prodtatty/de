import { useEffect, useRef, useState, type ReactNode } from 'react'
import { contacts, grill, menu, services, type MenuGroup } from './data'

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible')
            io.unobserve(e.target)
          }
        })
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

function useParallax<T extends HTMLElement>(strength = 0.08) {
  const ref = useRef<T>(null)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const update = () => {
      const el = ref.current
      if (!el) return
      const r = el.parentElement!.getBoundingClientRect()
      const offset = (r.top + r.height / 2 - window.innerHeight / 2) * -strength
      el.style.transform = `translate3d(0, ${offset}px, 0)`
    }
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [strength])
  return ref
}

const nav = [
  { href: '#menu', label: 'Меню' },
  { href: '#about', label: 'О нас' },
  { href: '#grill', label: 'Мангал' },
  { href: '#services', label: 'Услуги' },
  { href: '#contacts', label: 'Контакты' },
]

function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,padding] duration-700 ${
        scrolled || open ? 'border-b border-line bg-ink/95 py-4' : 'border-b border-transparent py-7'
      }`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 md:px-[6vw]">
        <a href="#top" className="font-serif text-xl tracking-[0.32em]" onClick={() => setOpen(false)}>
          ATOMIC
        </a>
        <nav className="hidden items-center gap-10 lg:flex">
          {nav.map((n) => (
            <a key={n.href} href={n.href} className="link-line text-[13px] tracking-wide text-ivory/80 hover:text-ivory">
              {n.label}
            </a>
          ))}
          <a
            href={contacts.phoneHref}
            className="border border-ivory/40 px-5 py-2.5 text-[12px] uppercase tracking-[0.18em] transition-colors duration-500 hover:border-ivory hover:bg-ivory hover:text-ink"
          >
            Забронировать
          </a>
        </nav>
        <button
          className="flex h-10 w-10 flex-col items-end justify-center gap-[7px] lg:hidden"
          aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`block h-px w-7 bg-ivory transition-transform duration-500 ${open ? 'translate-y-[4px] rotate-45' : ''}`} />
          <span className={`block h-px bg-ivory transition-all duration-500 ${open ? 'w-7 -translate-y-[4px] -rotate-45' : 'w-5'}`} />
        </button>
      </div>

      <div
        className={`fixed inset-x-0 bottom-0 top-[65px] bg-ink px-5 transition-opacity duration-500 lg:hidden ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <nav className="flex flex-col pt-10">
          {nav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="border-b border-line py-5 font-serif text-4xl"
            >
              {n.label}
            </a>
          ))}
        </nav>
        <div className="mt-12 space-y-2">
          <p className="eyebrow">Бронирование</p>
          <a href={contacts.phoneHref} className="block font-serif text-3xl">
            {contacts.phone}
          </a>
        </div>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section id="top" className="grain relative flex h-[100svh] min-h-[600px] items-end overflow-hidden">
      <img
        src="./images/hall.webp"
        srcSet="./images/hall-800.webp 800w, ./images/hall.webp 1600w"
        sizes="100vw"
        alt="Зал кафе ATOMIC с панорамными окнами на трассу картинга"
        className="graded settle absolute inset-0 h-full w-full object-cover"
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/30" />
      <div className="relative mx-auto w-full max-w-[1400px] px-5 pb-14 md:px-[6vw] md:pb-20">
        <p className="eyebrow reveal">Сосновый Бор</p>
        <h1 className="reveal mt-6 font-serif text-[22vw] font-normal leading-[0.85] tracking-[0.04em] md:text-[13vw] xl:text-[200px]">
          ATOMIC
        </h1>
        <div className="reveal mt-10 flex flex-col gap-8 border-t border-line pt-8 md:flex-row md:items-end md:justify-between">
          <p className="max-w-md font-serif text-2xl italic leading-snug text-ivory/90 md:text-3xl">
            Кухня и бар у старт-финишной прямой
          </p>
          <div className="flex flex-col gap-1 text-[13px] text-stone md:text-right">
            <span>{contacts.address}</span>
            <span>{contacts.hours}</span>
          </div>
        </div>
      </div>
    </section>
  )
}

function SectionHead({ index, eyebrow, title }: { index: string; eyebrow: string; title: ReactNode }) {
  return (
    <div className="reveal">
      <p className="eyebrow">
        <span className="text-bronze">{index}</span>
        <span className="mx-3 inline-block h-px w-8 translate-y-[-3px] bg-line align-middle" />
        {eyebrow}
      </p>
      <h2 className="mt-8 font-serif text-[44px] font-normal leading-[1.02] md:text-[72px]">{title}</h2>
    </div>
  )
}

function About() {
  const img = useParallax<HTMLImageElement>(0.06)
  return (
    <section id="about" className="mx-auto max-w-[1400px] px-5 py-32 md:px-[6vw] md:py-52">
      <div className="grid gap-16 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-5">
          <SectionHead index="01" eyebrow="О нас" title={<>Кухня, построенная вместе с трассой</>} />
          <div className="reveal mt-12 max-w-md space-y-6 text-[15px] leading-[1.8] text-ivory/75">
            <p>
              Когда здесь появилась трасса, вокруг были только шоссе и лес. Гости уезжали после заезда, так и не
              пообедав.
            </p>
            <p>
              Поэтому кухню и бар мы проектировали одновременно с треком и с той же тщательностью. Всё готовим на месте,
              без полуфабрикатов.
            </p>
            <p>Сегодня сюда приезжают и без заезда: на кофе, семейный обед или мангал по выходным.</p>
          </div>
        </div>
        <div className="relative overflow-hidden md:col-span-6 md:col-start-7 md:mt-32">
          <div className="relative aspect-[4/5] overflow-hidden">
            <img
              ref={img}
              src="./images/hall-800.webp"
              srcSet="./images/hall-800.webp 800w, ./images/hall.webp 1600w"
              sizes="(min-width: 768px) 45vw, 100vw"
              alt="Столы у окна с видом на трассу"
              loading="lazy"
              className="graded absolute inset-x-0 -top-[8%] h-[116%] w-full object-cover object-[70%_50%]"
            />
          </div>
          <p className="eyebrow mt-4">Зал · вид на старт-финишную прямую</p>
        </div>
      </div>

      <div className="mt-32 grid border-t border-line md:mt-48 md:grid-cols-3">
        {[
          ['I', 'Готовим на месте', 'От борща до дубайского шоколада — всё делает наша команда, ничего не привозится замороженным.'],
          ['II', 'Часть трассы', 'Кафе проектировали вместе с треком: зал, меню и ритм работы рассчитаны на гостей картинга.'],
          ['III', 'Для всей семьи', 'Стейк и домашний лимонад для взрослых, мороженое и коктейли — для детей.'],
        ].map(([n, t, d]) => (
          <div key={n} className="reveal border-b border-line py-10 md:border-b-0 md:border-r md:px-10 md:py-14 md:first:pl-0 md:last:border-r-0">
            <p className="font-serif text-lg text-bronze">{n}</p>
            <h3 className="mt-6 font-serif text-3xl font-normal">{t}</h3>
            <p className="mt-4 max-w-xs text-[14px] leading-[1.75] text-stone">{d}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function MenuList({ group, reveal = true }: { group: MenuGroup; reveal?: boolean }) {
  return (
    <div className={`${reveal ? 'reveal ' : ''}break-inside-avoid pb-16`}>
      <div className="flex items-baseline justify-between border-b border-line pb-4">
        <h3 className="font-serif text-[28px] font-normal italic">{group.title}</h3>
        {group.aside && <span className="eyebrow">{group.aside}</span>}
      </div>
      <ul className="mt-6 space-y-5">
        {group.items.map((d) => (
          <li key={d.name}>
            <div className="flex items-baseline gap-3">
              <span className="text-[15px] font-normal">{d.name}</span>
              <span className="leader" />
              <span className="whitespace-nowrap text-[14px] tabular-nums text-ivory/85">
                {d.price}
                <span className="ml-1 text-stone">₽</span>
              </span>
            </div>
            {d.note && <p className="mt-1 text-[13px] text-stone">{d.note}</p>}
          </li>
        ))}
      </ul>
    </div>
  )
}

const tabs = [
  { id: 'kitchen', label: 'Кухня' },
  { id: 'bar', label: 'Бар' },
  { id: 'desserts', label: 'Десерты' },
] as const

function Menu() {
  const [tab, setTab] = useState<(typeof tabs)[number]['id']>('kitchen')
  const [fading, setFading] = useState(false)

  const select = (id: typeof tab) => {
    if (id === tab) return
    setFading(true)
    window.setTimeout(() => {
      setTab(id)
      setFading(false)
    }, 350)
  }

  return (
    <section id="menu" className="border-t border-line bg-ink2">
      <div className="mx-auto max-w-[1400px] px-5 py-32 md:px-[6vw] md:py-52">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-6">
            <SectionHead index="02" eyebrow="Меню" title="Что подаём" />
          </div>
          <p className="reveal self-end text-[14px] leading-[1.8] text-stone md:col-span-4 md:col-start-9">
            Домашняя кухня, бар и десерты собственного производства. Цены в рублях.
          </p>
        </div>

        <div className="reveal mt-20 flex gap-10 border-b border-line" role="tablist">
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => select(t.id)}
              className={`relative -mb-px pb-5 font-serif text-2xl transition-colors duration-500 md:text-3xl ${
                tab === t.id ? 'text-ivory' : 'text-stone hover:text-ivory/80'
              }`}
            >
              {t.label}
              <span
                className={`absolute inset-x-0 bottom-0 h-px origin-left bg-bronze transition-transform duration-700 ${
                  tab === t.id ? 'scale-x-100' : 'scale-x-0'
                }`}
              />
            </button>
          ))}
        </div>

        <div
          className={`mt-16 gap-x-24 transition-opacity duration-300 md:columns-2 ${fading ? 'opacity-0' : 'opacity-100'}`}
          role="tabpanel"
        >
          {menu[tab].map((g) => (
            <MenuList key={tab + g.title} group={g} reveal={false} />
          ))}
        </div>
      </div>
    </section>
  )
}

function Grill() {
  return (
    <section id="grill" className="mx-auto max-w-[1400px] px-5 py-32 md:px-[6vw] md:py-52">
      <div className="grid gap-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <SectionHead index="03" eyebrow="Мангал" title="Пятница, суббота, воскресенье" />
          <p className="reveal mt-10 max-w-sm text-[15px] leading-[1.8] text-ivory/75">
            По выходным разжигаем мангал. Мясо на углях, свежий воздух и вид на трассу.
          </p>
        </div>
        <div className="md:col-span-6 md:col-start-7 md:pt-40">
          <MenuList group={{ title: 'На углях', items: grill }} />
        </div>
      </div>
    </section>
  )
}

function Services() {
  return (
    <section id="services" className="border-t border-line bg-ink2">
      <div className="mx-auto max-w-[1400px] px-5 py-32 md:px-[6vw] md:py-52">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <SectionHead index="04" eyebrow="Услуги" title="За пределами зала" />
          </div>
          <div className="reveal self-end md:col-span-4 md:col-start-9">
            <p className="text-[15px] leading-[1.8] text-ivory/75">
              Работаем на гостя. Меню собираем под задачу и под бюджет — от скромного кофе-брейка до большого банкета.
            </p>
          </div>
        </div>

        <ol className="mt-24 border-t border-line">
          {services.map((s, i) => (
            <li
              key={s.title}
              className="reveal group grid gap-3 border-b border-line py-9 md:grid-cols-12 md:items-baseline md:gap-8 md:py-11"
            >
              <span className="font-serif text-lg text-bronze md:col-span-1">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="font-serif text-[30px] font-normal leading-tight transition-transform duration-700 group-hover:translate-x-2 md:col-span-6 md:text-[40px]">
                {s.title}
              </h3>
              <p className="text-[14px] leading-[1.75] text-stone md:col-span-4 md:col-start-9">{s.text}</p>
            </li>
          ))}
        </ol>

        <div className="reveal mt-20 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Подробности и расчёт — по телефону</p>
            <a href={contacts.phoneHref} className="link-line mt-4 inline-block font-serif text-4xl md:text-6xl">
              {contacts.phone}
            </a>
          </div>
          <a
            href={contacts.phoneHref}
            className="self-start border border-ivory/40 px-8 py-4 text-[12px] uppercase tracking-[0.2em] transition-colors duration-500 hover:border-ivory hover:bg-ivory hover:text-ink md:self-auto"
          >
            Позвонить
          </a>
        </div>
      </div>
    </section>
  )
}

function Contacts() {
  return (
    <section id="contacts" className="mx-auto max-w-[1400px] px-5 pb-16 pt-32 md:px-[6vw] md:pt-52">
      <SectionHead index="05" eyebrow="Бронирование и контакты" title={<>Ждём вас<br />у трассы</>} />

      <div className="mt-24 grid border-t border-line md:grid-cols-3">
        <div className="reveal border-b border-line py-10 md:border-b-0 md:border-r md:pr-10">
          <p className="eyebrow">Стол и заказы</p>
          <a href={contacts.phoneHref} className="link-line mt-5 inline-block font-serif text-3xl">
            {contacts.phone}
          </a>
          <p className="mt-3 text-[13px] text-stone">Бронирование, навынос, мероприятия</p>
        </div>
        <div className="reveal border-b border-line py-10 md:border-b-0 md:border-r md:px-10">
          <p className="eyebrow">Адрес</p>
          <a href={contacts.mapHref} target="_blank" rel="noreferrer" className="link-line mt-5 inline-block font-serif text-3xl leading-tight">
            Сосновый Бор,
            <br />
            Ракопежское шоссе, 32/а
          </a>
          <p className="mt-3 text-[13px] text-stone">На территории школы картинга</p>
        </div>
        <div className="reveal py-10 md:pl-10">
          <p className="eyebrow">Часы</p>
          <p className="mt-5 font-serif text-3xl">10:00 — 20:00</p>
          <p className="mt-3 text-[13px] text-stone">Ежедневно · мангал пт–вс</p>
        </div>
      </div>

      <footer className="mt-32 flex flex-col gap-6 border-t border-line pt-10 text-[12px] text-stone md:flex-row md:items-center md:justify-between">
        <span className="font-serif text-lg tracking-[0.32em] text-ivory">ATOMIC</span>
        <span>Кафе Сосновоборской школы картинга</span>
        <div className="flex gap-8">
          <a href={contacts.vkHref} target="_blank" rel="noreferrer" className="link-line">
            ВКонтакте
          </a>
          <a href="#top" className="link-line">
            Наверх
          </a>
        </div>
      </footer>
    </section>
  )
}

export default function App() {
  useReveal()
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Menu />
        <Grill />
        <Services />
        <Contacts />
      </main>
    </>
  )
}
