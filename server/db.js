import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = join(__dirname, 'data')

// Ensure data directory exists
if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true })
}

function getFilePath(collection) {
  return join(DATA_DIR, `${collection}.json`)
}

export function readCollection(collection) {
  const filePath = getFilePath(collection)
  if (!existsSync(filePath)) {
    writeFileSync(filePath, '[]', 'utf-8')
    return []
  }
  const raw = readFileSync(filePath, 'utf-8')
  return JSON.parse(raw)
}

export function writeCollection(collection, data) {
  const filePath = getFilePath(collection)
  writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
}

