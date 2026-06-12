import { Router } from 'express'
import Schedule from '../models/Schedule.js'
import User from '../models/User.js'
import Patient from '../models/Patient.js'
import Caretaker from '../models/Caretaker.js'
import Settings from '../models/Settings.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// Helper to calculate end date/time
function getEndDateTime(startDate, startTime, dayType) {
  const start = new Date(`${startDate.split('T')[0]}T${startTime}:00`)
  const hoursToAdd = dayType === 'full' ? 24 : 12
  const end = new Date(start.getTime() + hoursToAdd * 60 * 60 * 1000)
  return end
}

// Helper: Check if a caretaker has a conflicting schedule
async function checkCaretakerConflict(caretakerId, startDate, startTime, dayType, excludeScheduleId = null) {
  const newStart = new Date(`${startDate.split('T')[0]}T${startTime}:00`)
  const newEnd = getEndDateTime(startDate, startTime, dayType)

  const query = {
    caretakerId,
    status: { $ne: 'cancelled' }
  }

  if (excludeScheduleId) {
    query._id = { $ne: excludeScheduleId }
  }

  const existingSchedules = await Schedule.find(query).populate('patientId', 'name')
  
  for (const existing of existingSchedules) {
    const existingStart = new Date(`${new Date(existing.startDate).toISOString().split('T')[0]}T${existing.startTime}:00`)
    const existingEnd = getEndDateTime(existing.startDate.toISOString(), existing.startTime, existing.dayType)
    
    // Check overlap
    if (newStart < existingEnd && newEnd > existingStart) {
      return {
        conflict: true,
        message: `This caretaker is already assigned to "${existing.patientId?.name || 'a patient'}" from ${existingStart.toLocaleString()} to ${existingEnd.toLocaleString()}. Time conflict detected.`
      }
    }
  }

  return null
}

// Get all schedules
router.get('/', requireAuth(['admin']), async (req, res) => {
  try {
    const schedules = await Schedule.find()
      .populate('patientId', 'patientId name phone address')
      .populate('caretakerId', 'caretakerId name phone')
      .sort({ startDate: 1, startTime: 1 })
    res.json(schedules)
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Server error' })
  }
})

// Create schedule(s) for a date range
router.post('/', requireAuth(['admin']), async (req, res) => {
  try {
    const { patientId, caretakerId, startDate, endDate, startTime, dayType, wardNo, paymentToAgency, status, notes } = req.body
    
    if (!patientId || !caretakerId || !startDate || !startTime || !dayType) {
      return res.status(400).json({ message: 'Patient, Caretaker, Start Date, Start Time, and Day Type are required' })
    }

    const start = new Date(startDate)
    const end = endDate ? new Date(endDate) : new Date(startDate)
    
    // Validate dates
    if (end < start) {
      return res.status(400).json({ message: 'End date cannot be before start date' })
    }

    // Generate array of dates
    const dates = []
    let currentDate = new Date(start)
    while (currentDate <= end) {
      dates.push(new Date(currentDate).toISOString().split('T')[0])
      currentDate.setDate(currentDate.getDate() + 1)
    }

    // Check conflicts for all dates first
    for (const date of dates) {
      const conflict = await checkCaretakerConflict(caretakerId, date, startTime, dayType)
      if (conflict) {
        return res.status(409).json({ message: `Conflict on ${date}: ${conflict.message}` })
      }
    }

    // Fetch current rates
    const fullDayRate = await Settings.getValue('fullDayRate', 2800)
    const halfDayRate = await Settings.getValue('halfDayRate', 1400)
    const dailyRate = dayType === 'full' ? fullDayRate : halfDayRate

    // Create schedules
    const createdSchedules = []
    for (const date of dates) {
      const schedule = await Schedule.create({
        patientId,
        caretakerId,
        wardNo,
        startDate: date,
        startTime,
        dayType,
        dailyRate,
        paymentToAgency: paymentToAgency || 'unpaid',
        status: status || 'pending',
        notes
      })
      createdSchedules.push(schedule)
    }

    // Return the first created schedule populated (or array depending on frontend expectation)
    // Since frontend mostly expects a single object for immediate update, we return the first one.
    // However, they will fetch all schedules anyway.
    const populated = await Schedule.findById(createdSchedules[0]._id)
      .populate('patientId', 'patientId name phone address')
      .populate('caretakerId', 'caretakerId name phone')
    
    res.status(201).json(populated)
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Server error' })
  }
})

