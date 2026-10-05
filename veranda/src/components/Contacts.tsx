import { Mail, MapPin, Phone } from 'lucide-react'
import { BUSINESS as B } from '../config'

const ROWS = [
  { icon: MapPin, label: 'Адрес', value: B.place, href: B.yandexUrl, external: true },
  { icon: Phone, label: 'Телефон', value: B.phone, href: `tel:${B.phoneHref}` },
  { icon: Mail, label: 'Email', value: B.email, href: `mailto:${B.email}` },
]

export default function Contacts() {
  return (
    <section id="contacts" aria-labelledby="contacts-title" className="mx-auto max-w-[1340px] px-[15px] pb-24 mobile:px-[18px] mobile:pb-16">
      <h2 id="contacts-title" className="mb-10 text-[64px] font-medium uppercase leading-[90%] tracking-[-2px] mobile:text-[40px]">
        Контакты<span className="text-[#F598F2]">.</span>
      </h2>
      <div className="flex items-end justify-between gap-10 mobile:flex-col mobile:items-start">
        <ul className="flex flex-col gap-7">
          {ROWS.map(({ icon: Icon, label, value, href, external }) => (
            <li key={label} className="flex gap-4">
              <Icon size={26} strokeWidth={1.5} className="mt-0.5 shrink-0 text-[#F598F2]" aria-hidden="true" />
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.06em] text-white/55">{label}</p>
                <a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="nav-link-underline text-lg leading-7">
                  {value}
                </a>
              </div>
            </li>
          ))}
        </ul>
        <a href={B.vk} target="_blank" rel="noopener noreferrer" className="cta-fill flex items-center gap-3 border border-white px-6 py-4 text-base font-medium">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
            <path d="M12.8 17.3c-5.5 0-8.6-3.8-8.7-10h2.8c.1 4.6 2.1 6.5 3.7 6.9V7.3h2.6v3.9c1.6-.2 3.3-2 3.8-3.9h2.6c-.4 2.4-2.2 4.2-3.4 4.9 1.2.6 3.2 2.1 4 5.1h-2.9c-.6-1.9-2.2-3.4-4.1-3.6v3.6h-.4z" />
          </svg>
          Мы во ВКонтакте
        </a>
      </div>
    </section>
  )
}
