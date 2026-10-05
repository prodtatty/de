import { useRef } from 'react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { BUSINESS } from '../config'
import { REVIEWS } from '../data/reviews'

function Stars({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`Оценка ${value} из 5`}>
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={14} className={i <= value ? 'fill-[#F598F2] text-[#F598F2]' : 'text-white/25'} aria-hidden="true" />
      ))}
    </div>
  )
}

export default function Reviews() {
  const track = useRef<HTMLUListElement>(null)
  const scroll = (dir: number) => {
    const el = track.current
    if (el) el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: 'smooth' })
  }

  return (
    <section id="reviews" aria-labelledby="reviews-title" className="mx-auto max-w-[1340px] px-[15px] py-24 mobile:px-[18px] mobile:py-16">
      <div className="mb-10 flex items-end justify-between gap-6 mobile:flex-col mobile:items-start">
        <h2 id="reviews-title" className="text-[64px] font-medium uppercase leading-[90%] tracking-[-2px] mobile:text-[40px]">
          Отзывы<span className="text-[#F598F2]">.</span>
        </h2>
        <a href={`${BUSINESS.yandexUrl}reviews/`} target="_blank" rel="noopener noreferrer" className="cta-fill border border-white px-5 py-3 text-sm font-medium lowercase">
          все отзывы на яндекс картах
        </a>
      </div>

      {REVIEWS.length > 0 && (
        <div className="relative">
          <ul ref={track} className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none]">
            {REVIEWS.map(r => (
              <li key={r.author + r.text.slice(0, 20)} className="flex w-[calc((100%-40px)/3)] shrink-0 snap-start flex-col gap-4 rounded-lg border border-white/12 bg-white/[0.04] p-6 md-tablet:w-[calc((100%-20px)/2)] mobile:w-[85%]">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F598F2]/20 text-lg font-semibold uppercase" aria-hidden="true">
                    {r.author.charAt(0)}
                  </span>
                  <div>
                    <p className="font-medium">{r.author}</p>
                    <Stars value={r.rating} />
                  </div>
                </div>
                <p className="text-[15px] leading-6 text-white/80">{r.text}</p>
                {r.date && <p className="mt-auto text-xs text-white/45">{r.date} · Яндекс Карты</p>}
              </li>
            ))}
          </ul>
          {REVIEWS.length > 3 && (
            <>
              <button type="button" onClick={() => scroll(-1)} aria-label="Предыдущие отзывы" className="absolute -left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-lg mobile:hidden"><ChevronLeft size={20} /></button>
              <button type="button" onClick={() => scroll(1)} aria-label="Следующие отзывы" className="absolute -right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-lg mobile:hidden"><ChevronRight size={20} /></button>
            </>
          )}
        </div>
      )}
    </section>
  )
}
