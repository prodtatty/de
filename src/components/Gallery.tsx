import { Camera } from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { NAVY, navyAlpha, accentAlpha, CREAM } from '@/lib/theme'

// TODO: swap these placeholder tiles for real production/on-water photography.
const TILE_COUNT = 6

export function Gallery() {
  return (
    <section id="gallery" className="py-24 sm:py-32 px-6 sm:px-8 md:px-12" style={{ backgroundColor: CREAM }}>
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <p className="text-xs tracking-[0.3em] uppercase font-medium" style={{ color: NAVY }}>
            Галерея
          </p>
        </Reveal>
        <Reveal delay={80} className="mt-4 max-w-2xl">
          <h2
            className="font-light uppercase leading-[1.2]"
            style={{ fontSize: 'clamp(1.75rem, 3.6vw, 3rem)', color: NAVY }}
          >
            Лодки в деле
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {Array.from({ length: TILE_COUNT }).map((_, i) => (
            <Reveal key={i} delay={(i % 3) * 100} className={i === 0 ? 'col-span-2 row-span-2' : ''}>
              <div
                className="relative w-full h-full aspect-square rounded-xl overflow-hidden flex items-center justify-center"
                style={{
                  background: `linear-gradient(${135 + i * 15}deg, ${navyAlpha(0.9)}, ${accentAlpha(0.55)})`,
                }}
              >
                <Camera size={i === 0 ? 32 : 22} strokeWidth={1.25} color="rgba(255,255,255,0.55)" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
