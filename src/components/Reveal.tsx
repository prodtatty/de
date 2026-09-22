import type { CSSProperties, ReactNode } from 'react'
import { useReveal } from '@/hooks/useReveal'
import { EASE } from '@/lib/theme'

export function Reveal({
  children,
  delay = 0,
  className,
  onClick,
  style: extraStyle,
}: {
  children: ReactNode
  delay?: number
  className?: string
  onClick?: () => void
  style?: CSSProperties
}) {
  const { ref, visible } = useReveal<HTMLDivElement>()
  const style: CSSProperties = {
    ...extraStyle,
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(32px)',
    transition: `opacity 0.9s ${EASE} ${delay}ms, transform 0.9s ${EASE} ${delay}ms`,
  }
  return (
    <div ref={ref} className={className} style={style} onClick={onClick}>
      {children}
    </div>
  )
}
