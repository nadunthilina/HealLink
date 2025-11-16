import { Router } from 'express'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// Admin list users
router.get('/', requireAuth(['admin']), async (req, res) => {
  const { role } = req.query
  const filter = role ? { role } : {}
  const users = await User.find(filter).select('-passwordHash')
  res.json(users)
})

// Me profile
router.get('/me', requireAuth(), async (req, res) => {
  const user = await User.findById(req.user.sub).select('-passwordHash')
  res.json(user)
})

// Get list of available caretakers (for patients to browse)
router.get('/caretakers', requireAuth(['patient', 'admin']), async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query
    const skip = (page - 1) * limit

    const caretakers = await User.find({ 
      role: 'caretaker', 
      status: 'active' 
    })
      .select('name email phone status createdAt')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })

    const total = await User.countDocuments({ 
      role: 'caretaker', 
      status: 'active' 
    })

    res.json({
      caretakers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router

// Admin create caretaker
router.post('/caretakers', requireAuth(['admin']), async (req, res) => {
  try {
    const { name, email, phone, password } = req.body
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' })

    const exists = await User.findOne({ email })
    if (exists) return res.status(409).json({ message: 'Email already in use' })

    const passwordHash = await bcrypt.hash(password, 10)
    const caretaker = await User.create({ name, email, phone, passwordHash, role: 'caretaker', status: 'active' })
    res.status(201).json({ id: caretaker._id, name: caretaker.name, email: caretaker.email, role: caretaker.role })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Server error' })
  }
})

// Admin reset user password (caretaker or patient)
router.post('/:id/reset-password', requireAuth(['admin']), async (req, res) => {
  try {
    const { id } = req.params
    const { password } = req.body
    if (!password) return res.status(400).json({ message: 'Missing password' })
    const passwordHash = await bcrypt.hash(password, 10)
    await User.findByIdAndUpdate(id, { passwordHash })
    res.json({ ok: true })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Server error' })
  }
})
