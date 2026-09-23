import { Phone, MapPin } from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { NAVY_DEEP, ACCENT, PHONE_DISPLAY, PHONE_HREF } from '@/lib/theme'

export function Contact() {
  return (
    <section id="contact" style={{ backgroundColor: NAVY_DEEP }}>
      <div className="max-w-6xl mx-auto py-24 sm:py-32 px-6 sm:px-8 md:px-12 text-center">
        <Reveal>
          <p className="text-xs tracking-[0.3em] uppercase font-medium" style={{ color: ACCENT }}>
            Контакты
          </p>
        </Reveal>
        <Reveal delay={80} className="mt-4">
          <h2
            className="font-light uppercase leading-[1.2] text-white mx-auto max-w-3xl"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 3.25rem)' }}
          >
            Готовы обсудить свою лодку?
          </h2>
        </Reveal>
        <Reveal delay={160} className="mt-6">
          <p className="text-base sm:text-lg text-white/60 max-w-xl mx-auto">
            Позвоните нам — расскажем про наличие, сроки изготовления и подберём модель под ваши
            задачи.
          </p>
        </Reveal>

        <Reveal delay={260} className="mt-10">
          <a
            href={PHONE_HREF}
            className="inline-flex items-center gap-3 rounded-full px-8 py-4 text-lg font-medium hover:opacity-90 transition-opacity"
            style={{ backgroundColor: ACCENT, color: NAVY_DEEP }}
          >
            <Phone size={20} />
            {PHONE_DISPLAY}
          </a>
          <p className="mt-3 text-xs tracking-[0.2em] uppercase text-white/40">Бесплатно по России</p>
        </Reveal>

        <Reveal delay={340} className="mt-12 flex items-center justify-center gap-2 text-white/50 text-sm">
          <MapPin size={16} />
          Производство: г. Сосновый Бор, Ленинградская область
        </Reveal>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-12 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs tracking-[0.15em] uppercase text-white/40">
            Vrungel<span style={{ color: ACCENT }}>.</span>Pro — лодки из ПНД
          </span>
          <div className="flex items-center gap-6">
            <a href="#about" className="text-xs tracking-[0.15em] uppercase text-white/40 hover:text-white/70 transition-colors">
              О нас
            </a>
            <a href="#advantages" className="text-xs tracking-[0.15em] uppercase text-white/40 hover:text-white/70 transition-colors">
              Преимущества
            </a>
            <a href="#models" className="text-xs tracking-[0.15em] uppercase text-white/40 hover:text-white/70 transition-colors">
              Модели
            </a>
            <a href="#gallery" className="text-xs tracking-[0.15em] uppercase text-white/40 hover:text-white/70 transition-colors">
              Галерея
            </a>
            <a href="#faq" className="text-xs tracking-[0.15em] uppercase text-white/40 hover:text-white/70 transition-colors">
              Вопросы
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
