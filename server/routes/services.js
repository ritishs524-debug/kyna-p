import { Router } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { readCollection, writeCollection } from '../db.js'

const COLLECTION = 'services'
export const servicesRouter = Router()

// GET all services (sorted by order)
servicesRouter.get('/', (_req, res) => {
  try {
    const services = readCollection(COLLECTION)
    services.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    res.json(services)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET single service
servicesRouter.get('/:id', (req, res) => {
  try {
    const services = readCollection(COLLECTION)
    const service = services.find((s) => s.id === req.params.id)
    if (!service) return res.status(404).json({ error: 'Not found' })
    res.json(service)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST create service
servicesRouter.post('/', (req, res) => {
  try {
    const services = readCollection(COLLECTION)
    const newService = {
      id: uuidv4(),
      title: req.body.title || '',
      badge: req.body.badge || '',
      description: req.body.description || '',
      image: req.body.image || '',
      imageAlt: req.body.imageAlt || '',
      order: req.body.order ?? services.length,
    }
    services.push(newService)
    writeCollection(COLLECTION, services)
    res.status(201).json(newService)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT update service
servicesRouter.put('/:id', (req, res) => {
  try {
    const services = readCollection(COLLECTION)
    const idx = services.findIndex((s) => s.id === req.params.id)
    if (idx === -1) return res.status(404).json({ error: 'Not found' })
    services[idx] = { ...services[idx], ...req.body, id: req.params.id }
    writeCollection(COLLECTION, services)
    res.json(services[idx])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE service
servicesRouter.delete('/:id', (req, res) => {
  try {
    let services = readCollection(COLLECTION)
    const exists = services.some((s) => s.id === req.params.id)
    if (!exists) return res.status(404).json({ error: 'Not found' })
    services = services.filter((s) => s.id !== req.params.id)
    writeCollection(COLLECTION, services)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

