import { useEffect, useRef, useState, type ReactNode } from 'react'
import { contacts, grill, menu, services, type MenuGroup, type Photo, type Service } from './data'
import { EDITION, legalDocs, operator, type Block, type LegalDoc } from './legal'

function useReveal(page: string) {
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
      { rootMargin: '0px 0px -4% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [page])
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

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setMatches(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])
  return matches
}

const nav = [
  { href: '#services', label: 'Услуги' },
  { href: '#menu', label: 'Меню' },
  { href: '#about', label: 'О нас' },
  { href: '#grill', label: 'Мангал' },
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
        <a href="#top" onClick={() => setOpen(false)} aria-label="Моторрест — на главную">
          <img
            src="./images/logo-sm.webp"
            srcSet="./images/logo-xs.webp 300w, ./images/logo-sm.webp 492w"
            sizes="146px"
            alt="Моторрест"
            width={492}
            height={121}
            className="h-8 w-auto md:h-9"
          />
        </a>
        <nav className="hidden items-center gap-10 lg:flex">
          {nav.map((n) => (
            <a key={n.href} href={n.href} className="link-line text-[13px] tracking-wide text-ivory/80 hover:text-ivory">
              {n.label}
            </a>
          ))}
          <a
            href={contacts.phones[0].href}
            className="border border-ivory/40 px-5 py-2.5 text-[12px] uppercase tracking-[0.18em] transition-colors duration-500 hover:border-ivory hover:bg-ivory hover:text-ink"
          >
            Забронировать
          </a>
        </nav>
        <div className="flex items-center gap-2 lg:hidden">
          <a
            href={contacts.phones[0].href}
            aria-label={`Позвонить: ${contacts.phones[0].label}`}
            className="flex h-11 w-11 items-center justify-center text-ivory/85 transition-colors hover:text-ivory"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
              <path d="M5 3.5h3.2l1.6 4.3-2.2 1.5a11.5 11.5 0 0 0 7.1 7.1l1.5-2.2 4.3 1.6V19a1.5 1.5 0 0 1-1.6 1.5C10.5 20 4 13.5 3.5 5.1A1.5 1.5 0 0 1 5 3.5z" />
            </svg>
          </a>
          <button
            className="flex h-11 w-11 flex-col items-end justify-center gap-[7px]"
            aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className={`block h-px w-7 bg-ivory transition-transform duration-500 ${open ? 'translate-y-[4px] rotate-45' : ''}`} />
            <span className={`block h-px bg-ivory transition-all duration-500 ${open ? 'w-7 -translate-y-[4px] -rotate-45' : 'w-5'}`} />
          </button>
        </div>
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
          <p className="eyebrow">Бронирование и заказы</p>
          {contacts.phones.map((ph) => (
            <a key={ph.href} href={ph.href} className="block font-serif text-3xl">
              {ph.label}
            </a>
          ))}
        </div>
      </div>
    </header>
  )
}

const OPEN_SERVICE = 'motorrest:open-service'
const requestOpenService = (index: number) => window.dispatchEvent(new CustomEvent(OPEN_SERVICE, { detail: index }))

// Медленная связь или включённая экономия трафика — видео сами не запускаем, остаётся обложка
function prefersLightMedia() {
  const c = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection
  return !!c && (c.saveData === true || c.effectiveType === 'slow-2g' || c.effectiveType === '2g')
}

// Ждём полной загрузки страницы: видео не отнимает канал и процессор у первого экрана
function afterPageLoad(cb: () => void) {
  let timer = 0
  const run = () => {
    timer = window.setTimeout(cb, 300)
  }
  if (document.readyState === 'complete') run()
  else window.addEventListener('load', run, { once: true })
  return () => {
    window.removeEventListener('load', run)
    window.clearTimeout(timer)
  }
}

