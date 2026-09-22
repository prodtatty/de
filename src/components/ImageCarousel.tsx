import { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CarouselImage {
  src: string
  alt: string
}

export function ImageCarousel({ images, className }: { images: CarouselImage[]; className?: string }) {
  const [index, setIndex] = useState(0)
  const touchStartX = useRef<number | null>(null)

  const go = (next: number) => {
    setIndex((next + images.length) % images.length)
  }

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1))
    touchStartX.current = null
  }

  if (images.length === 0) return null

  return (
    <div className={`relative select-none ${className ?? ''}`}>
      <div
        className="relative aspect-[4/3] rounded-2xl overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="flex h-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {images.map((img) => (
            <img
              key={img.src}
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-cover flex-shrink-0"
              loading="lazy"
            />
          ))}
        </div>

        {images.length > 1 && (
          <>
            <div
              className="absolute bottom-0 left-0 w-full h-14 pointer-events-none"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.45), transparent)' }}
            />
            <button
              aria-label="Предыдущее фото"
              onClick={() => go(index - 1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm transition-colors"
              style={{ width: 32, height: 32 }}
            >
              <ChevronLeft size={18} className="text-white" />
            </button>
            <button
              aria-label="Следующее фото"
              onClick={() => go(index + 1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm transition-colors"
              style={{ width: 32, height: 32 }}
            >
              <ChevronRight size={18} className="text-white" />
            </button>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
              {images.map((img, i) => (
                <button
                  key={img.src}
                  aria-label={`Фото ${i + 1}`}
                  onClick={() => go(i)}
                  className="rounded-full transition-all"
                  style={{
                    width: i === index ? 16 : 6,
                    height: 6,
                    backgroundColor: i === index ? '#ffffff' : 'rgba(255,255,255,0.5)',
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
