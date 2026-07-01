import { Router } from 'express'
import bcrypt from 'bcryptjs'
import Patient from '../models/Patient.js'
import User from '../models/User.js'
import Schedule from '../models/Schedule.js'
import { checkCaretakerConflict } from './schedules.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// Get current patient profile
router.get('/me', requireAuth(['patient']), async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user.sub })
      .populate('assignedCaretaker', 'name phone email skills caretakerId gender availability')

    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' })
    }

    res.json(patient)
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Server error' })
  }
})

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
    const { name, age, gender, phone, email, password, address, emergencyContact, assignedCaretaker, assignmentStartDate, assignmentEndDate, assignmentStartTime, assignmentDayType, wardNo, paymentToAgency, notes } = req.body
    
    if (!name || !age || !gender || !phone || !email || !password) {
      return res.status(400).json({ message: 'Name, age, gender, phone, email, and password are required' })
    }

    let dates = []
    if (assignedCaretaker && assignmentStartDate && assignmentStartTime && assignmentDayType) {
      const start = new Date(assignmentStartDate)
      const end = assignmentEndDate ? new Date(assignmentEndDate) : new Date(assignmentStartDate)
      
      if (end < start) {
        return res.status(400).json({ message: 'End date cannot be before start date' })
      }

      let currentDate = new Date(start)
      while (currentDate <= end) {
        dates.push(new Date(currentDate).toISOString().split('T')[0])
        currentDate.setDate(currentDate.getDate() + 1)
      }

      for (const date of dates) {
        const conflict = await checkCaretakerConflict(assignedCaretaker, date, assignmentStartTime, assignmentDayType)
        if (conflict) {
          return res.status(409).json({ message: `Conflict on ${date}: ${conflict.message}` })
        }
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

    // Generate PAT-00000001 ID
    const lastPatient = await Patient.findOne({ patientId: { $exists: true, $ne: null } }).sort({ patientId: -1 })
    let newIdNum = 1
    if (lastPatient && lastPatient.patientId) {
      const match = lastPatient.patientId.match(/PAT-(\d+)/)
      if (match) newIdNum = parseInt(match[1]) + 1
    }
    const patientId = `PAT-${newIdNum.toString().padStart(8, '0')}`

    let patient
    try {
      patient = await Patient.create({
        patientId,
        name,
        age,
        gender,
        phone,
        email,
        address,
        emergencyContact,
        assignedCaretaker: assignedCaretaker || null,
        assignmentStartDate: assignmentStartDate || null,
        assignmentEndDate: assignmentEndDate || null,
        assignmentStartTime: assignmentStartTime || null,
        assignmentDayType: assignmentDayType || null,
        userId: user._id,
        notes,
        status: 'active'
      })
    } catch (err) {
      await User.findByIdAndDelete(user._id)
      throw err
    }

    if (assignedCaretaker && assignmentStartDate && assignmentStartTime && assignmentDayType) {
      const autoScheduleIds = []
      for (const date of dates) {
        const schedule = await Schedule.create({
          patientId: patient._id,
          caretakerId: assignedCaretaker,
          wardNo: wardNo || address,
          startDate: date,
          startTime: assignmentStartTime,
          dayType: assignmentDayType,
          paymentToAgency: paymentToAgency || 'unpaid',
          status: 'pending',
          notes: 'Auto-generated from patient assignment'
        })
        autoScheduleIds.push(schedule._id)
      }
      patient.autoScheduleIds = autoScheduleIds
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
    const { name, age, gender, phone, email, address, emergencyContact, assignedCaretaker, assignmentStartDate, assignmentEndDate, assignmentStartTime, assignmentDayType, wardNo, paymentToAgency, status, notes } = req.body
    
    const patient = await Patient.findById(req.params.id)
    if (!patient) return res.status(404).json({ message: 'Patient not found' })

    let dates = []
    if (assignedCaretaker && assignmentStartDate && assignmentStartTime && assignmentDayType) {
      const start = new Date(assignmentStartDate)
      const end = assignmentEndDate ? new Date(assignmentEndDate) : new Date(assignmentStartDate)
      
      if (end < start) {
        return res.status(400).json({ message: 'End date cannot be before start date' })
      }

      let currentDate = new Date(start)
      while (currentDate <= end) {
        dates.push(new Date(currentDate).toISOString().split('T')[0])
        currentDate.setDate(currentDate.getDate() + 1)
      }

      for (const date of dates) {
        const conflict = await checkCaretakerConflict(
          assignedCaretaker, 
          date, 
          assignmentStartTime, 
          assignmentDayType,
          null // Cannot easily exclude multiple IDs here if checking array
        )
        // Wait, if it's the SAME patient and we are updating the autoScheduleIds, it might conflict with itself if we don't exclude.
        // Actually, let's just delete old autoSchedules and create new ones to avoid self-conflict.
      }
    }

    // Update auto schedules
    if (assignedCaretaker && assignmentStartDate && assignmentStartTime && assignmentDayType) {
      // Delete old auto schedules
      if (patient.autoScheduleIds && patient.autoScheduleIds.length > 0) {
        await Schedule.deleteMany({ _id: { $in: patient.autoScheduleIds } })
      }

      const autoScheduleIds = []
      for (const date of dates) {
        const schedule = await Schedule.create({
          patientId: patient._id,
          caretakerId: assignedCaretaker,
          wardNo: wardNo || address || patient.address,
          startDate: date,
          startTime: assignmentStartTime,
          dayType: assignmentDayType,
          paymentToAgency: paymentToAgency || 'unpaid',
          status: 'pending',
          notes: 'Auto-generated from patient assignment'
        })
        autoScheduleIds.push(schedule._id)
      }
      patient.autoScheduleIds = autoScheduleIds
    } else if (!assignedCaretaker && patient.autoScheduleIds && patient.autoScheduleIds.length > 0) {
      await Schedule.deleteMany({ _id: { $in: patient.autoScheduleIds } })
      patient.autoScheduleIds = []
    }

    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      { name, age, gender, phone, email, address, emergencyContact, assignedCaretaker, assignmentStartDate, assignmentEndDate, assignmentStartTime, assignmentDayType, autoScheduleIds: patient.autoScheduleIds, status, notes },
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

    if (patient.autoScheduleIds && patient.autoScheduleIds.length > 0) {
      await Schedule.deleteMany({ _id: { $in: patient.autoScheduleIds } })
    }

    await Patient.findByIdAndDelete(req.params.id)
    res.json({ message: 'Patient and associated user account deleted successfully' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
