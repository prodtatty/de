import { useEffect, useState } from 'react'
import { Phone } from 'lucide-react'
import { navyDeepAlpha, ACCENT, PHONE_DISPLAY, PHONE_HREF } from '@/lib/theme'

export function StickyNav() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    // The hero's own navbar stays pinned for its whole 500vh scroll range (it only
    // scrolls away once the sticky pin releases). Only show this bar after that point,
    // so the two never overlap.
    const getThreshold = () => {
      const hero = document.getElementById('hero')
      return hero ? hero.offsetHeight - window.innerHeight : window.innerHeight * 0.9
    }
    const onScroll = () => setShow(window.scrollY > getThreshold())
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div
      className="fixed top-0 left-0 w-full z-40 flex items-center justify-between px-6 sm:px-8 md:px-12 py-4 backdrop-blur-md"
      style={{
        backgroundColor: navyDeepAlpha(0.92),
        transform: show ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
        pointerEvents: show ? 'auto' : 'none',
      }}
    >
      <a href="#hero" className="text-white text-sm tracking-[0.2em] uppercase font-semibold">
        Vrungel<span style={{ color: ACCENT }}>.</span>Pro
      </a>
      <div className="hidden sm:flex items-center gap-8">
        <a href="#about" className="text-xs tracking-[0.15em] uppercase text-white/70 hover:text-white transition-colors">
          О нас
        </a>
        <a href="#advantages" className="text-xs tracking-[0.15em] uppercase text-white/70 hover:text-white transition-colors">
          Преимущества
        </a>
        <a href="#models" className="text-xs tracking-[0.15em] uppercase text-white/70 hover:text-white transition-colors">
          Модели
        </a>
        <a href="#gallery" className="text-xs tracking-[0.15em] uppercase text-white/70 hover:text-white transition-colors">
          Галерея
        </a>
        <a href="#faq" className="text-xs tracking-[0.15em] uppercase text-white/70 hover:text-white transition-colors">
          Вопросы
        </a>
      </div>
      <a href={PHONE_HREF} className="flex items-center gap-2 text-white text-xs sm:text-sm tracking-wide font-medium">
        <Phone size={14} />
        <span className="hidden sm:inline">{PHONE_DISPLAY}</span>
      </a>
    </div>
  )
}
