import { Router } from 'express'
import Schedule from '../models/Schedule.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// Helper: Check if a caretaker has a conflicting schedule
async function checkCaretakerConflict(caretakerId, startDate, endDate, startTime, endTime, isFullDay, excludeScheduleId = null) {
  // Find schedules where dates overlap for the same caretaker
  const query = {
    caretakerId,
    status: { $ne: 'cancelled' },
    startDate: { $lte: new Date(endDate) },
    endDate: { $gte: new Date(startDate) }
  }

  // Exclude current schedule when editing
  if (excludeScheduleId) {
    query._id = { $ne: excludeScheduleId }
  }

  const overlapping = await Schedule.find(query)
    .populate('patientId', 'name')

  if (overlapping.length === 0) return null

  // If either the new or existing schedule is full day, any date overlap = conflict
  for (const existing of overlapping) {
    if (isFullDay || existing.isFullDay) {
      return {
        conflict: true,
        message: `This caretaker is already assigned to "${existing.patientId?.name || 'a patient'}" from ${new Date(existing.startDate).toLocaleDateString()} to ${new Date(existing.endDate).toLocaleDateString()} (${existing.isFullDay ? 'Full Day' : existing.startTime + ' – ' + existing.endTime}). Please choose a different caretaker or adjust the dates/times.`
      }
    }

    // Both have specific times - check time overlap
    if (startTime && endTime && existing.startTime && existing.endTime) {
      if (startTime < existing.endTime && endTime > existing.startTime) {
        return {
          conflict: true,
          message: `This caretaker is already assigned to "${existing.patientId?.name || 'a patient'}" from ${new Date(existing.startDate).toLocaleDateString()} to ${new Date(existing.endDate).toLocaleDateString()} (${existing.startTime} – ${existing.endTime}). Time conflict detected. Please choose a different time or caretaker.`
        }
      }
    } else {
      // One side has no time set - treat as full day conflict
      return {
        conflict: true,
        message: `This caretaker is already assigned to "${existing.patientId?.name || 'a patient'}" during the selected date range. Please choose a different caretaker or adjust the dates/times.`
      }
    }
  }

  return null
}

// Get all schedules
router.get('/', requireAuth(['admin']), async (req, res) => {
  try {
    const schedules = await Schedule.find()
      .populate('patientId', 'name phone')
      .populate('caretakerId', 'name phone')
      .sort({ startDate: 1, startTime: 1 })
    res.json(schedules)
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Server error' })
  }
})

// Create schedule
router.post('/', requireAuth(['admin']), async (req, res) => {
  try {
    const { patientId, caretakerId, startDate, endDate, startTime, endTime, isFullDay, status, notes } = req.body
    
    if (!patientId || !caretakerId || !startDate || !endDate) {
      return res.status(400).json({ message: 'Patient, Caretaker, Start Date, and End Date are required' })
    }

    // Check for conflicts
    const conflict = await checkCaretakerConflict(caretakerId, startDate, endDate, startTime, endTime, isFullDay)
    if (conflict) {
      return res.status(409).json({ message: conflict.message })
    }

    const schedule = await Schedule.create({
      patientId,
      caretakerId,
      startDate,
      endDate,
      startTime,
      endTime,
      isFullDay: isFullDay || false,
      status: status || 'pending',
      notes
    })

    const populated = await Schedule.findById(schedule._id)
      .populate('patientId', 'name phone')
      .populate('caretakerId', 'name phone')
    
    res.status(201).json(populated)
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Server error' })
  }
})

// Update schedule
router.put('/:id', requireAuth(['admin']), async (req, res) => {
  try {
    const { patientId, caretakerId, startDate, endDate, startTime, endTime, isFullDay, status, notes } = req.body
    
    // Check for conflicts (excluding this schedule)
    const conflict = await checkCaretakerConflict(caretakerId, startDate, endDate, startTime, endTime, isFullDay, req.params.id)
    if (conflict) {
      return res.status(409).json({ message: conflict.message })
    }

    const schedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      { patientId, caretakerId, startDate, endDate, startTime, endTime, isFullDay, status, notes },
      { new: true, runValidators: true }
    ).populate('patientId', 'name phone').populate('caretakerId', 'name phone')

    if (!schedule) return res.status(404).json({ message: 'Schedule not found' })
    res.json(schedule)
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Server error' })
  }
})

// Delete schedule
router.delete('/:id', requireAuth(['admin']), async (req, res) => {
  try {
    const schedule = await Schedule.findByIdAndDelete(req.params.id)
    if (!schedule) return res.status(404).json({ message: 'Schedule not found' })
    res.json({ message: 'Schedule deleted successfully' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Server error' })
  }
})

// Export the conflict checker so patients.js can use it too
export { checkCaretakerConflict }
export default router
