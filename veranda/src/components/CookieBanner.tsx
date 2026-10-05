import { setConsent, useConsent } from '../lib/consent'

export default function CookieBanner() {
  const consent = useConsent()
  if (consent) return null
  return (
    <div role="dialog" aria-live="polite" aria-label="Использование cookie" className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-[720px] rounded-lg border border-white/15 bg-neutral-950/95 p-5 text-sm shadow-2xl backdrop-blur">
      <p className="mb-4 leading-6 text-white/80">
        Мы используем cookie и аналогичные технологии для работы сайта и отображения сервисов Яндекса. Продолжая, вы соглашаетесь с{' '}
        <a href="#/cookies" className="underline">Политикой cookie</a> и{' '}
        <a href="#/privacy" className="underline">Политикой обработки персональных данных</a>.
      </p>
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={() => setConsent('all')} className="cta-fill border border-white px-4 py-2 font-medium lowercase">принять все</button>
        <button type="button" onClick={() => setConsent('necessary')} className="px-4 py-2 font-medium lowercase text-white/70 hover:text-white">только необходимые</button>
      </div>
    </div>
  )
}
