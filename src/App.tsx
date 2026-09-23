import { Hero } from '@/components/Hero'
import { StickyNav } from '@/components/StickyNav'
import { About } from '@/components/About'
import { Advantages } from '@/components/Advantages'
import { Models } from '@/components/Models'
import { Gallery } from '@/components/Gallery'
import { FAQ } from '@/components/FAQ'
import { Contact } from '@/components/Contact'

export default function App() {
  return (
    <>
      <StickyNav />
      <Hero />
      <About />
      <Advantages />
      <Models />
      <Gallery />
      <FAQ />
      <Contact />
    </>
  )
}
