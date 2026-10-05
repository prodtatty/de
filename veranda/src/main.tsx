import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Fonts are self-hosted so no visitor data goes to Google Fonts (152-ФЗ).
// Figtree has no Cyrillic, so Onest covers the Russian glyphs.
import '@fontsource/figtree/latin-400.css'
import '@fontsource/figtree/latin-500.css'
import '@fontsource/figtree/latin-600.css'
import '@fontsource/onest/cyrillic-400.css'
import '@fontsource/onest/cyrillic-500.css'
import '@fontsource/onest/cyrillic-600.css'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
