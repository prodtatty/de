import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

// Шрифт заголовка главного экрана грузим заранее, чтобы название не «перепрыгивало» после загрузки
function preloadHeroFont(): Plugin {
  return {
    name: 'preload-hero-font',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(_html, ctx) {
        const font = Object.keys(ctx.bundle ?? {}).find((f) => /cormorant-garamond-cyrillic-400-italic-.*\.woff2$/.test(f))
        if (!font) return
        return [
          {
            tag: 'link',
            attrs: { rel: 'preload', as: 'font', type: 'font/woff2', href: `./${font}`, crossorigin: '' },
            injectTo: 'head',
          },
        ]
      },
    },
  }
}

export default defineConfig(({ isSsrBuild }) => ({
  base: './',
  plugins: [react(), preloadHeroFont()],
  // серверная сборка нужна только чтобы заранее отрисовать HTML, картинки и видео ей не нужны
  build: { copyPublicDir: !isSsrBuild },
}))
