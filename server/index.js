import { config } from 'dotenv'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: join(__dirname, '..', '.env') })

import express from 'express'
import cors from 'cors'
import { servicesRouter } from './routes/services.js'
import { teamRouter } from './routes/team.js'
import { uploadRouter } from './routes/upload.js'
import { contactRouter } from './routes/contact.js'

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

// API routes
app.use('/api/services', servicesRouter)
app.use('/api/team', teamRouter)
app.use('/api/upload', uploadRouter)
app.use('/api/contact', contactRouter)

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`KYNA backend running on http://localhost:${PORT}`)
})

