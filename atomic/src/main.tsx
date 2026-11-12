import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import '@fontsource/cormorant-garamond/cyrillic-400.css'
import '@fontsource/cormorant-garamond/latin-400.css'
import '@fontsource/cormorant-garamond/cyrillic-500.css'
import '@fontsource/cormorant-garamond/latin-500.css'
import '@fontsource/cormorant-garamond/cyrillic-400-italic.css'
import '@fontsource/cormorant-garamond/latin-400-italic.css'
import '@fontsource/manrope/cyrillic-300.css'
import '@fontsource/manrope/latin-300.css'
import '@fontsource/manrope/cyrillic-400.css'
import '@fontsource/manrope/latin-400.css'
import '@fontsource/manrope/cyrillic-500.css'
import '@fontsource/manrope/latin-500.css'
import App, { docFromHash } from './App'
import './index.css'

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// Главная уже отрисована при сборке — «оживляем» готовую разметку.
// Документы по прямой ссылке (#/privacy и т. п.) и режим разработки рисуем с нуля.
if (root.hasChildNodes() && !docFromHash()) hydrateRoot(root, app)
else createRoot(root).render(app)
