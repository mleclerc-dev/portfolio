#!/usr/bin/env node
/*
 * Regenerates the files the site serves but can't draw at request time:
 *   - the share cards (Open Graph), 1200 × 630, from the /og/<id> pages → public/og/<id>-<lang>.png
 *   - the CV PDFs, from /cv and /en/cv                                → public/cv/maxime-leclerc-cv-<lang>.pdf
 *
 * Usage:  npm run og   |   npm run cv   |   npm run snapshots   (add -- --no-build to reuse .output)
 * It builds the static site (nuxt generate), serves it locally, and drives a headless Chrome:
 * set CHROME_PATH if Chrome isn't in its usual place. Motion is reduced so captures are stable.
 */
import { execFileSync, spawn } from 'node:child_process'
import { createServer } from 'node:http'
import { existsSync, mkdtempSync, readFileSync, rmSync, statSync } from 'node:fs'
import { extname, join, resolve } from 'node:path'
import { tmpdir } from 'node:os'
import { projects } from '../app/data/content.ts'

const root = resolve(import.meta.dirname, '..')
const args = process.argv.slice(2)
const what = args.find((a) => !a.startsWith('--')) ?? 'all'
const build = !args.includes('--no-build')
const langs = ['fr', 'en']

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ].filter(Boolean)
  const found = candidates.find((p) => existsSync(p))
  if (!found) throw new Error('Chrome not found: set CHROME_PATH to its executable.')
  return found
}

// A tiny static server for .output/public (directory URLs serve their index.html)
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.mp4': 'video/mp4', '.xml': 'application/xml', '.txt': 'text/plain' }
function serve(dir) {
  const server = createServer((req, res) => {
    let file = join(dir, decodeURIComponent(new URL(req.url, 'http://x').pathname))
    if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html')
    if (!existsSync(file)) {
      res.writeHead(404).end()
      return
    }
    res.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream' }).end(readFileSync(file))
  })
  return new Promise((ok) => server.listen(0, '127.0.0.1', () => ok(server)))
}

if (build) {
  console.log('› nuxt generate')
  execFileSync('npx', ['nuxt', 'generate'], { cwd: root, stdio: 'inherit' })
}
const chrome = findChrome()
const server = await serve(join(root, '.output/public'))
const base = `http://127.0.0.1:${server.address().port}`
const profile = mkdtempSync(join(tmpdir(), 'snapshots-'))
// Async on purpose: a synchronous child would block this process, and with it the server Chrome is waiting on
const run = (url, lang, extra) =>
  new Promise((ok, fail) => {
    const child = spawn(chrome, ['--headless=new', '--hide-scrollbars', '--force-prefers-reduced-motion', `--lang=${lang}`, '--no-pdf-header-footer', '--virtual-time-budget=8000', `--user-data-dir=${profile}`, ...extra, url], { stdio: 'ignore' })
    child.on('error', fail)
    child.on('exit', (code) => (code === 0 ? ok() : fail(new Error(`Chrome failed on ${url}`))))
  })
const prefix = (lang) => (lang === 'en' ? '/en' : '')

try {
  if (what === 'og' || what === 'all') {
    for (const id of ['home', ...projects.map((p) => p.slug)]) {
      for (const lang of langs) {
        const out = join(root, 'public/og', `${id}-${lang}.png`)
        await run(`${base}${prefix(lang)}/og/${id}/`, lang, ['--window-size=1200,630', `--screenshot=${out}`])
        console.log(`✓ ${out.replace(root + '/', '')}`)
      }
    }
  }
  if (what === 'cv' || what === 'all') {
    for (const lang of langs) {
      const out = join(root, 'public/cv', `maxime-leclerc-cv-${lang}.pdf`)
      await run(`${base}${prefix(lang)}/cv/`, lang, [`--print-to-pdf=${out}`])
      console.log(`✓ ${out.replace(root + '/', '')}`)
    }
  }
} finally {
  server.close()
  rmSync(profile, { recursive: true, force: true })
}
console.log(build ? 'Done. Run `npm run generate` again if you deploy now, so the new files are in .output.' : 'Done.')
