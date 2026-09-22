import { Reveal } from '@/components/Reveal'
import { ACCENT, accentAlpha } from '@/lib/theme'

const LINE = 'rgba(255,255,255,0.55)'
const LINE_SOFT = 'rgba(255,255,255,0.25)'

function DimLine({
  x1,
  y1,
  x2,
  y2,
  label,
  labelPos,
}: {
  x1: number
  y1: number
  x2: number
  y2: number
  label: string
  labelPos: { x: number; y: number }
}) {
  const vertical = x1 === x2
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={LINE_SOFT} strokeWidth={1} />
      <line
        x1={vertical ? x1 - 4 : x1}
        y1={vertical ? y1 : y1 - 4}
        x2={vertical ? x1 + 4 : x1}
        y2={vertical ? y1 : y1 + 4}
        stroke={LINE_SOFT}
        strokeWidth={1}
      />
      <line
        x1={vertical ? x2 - 4 : x2}
        y1={vertical ? y2 : y2 - 4}
        x2={vertical ? x2 + 4 : x2}
        y2={vertical ? y2 : y2 + 4}
        stroke={LINE_SOFT}
        strokeWidth={1}
      />
      <text
        x={labelPos.x}
        y={labelPos.y}
        fill={ACCENT}
        fontSize={13}
        letterSpacing={0.5}
        textAnchor="middle"
        fontFamily="inherit"
      >
        {label}
      </text>
    </g>
  )
}

export function TechnicalDrawing() {
  return (
    <Reveal className="mt-24 sm:mt-32">
      <div className="flex items-baseline justify-between flex-wrap gap-4 mb-8">
        <div>
          <p className="text-xs tracking-[0.3em] uppercase font-medium" style={{ color: ACCENT }}>
            Инженерный чертёж
          </p>
          <h3 className="mt-3 text-2xl sm:text-3xl font-light text-white uppercase tracking-wide">K520 Classic</h3>
        </div>
        <p className="text-sm text-white/40 max-w-sm">
          Корпус проектируется под раскрой листа ПНД на фрезерном станке с ЧПУ — каждый размер выверен
          заранее.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 p-6 sm:p-10" style={{ background: accentAlpha(0.04) }}>
        <svg viewBox="0 0 900 420" className="w-full h-auto" role="img" aria-label="Чертёж катера K520 Classic">
          {/* side profile */}
          <g>
            <path
              d="M 60 230 Q 40 210 55 185 Q 90 130 150 110 L 660 100 Q 700 100 700 130 L 700 230 Z"
              fill="none"
              stroke={LINE}
              strokeWidth={1.75}
            />
            <path
              d="M 340 100 L 355 55 Q 358 46 368 46 L 430 46 Q 440 46 442 56 L 448 100"
              fill="none"
              stroke={LINE}
              strokeWidth={1.5}
            />
            <line x1="60" y1="230" x2="700" y2="230" stroke={LINE_SOFT} strokeWidth={1} />
            <path d="M 700 205 L 725 212 L 725 226 L 700 226 Z" fill="none" stroke={LINE} strokeWidth={1.5} />

            <DimLine x1={60} y1={260} x2={700} y2={260} label="520 см" labelPos={{ x: 380, y: 278 }} />
            <DimLine x1={730} y1={130} x2={730} y2={230} label="51 см" labelPos={{ x: 764, y: 184 }} />
          </g>

          {/* top view */}
          <g transform="translate(0, 300)">
            <path
              d="M 90 60 Q 60 60 60 30 Q 60 0 90 0 L 640 0 Q 700 0 700 30 Q 700 60 640 60 Z"
              fill="none"
              stroke={LINE}
              strokeWidth={1.75}
            />
            <ellipse cx="390" cy="30" rx="34" ry="22" fill="none" stroke={LINE_SOFT} strokeWidth={1.25} />
            <rect x="200" y="12" width="110" height="36" rx="4" fill="none" stroke={LINE_SOFT} strokeWidth={1} />
            <rect x="470" y="12" width="110" height="36" rx="4" fill="none" stroke={LINE_SOFT} strokeWidth={1} />

            <DimLine x1={730} y1={0} x2={730} y2={60} label="220 см" labelPos={{ x: 780, y: 34 }} />
          </g>

          <text x="60" y="410" fill="rgba(255,255,255,0.3)" fontSize={11} letterSpacing={1}>
            МАССА 410 КГ · МОТОР ДО 150 Л.С. · ЭКИПАЖ 5 ЧЕЛ
          </text>
        </svg>
      </div>
    </Reveal>
  )
}
