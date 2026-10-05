import { useEffect, useState } from 'react'

const NAV = [
  { label: 'Меню', href: '#menu' },
  { label: 'Отзывы', href: '#reviews' },
  { label: 'Контакты', href: '#contacts' },
  { label: 'Документы', href: '#/privacy' },
]

const fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Europe/Moscow' })

function Clock() {
  const [now, setNow] = useState(() => fmt.format(new Date()))
  useEffect(() => {
    const id = setInterval(() => setNow(fmt.format(new Date())), 1000)
    return () => clearInterval(id)
  }, [])
  return <time className="tabular-nums" aria-label="Текущее время, Москва">MSK {now}</time>
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <header className="absolute inset-x-0 top-0 z-10">
      <div className="mx-auto flex max-w-[1340px] items-start justify-between px-[15px] py-9 md-tablet:px-[18px] md-tablet:py-[30px] mobile:px-[18px] mobile:py-6">
        <nav aria-label="Основная навигация" className="mobile:hidden">
          <ul className="flex gap-8 md-tablet:gap-4">
            {NAV.map((item, i) => (
              <li key={item.href}>
                <a href={item.href} className="nav-link-underline flex items-start gap-1 uppercase font-medium">
                  <span className="text-[8px] leading-3 tracking-[-0.08px]">0{i + 1} /</span>
                  <span className="text-xs leading-4 tracking-[-0.12px]">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <button
          type="button"
          className="hidden mobile:block text-xs font-medium uppercase tracking-[-0.12px]"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen(v => !v)}
        >
          {open ? 'Закрыть' : 'Меню'}
        </button>
        <div className="flex flex-col items-end text-right text-xs font-medium uppercase leading-4 tracking-[-0.12px]">
          <a href="#contacts" className="nav-link-underline">Кофейня Веранда</a>
          <Clock />
        </div>
      </div>
      <div
        id="mobile-nav"
        className={`hidden mobile:grid bg-black/80 backdrop-blur transition-[grid-template-rows] duration-[420ms] ease-[var(--ease-spring)] ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <nav aria-label="Мобильная навигация" className="overflow-hidden">
          <ul className="flex flex-col gap-3 px-[18px] pb-8 pt-2">
            {NAV.map((item, i) => (
              <li key={item.href}>
                <a href={item.href} onClick={() => setOpen(false)} className="flex items-start gap-2 font-medium uppercase">
                  <span className="text-[8px] leading-3">0{i + 1} /</span>
                  <span className="text-[28px] leading-8 tracking-[-0.84px]">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
