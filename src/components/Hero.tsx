import { useEffect, useState, type ReactNode, type CSSProperties } from 'react'
import { ArrowRight, ArrowDown, ChevronUp, Phone, X } from 'lucide-react'
import { useVideoScrub } from '@/useVideoScrub'
import { NAVY, ACCENT, EASE, PHONE_DISPLAY, PHONE_HREF } from '@/lib/theme'

// TODO: replace with real footage of Vrungel.Pro boats on water (drone / on-board shots
// work best for the scroll-scrub effect). Until then the hero renders an animated gradient.
const VIDEO_SRC = ''

const NAV_LINKS: { label: string; href: string }[] = [
  { label: 'ГЛАВНАЯ', href: '#hero' },
  { label: 'О НАС', href: '#about' },
  { label: 'ПРЕИМУЩЕСТВА', href: '#advantages' },
  { label: 'МОДЕЛИ', href: '#models' },
  { label: 'ГАЛЕРЕЯ', href: '#gallery' },
  { label: 'КОНТАКТЫ', href: '#contact' },
]

function getS1Opacity(p: number) {
  if (p < 0.2) return 1
  return Math.max(0, 1 - (p - 0.2) / 0.08)
}

function getS2Opacity(p: number) {
  if (p < 0.32) return 0
  if (p < 0.4) return (p - 0.32) / 0.08
  if (p < 0.55) return 1
  return Math.max(0, 1 - (p - 0.55) / 0.08)
}

function getS3Opacity(p: number) {
  if (p < 0.67) return 0
  if (p < 0.75) return (p - 0.67) / 0.08
  return 1
}

function Stagger({
  visible,
  delay,
  children,
  className,
}: {
  visible: boolean
  delay: number
  children: ReactNode
  className?: string
}) {
  const style: CSSProperties = {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(24px)',
    transition: `opacity 0.8s ${EASE} ${delay}ms, transform 0.8s ${EASE} ${delay}ms`,
  }
  return (
    <div className={className} style={style}>
      {children}
    </div>
  )
}

