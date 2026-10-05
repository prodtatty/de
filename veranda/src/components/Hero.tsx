import { useEffect, useRef, useState } from 'react'

const VIDEOS = [
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260629_030107_874273ea-684a-4e90-bb96-8fdfde48d53d.mp4',
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260629_032424_3c9c2a9d-807b-4482-80e6-dd6d9dfd4545.mp4',
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260627_094019_4214ea73-b963-46a4-8327-61489192de99.mp4',
]
const LABELS = ['Утро', 'Эспрессо', 'Вечер']
const ACCENT = '#F598F2'

function usePreloaded(urls: string[]) {
  const [srcs, setSrcs] = useState(urls)
  useEffect(() => {
    let alive = true
    const created: string[] = []
    urls.forEach((url, i) =>
      fetch(url)
        .then(r => (r.ok ? r.blob() : Promise.reject()))
        .then(blob => {
          const obj = URL.createObjectURL(blob)
          created.push(obj)
          if (alive) setSrcs(prev => prev.map((s, j) => (j === i ? obj : s)))
        })
        .catch(() => {}),
    )
    return () => {
      alive = false
      created.forEach(u => URL.revokeObjectURL(u))
    }
  }, [urls])
  return srcs
}

export default function Hero() {
  const [active, setActive] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const ref = useRef<HTMLElement>(null)
  const srcs = usePreloaded(VIDEOS)
  const accent = active === 0 ? ACCENT : '#fff'

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setRevealed(true)
        io.disconnect()
      }
    }, { threshold: 0.35 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section ref={ref} aria-label="Кофейня Веранда" className={`relative h-[100svh] min-h-[640px] overflow-hidden ${revealed ? 'is-revealed' : ''}`}>
      {srcs.map((src, i) => (
        <video
          key={i}
          src={src}
          autoPlay muted loop playsInline aria-hidden="true"
          className={`video-fade absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-in-out ${i === active ? 'opacity-100' : 'opacity-0'}`}
        />
      ))}
      <div className="absolute inset-0 z-[1] bg-black/10" aria-hidden="true" />

      <div className="relative z-[2] mx-auto flex h-full max-w-[1340px] flex-col items-end justify-end gap-[150px] px-[15px] pt-[190px] mobile:items-start mobile:gap-[72px] mobile:px-[18px] mobile:pt-[140px]">
        <div className="flex w-full mobile:flex-col mobile:gap-7">
          <div className="flex flex-[4] flex-col items-start gap-1" role="group" aria-label="Атмосфера">
            {LABELS.map((label, i) => (
              <button
                key={label}
                type="button"
                aria-pressed={i === active}
                onClick={() => setActive(i)}
                className={`role-link text-xs font-medium uppercase leading-4 tracking-[-0.12px] ${i === active ? 'opacity-100' : 'opacity-55 hover:opacity-75'}`}
              >
                0{i + 1} / {label}
              </button>
            ))}
          </div>
          <div className="flex flex-1 items-start gap-2 text-xs font-medium uppercase leading-4" role="status">
            <span className="status-dot mt-[4px]" style={{ background: accent, boxShadow: `0 0 10px 2px ${accent}99` }} aria-hidden="true" />
            Открыто — ждём вас
          </div>
        </div>

        <div className="flex w-full items-end pb-[60px] md-tablet:gap-7 md-tablet:pb-[52px] md-tablet:pl-6 mobile:flex-col mobile:items-start mobile:gap-8 mobile:pb-11">
          {/* "ВЕРАНДА." is ~1.5× wider than a short Latin name, so the size caps at
              the spec's 200px / 129.6px but shrinks with the viewport to leave the
              copy column room instead of overflowing. */}
          <div className="flex-none">
            <h1 className="reveal-up whitespace-nowrap text-[min(200px,13.2vw)] font-medium uppercase leading-[81%] tracking-[-0.03em] md-tablet:text-[min(129.6px,11vw)] md-tablet:leading-[0.875] md-tablet:tracking-[-0.06em] mobile:text-[clamp(56px,17vw,80px)] mobile:leading-[96px] mobile:tracking-[-4px]">
              Веранда<span style={{ color: accent }} className="transition-colors duration-700">.</span>
            </h1>
          </div>
          <div className="flex min-w-0 flex-1 flex-col items-start gap-6 pl-[50px] mobile:pl-0">
            <p className="reveal-right max-w-[420px] text-base font-medium leading-6 tracking-[-0.16px]">
              Семейная кофейня «Веранда», в которой всегда большой выбор вкусного кофе и чая! На выбор гостю предоставлены альтернативные методы заваривания кофе, растительное молоко. В ассортименте десерты и закуски собственного приготовления. Иногда Вам может сварить кофе сам хозяин, а хозяйку можно застать за обновлением внутреннего декора.</p>
            <a href="#reviews" className="reveal-right reveal-delay cta-fill border border-white px-5 py-3 text-sm font-medium lowercase">
              отзывы гостей
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
