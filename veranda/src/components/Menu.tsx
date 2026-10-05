import { MENU } from '../data/menu'
import { BUSINESS } from '../config'

export default function Menu() {
  return (
    <section id="menu" aria-labelledby="menu-title" className="mx-auto max-w-[1340px] px-[15px] pt-24 mobile:px-[18px] mobile:pt-16">
      <h2 id="menu-title" className="mb-10 text-[64px] font-medium uppercase leading-[90%] tracking-[-2px] mobile:text-[40px]">
        Меню<span className="text-[#F598F2]">.</span>
      </h2>
      {MENU.length ? (
        <div className="flex flex-col gap-16">
          {MENU.map(group => (
            <div key={group.title}>
              <h3 className="mb-6 text-2xl font-medium uppercase tracking-[-0.5px]">{group.title}</h3>
              <ul className="grid grid-cols-4 gap-5 md-tablet:grid-cols-3 mobile:grid-cols-2 mobile:gap-3">
                {group.items.map(d => (
                  <li key={d.name} className="flex flex-col overflow-hidden rounded-lg border border-white/12 bg-white/[0.04]">
                    {d.image && (
                      <img src={d.image} alt={d.name} loading="lazy" className="aspect-square w-full object-cover" />
                    )}
                    <div className="flex flex-1 flex-col gap-2 p-4 mobile:p-3">
                      <p className="font-semibold leading-5">{d.name}</p>
                      {d.description && <p className="text-sm leading-5 text-white/65 mobile:text-xs">{d.description}</p>}
                      <p className="mt-auto pt-2 text-lg font-semibold tabular-nums text-[#F598F2]">{d.price}</p>
                    </div>
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
