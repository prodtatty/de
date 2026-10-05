import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Menu from './components/Menu'
import Reviews from './components/Reviews'
import Contacts from './components/Contacts'
import Footer from './components/Footer'
import CookieBanner from './components/CookieBanner'
import { ConsentDoc, Cookies, Privacy } from './components/Legal'

const LEGAL: Record<string, () => JSX.Element> = { '#/privacy': Privacy, '#/consent': ConsentDoc, '#/cookies': Cookies }

export default function App() {
  const [hash, setHash] = useState(location.hash)
  useEffect(() => {
    const on = () => setHash(location.hash)
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])

  // Legal pages replace the landing, so section anchors only exist after the
  // landing re-renders — scroll once it has.
  useEffect(() => {
    const id = hash.slice(1)
    const target = id && !id.startsWith('/') ? document.getElementById(id) : null
    if (target) target.scrollIntoView({ behavior: 'smooth' })
    else window.scrollTo(0, 0)
  }, [hash])

  const LegalPage = LEGAL[hash]
  return (
    <>
      <Navbar />
      {LegalPage ? <LegalPage /> : (
        <main id="top">
          <Hero />
          <Menu />
          <Reviews />
          <Contacts />
        </main>
      )}
      <Footer />
      <CookieBanner />
    </>
  )
}
