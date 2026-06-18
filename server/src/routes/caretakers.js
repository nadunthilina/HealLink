import { Router } from 'express'
import bcrypt from 'bcryptjs'
import Caretaker from '../models/Caretaker.js'
import User from '../models/User.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// Get all caretakers
router.get('/', requireAuth(['admin', 'patient']), async (req, res) => {
  try {
    let query = Caretaker.find().sort({ createdAt: -1 })

    if (req.user.role === 'admin') {
      query = query
        .populate('userId', 'email status')
        .populate('assignedPatients', 'name condition')
    } else {
      query = query.select('caretakerId name age gender phone email skills experience certifications availability status rating assignedPatients')
    }

    const caretakers = await query
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
    const { name, phone, email, password, age, gender, skills, experience, certifications } = req.body
    
    if (!name || !phone || !email || !password || !age || !gender) {
      return res.status(400).json({ message: 'Name, phone, email, password, age, and gender are required' })
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

    // Generate CARE-XXXX ID
    const lastCaretaker = await Caretaker.findOne().sort({ createdAt: -1 })
    let newIdNum = 1
    if (lastCaretaker && lastCaretaker.caretakerId) {
      const match = lastCaretaker.caretakerId.match(/CARE-(\d+)/)
      if (match) newIdNum = parseInt(match[1]) + 1
    }
    const caretakerId = `CARE-${newIdNum.toString().padStart(4, '0')}`

    // Create Caretaker profile
    const caretaker = await Caretaker.create({
      caretakerId,
      name,
      age,
      gender,
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
    const { name, phone, email, age, gender, skills, experience, certifications, availability, status } = req.body
    
    const caretaker = await Caretaker.findByIdAndUpdate(
      req.params.id,
      { name, phone, email, age, gender, skills, experience, certifications, availability, status },
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
