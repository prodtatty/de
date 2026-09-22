import { useEffect, useState } from 'react'
import { X, Phone, Ship } from 'lucide-react'
import { ImageCarousel } from '@/components/ImageCarousel'
import type { Model } from '@/components/Models'
import { NAVY_DEEP, ACCENT, accentAlpha, EASE, PHONE_DISPLAY, PHONE_HREF } from '@/lib/theme'

const TRANSITION_MS = 280

function DetailColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-white text-base font-medium uppercase tracking-wide mb-4">{title}</h4>
      {children}
    </div>
  )
}

export function ModelModal({ model, onClose }: { model: Model; onClose: () => void }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const raf = requestAnimationFrame(() => setVisible(true))
    return () => {
      document.body.style.overflow = ''
      cancelAnimationFrame(raf)
    }
  }, [])

  const handleClose = () => {
    setVisible(false)
    setTimeout(onClose, TRANSITION_MS)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="fixed inset-0 z-[200] flex items-start sm:items-center justify-center sm:p-6" onClick={handleClose}>
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        style={{ opacity: visible ? 1 : 0, transition: `opacity ${TRANSITION_MS}ms ${EASE}` }}
      />
      <div
        className="modal-scroll relative w-full sm:max-w-5xl h-full sm:h-auto sm:max-h-[90vh] overflow-y-auto sm:rounded-3xl"
        style={{
          backgroundColor: NAVY_DEEP,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.97)',
          transition: `opacity ${TRANSITION_MS}ms ${EASE}, transform ${TRANSITION_MS}ms ${EASE}`,
          boxShadow: '0 32px 80px -16px rgba(0,0,0,0.6)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          aria-label="Закрыть"
          className="absolute top-5 right-5 z-10 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm transition-colors"
          style={{ width: 40, height: 40 }}
        >
          <X size={18} className="text-white" />
        </button>

        {model.images ? (
          <ImageCarousel images={model.images} aspectClassName="aspect-[16/9]" rounded={false} />
        ) : (
          <div
            className="relative aspect-[16/9] flex items-center justify-center"
            style={{ background: `linear-gradient(150deg, ${accentAlpha(0.12)}, rgba(255,255,255,0.04))` }}
          >
            <Ship size={48} strokeWidth={1.25} color={accentAlpha(0.7)} />
          </div>
        )}

        <div className={`px-6 sm:px-12 pt-8 sm:pt-10 ${model.details ? '' : 'pb-10 sm:pb-12'}`}>
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
            <div
              className="mt-10 sm:mt-12 -mx-6 sm:-mx-12 px-6 sm:px-12 pt-10 sm:pt-12 pb-10 sm:pb-12 grid grid-cols-1 md:grid-cols-3 gap-x-10 lg:gap-x-14 gap-y-10"
              style={{ backgroundColor: 'rgba(255,255,255,0.025)' }}
            >
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
