import { Youtube, PlayCircle } from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { NAVY, navyAlpha, ACCENT, CREAM } from '@/lib/theme'

interface Advantage {
  title: string
  text: string
  image?: { src: string; alt: string }
  video?: {
    embedSrc: string
    watchHref: string
    platform: 'youtube' | 'rutube'
  }
}

const ADVANTAGES: Advantage[] = [
  {
    title: 'Безопасность на воде',
    text: 'Лодки ПНД обладают превосходной плавучестью и устойчивостью, обеспечивая безопасность ваших приключений на воде.',
    video: {
      embedSrc: 'https://www.youtube.com/embed/j3nm80AjkS0',
      watchHref: 'https://www.youtube.com/watch?v=j3nm80AjkS0',
      platform: 'youtube',
    },
  },
  {
    title: 'Прочный материал',
    text: 'ПНД — это высококачественный полиэтилен низкого давления. Материал обеспечивает высокую прочность и устойчивость к механическим повреждениям.',
    video: {
      embedSrc: 'https://rutube.ru/play/embed/186329bffa38bb70ffded98469fc6135/',
      watchHref: 'https://rutube.ru/play/embed/186329bffa38bb70ffded98469fc6135/',
      platform: 'rutube',
    },
  },
  {
    title: 'Ремонтопригодность',
    text: 'Полиэтилен низкого давления поддаётся ремонту. Даже в случае повреждения лодки можно восстановить её целостность.',
    image: { src: 'images/advantages/repair.webp', alt: 'Сборка корпуса из ПНД на производстве Vrungel.Pro' },
  },
  {
    title: 'Устойчивость к ультрафиолету',
    text: 'Лодки ПНД обладают высокой устойчивостью к ультрафиолетовому излучению. Это обеспечивает долговечность и надёжность лодок даже при длительном пребывании на солнце.',
    image: { src: 'images/advantages/uv.webp', alt: 'Лодка Vrungel.Pro на воде в солнечный день' },
  },
  {
    title: 'Простота в уходе',
    text: 'Лодки ПНД легко чистятся и не требуют сложного ухода. Для сохранения внешнего вида достаточно промыть их водой и вытереть сухой тряпкой.',
    image: { src: 'images/advantages/care.webp', alt: 'Лодка Vrungel.Pro под транспортировочным тентом' },
  },
  {
    title: 'Устойчивость к коррозии',
    text: 'Материал ПНД не подвержен коррозии. Он подходит для использования даже для морской среды, где коррозия является особым проблемным аспектом. Лодки ПНД невосприимчивы к вредителям и гниению.',
    image: { src: 'images/advantages/corrosion.webp', alt: 'Днище лодки Vrungel.Pro без следов коррозии' },
  },
]

function AdvantageCard({ advantage, delay }: { advantage: Advantage; delay: number }) {
  const { title, text, video, image } = advantage
  return (
    <Reveal delay={delay} className="rounded-2xl overflow-hidden bg-white h-full flex flex-col" style={{ boxShadow: `0 1px 3px ${navyAlpha(0.08)}, 0 12px 32px -16px ${navyAlpha(0.15)}` }}>
      {video ? (
        <div className="relative aspect-video bg-black">
          <iframe
            src={video.embedSrc}
            title={title}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          />
        </div>
      ) : image ? (
        <div className="relative aspect-video">
          <img src={image.src} alt={image.alt} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        </div>
      ) : null}

      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-lg font-medium mb-2" style={{ color: NAVY }}>
          {title}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: navyAlpha(0.6) }}>
          {text}
        </p>

        {video && (
          <a
            href={video.watchHref}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity"
            style={{ color: ACCENT }}
          >
            {video.platform === 'youtube' ? <Youtube size={16} /> : <PlayCircle size={16} />}
            Посмотреть видео
          </a>
        )}
      </div>
    </Reveal>
  )
}

export function Advantages() {
  return (
    <section id="advantages" className="py-24 sm:py-32 px-6 sm:px-8 md:px-12" style={{ backgroundColor: CREAM }}>
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <p className="text-xs tracking-[0.3em] uppercase font-medium" style={{ color: ACCENT }}>
            Преимущества
          </p>
        </Reveal>
        <Reveal delay={80} className="mt-4 max-w-3xl">
          <h2
            className="font-light uppercase leading-[1.2]"
            style={{ fontSize: 'clamp(1.75rem, 3.6vw, 3rem)', color: NAVY }}
          >
            Преимущества лодок из ПНД
          </h2>
        </Reveal>
        <Reveal delay={160} className="mt-6 max-w-2xl">
          <p className="text-base sm:text-lg leading-relaxed" style={{ color: navyAlpha(0.8) }}>
            Каждый корпус формуется на собственном производстве в Сосновом Бору — от раскроя листа
            ПНД на фрезерном станке с ЧПУ до сборки готовой лодки.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {ADVANTAGES.map((advantage, i) => (
            <AdvantageCard key={advantage.title} advantage={advantage} delay={(i % 3) * 100} />
          ))}
        </div>
      </div>
    </section>
  )
}
