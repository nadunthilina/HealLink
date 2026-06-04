import { Router } from 'express'
import bcrypt from 'bcryptjs'
import Patient from '../models/Patient.js'
import User from '../models/User.js'
import Schedule from '../models/Schedule.js'
import { checkCaretakerConflict } from './schedules.js'
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
    const { name, age, phone, email, password, address, condition, emergencyContact, assignedCaretaker, assignmentStartDate, assignmentEndDate, assignmentStartTime, assignmentEndTime, assignmentIsFullDay, notes } = req.body
    
    if (!name || !age || !phone || !email || !password) {
      return res.status(400).json({ message: 'Name, age, phone, email, and password are required' })
    }

    if (assignedCaretaker && assignmentStartDate && assignmentEndDate) {
      const conflict = await checkCaretakerConflict(assignedCaretaker, assignmentStartDate, assignmentEndDate, assignmentStartTime, assignmentEndTime, assignmentIsFullDay)
      if (conflict) {
        return res.status(409).json({ message: conflict.message })
      }
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await User.create({
      name,
      email,
      phone,
      passwordHash,
      role: 'patient',
      status: 'active'
    })

    const patient = await Patient.create({
      name,
      age,
      phone,
      email,
      address,
      condition,
      emergencyContact,
      assignedCaretaker: assignedCaretaker || null,
      assignmentStartDate: assignmentStartDate || null,
      assignmentEndDate: assignmentEndDate || null,
      assignmentStartTime: assignmentStartTime || null,
      assignmentEndTime: assignmentEndTime || null,
      assignmentIsFullDay: assignmentIsFullDay || false,
      userId: user._id,
      notes,
      status: 'active'
    })

    if (assignedCaretaker && assignmentStartDate && assignmentEndDate) {
      const schedule = await Schedule.create({
        patientId: patient._id,
        caretakerId: assignedCaretaker,
        startDate: assignmentStartDate,
        endDate: assignmentEndDate,
        startTime: assignmentStartTime,
        endTime: assignmentEndTime,
        isFullDay: assignmentIsFullDay,
        status: 'pending',
        notes: 'Auto-generated from patient assignment'
      })
      patient.autoScheduleId = schedule._id
      await patient.save()
    }

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
    const { name, age, phone, email, address, condition, emergencyContact, assignedCaretaker, assignmentStartDate, assignmentEndDate, assignmentStartTime, assignmentEndTime, assignmentIsFullDay, status, notes } = req.body
    
    const patient = await Patient.findById(req.params.id)
    if (!patient) return res.status(404).json({ message: 'Patient not found' })

    if (assignedCaretaker && assignmentStartDate && assignmentEndDate) {
      const conflict = await checkCaretakerConflict(
        assignedCaretaker, 
        assignmentStartDate, 
        assignmentEndDate, 
        assignmentStartTime, 
        assignmentEndTime, 
        assignmentIsFullDay,
        patient.autoScheduleId
      )
      if (conflict) {
        return res.status(409).json({ message: conflict.message })
      }
    }

    // Update auto schedule if exists
    if (assignedCaretaker && assignmentStartDate && assignmentEndDate) {
      if (patient.autoScheduleId) {
        await Schedule.findByIdAndUpdate(patient.autoScheduleId, {
          caretakerId: assignedCaretaker,
          startDate: assignmentStartDate,
          endDate: assignmentEndDate,
          startTime: assignmentStartTime,
          endTime: assignmentEndTime,
          isFullDay: assignmentIsFullDay || false
        })
      } else {
        const schedule = await Schedule.create({
          patientId: patient._id,
          caretakerId: assignedCaretaker,
          startDate: assignmentStartDate,
          endDate: assignmentEndDate,
          startTime: assignmentStartTime,
          endTime: assignmentEndTime,
          isFullDay: assignmentIsFullDay || false,
          status: 'pending',
          notes: 'Auto-generated from patient assignment'
        })
        patient.autoScheduleId = schedule._id
      }
    } else if (!assignedCaretaker && patient.autoScheduleId) {
      await Schedule.findByIdAndDelete(patient.autoScheduleId)
      patient.autoScheduleId = null
    }

    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      { name, age, phone, email, address, condition, emergencyContact, assignedCaretaker, assignmentStartDate, assignmentEndDate, assignmentStartTime, assignmentEndTime, assignmentIsFullDay: assignmentIsFullDay || false, autoScheduleId: patient.autoScheduleId, status, notes },
      { new: true, runValidators: true }
    ).populate('assignedCaretaker', 'name phone email')

    if (!updatedPatient) return res.status(404).json({ message: 'Patient not found' })

    if (email && updatedPatient.userId) {
      await User.findByIdAndUpdate(updatedPatient.userId, { email, name, phone })
    }

    res.json(updatedPatient)
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Server error' })
  }
})

// Delete patient (Admin only)
router.delete('/:id', requireAuth(['admin']), async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
    if (!patient) return res.status(404).json({ message: 'Patient not found' })

    if (patient.userId) {
      await User.findByIdAndDelete(patient.userId)
    }

    if (patient.autoScheduleId) {
      await Schedule.findByIdAndDelete(patient.autoScheduleId)
    }

    await Patient.findByIdAndDelete(req.params.id)
    res.json({ message: 'Patient and associated user account deleted successfully' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
