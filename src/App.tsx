import { useEffect, useState, type ReactNode, type CSSProperties } from 'react'
import { ArrowRight, ArrowDown, ChevronUp, Info, X } from 'lucide-react'
import { useVideoScrub } from '@/useVideoScrub'

const VIDEO_SRC =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260821_114821_a8ca298f-be2c-4613-a4dd-51b69e16bbde.mp4'

const DARK = '#1D3045'
const DARK_RGB = '29, 48, 69'
const darkAlpha = (a: number) => `rgba(${DARK_RGB}, ${a})`

const NAV_LINKS = ['VECTRUS ENERGY', 'VECTRUS UPSTREAM', 'VECTRUS MARKETS', 'VECTRUS SYSTEMS', 'VECTRUS+']

const EASE = 'cubic-bezier(0.16,1,0.3,1)'

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

function Navbar({ p, onOpenMenu }: { p: number; onOpenMenu: () => void }) {
  const isLight = p > 0.55
  const color = isLight ? '#ffffff' : DARK
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
        {NAV_LINKS.map((label, i) => {
          const active = i === 0
          return (
            <a
              key={label}
              href="#"
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

      <button
        aria-label="Open menu"
        onClick={onOpenMenu}
        className="flex lg:hidden flex-col items-start justify-center gap-[5px]"
        style={entrance(100)}
      >
        <span style={{ backgroundColor: color, width: 24, height: 2, transition: 'background-color 0.5s' }} />
        <span style={{ backgroundColor: color, width: 24, height: 2, transition: 'background-color 0.5s' }} />
        <span style={{ backgroundColor: color, width: 16, height: 2, transition: 'background-color 0.5s' }} />
      </button>

      <div className="hidden sm:flex items-center gap-6" style={entrance(500)}>
        <div className="flex items-center gap-2" style={{ color, transition: 'color 0.5s' }}>
          <span className="text-xs tracking-[0.2em] uppercase font-medium">NEWS</span>
          <span
            className="flex items-center justify-center rounded-full"
            style={{ width: 20, height: 20, backgroundColor: color, transition: 'background-color 0.5s' }}
          >
            <Info size={10} color={isLight ? DARK : '#ffffff'} />
          </span>
        </div>
        <span
          className="hidden lg:inline text-xs tracking-[0.2em] uppercase font-medium"
          style={{ color, transition: 'color 0.5s' }}
        >
          MENU
        </span>
        <button
          onClick={onOpenMenu}
          className="inline lg:hidden text-xs tracking-[0.2em] uppercase font-medium"
          style={{ color, transition: 'color 0.5s' }}
        >
          MENU
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
        backgroundColor: DARK,
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
            aria-label="Close menu"
            onClick={onClose}
            className="flex items-center justify-center rounded-full border border-white/30 hover:border-white transition-colors"
            style={{ width: 40, height: 40 }}
          >
            <X size={18} className="text-white" />
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          {NAV_LINKS.map((label, i) => {
            const active = i === 0
            return (
              <a
                key={label}
                href="#"
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

        <div className="flex items-center justify-between px-8 sm:px-12 pb-10">
          <span className="text-xs tracking-[0.2em] uppercase text-white/60">NEWS</span>
          <span className="text-xs tracking-[0.2em] uppercase text-white/60">CONTACT</span>
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
            className="font-light uppercase leading-[1.2]"
            style={{ fontSize: 'clamp(2rem, 5vw, 5rem)', color: DARK }}
          >
            Advancing resources for a cleaner future
          </h1>
        </Stagger>
        <Stagger visible={visible} delay={150} className="mt-6">
          <p className="text-sm tracking-[0.3em] uppercase" style={{ color: darkAlpha(0.9) }}>
            Sustainable power with purpose
          </p>
        </Stagger>
      </div>

      <Stagger
        visible={visible}
        delay={300}
        className="absolute bottom-12 right-6 sm:right-8 md:right-12 pointer-events-auto"
      >
        <button
          className="flex items-center justify-center rounded-full hover:opacity-70 transition-opacity"
          style={{ width: 48, height: 48, border: `1px solid ${darkAlpha(0.5)}` }}
        >
          <ArrowRight size={18} color={DARK} />
        </button>
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
          className="font-extralight tracking-wide leading-[1.3] text-center uppercase"
          style={{ fontSize: 'clamp(1.5rem, 4.5vw, 4.5rem)', color: DARK }}
        >
          We build lasting partnerships with vision{' '}
          <span style={{ color: darkAlpha(0.8) }}>and precision</span>{' '}
          <span style={{ color: darkAlpha(0.5) }}>across every frontier</span>
        </h2>
      </Stagger>

      <div className="absolute bottom-16 right-6 sm:right-8 md:right-12 flex flex-col items-center gap-4 pointer-events-auto">
        <Stagger visible={visible} delay={200}>
          <button
            className="flex items-center justify-center rounded-full"
            style={{ width: 48, height: 48, border: `1px solid ${darkAlpha(0.4)}` }}
          >
            <ArrowDown size={18} color={DARK} />
          </button>
        </Stagger>
        <Stagger visible={visible} delay={350} className="mt-4 flex items-center gap-2">
          <span className="rounded-full" style={{ width: 8, height: 8, backgroundColor: DARK }} />
          <span className="rounded-full" style={{ width: 6, height: 6, backgroundColor: darkAlpha(0.4) }} />
          <span className="rounded-full" style={{ width: 6, height: 6, backgroundColor: darkAlpha(0.4) }} />
        </Stagger>
        <Stagger visible={visible} delay={500} className="mt-2">
          <button
            className="flex items-center justify-center rounded-full"
            style={{ width: 40, height: 40, border: `1px solid ${darkAlpha(0.3)}` }}
          >
            <ChevronUp size={16} color={darkAlpha(0.8)} />
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
          <p className="text-white/60 text-lg tracking-wide mb-4">Halder | Nordvik</p>
        </Stagger>
        <Stagger visible={visible} delay={150}>
          <h2
            className="font-light text-white leading-[1.2] uppercase tracking-wide mb-8"
            style={{ fontSize: 'clamp(2rem, 4vw, 4rem)' }}
          >
            Fueling ambition,
            <br />
            shaping tomorrow.
          </h2>
        </Stagger>
        <Stagger visible={visible} delay={300} className="flex items-center gap-4 pointer-events-auto">
          <span className="text-sm tracking-[0.3em] text-white/80 uppercase">Contact Nordvik</span>
          <button
            className="flex items-center justify-center rounded-full bg-white hover:scale-110 transition-transform duration-300"
            style={{ width: 40, height: 40 }}
          >
            <ArrowRight size={16} className="text-gray-800" />
          </button>
        </Stagger>
      </div>
    </div>
  )
}

export default function App() {
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

  return (
    <div ref={containerRef} className="relative h-[500vh]">
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <canvas
          ref={canvasRef}
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
          style={{ opacity: canvasLive ? 1 : 0 }}
        />

        <div className="absolute inset-0 pointer-events-none">
          <Navbar p={p} onOpenMenu={() => setMenuOpen(true)} />
          <Section1 opacity={s1} />
          <Section2 opacity={s2} />
          <Section3 opacity={s3} />
        </div>
      </div>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  )
}