// Видео без звука и по кругу, звук — по кнопке; играет, только пока видно на экране
// (threshold — какая доля кадра должна быть видна), при «уменьшить движение» и экономии трафика само не запускается.
function useAutoplayVideo(threshold = 0) {
  const ref = useRef<HTMLVideoElement>(null)
  const [muted, setMuted] = useState(true)
  // видео хоть раз начало играть — можно проявлять его поверх обложки
  const [started, setStarted] = useState(false)
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  useEffect(() => {
    const v = ref.current
    if (!v) return
    v.muted = true
    const onPlay = () => setStarted(true)
    v.addEventListener('playing', onPlay)
    let io: IntersectionObserver | undefined
    const cancel =
      reducedMotion || prefersLightMedia()
        ? undefined
        : afterPageLoad(() => {
            io = new IntersectionObserver(
              ([e]) => {
                if (e.isIntersecting) v.play().catch(() => {})
                else v.pause()
              },
              { threshold },
            )
            io.observe(v)
          })
    return () => {
      cancel?.()
      io?.disconnect()
      v.removeEventListener('playing', onPlay)
    }
  }, [reducedMotion, threshold])

  const toggleSound = () => {
    const v = ref.current
    if (!v) return
    v.muted = !v.muted
    setMuted(v.muted)
    if (v.paused) v.play().catch(() => {})
  }

  const togglePlay = () => {
    const v = ref.current
    if (!v) return
    if (v.paused) v.play().catch(() => {})
    else v.pause()
  }

  return { ref, muted, started, toggleSound, togglePlay }
}

const TOUR_POSTER = './videos/tour-poster.webp'

// H.264 для Safari и большинства браузеров, VP9 — запасной вариант для сборок без H.264
const tourSources = (
  <>
    <source src="./videos/tour.mp4" type="video/mp4" />
    <source src="./videos/tour.webm" type="video/webm" />
  </>
)

function SoundButton({ muted, onClick, className = '' }: { muted: boolean; onClick: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={!muted}
      className={`flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-ivory/85 transition-colors hover:text-ivory ${className}`}
    >
      <span aria-hidden className="flex h-3 items-end gap-[2px]">
        {[5, 9, 6, 11].map((h, i) => (
          <span key={i} className={`w-px bg-current transition-all duration-500 ${muted ? 'h-[3px]' : ''}`} style={muted ? undefined : { height: h }} />
        ))}
      </span>
      {muted ? 'Включить звук' : 'Выключить звук'}
    </button>
  )
}

