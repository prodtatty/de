// Colors sampled from the hero footage itself (deep forest shadow, moss, mist)
// so the rest of the site's dark sections and accents read as one piece with it.
export const NAVY = '#1C2B21'
export const NAVY_RGB = '28, 43, 33'
export const NAVY_DEEP = '#0F1712'
export const NAVY_DEEP_RGB = '15, 23, 18'
export const ACCENT = '#D9A24B'
export const ACCENT_RGB = '217, 162, 75'
export const CREAM = '#E8E6D9'

export const navyAlpha = (a: number) => `rgba(${NAVY_RGB}, ${a})`
export const navyDeepAlpha = (a: number) => `rgba(${NAVY_DEEP_RGB}, ${a})`
export const accentAlpha = (a: number) => `rgba(${ACCENT_RGB}, ${a})`

export const EASE = 'cubic-bezier(0.16,1,0.3,1)'

export const PHONE_DISPLAY = '+7 986 331-73-62'
export const PHONE_HREF = 'tel:+79863317362'
