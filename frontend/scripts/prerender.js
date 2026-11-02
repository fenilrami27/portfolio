import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DIST_DIR = path.resolve(__dirname, '../dist')
const FALLBACK_PATH = path.resolve(__dirname, '../src/data/fallback.json')
const INDEX_HTML_PATH = path.join(DIST_DIR, 'index.html')

if (!fs.existsSync(INDEX_HTML_PATH)) {
  console.error('[Prerender] dist/index.html not found. Run vite build first.')
  process.exit(1)
}

const templateHtml = fs.readFileSync(INDEX_HTML_PATH, 'utf-8')
const fallbackData = JSON.parse(fs.readFileSync(FALLBACK_PATH, 'utf-8'))

const BASE_URL = 'https://fenilrami.com'

const routes = [
  {
    path: '/',
    title: 'Fenil Rami - Python Backend & Full Stack Developer',
    description:
      'Portfolio of Fenil Rami, Python Backend & Full Stack Developer building enterprise web apps with Django and React.',
    ogImage: `${BASE_URL}/og-image.png`,
    canonical: `${BASE_URL}/`,
  },
  {
    path: '/projects',
    title: 'Projects - Fenil Rami',
    description:
      'Explore enterprise ERP systems, university portals, and full-stack projects engineered by Fenil Rami with Django and React.',
    ogImage: `${BASE_URL}/og-image.png`,
    canonical: `${BASE_URL}/projects`,
  },
  {
    path: '/resume',
    title: 'Resume - Fenil Rami',
    description:
      'Professional resume of Fenil Rami, Python Backend and Full Stack Developer (Django, React, PostgreSQL).',
    ogImage: `${BASE_URL}/og-image.png`,
    canonical: `${BASE_URL}/resume`,
  },
]

// Add project detail routes
const projects = fallbackData.projects || []
for (const proj of projects) {
  if (!proj.isPublished) continue
  const slug = proj.slug
  routes.push({
    path: `/projects/${slug}`,
    title: `${proj.title} - Fenil Rami`,
    description: proj.oneLiner ? proj.oneLiner.slice(0, 150) : '',
    ogImage: fs.existsSync(path.join(DIST_DIR, `og-${slug}.png`))
      ? `${BASE_URL}/og-${slug}.png`
      : `${BASE_URL}/og-image.png`,
    canonical: `${BASE_URL}/projects/${slug}`,
    project: proj,
  })
}

console.log(`[Prerender] Generating static HTML for ${routes.length} routes...`)

for (const route of routes) {
  let html = templateHtml

  // Replace Title
  html = html.replace(/<title>.*?<\/title>/i, `<title>${route.title}</title>`)

  // Replace Description
  html = html.replace(
    /<meta\s+name="description"\s+content=".*?"\s*\/?>/i,
    `<meta name="description" content="${route.description}" />`
  )

  // Replace Canonical
  html = html.replace(
    /<link\s+rel="canonical"\s+href=".*?"\s*\/?>/i,
    `<link rel="canonical" href="${route.canonical}" />`
  )

  // Replace Open Graph tags
  html = html.replace(
    /<meta\s+property="og:title"\s+content=".*?"\s*\/?>/i,
    `<meta property="og:title" content="${route.title}" />`
  )
  html = html.replace(
    /<meta\s+property="og:description"\s+content=".*?"\s*\/?>/i,
    `<meta property="og:description" content="${route.description}" />`
  )
  html = html.replace(
    /<meta\s+property="og:url"\s+content=".*?"\s*\/?>/i,
    `<meta property="og:url" content="${route.canonical}" />`
  )
  html = html.replace(
    /<meta\s+property="og:image"\s+content=".*?"\s*\/?>/i,
    `<meta property="og:image" content="${route.ogImage}" />`
  )

  // Replace Twitter tags
  html = html.replace(
    /<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/i,
    `<meta name="twitter:title" content="${route.title}" />`
  )
  html = html.replace(
    /<meta\s+name="twitter:description"\s+content=".*?"\s*\/?>/i,
    `<meta name="twitter:description" content="${route.description}" />`
  )
  html = html.replace(
    /<meta\s+name="twitter:image"\s+content=".*?"\s*\/?>/i,
    `<meta name="twitter:image" content="${route.ogImage}" />`
  )

  // Determine target path
  let targetPath = path.join(DIST_DIR, 'index.html')
  if (route.path !== '/') {
    const routeDir = path.join(DIST_DIR, route.path.replace(/^\//, ''))
    fs.mkdirSync(routeDir, { recursive: true })
    targetPath = path.join(routeDir, 'index.html')
  }

  fs.writeFileSync(targetPath, html, 'utf-8')
  console.log(`  ✓ Prerendered ${route.path} -> ${path.relative(DIST_DIR, targetPath)}`)
}

console.log('[Prerender] All routes successfully prerendered!')