function TourCard() {
  const { ref, muted, started, toggleSound, togglePlay } = useAutoplayVideo()
  return (
    <figure className="rise rise-3 shrink-0">
      <div className="relative aspect-[9/16] h-[clamp(320px,calc(100svh-450px),500px)] overflow-hidden border border-ivory/15 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9)]">
        {/* обложка отдельной «ленивой» картинкой: на телефоне карточка скрыта, и обложка не скачивается */}
        <img src={TOUR_POSTER} alt="" width={720} height={1280} loading="lazy" className="graded-video absolute inset-0 h-full w-full object-cover" />
        <video
          ref={ref}
          muted
          loop
          playsInline
          preload="none"
          onClick={togglePlay}
          aria-label="Видеоэкскурсия по «Моторресту»: зал, симулятор, детская комната"
          className={`graded-video relative h-full w-full object-cover transition-opacity duration-700 ${
            started ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {tourSources}
        </video>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink/80 to-transparent" />
        <SoundButton muted={muted} onClick={toggleSound} className="absolute bottom-4 left-4" />
      </div>
      <figcaption className="mt-4 text-[10px] uppercase tracking-[0.22em] text-ivory/60">Экскурсия по залу · 0:18</figcaption>
    </figure>
  )
}

// Телефон и планшет: под видео лежит его первый кадр (картинка в <picture> у Hero),
// само видео — облегчённая версия 540×960 — проявляется, когда начинает играть
function HeroBackgroundVideo() {
  const { ref, muted, started, toggleSound } = useAutoplayVideo()
  return (
    <div className="lg:hidden">
      <video
        ref={ref}
        muted
        loop
        playsInline
        preload="none"
        aria-label="Видеоэкскурсия по «Моторресту»"
        className={`graded-video-bg absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
          started ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <source src="./videos/tour-m.mp4" type="video/mp4" />
        <source src="./videos/tour-m.webm" type="video/webm" />
      </video>
      <SoundButton muted={muted} onClick={toggleSound} className="absolute right-5 top-24 z-10 md:right-[6vw]" />
    </div>
  )
}

function Hero() {
  return (
    <section id="top" className="grain relative flex min-h-[100svh] items-end overflow-hidden">
      {/* Компьютер — фото зала; телефон — первый кадр видео, сразу, без ожидания самого ролика */}
      <picture>
        <source
          media="(min-width: 1024px)"
          srcSet="./images/hall-800.webp 800w, ./images/hall.webp 1600w"
          sizes="100vw"
        />
        <img
          src="./videos/tour-m-poster.webp"
          alt="Зал кафе «Моторрест» с панорамными окнами на трассу картинга"
          width={540}
          height={960}
          {...{ fetchpriority: 'high' } /* React 18 не знает fetchPriority — пишем атрибут как есть */}
          className="hero-bg absolute inset-0 h-full w-full object-cover"
        />
      </picture>
      <HeroBackgroundVideo />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/40 lg:via-ink/40 lg:to-ink/30" />
      <div className="relative mx-auto w-full max-w-[1400px] px-5 pb-14 pt-32 md:px-[6vw] md:pb-20">
        <div className="lg:flex lg:items-end lg:justify-between lg:gap-12">
          <div>
            <p className="rise text-[11px] uppercase tracking-[0.22em] text-ivory/70">Сосновый Бор</p>
            <h1 className="rise rise-1 mt-4 whitespace-nowrap font-serif text-[min(17.5vw,190px)] font-normal italic leading-[1.05] -tracking-[0.005em] lg:text-[min(12vw,190px)]">
              Моторрест
            </h1>
          </div>
          <div className="hidden lg:block">
            <TourCard />
          </div>
        </div>
        <div className="rise rise-2 mt-10 flex flex-col gap-8 border-t border-line pt-8 md:flex-row md:items-end md:justify-between">
          <p className="max-w-lg font-serif text-2xl italic leading-snug text-ivory/90 md:text-3xl">
            Кейтеринг, банкеты и кухня у старт-финишной прямой
          </p>
          <div className="flex flex-col gap-1 text-[13px] text-stone md:text-right">
            <span>{contacts.address}</span>
            <span>{contacts.hours}</span>
          </div>
        </div>
        <nav aria-label="Услуги" className="rise rise-3 mt-6 flex flex-wrap gap-x-5">
          {services.map((s, i) => (
            <a
              key={s.short}
              href={`#service-item-${i}`}
              onClick={(e) => {
                e.preventDefault()
                requestOpenService(i)
              }}
              className="py-2 text-[11px] uppercase tracking-[0.22em] text-ivory/85 transition-colors hover:text-ivory md:text-[12px]"
            >
              <span className="link-line">{s.short}</span>
            </a>
          ))}
        </nav>
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
          <SectionHead index="02" eyebrow="О нас" title={<>Кухня, построенная вместе с трассой</>} />
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

// 1600 → «1 600» (неразрывный пробел); одинаково на сервере и в браузере
const formatPrice = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0')

function MenuList({ group, reveal = true }: { group: MenuGroup; reveal?: boolean }) {
  const priceCell = 'w-[4.5rem] shrink-0 text-right md:w-20'
  return (
    <div className={`${reveal ? 'reveal ' : ''}pb-16`}>
      <div className="flex items-end justify-between gap-4 border-b border-line pb-4">
        <div>
          <h3 className="font-serif text-[28px] font-normal italic leading-tight">{group.title}</h3>
          {group.note && <p className="mt-1 text-[13px] text-stone">{group.note}</p>}
        </div>
        {group.sizes && (
          <div className="flex pb-1">
            {group.sizes.map((s) => (
              <span key={s} className={`eyebrow ${priceCell}`}>
                {s}
              </span>
            ))}
          </div>
        )}
      </div>
      <ul className="mt-6 space-y-5">
        {group.items.map((d) => (
          <li key={d.name}>
            <div className="flex items-baseline gap-3">
              <span className="text-[15px] font-normal">{d.name}</span>
              <span className="leader" />
              <span className="flex whitespace-nowrap text-[14px] tabular-nums text-ivory/85">
                {d.prices.map((p, i) => (
                  <span key={i} className={group.sizes ? priceCell : ''}>
                    <span className="mr-1.5 text-stone">от</span>
                    {formatPrice(p)}
                  </span>
                ))}
              </span>
            </div>
            {d.note && <p className="mt-1.5 max-w-md text-[13px] leading-relaxed text-stone">{d.note}</p>}
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
  const panel = useRef<HTMLDivElement>(null)
  const tablist = useRef<HTMLDivElement>(null)

  const select = (id: typeof tab) => {
    if (id === tab) return
    setFading(true)
    window.setTimeout(() => {
      setTab(id)
      setFading(false)
      // если читали глубоко в списке — возвращаем к началу нового раздела
      const top = panel.current!.getBoundingClientRect().top + window.scrollY - tablist.current!.offsetHeight - 80
      if (window.scrollY > top) window.scrollTo({ top, behavior: 'smooth' })
    }, 350)
  }

  return (
    <section id="menu" className="border-t border-line bg-ink2">
      <div className="mx-auto max-w-[1400px] px-5 py-32 md:px-[6vw] md:py-52">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-6">
            <SectionHead index="03" eyebrow="Меню" title="Что подаём" />
          </div>
          <p className="reveal self-end text-[14px] leading-[1.8] text-stone md:col-span-4 md:col-start-9">
            Домашняя кухня, бар и десерты собственного производства. Цены в рублях.
          </p>
        </div>

        <div
          ref={tablist}
          className="reveal sticky top-[61px] z-10 mt-20 flex gap-10 border-b border-line bg-ink2 pt-5"
          role="tablist"
        >
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
          ref={panel}
          className={`mt-16 grid items-start gap-x-24 transition-opacity duration-300 md:grid-cols-2 ${fading ? 'opacity-0' : 'opacity-100'}`}
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
          <SectionHead index="04" eyebrow="Мангал" title="Пятница, суббота, воскресенье" />
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

function VideoSlide({ item }: { item: Photo }) {
  // половина кадра на экране: соседние слайды в карусели не играют
  const { ref, muted, toggleSound, togglePlay } = useAutoplayVideo(0.5)
  return (
    <div className="relative h-full w-full shrink-0 snap-center">
      <video
        ref={ref}
        poster={item.src}
        muted
        loop
        playsInline
        preload="none"
        onClick={togglePlay}
        aria-label={item.alt}
        className="graded-photo h-full w-full object-cover"
      >
        <source src={item.video!.mp4} type="video/mp4" />
        <source src={item.video!.webm} type="video/webm" />
      </video>
      {!item.video!.silent && (
        <>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink/80 to-transparent" />
          <SoundButton muted={muted} onClick={toggleSound} className="absolute bottom-4 left-4" />
        </>
      )}
    </div>
  )
}

// Лента фото и видео 4:5 на нативной прокрутке со snap: на телефоне — свайп, на компьютере — стрелки
function PhotoCarousel({ photos, label }: { photos: Photo[]; label: string }) {
  const track = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)

  const onScroll = () => {
    const el = track.current
    if (el) setIndex(Math.round(el.scrollLeft / el.clientWidth))
  }

  const go = (to: number) => {
    const el = track.current
    if (!el) return
    const i = (to + photos.length) % photos.length
    el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' })
  }

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div role="group" aria-roledescription="карусель" aria-label={`Фото: ${label}`}>
      <div
        ref={track}
        onScroll={onScroll}
        tabIndex={0}
        onKeyDown={(e) => {
          const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
          if (!step) return
          e.preventDefault()
          go(index + step)
        }}
        className="no-scrollbar flex aspect-[4/5] snap-x snap-mandatory overflow-x-auto overscroll-x-contain focus:outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-ivory/30"
      >
        {photos.map((ph) =>
          ph.video ? (
            <VideoSlide key={ph.src} item={ph} />
          ) : (
            <img
              key={ph.src}
              src={ph.src}
              alt={ph.alt}
              width={800}
              height={1000}
              loading="lazy"
              className="graded-photo h-full w-full shrink-0 snap-center object-cover"
            />
          ),
        )}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-[11px] tabular-nums tracking-[0.22em] text-stone" aria-live="polite">
          <span className="text-ivory">{pad(index + 1)}</span> / {pad(photos.length)}
        </span>
        <div className="flex gap-2">
          {[
            { dir: -1, label: 'Предыдущее фото', path: 'M15 5l-7 7 7 7' },
            { dir: 1, label: 'Следующее фото', path: 'M9 5l7 7-7 7' },
          ].map((b) => (
            <button
              key={b.dir}
              type="button"
              onClick={() => go(index + b.dir)}
              aria-label={b.label}
              className="flex h-11 w-11 items-center justify-center border border-ivory/25 text-ivory/80 transition-colors duration-500 hover:border-ivory hover:bg-ivory hover:text-ink"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
                <path d={b.path} />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function ServiceItem({
  service,
  index,
  open,
  onToggle,
}: {
  service: Service
  index: number
  open: boolean
  onToggle: () => void
}) {
  const id = `service-${index}`
  // фото и видео услуги не скачиваем, пока её ни разу не открыли — первый экран грузится быстрее
  const [mediaReady, setMediaReady] = useState(open)
  useEffect(() => {
    if (open) setMediaReady(true)
  }, [open])
  return (
    <li id={`service-item-${index}`} className="reveal border-b border-line">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={onToggle}
        className="group grid w-full grid-cols-[1fr_auto] gap-x-6 gap-y-3 py-9 text-left md:grid-cols-12 md:items-baseline md:gap-8 md:py-11 focus:outline-none focus-visible:outline focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-ivory/30"
      >
        <span className="font-serif text-lg text-bronze md:col-span-1">{String(index + 1).padStart(2, '0')}</span>
        <span
          aria-hidden
          className={`relative row-span-2 mt-2 h-4 w-4 self-start justify-self-end transition-transform duration-700 md:order-last md:col-span-1 md:row-span-1 md:mt-0 md:self-center ${
            open ? 'rotate-45' : 'group-hover:rotate-90'
          }`}
        >
          <span className="absolute left-0 top-1/2 h-px w-4 bg-ivory/70" />
          <span className="absolute left-1/2 top-0 h-4 w-px bg-ivory/70" />
        </span>
        <h3 className="font-serif text-[30px] font-normal leading-tight transition-transform duration-700 group-hover:translate-x-2 md:col-span-6 md:text-[40px]">
          {service.title}
        </h3>
        <p className="col-span-2 text-[14px] leading-[1.75] text-stone md:col-span-4 md:col-start-8">{service.text}</p>
      </button>

      <div
        id={id}
        role="region"
        className={`grid transition-[grid-template-rows,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="grid gap-12 pb-14 pt-6 md:grid-cols-12 md:gap-8 md:pb-16 md:pt-10">
            {service.photos && (
              <div className="mt-6 w-full max-w-[420px] md:col-span-4 md:col-start-2 md:mt-20 md:max-w-none">
                {!mediaReady ? null : service.photos.length > 1 ? (
                  <PhotoCarousel photos={service.photos} label={service.title} />
                ) : (
                  <img
                    src={service.photos[0].src}
                    alt={service.photos[0].alt}
                    width={800}
                    height={1000}
                    loading="lazy"
                    className="graded-photo aspect-[4/5] w-full object-cover"
                  />
                )}
              </div>
            )}
            <div
              className={
                service.photos
                  ? 'space-y-12 md:col-span-5 md:col-start-7'
                  : 'grid gap-12 md:col-span-10 md:col-start-2 md:grid-cols-10 md:gap-8'
              }
            >
              <div className={`space-y-5 ${service.photos ? '' : 'md:col-span-6'}`}>
                {service.story.map((p) => (
                  <p key={p} className="font-serif text-[21px] leading-[1.55] text-ivory/85 md:text-[23px]">
                    {p}
                  </p>
                ))}
              </div>
              <div className={service.photos ? '' : 'md:col-span-4 md:col-start-7'}>
                <p className="eyebrow">Что входит</p>
                <ul className="mt-5 border-t border-line">
                  {service.includes.map((item) => (
                    <li key={item} className="border-b border-line py-3.5 text-[14px] text-ivory/80">
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="eyebrow mt-8">Обсудить по телефону</p>
                <div className="mt-3 flex flex-col items-start gap-1.5">
                  {contacts.phones.map((ph) => (
                    <a key={ph.href} href={ph.href} className="link-line text-[15px] text-ivory">
                      {ph.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </li>
  )
}

function Services() {
  const [openService, setOpenService] = useState<number | null>(null)

  useEffect(() => {
    const onOpen = (e: Event) => {
      const i = (e as CustomEvent<number>).detail
      setOpenService(i)
      document.getElementById(`service-item-${i}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    window.addEventListener(OPEN_SERVICE, onOpen)
    return () => window.removeEventListener(OPEN_SERVICE, onOpen)
  }, [])

  return (
    <section id="services" className="border-t border-line bg-ink2">
      <div className="mx-auto max-w-[1400px] px-5 py-32 md:px-[6vw] md:py-52">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <SectionHead index="01" eyebrow="Услуги" title="Кейтеринг и мероприятия" />
          </div>
          <div className="reveal self-end md:col-span-4 md:col-start-9">
            <p className="text-[15px] leading-[1.8] text-ivory/75">
              Работаем на гостя. Меню собираем под задачу и под бюджет — от скромного кофе-брейка до большого банкета.
            </p>
          </div>
        </div>

        <ol className="mt-24 border-t border-line">
          {services.map((s, i) => (
            <ServiceItem
              key={s.title}
              index={i}
              service={s}
              open={openService === i}
              onToggle={() => setOpenService(openService === i ? null : i)}
            />
          ))}
        </ol>

        <div className="reveal mt-20">
          <p className="eyebrow">Подробности и расчёт — по телефону</p>
          <div className="mt-5 flex flex-col items-start gap-3 md:flex-row md:gap-16">
            {contacts.phones.map((ph) => (
              <a key={ph.href} href={ph.href} className="link-line font-serif text-4xl md:text-6xl">
                {ph.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Contacts() {
  return (
    <section id="contacts" className="mx-auto max-w-[1400px] border-t border-line px-5 pb-16 pt-32 md:px-[6vw] md:pt-52">
      <div className="relative">
        <SectionHead index="05" eyebrow="Бронирование и контакты" title={<>Ждём вас<br />у трассы</>} />
        <img
          src="./images/racer.webp"
          alt="Талисман «Моторреста» с клетчатым флагом"
          width={480}
          height={493}
          loading="lazy"
          className="reveal absolute bottom-0 right-0 w-[104px] md:right-[4%] md:w-[168px]"
        />
      </div>

      <div className="mt-24 grid border-t border-line md:grid-cols-3">
        <div className="reveal border-b border-line py-10 md:border-b-0 md:border-r md:pr-10">
          <p className="eyebrow">Стол и заказы</p>
          <div className="mt-5 flex flex-col items-start gap-1">
            {contacts.phones.map((ph) => (
              <a key={ph.href} href={ph.href} className="link-line font-serif text-3xl">
                {ph.label}
              </a>
            ))}
          </div>
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
    </section>
  )
}

function Footer() {
  return (
    <footer className="mx-auto max-w-[1400px] px-5 pb-12 md:px-[6vw]">
      <div className="flex flex-col gap-10 border-t border-line pt-10 md:flex-row md:items-start md:justify-between">
        <div>
          <img
            src="./images/logo-sm.webp"
            srcSet="./images/logo-xs.webp 300w, ./images/logo-sm.webp 492w"
            sizes="146px"
            alt="Моторрест"
            width={492}
            height={121}
            loading="lazy"
            className="h-9 w-auto"
          />
          <p className="mt-4 text-[12px] text-stone">Кафе и кейтеринг у трассы Сосновоборской школы картинга</p>
        </div>
        <nav aria-label="Документы" className="flex flex-col gap-1 text-[12px] text-stone">
          {legalDocs.map((d) => (
            <a key={d.slug} href={`#/${d.slug}`} className="self-start py-1.5 hover:text-ivory">
              <span className="link-line">{d.title}</span>
            </a>
          ))}
        </nav>
        <div className="flex gap-8 text-[12px] text-stone">
          <a href={contacts.vkHref} target="_blank" rel="noreferrer" className="py-1.5 hover:text-ivory">
            <span className="link-line">ВКонтакте</span>
          </a>
          <a href="#top" className="py-1.5 hover:text-ivory">
            <span className="link-line">Наверх</span>
          </a>
        </div>
      </div>
      <p className="mt-10 text-[11px] leading-relaxed text-stone">
        © 2026 Моторрест · {operator.name} · ИНН {operator.inn} · ОГРН {operator.ogrn}
      </p>
    </footer>
  )
}

function LegalBlock({ block }: { block: Block }) {
  if (typeof block === 'string') return <p>{block}</p>
  return (
    <ul className="space-y-2 border-l border-line pl-5">
      {block.list.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <main className="mx-auto max-w-[1400px] px-5 pb-32 pt-36 md:px-[6vw] md:pt-48">
      <a href="#top" className="link-line eyebrow hover:text-ivory">
        ← На главную
      </a>
      <div className="mt-14 grid gap-16 md:grid-cols-12 md:gap-8">
        <article className="md:col-span-8">
          <p className="eyebrow">Документы</p>
          <h1 className="mt-6 font-serif text-[40px] font-normal leading-[1.05] md:text-[64px]">{doc.title}</h1>
          <p className="mt-8 max-w-xl text-[16px] leading-[1.8] text-ivory/80">{doc.lead}</p>
          <p className="eyebrow mt-6">{EDITION}</p>

          <div className="mt-16 border-t border-line">
            {doc.sections.map((sec, i) => (
              <section key={sec.title} className="border-b border-line py-10">
                <h2 className="font-serif text-[26px] font-normal md:text-[30px]">
                  <span className="mr-4 text-bronze">{i + 1}</span>
                  {sec.title}
                </h2>
                <div className="mt-5 max-w-2xl space-y-4 text-[15px] leading-[1.8] text-ivory/75">
                  {sec.blocks.map((b, j) => (
                    <LegalBlock key={j} block={b} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </article>
        <aside className="md:col-span-3 md:col-start-10">
          <div className="md:sticky md:top-32">
            <p className="eyebrow">Все документы</p>
            <ul className="mt-5 border-t border-line">
              {legalDocs.map((d) => (
                <li key={d.slug} className="border-b border-line py-4">
                  {d.slug === doc.slug ? (
                    <span className="text-[14px] text-ivory">{d.title}</span>
                  ) : (
                    <a href={`#/${d.slug}`} className="link-line text-[14px] text-stone hover:text-ivory">
                      {d.title}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </main>
  )
}

// v2: в уведомление добавлены персональные данные — показываем его заново всем, кто подтвердил старую версию
const CONSENT_KEY = 'motorrest-consent-v2'

function CookieNotice() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let accepted = false
    try {
      accepted = localStorage.getItem(CONSENT_KEY) === '1'
    } catch {
      // хранилище недоступно (приватный режим) — просто показываем уведомление
    }
    if (accepted) return
    const t = window.setTimeout(() => setVisible(true), 1200)
    return () => window.clearTimeout(t)
  }, [])

  const accept = () => {
    try {
      localStorage.setItem(CONSENT_KEY, '1')
    } catch {
      // без хранилища уведомление вернётся при следующем визите
    }
    setVisible(false)
  }

  return (
    <div
      role="region"
      aria-label="Уведомление о cookie и персональных данных"
      className={`fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-[60] flex flex-col items-start gap-4 border border-line bg-ink2 p-5 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)] transition-[opacity,transform] duration-700 md:inset-x-auto md:bottom-6 md:left-6 md:max-w-[460px] ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
      }`}
    >
      <p className="text-[12px] leading-[1.65] text-ivory/80 md:text-[13px]">
        Сайт использует файлы cookie и обрабатывает персональные данные в соответствии с{' '}
        <a href="#/privacy" className="underline decoration-line underline-offset-4 hover:text-ivory">
          Политикой конфиденциальности
        </a>
        ,{' '}
        <a href="#/personal-data" className="underline decoration-line underline-offset-4 hover:text-ivory">
          Политикой обработки персональных данных
        </a>{' '}
        и{' '}
        <a href="#/cookies" className="underline decoration-line underline-offset-4 hover:text-ivory">
          Политикой cookie
        </a>
        .
      </p>
      <button
        type="button"
        onClick={accept}
        className="shrink-0 border border-ivory/40 px-5 py-3 text-[11px] uppercase tracking-[0.2em] transition-colors duration-500 hover:border-ivory hover:bg-ivory hover:text-ink md:px-6"
      >
        Подтвердить
      </button>
    </div>
  )
}

export const docFromHash = () =>
  typeof window === 'undefined' ? null : (legalDocs.find((d) => window.location.hash === `#/${d.slug}`) ?? null)

export default function App() {
  const [doc, setDoc] = useState<LegalDoc | null>(docFromHash)
  useReveal(doc?.slug ?? 'home')

  useEffect(() => {
    const onHash = () => setDoc(docFromHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  // при смене страницы: документ открываем сверху, на главной — переходим к нужному разделу
  useEffect(() => {
    if (doc) {
      window.scrollTo({ top: 0 })
      return
    }
    const id = window.location.hash.slice(1)
    if (id) document.getElementById(id)?.scrollIntoView()
  }, [doc])

  return (
    <>
      <Header />
      {doc ? (
        <LegalPage doc={doc} />
      ) : (
        <main>
          <Hero />
          <Services />
          <About />
          <Menu />
          <Grill />
          <Contacts />
        </main>
      )}
      <Footer />
      <CookieNotice />
    </>
  )
}
