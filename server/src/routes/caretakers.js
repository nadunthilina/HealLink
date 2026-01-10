import { Router } from 'express'
import bcrypt from 'bcryptjs'
import Caretaker from '../models/Caretaker.js'
import User from '../models/User.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// Get all caretakers (Admin only)
router.get('/', requireAuth(['admin']), async (req, res) => {
  try {
    const caretakers = await Caretaker.find()
      .populate('userId', 'email status')
      .populate('assignedPatients', 'name condition')
      .sort({ createdAt: -1 })
    res.json(caretakers)
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get single caretaker (Admin only)
router.get('/:id', requireAuth(['admin']), async (req, res) => {
  try {
    const caretaker = await Caretaker.findById(req.params.id)
      .populate('userId', 'email status')
      .populate('assignedPatients', 'name age condition phone')
    if (!caretaker) return res.status(404).json({ message: 'Caretaker not found' })
    res.json(caretaker)
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Server error' })
  }
})

// Create caretaker (Admin only) - Creates both User and Caretaker
router.post('/', requireAuth(['admin']), async (req, res) => {
  try {
    const { name, phone, email, password, skills, experience, certifications } = req.body
    
    if (!name || !phone || !email || !password) {
      return res.status(400).json({ message: 'Name, phone, email, and password are required' })
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' })
    }

    // Create User account for caretaker
    const passwordHash = await bcrypt.hash(password, 10)
    const user = await User.create({
      name,
      email,
      phone,
      passwordHash,
      role: 'caretaker',
      status: 'active'
    })

    // Create Caretaker profile
    const caretaker = await Caretaker.create({
      name,
      phone,
      email,
      skills,
      experience,
      certifications: certifications || [],
      userId: user._id,
      status: 'active',
      availability: 'available'
    })

    const populated = await Caretaker.findById(caretaker._id)
      .populate('userId', 'email status')
    
    res.status(201).json(populated)
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Server error' })
  }
})

// Update caretaker (Admin only)
router.put('/:id', requireAuth(['admin']), async (req, res) => {
  try {
    const { name, phone, email, skills, experience, certifications, availability, status } = req.body
    
    const caretaker = await Caretaker.findByIdAndUpdate(
      req.params.id,
      { name, phone, email, skills, experience, certifications, availability, status },
      { new: true, runValidators: true }
    ).populate('userId', 'email status')

    if (!caretaker) return res.status(404).json({ message: 'Caretaker not found' })

    // Update user email if changed
    if (email && caretaker.userId) {
      await User.findByIdAndUpdate(caretaker.userId, { email, name, phone })
    }

    res.json(caretaker)
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Server error' })
  }
})

// Delete caretaker (Admin only)
router.delete('/:id', requireAuth(['admin']), async (req, res) => {
  try {
    const caretaker = await Caretaker.findById(req.params.id)
    if (!caretaker) return res.status(404).json({ message: 'Caretaker not found' })

    // Delete associated user account
    if (caretaker.userId) {
      await User.findByIdAndDelete(caretaker.userId)
    }

    await Caretaker.findByIdAndDelete(req.params.id)
    res.json({ message: 'Caretaker and associated user account deleted successfully' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
