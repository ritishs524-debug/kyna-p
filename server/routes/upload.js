import { Router } from 'express'
import multer from 'multer'

export const uploadRouter = Router()

const upload = multer({ storage: multer.memoryStorage() })

// POST upload image to Cloudinary via backend
uploadRouter.post('/', upload.single('file'), async (req, res) => {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET

    if (!cloudName || !uploadPreset) {
      return res.status(500).json({ error: 'Cloudinary not configured. Set CLOUDINARY_CLOUD_NAME and CLOUDINARY_UPLOAD_PRESET env vars.' })
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' })
    }

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`

    const formData = new FormData()
    formData.append('file', new Blob([req.file.buffer], { type: req.file.mimetype }), req.file.originalname)
    formData.append('upload_preset', uploadPreset)
    formData.append('folder', 'kyna')

    const cloudRes = await fetch(url, { method: 'POST', body: formData })

    if (!cloudRes.ok) {
      const err = await cloudRes.json()
      return res.status(500).json({ error: err?.error?.message || 'Cloudinary upload failed' })
    }

    const data = await cloudRes.json()
    res.json({ url: data.secure_url })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

