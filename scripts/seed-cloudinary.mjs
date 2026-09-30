/**
 * One-time seed: push every bundled image to Cloudinary and write a manifest
 * the app can import from.
 *
 * Idempotent — each asset gets a stable slug `public_id` and the script
 * HEAD-checks it first, so re-running skips anything already stored.
 *
 * Usage:  node scripts/seed-cloudinary.mjs [--force]
 */
import {
  readdirSync,
  statSync,
  readFileSync,
  writeFileSync,
  existsSync,
} from 'node:fs'
import { readFile as readFileAsync } from 'node:fs/promises'
import { join, basename, extname, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const FORCE = process.argv.includes('--force')

/* ── Config (read straight from .env so no build step is needed) ── */
function readEnv(name) {
  const file = join(ROOT, '.env')
  if (!existsSync(file)) return ''
  const line = readFileSync(file, 'utf8')
    .split('\n')
    .find((l) => l.trim().startsWith(`${name}=`))
  return line ? line.split('=').slice(1).join('=').trim() : ''
}

const CLOUD = readEnv('VITE_CLOUDINARY_CLOUD_NAME')
const PRESET = readEnv('VITE_CLOUDINARY_UPLOAD_PRESET')

if (!CLOUD || !PRESET) {
  console.error(
    '✗ VITE_CLOUDINARY_CLOUD_NAME / VITE_CLOUDINARY_UPLOAD_PRESET missing from .env',
  )
  process.exit(1)
}

/* ── Delivery transform — must match src/lib/cloudinary.ts ── */
const DELIVERY = 'c_limit,w_1600,q_auto:good,f_auto'

/* ── Source directory → Cloudinary folder ── */
const FOLDER_BY_DIR = {
  'src/assets/services': 'kyna/services',
  'src/assets/about': 'kyna/about',
  'src/assets/logo': 'kyna/brand',
  'src/assets/images': 'kyna/site',
  public: 'kyna/brand',
}

/* ── Collect every image ── */
function walk(dir, out = []) {
  if (!existsSync(dir)) return out
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) walk(full, out)
    else if (/\.(jpe?g|png|webp|avif)$/i.test(entry)) out.push(full)
  }
  return out
}

/** Readable, stable slug. Strips the "(1) (1)" dedup suffixes. */
function slugify(path) {
  return basename(path, extname(path))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-\d+-\d+$/, '')
    .slice(0, 60)
    .replace(/-+$/, '')
}

const plainUrl = (pid) => `https://res.cloudinary.com/${CLOUD}/image/upload/${pid}`
const deliveryUrl = (pid) =>
  `https://res.cloudinary.com/${CLOUD}/image/upload/${DELIVERY}/${pid}`

/* ── Upload one asset ── */
async function upload(absolutePath, folder, publicId) {
  if (!FORCE) {
    const head = await fetch(plainUrl(publicId), { method: 'HEAD' }).catch(
      () => null,
    )
    if (head && head.ok) return { skipped: true }
  }

  const bytes = await readFileAsync(absolutePath)
  const form = new FormData()
  form.append('file', new Blob([bytes]))
  form.append('upload_preset', PRESET)
  form.append('folder', folder)
  // Only the params an unsigned preset accepts.
  form.append('public_id', publicId.split('/').pop())

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`, {
    method: 'POST',
    body: form,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data?.error?.message || `HTTP ${res.status}`)
  return { skipped: false, bytes: data.bytes }
}

/* ── Run ── */
const jobs = Object.entries(FOLDER_BY_DIR).flatMap(([dir, folder]) =>
  walk(join(ROOT, dir)).map((absolute) => {
    const rel = relative(ROOT, absolute)
    return { absolute, rel, folder, publicId: `${folder}/${slugify(absolute)}` }
  }),
)

console.log(`\nSeeding ${jobs.length} images → Cloudinary cloud "${CLOUD}"\n`)

const manifest = {}
let uploaded = 0
let skipped = 0
let failed = 0

for (const job of jobs) {
  const localKb = Math.round(statSync(job.absolute).size / 1024)
  try {
    const r = await upload(job.absolute, job.folder, job.publicId)
    manifest[job.rel] = deliveryUrl(job.publicId)
    if (r.skipped) {
      skipped++
      console.log(`  = ${job.rel}  (already stored)`)
    } else {
      uploaded++
      console.log(
        `  + ${job.rel}\n      ${localKb} KB → ${Math.round((r.bytes || 0) / 1024)} KB stored`,
      )
    }
  } catch (err) {
    failed++
    console.log(`  ✗ ${job.rel}\n      ${err.message}`)
  }
}

writeFileSync(
  join(ROOT, 'cloudinary-manifest.json'),
  JSON.stringify(manifest, null, 2),
)

console.log(
  `\n${uploaded} uploaded · ${skipped} already present · ${failed} failed`,
)
console.log('→ cloudinary-manifest.json written\n')
if (failed > 0) process.exit(1)
