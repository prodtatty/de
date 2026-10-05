import { MENU } from '../data/menu'
import { BUSINESS } from '../config'

export default function Menu() {
  return (
    <section id="menu" aria-labelledby="menu-title" className="mx-auto max-w-[1340px] px-[15px] pt-24 mobile:px-[18px] mobile:pt-16">
      <h2 id="menu-title" className="mb-10 text-[64px] font-medium uppercase leading-[90%] tracking-[-2px] mobile:text-[40px]">
        Меню<span className="text-[#F598F2]">.</span>
      </h2>
      {MENU.length ? (
        <div className="grid gap-12 md:grid-cols-2">
          {MENU.map(group => (
            <div key={group.title}>
              <h3 className="mb-4 text-xs font-medium uppercase tracking-[0.04em] text-white/55">{group.title}</h3>
              <ul className="divide-y divide-white/10">
                {group.items.map(d => (
                  <li key={d.name} className="flex items-baseline justify-between gap-6 py-3">
                    <div className="min-w-0">
                      <p className="font-medium">{d.name}</p>
                      {d.description && <p className="text-sm text-white/55">{d.description}</p>}
                    </div>
                    <span className="shrink-0 tabular-nums">{d.price}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <a href={`${BUSINESS.yandexUrl}menu/`} target="_blank" rel="noopener noreferrer" className="cta-fill inline-block border border-white px-5 py-3 text-sm font-medium lowercase">
          меню на яндекс картах
        </a>
      )}
    </section>
  )
}
