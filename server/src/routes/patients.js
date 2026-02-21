import { Router } from 'express'
import Patient from '../models/Patient.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// Get all patients (Admin only)
router.get('/', requireAuth(['admin']), async (req, res) => {
  try {
    const patients = await Patient.find()
      .populate('assignedCaretaker', 'name phone email')
      .sort({ createdAt: -1 })
    res.json(patients)
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get single patient (Admin only)
router.get('/:id', requireAuth(['admin']), async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .populate('assignedCaretaker', 'name phone email skills')
    if (!patient) return res.status(404).json({ message: 'Patient not found' })
    res.json(patient)
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Server error' })
  }
})

// Create patient (Admin only)
router.post('/', requireAuth(['admin']), async (req, res) => {
  try {
    const { name, age, phone, email, address, condition, emergencyContact, assignedCaretaker, notes } = req.body
    
    if (!name || !age || !phone) {
      return res.status(400).json({ message: 'Name, age, and phone are required' })
    }

    const patient = await Patient.create({
      name,
      age,
      phone,
      email,
      address,
      condition,
      emergencyContact,
      assignedCaretaker: assignedCaretaker || null,
      notes,
      status: 'active'
    })

    const populated = await Patient.findById(patient._id)
      .populate('assignedCaretaker', 'name phone email')
    
    res.status(201).json(populated)
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Server error' })
  }
})

// Update patient (Admin only)
router.put('/:id', requireAuth(['admin']), async (req, res) => {
  try {
    const { name, age, phone, email, address, condition, emergencyContact, assignedCaretaker, status, notes } = req.body
    
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { name, age, phone, email, address, condition, emergencyContact, assignedCaretaker, status, notes },
      { new: true, runValidators: true }
    ).populate('assignedCaretaker', 'name phone email')

    if (!patient) return res.status(404).json({ message: 'Patient not found' })
    res.json(patient)
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Server error' })
  }
})

// Delete patient (Admin only)
router.delete('/:id', requireAuth(['admin']), async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id)
    if (!patient) return res.status(404).json({ message: 'Patient not found' })
    res.json({ message: 'Patient deleted successfully' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
