import { useState } from 'react'
import { BUSINESS } from '../config'
import { useConsent } from '../lib/consent'

export default function Reviews() {
  const consent = useConsent()
  const [manual, setManual] = useState(false)
  const show = consent === 'all' || manual

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

      <div className="relative h-[800px] w-full overflow-hidden rounded-lg border border-white/15 bg-white mobile:h-[640px]">
        {/* Preview hosts that forbid third-party iframes build with VITE_PREVIEW=1. */}
        {import.meta.env.VITE_PREVIEW ? (
          <div className="flex h-full flex-col items-center justify-center gap-5 bg-neutral-950 p-8 text-center">
            <p className="max-w-[460px] text-white/75">
              Это превью: здесь виджет Яндекс Карт не загружается. На опубликованном сайте в этом блоке будут живые отзывы гостей.
            </p>
          </div>
        ) : show ? (
          <iframe
            title="Отзывы о кофейне Веранда на Яндекс Картах"
            src={`https://yandex.ru/maps-reviews-widget/${BUSINESS.yandexOrgId}?comments`}
            className="h-full w-full border-0"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-5 bg-neutral-950 p-8 text-center">
            <p className="max-w-[460px] text-white/75">
              Отзывы загружаются с Яндекс Карт. Сервис может устанавливать собственные cookie. Загрузить отзывы?
            </p>
            <button type="button" onClick={() => setManual(true)} className="cta-fill border border-white px-5 py-3 text-sm font-medium lowercase">
              показать отзывы
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