// Update schedule
router.put('/:id', requireAuth(['admin']), async (req, res) => {
  try {
    const { 
      patientId, caretakerId, startDate, startTime, dayType, 
      status, paymentToAgency, paymentToCaretaker, 
      jobCompletedByPatient, jobCompletedByAdmin, adminNote, notes 
    } = req.body
    
    const existingSchedule = await Schedule.findById(req.params.id)
    if (!existingSchedule) return res.status(404).json({ message: 'Schedule not found' })

    // Allow partial updates by falling back to existing values
    const safePatientId = patientId || existingSchedule.patientId
    const safeCaretakerId = caretakerId || existingSchedule.caretakerId
    const safeStartDate = startDate || existingSchedule.startDate
    const safeStartTime = startTime || existingSchedule.startTime
    const safeDayType = dayType || existingSchedule.dayType

    // If schedule is not pending, block edits to core details
    const isCoreEdit = existingSchedule.caretakerId.toString() !== safeCaretakerId.toString() ||
                       new Date(existingSchedule.startDate).toISOString().split('T')[0] !== new Date(safeStartDate).toISOString().split('T')[0] ||
                       existingSchedule.startTime !== safeStartTime ||
                       existingSchedule.dayType !== safeDayType

    if (existingSchedule.status !== 'pending' && isCoreEdit) {
      return res.status(400).json({ message: 'Cannot edit core details of a schedule that has already started or completed.' })
    }

    if (isCoreEdit) {
      const conflict = await checkCaretakerConflict(safeCaretakerId, safeStartDate, safeStartTime, safeDayType, req.params.id)
      if (conflict) {
        return res.status(409).json({ message: conflict.message })
      }
    }

    // Auto-complete logic
    let newStatus = status || existingSchedule.status
    let newPaymentToAgency = paymentToAgency || existingSchedule.paymentToAgency
    let newPaymentToCaretaker = paymentToCaretaker || existingSchedule.paymentToCaretaker

    if ((jobCompletedByPatient || jobCompletedByAdmin || existingSchedule.jobCompletedByPatient || existingSchedule.jobCompletedByAdmin) && newPaymentToAgency === 'paid' && newPaymentToCaretaker === 'success') {
      newStatus = 'completed'
    }

    let dailyRate = existingSchedule.dailyRate
    if (isCoreEdit || !dailyRate) {
      const fullDayRate = await Settings.getValue('fullDayRate', 2800)
      const halfDayRate = await Settings.getValue('halfDayRate', 1400)
      dailyRate = safeDayType === 'full' ? fullDayRate : halfDayRate
    }

    const schedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      { 
        patientId: safePatientId, 
        caretakerId: safeCaretakerId, 
        startDate: safeStartDate, 
        startTime: safeStartTime, 
        dayType: safeDayType, 
        dailyRate,
        status: newStatus, 
        paymentToAgency: newPaymentToAgency, 
        paymentToCaretaker: newPaymentToCaretaker, 
        jobCompletedByPatient: jobCompletedByPatient !== undefined ? jobCompletedByPatient : existingSchedule.jobCompletedByPatient, 
        jobCompletedByAdmin: jobCompletedByAdmin !== undefined ? jobCompletedByAdmin : existingSchedule.jobCompletedByAdmin, 
        adminNote: adminNote !== undefined ? adminNote : existingSchedule.adminNote, 
        notes: notes !== undefined ? notes : existingSchedule.notes 
      },
      { new: true, runValidators: true }
    ).populate('patientId', 'patientId name phone address').populate('caretakerId', 'caretakerId name phone')

    res.json(schedule)
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Server error' })
  }
})

// Delete schedule
router.delete('/:id', requireAuth(['admin']), async (req, res) => {
  try {
    const existingSchedule = await Schedule.findById(req.params.id)
    if (!existingSchedule) return res.status(404).json({ message: 'Schedule not found' })

    if (existingSchedule.status === 'start' || existingSchedule.status === 'completed') {
      return res.status(400).json({ message: 'Cannot delete a schedule that has started or completed' })
    }

    await Schedule.findByIdAndDelete(req.params.id)
    res.json({ message: 'Schedule deleted successfully' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Server error' })
  }
})

export { checkCaretakerConflict }
export default router
