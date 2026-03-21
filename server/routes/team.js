import { Router } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { readCollection, writeCollection } from '../db.js'

const COLLECTION = 'team'
export const teamRouter = Router()

// GET all team members (sorted by order)
teamRouter.get('/', (_req, res) => {
  try {
    const team = readCollection(COLLECTION)
    team.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    res.json(team)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET single member
teamRouter.get('/:id', (req, res) => {
  try {
    const team = readCollection(COLLECTION)
    const member = team.find((m) => m.id === req.params.id)
    if (!member) return res.status(404).json({ error: 'Not found' })
    res.json(member)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST create member
teamRouter.post('/', (req, res) => {
  try {
    const team = readCollection(COLLECTION)
    const newMember = {
      id: uuidv4(),
      name: req.body.name || '',
      primaryRole: req.body.primaryRole || '',
      tags: req.body.tags || [],
      focus: req.body.focus || '',
      initials: req.body.initials || '',
      image: req.body.image || '',
      order: req.body.order ?? team.length,
      showOnHome: req.body.showOnHome ?? false,
    }
    team.push(newMember)
    writeCollection(COLLECTION, team)
    res.status(201).json(newMember)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT update member
teamRouter.put('/:id', (req, res) => {
  try {
    const team = readCollection(COLLECTION)
    const idx = team.findIndex((m) => m.id === req.params.id)
    if (idx === -1) return res.status(404).json({ error: 'Not found' })
    team[idx] = { ...team[idx], ...req.body, id: req.params.id }
    writeCollection(COLLECTION, team)
    res.json(team[idx])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE member
teamRouter.delete('/:id', (req, res) => {
  try {
    let team = readCollection(COLLECTION)
    const exists = team.some((m) => m.id === req.params.id)
    if (!exists) return res.status(404).json({ error: 'Not found' })
    team = team.filter((m) => m.id !== req.params.id)
    writeCollection(COLLECTION, team)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

