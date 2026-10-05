import { BUSINESS } from '../config'
import { resetConsent } from '../lib/consent'

export default function Footer() {
  return (
    <footer id="contacts" className="border-t border-white/10">
      <div className="mx-auto grid max-w-[1340px] gap-10 px-[15px] py-16 text-sm md:grid-cols-3 mobile:px-[18px]">
        <div>
          <p className="mb-3 text-2xl font-medium uppercase tracking-[-0.5px]">Веранда<span className="text-[#F598F2]">.</span></p>
          <p className="text-white/60">Кофейня</p>
          <a href={BUSINESS.yandexUrl} target="_blank" rel="noopener noreferrer" className="nav-link-underline mt-3 inline-block">Как добраться — Яндекс Карты</a>
        </div>
        <nav aria-label="Правовая информация" className="flex flex-col gap-2">
          <a href="#/privacy" className="nav-link-underline w-fit">Политика обработки персональных данных</a>
          <a href="#/consent" className="nav-link-underline w-fit">Согласие на обработку персональных данных</a>
          <a href="#/cookies" className="nav-link-underline w-fit">Политика использования cookie</a>
          <button type="button" onClick={resetConsent} className="nav-link-underline w-fit text-left">Отозвать согласие на cookie</button>
        </nav>
        <div className="text-white/60">
          <p>{BUSINESS.operator}</p>
          <p>ИНН {BUSINESS.inn} · {BUSINESS.ogrn}</p>
          <p>{BUSINESS.address}</p>
          <p className="mt-3">© {new Date().getFullYear()} ВЕРАНДА</p>
        </div>
      </div>
    </footer>
  )
}
