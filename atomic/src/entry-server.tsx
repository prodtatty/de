import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'

// Готовый HTML главной страницы: телефон показывает её сразу, не дожидаясь JavaScript
export function render() {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
