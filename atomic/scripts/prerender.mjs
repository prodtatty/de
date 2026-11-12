// Вставляет заранее отрисованную главную страницу в dist/index.html
import { readFileSync, rmSync, writeFileSync } from 'node:fs'

const ssrDir = new URL('../.ssr/', import.meta.url)
const page = new URL('../dist/index.html', import.meta.url)
const { render } = await import(new URL('entry-server.js', ssrDir))

const marker = '<div id="root"></div>'
const html = readFileSync(page, 'utf8')
if (!html.includes(marker)) throw new Error('prerender: в dist/index.html не найден <div id="root"></div>')

writeFileSync(page, html.replace(marker, `<div id="root">${render()}</div>`))
rmSync(ssrDir, { recursive: true, force: true })
console.log('prerender: главная страница отрисована в dist/index.html')
