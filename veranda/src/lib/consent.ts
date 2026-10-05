import { useEffect, useState } from 'react'

export type Consent = 'all' | 'necessary' | null
const KEY = 'veranda-cookie-consent'
const EVT = 'veranda-consent'

function read(): Consent {
  try {
    const v = localStorage.getItem(KEY)
    return v === 'all' || v === 'necessary' ? v : null
  } catch {
    return null
  }
}

export function setConsent(v: Exclude<Consent, null>) {
  try { localStorage.setItem(KEY, v) } catch { /* storage unavailable */ }
  window.dispatchEvent(new Event(EVT))
}

export function useConsent() {
  const [c, setC] = useState<Consent>(read)
  useEffect(() => {
    const on = () => setC(read())
    window.addEventListener(EVT, on)
    return () => window.removeEventListener(EVT, on)
  }, [])
  return c
}

export function resetConsent() {
  try { localStorage.removeItem(KEY) } catch { /* storage unavailable */ }
  location.reload()
}
