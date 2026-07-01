import { Router } from 'express'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import Patient from '../models/Patient.js'
import Caretaker from '../models/Caretaker.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// Admin list users
router.get('/', requireAuth(['admin']), async (req, res) => {
  try {
    const { role } = req.query
    const filter = role ? { role } : {}
    const users = await User.find(filter).select('-passwordHash').sort({ createdAt: -1 }).lean()
    
    const enrichedUsers = await Promise.all(users.map(async (user) => {
      let customId = '';
      if (user.role === 'admin') {
        customId = `ADM-${user._id.toString().slice(-6).toUpperCase()}`
      } else if (user.role === 'patient') {
        const p = await Patient.findOne({ userId: user._id }).lean()
        customId = p?.patientId || `PAT-${user._id.toString().slice(-6).toUpperCase()}`
      } else if (user.role === 'caretaker') {
        const c = await Caretaker.findOne({ userId: user._id }).lean()
        customId = c?.caretakerId || `CRT-${user._id.toString().slice(-6).toUpperCase()}`
      } else {
        customId = `USR-${user._id.toString().slice(-6).toUpperCase()}`
      }
      return { ...user, customId }
    }))
    
    res.json(enrichedUsers)
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get single user (Admin only)
router.get('/:id', requireAuth(['admin']), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash')
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(user)
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Server error' })
  }
})

// Me profile
router.get('/me', requireAuth(), async (req, res) => {
  try {
    const user = await User.findById(req.user.sub).select('-passwordHash')
    res.json(user)
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Server error' })
  }
})

// Admin create user
router.post('/', requireAuth(['admin']), async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    const exists = await User.findOne({ email })
    if (exists) return res.status(409).json({ message: 'Email already in use' })

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await User.create({ 
      name, 
      email, 
      phone, 
      passwordHash, 
      role, 
      status: 'active' 
    })
    
    res.status(201).json({ 
      id: user._id, 
      name: user.name, 
      email: user.email, 
      role: user.role,
      status: user.status 
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Server error' })
  }
})

// Admin update user
router.put('/:id', requireAuth(['admin']), async (req, res) => {
  try {
    const { name, email, phone, role, status } = req.body
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, role, status },
      { new: true, runValidators: true }
    ).select('-passwordHash')

    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(user)
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Server error' })
  }
})

// Admin delete user
router.delete('/:id', requireAuth(['admin']), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    if (user.role === 'patient') {
      await Patient.findOneAndDelete({ userId: user._id })
    } else if (user.role === 'caretaker') {
      await Caretaker.findOneAndDelete({ userId: user._id })
    }

    res.json({ message: 'User deleted successfully' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Server error' })
  }
})

// Admin reset user password
router.post('/:id/reset-password', requireAuth(['admin']), async (req, res) => {
  try {
    const { id } = req.params
    const { password } = req.body
    if (!password) return res.status(400).json({ message: 'Missing password' })
    const passwordHash = await bcrypt.hash(password, 10)
    await User.findByIdAndUpdate(id, { passwordHash })
    res.json({ ok: true, message: 'Password reset successfully' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
