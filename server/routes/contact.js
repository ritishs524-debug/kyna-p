import { Router } from 'express'
import { v4 as uuid } from 'uuid'
import { readCollection, writeCollection } from '../db.js'

const COLLECTION = 'contact'

export const contactRouter = Router()

// GET all contact messages
contactRouter.get('/', (_req, res) => {
  try {
    const messages = readCollection(COLLECTION)
    // Return newest first
    messages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    res.json(messages)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' })
  }
})

// POST new contact message
contactRouter.post('/', (req, res) => {
  try {
    const { name, email, phone, message } = req.body

    if (!name || !email || !phone || !message) {
      return res.status(400).json({ error: 'All fields are required (name, email, phone, message)' })
    }

    const messages = readCollection(COLLECTION)
    const newMessage = {
      id: uuid(),
      name,
      email,
      phone,
      message,
      createdAt: new Date().toISOString(),
    }
    messages.push(newMessage)
    writeCollection(COLLECTION, messages)

    res.status(201).json(newMessage)
  } catch (err) {
    res.status(500).json({ error: 'Failed to save message' })
  }
})

// DELETE a contact message
contactRouter.delete('/:id', (req, res) => {
  try {
    const messages = readCollection(COLLECTION)
    const filtered = messages.filter((m) => m.id !== req.params.id)

    if (filtered.length === messages.length) {
      return res.status(404).json({ error: 'Message not found' })
    }

    writeCollection(COLLECTION, filtered)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete message' })
  }
})
