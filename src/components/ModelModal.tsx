import { useEffect } from 'react'
import { X, Phone, Ship } from 'lucide-react'
import { ImageCarousel } from '@/components/ImageCarousel'
import type { Model } from '@/components/Models'
import { NAVY_DEEP, ACCENT, accentAlpha, PHONE_DISPLAY, PHONE_HREF } from '@/lib/theme'

function DetailColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-white text-base font-medium uppercase tracking-wide mb-4">{title}</h4>
      {children}
    </div>
  )
}

export function ModelModal({ model, onClose }: { model: Model; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start sm:items-center justify-center sm:p-6"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative w-full sm:max-w-4xl h-full sm:h-auto sm:max-h-[88vh] overflow-y-auto sm:rounded-2xl"
        style={{ backgroundColor: NAVY_DEEP }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Закрыть"
          className="absolute top-4 right-4 z-10 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm transition-colors"
          style={{ width: 40, height: 40 }}
        >
          <X size={18} className="text-white" />
        </button>

        {model.images ? (
          <div className="p-4 sm:p-6 pb-0">
            <ImageCarousel images={model.images} />
          </div>
        ) : (
          <div
            className="relative aspect-[16/9] sm:aspect-[21/9] flex items-center justify-center"
            style={{ background: `linear-gradient(150deg, ${accentAlpha(0.12)}, rgba(255,255,255,0.04))` }}
          >
            <Ship size={48} strokeWidth={1.25} color={accentAlpha(0.7)} />
          </div>
        )}

        <div className="p-6 sm:p-10">
          <h2 className="text-3xl sm:text-4xl font-light text-white uppercase tracking-wide">{model.name}</h2>
          <p className="mt-2 text-white/60">{model.tagline}</p>
          {model.description && <p className="mt-4 text-white/70 leading-relaxed max-w-2xl">{model.description}</p>}

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <span className="text-2xl font-medium" style={{ color: ACCENT }}>
              {model.price ?? 'Цена по запросу'}
            </span>
            <a
              href={PHONE_HREF}
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity"
              style={{ backgroundColor: ACCENT, color: NAVY_DEEP }}
            >
              <Phone size={15} />
              {PHONE_DISPLAY}
            </a>
          </div>

          {model.details && (
            <div className="mt-10 pt-8 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-10">
              <DetailColumn title="Характеристики">
                <ul className="space-y-2.5">
                  {model.details.characteristics.map(([label, value]) => (
                    <li key={label} className="text-sm leading-relaxed">
                      <span className="text-white/45">{label}: </span>
                      <span className="text-white/85">{value}</span>
                    </li>
                  ))}
                </ul>
              </DetailColumn>

              <DetailColumn title="Компоновка">
                <ul className="space-y-2.5">
                  {model.details.layout.map((item) => (
                    <li key={item} className="text-sm leading-relaxed text-white/75 flex gap-2">
                      <span style={{ color: ACCENT }}>•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </DetailColumn>

              <DetailColumn title="Дополнительные опции">
                <ul className="space-y-2.5">
                  {model.details.options.map((item) => (
                    <li key={item} className="text-sm leading-relaxed text-white/75 flex gap-2">
                      <span style={{ color: ACCENT }}>•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </DetailColumn>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