function Navbar({ p, hasVideo, onOpenMenu }: { p: number; hasVideo: boolean; onOpenMenu: () => void }) {
  // Without real footage the placeholder backdrop is uniformly dark, so keep the nav light.
  // Once real video is in place, re-tune this against its actual brightness per scroll depth.
  const isLight = hasVideo ? p > 0.55 : true
  const color = isLight ? '#ffffff' : NAVY
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 200)
    return () => clearTimeout(t)
  }, [])

  const entrance = (delay: number): CSSProperties => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translateY(0)' : 'translateY(-12px)',
    transition: `opacity 0.6s ${EASE} ${delay}ms, transform 0.6s ${EASE} ${delay}ms, color 0.5s`,
  })

  return (
    <nav className="absolute top-0 left-0 w-full z-50 pointer-events-auto flex items-center justify-between px-6 sm:px-8 md:px-12 pt-8 sm:pt-12 pb-6">
      <div className="hidden lg:flex items-center gap-8 xl:gap-10">
        {NAV_LINKS.map(({ label, href }, i) => {
          const active = i === 0
          return (
            <a
              key={label}
              href={href}
              className="relative text-xs tracking-[0.15em] uppercase font-medium hover:opacity-70"
              style={{ color, ...entrance(i * 80 + 100) }}
            >
              {label}
              {active && (
                <span
                  className="absolute -bottom-3 left-0 w-full h-[2px]"
                  style={{ backgroundColor: color, transition: 'background-color 0.5s' }}
                />
              )}
            </a>
          )
        })}
      </div>

      <a
        href="#hero"
        className="text-sm tracking-[0.2em] uppercase font-semibold lg:hidden"
        style={{ color, ...entrance(60) }}
      >
        Vrungel<span style={{ color: ACCENT }}>.</span>Pro
      </a>

      <button
        aria-label="Открыть меню"
        onClick={onOpenMenu}
        className="flex lg:hidden flex-col items-end justify-center gap-[5px]"
        style={entrance(100)}
      >
        <span style={{ backgroundColor: color, width: 24, height: 2, transition: 'background-color 0.5s' }} />
        <span style={{ backgroundColor: color, width: 24, height: 2, transition: 'background-color 0.5s' }} />
        <span style={{ backgroundColor: color, width: 16, height: 2, transition: 'background-color 0.5s' }} />
      </button>

      <div className="hidden sm:flex items-center gap-6" style={entrance(500)}>
        <a
          href={PHONE_HREF}
          className="flex items-center gap-2 hover:opacity-70 transition-opacity"
          style={{ color, transition: 'color 0.5s' }}
        >
          <Phone size={14} />
          <span className="text-xs tracking-[0.15em] uppercase font-medium">{PHONE_DISPLAY}</span>
        </a>
        <button
          onClick={onOpenMenu}
          className="hidden lg:inline text-xs tracking-[0.2em] uppercase font-medium"
          style={{ color, transition: 'color 0.5s' }}
        >
          МЕНЮ
        </button>
      </div>
    </nav>
  )
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[100]"
      style={{
        backgroundColor: NAVY,
        opacity: open ? 1 : 0,
        visibility: open ? 'visible' : 'hidden',
        transition: 'opacity 0.5s cubic-bezier(0.4,0,0.2,1), visibility 0.5s cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      <div
        className="flex flex-col h-full"
        style={{
          transform: open ? 'translateY(0)' : 'translateY(-32px)',
          transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <div className="flex justify-end px-6 sm:px-8 pt-8 sm:pt-12">
          <button
            aria-label="Закрыть меню"
            onClick={onClose}
            className="flex items-center justify-center rounded-full border border-white/30 hover:border-white transition-colors"
            style={{ width: 40, height: 40 }}
          >
            <X size={18} className="text-white" />
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          {NAV_LINKS.map(({ label, href }, i) => {
            const active = i === 0
            return (
              <a
                key={label}
                href={href}
                onClick={onClose}
                className={`px-8 sm:px-12 py-3 text-2xl sm:text-3xl font-light tracking-wide uppercase transition-colors ${
                  active ? 'text-white' : 'text-white/60 hover:text-white'
                }`}
                style={{
                  opacity: open ? 1 : 0,
                  transform: open ? 'translateY(0)' : 'translateY(20px)',
                  transition: `opacity 0.5s ${EASE} ${i * 60}ms, transform 0.5s ${EASE} ${i * 60}ms`,
                }}
              >
                {label}
              </a>
            )
          })}
        </div>

        <div className="flex items-center justify-center px-8 sm:px-12 pb-10">
          <a href={PHONE_HREF} className="text-sm tracking-[0.2em] uppercase text-white/80">
            {PHONE_DISPLAY}
          </a>
        </div>
      </div>
    </div>
  )
}

function Section1({ opacity }: { opacity: number }) {
  const visible = opacity > 0.3
  return (
    <div
      className="absolute inset-0 flex items-center px-6 sm:px-8 md:px-20 lg:px-32"
      style={{ opacity, transition: 'opacity 0.1s ease-out' }}
    >
      <div>
        <Stagger visible={visible} delay={0}>
          <h1
            className="font-light uppercase leading-[1.15] text-white"
            style={{ fontSize: 'clamp(2rem, 5.2vw, 5rem)' }}
          >
            Катера, которым
            <br />
            не страшна вода
          </h1>
        </Stagger>
        <Stagger visible={visible} delay={150} className="mt-6">
          <p className="text-sm tracking-[0.3em] uppercase text-white/80">
            Корпуса из ПНД ручной формовки · Сосновый Бор
          </p>
        </Stagger>
      </div>

      <Stagger
        visible={visible}
        delay={300}
        className="absolute bottom-12 right-6 sm:right-8 md:right-12 pointer-events-auto"
      >
        <a
          href="#advantages"
          aria-label="Узнать о преимуществах"
          className="flex items-center justify-center rounded-full hover:opacity-70 transition-opacity"
          style={{ width: 48, height: 48, border: '1px solid rgba(255,255,255,0.5)' }}
        >
          <ArrowRight size={18} color="#ffffff" />
        </a>
      </Stagger>
    </div>
  )
}

function Section2({ opacity }: { opacity: number }) {
  const visible = opacity > 0.3
  return (
    <div
      className="absolute inset-0 flex items-center justify-center px-6 sm:px-8"
      style={{ opacity, transition: 'opacity 0.1s ease-out' }}
    >
      <Stagger visible={visible} delay={0} className="max-w-[900px]">
        <h2
          className="font-extralight tracking-wide leading-[1.3] text-center uppercase text-white"
          style={{ fontSize: 'clamp(1.5rem, 4.3vw, 4.2rem)' }}
        >
          Лист ПНД 8 мм держит удар о камни и лёд{' '}
          <span className="text-white/80">не гниёт и не ржавеет</span>{' '}
          <span className="text-white/50">и не тонет, даже пробитый</span>
        </h2>
      </Stagger>

      <div className="absolute bottom-16 right-6 sm:right-8 md:right-12 flex flex-col items-center gap-4 pointer-events-auto">
        <Stagger visible={visible} delay={200}>
          <a
            href="#gallery"
            aria-label="Смотреть галерею"
            className="flex items-center justify-center rounded-full"
            style={{ width: 48, height: 48, border: '1px solid rgba(255,255,255,0.4)' }}
          >
            <ArrowDown size={18} color="#ffffff" />
          </a>
        </Stagger>
        <Stagger visible={visible} delay={350} className="mt-4 flex items-center gap-2">
          <span className="rounded-full bg-white" style={{ width: 8, height: 8 }} />
          <span className="rounded-full bg-white/40" style={{ width: 6, height: 6 }} />
          <span className="rounded-full bg-white/40" style={{ width: 6, height: 6 }} />
        </Stagger>
        <Stagger visible={visible} delay={500} className="mt-2">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Наверх"
            className="flex items-center justify-center rounded-full"
            style={{ width: 40, height: 40, border: '1px solid rgba(255,255,255,0.3)' }}
          >
            <ChevronUp size={16} color="rgba(255,255,255,0.8)" />
          </button>
        </Stagger>
      </div>
    </div>
  )
}

function Section3({ opacity }: { opacity: number }) {
  const visible = opacity > 0.3
  return (
    <div
      className="absolute inset-0 flex items-center justify-end px-6 sm:px-8 md:px-20 lg:px-32"
      style={{ opacity, transition: 'opacity 0.1s ease-out' }}
    >
      <div className="max-w-2xl text-left">
        <Stagger visible={visible} delay={0}>
          <p className="text-white/60 text-lg tracking-wide mb-4">Vrungel.Pro · Сосновый Бор</p>
        </Stagger>
        <Stagger visible={visible} delay={150}>
          <h2
            className="font-light text-white leading-[1.2] uppercase tracking-wide mb-8"
            style={{ fontSize: 'clamp(2rem, 4vw, 4rem)' }}
          >
            Выберите катер
            <br />
            под свои задачи
          </h2>
        </Stagger>
        <Stagger visible={visible} delay={300} className="flex items-center gap-4 pointer-events-auto">
          <span className="text-sm tracking-[0.3em] text-white/80 uppercase">Смотреть модели</span>
          <a
            href="#models"
            aria-label="Смотреть модели"
            className="flex items-center justify-center rounded-full bg-white hover:scale-110 transition-transform duration-300"
            style={{ width: 40, height: 40 }}
          >
            <ArrowRight size={16} className="text-gray-800" />
          </a>
        </Stagger>
      </div>
    </div>
  )
}

export function Hero() {
  const { videoRef, canvasRef, containerRef, scrollProgress, canvasLive } = useVideoScrub(VIDEO_SRC)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const p = scrollProgress
  const s1 = getS1Opacity(p)
  const s2 = getS2Opacity(p)
  const s3 = getS3Opacity(p)
  const hasVideo = Boolean(VIDEO_SRC)

  return (
    <div id="hero" ref={containerRef} className="relative h-[500vh]">
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        {!hasVideo && <div className="absolute inset-0 hero-water-bg" />}
        <video
          ref={videoRef}
          src={hasVideo ? VIDEO_SRC : undefined}
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: hasVideo ? 1 : 0 }}
        />
        <canvas
          ref={canvasRef}
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
          style={{ opacity: hasVideo && canvasLive ? 1 : 0 }}
        />

        <div className="absolute inset-0 pointer-events-none">
          <Navbar p={p} hasVideo={hasVideo} onOpenMenu={() => setMenuOpen(true)} />
          <Section1 opacity={s1} />
          <Section2 opacity={s2} />
          <Section3 opacity={s3} />
        </div>
      </div>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  )
}
