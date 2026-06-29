import { Router } from 'express'
import Schedule from '../models/Schedule.js'
import User from '../models/User.js'
import Patient from '../models/Patient.js'
import Caretaker from '../models/Caretaker.js'
import Settings from '../models/Settings.js'
import { requireAuth } from '../middleware/auth.js'
import { getAssignedPatients, updateScheduleStatus } from '../controllers/scheduleController.js'
import { createNotification } from '../utils/notificationHelper.js' // Notification helper එක import කළා

const router = Router()

// Get patients assigned to a specific caretaker (by User._id)
router.get('/assigned-patients/:caretakerId', requireAuth(['caretaker', 'admin']), getAssignedPatients)
router.patch("/:scheduleId/status", updateScheduleStatus);

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
        const existingStart = new Date(new Date(existing.startDate).toISOString().split('T')[0] + 'T' + existing.startTime + ':00')
        const existingEnd = getEndDateTime(existing.startDate.toISOString(), existing.startTime, existing.dayType)
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
router.get('/my', requireAuth(['patient']), async (req, res) => {
    try {
        const patient = await Patient.findOne({ userId: req.user.sub }).select('_id')
        if (!patient) {
            return res.status(404).json({ message: 'Patient profile not found' })
        }
        const schedules = await Schedule.find({ patientId: patient._id })
            .populate('patientId', 'patientId name phone address gender')
            .populate('caretakerId', 'caretakerId name phone gender skills availability')
            .sort({ startDate: 1, startTime: 1 })
        res.json(schedules)
    } catch (e) {
        console.error(e)
        res.status(500).json({ message: 'Server error' })
    }
})

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
router.post('/', requireAuth(['admin', 'patient']), async (req, res) => {
    try {
        const { patientId, caretakerId, startDate, endDate, startTime, dayType, wardNo, paymentToAgency, status, notes } = req.body
        let effectivePatientId = patientId
        if (req.user.role === 'patient') {
            const patient = await Patient.findOne({ userId: req.user.sub }).select('_id')
            if (!patient) {
                return res.status(404).json({ message: 'Patient profile not found' })
            }
            effectivePatientId = patient._id.toString()
        }
        if (!effectivePatientId || !caretakerId || !startDate || !startTime || !dayType) {
            return res.status(400).json({ message: 'Patient, Caretaker, Start Date, Start Time, and Day Type are required' })
        }
        const start = new Date(startDate)
        const end = endDate ? new Date(endDate) : new Date(startDate)
        if (end < start) {
            return res.status(400).json({ message: 'End date cannot be before start date' })
        }
        const dates = []
        let currentDate = new Date(start)
        while (currentDate <= end) {
            dates.push(new Date(currentDate).toISOString().split('T')[0])
            currentDate.setDate(currentDate.getDate() + 1)
        }
        for (const date of dates) {
            const duplicateSchedule = await Schedule.findOne({
                patientId: effectivePatientId,
                caretakerId,
                startDate: new Date(date),
                startTime,
                dayType,
                status: { $ne: 'cancelled' },
            })
            if (duplicateSchedule) {
                return res.status(409).json({
                    message: `A booking already exists for ${date} at ${startTime} with this caretaker.`
                })
            }
            const conflict = await checkCaretakerConflict(caretakerId, date, startTime, dayType)
            if (conflict) {
                return res.status(409).json({ message: `Conflict on ${date}: ${conflict.message}` })
            }
        }
        const fullDayRate = await Settings.getValue('fullDayRate', 2800)
        const halfDayRate = await Settings.getValue('halfDayRate', 1400)
        const dailyRate = dayType === 'full' ? fullDayRate : halfDayRate
        let finalWardNo = wardNo
        if (!finalWardNo) {
            const patient = await Patient.findById(effectivePatientId)
            if (patient && patient.address) {
                finalWardNo = patient.address
            }
        }
        const finalPaymentToAgency = req.user.role === 'patient' ? 'unpaid' : (paymentToAgency || 'unpaid')
        const finalStatus = req.user.role === 'patient' ? 'pending' : (status || 'pending')
        
        const createdSchedules = []
        for (const date of dates) {
            const schedule = await Schedule.create({
                patientId: effectivePatientId,
                caretakerId,
                wardNo: finalWardNo,
                startDate: date,
                startTime,
                dayType,
                dailyRate,
                paymentToAgency: finalPaymentToAgency,
                status: finalStatus,
                notes
            })
            createdSchedules.push(schedule)
        }

        // ==================== NOTIFICATION LOGIC START ====================
        try {
            // Caretaker model එකෙන් userId එක සොයාගැනීම (Notification එක යන්නේ User ID එකට නිසා)
            const caretakerProfile = await Caretaker.findById(caretakerId);
            if (caretakerProfile && caretakerProfile.userId) {
                const recipientId = caretakerProfile.userId;
                const senderId = req.user.sub || req.user._id || req.user.id;

                if (recipientId && senderId) {
                    await createNotification(
                        recipientId,
                        senderId,
                        `You have been assigned a new schedule. Please check your dashboard.`,
                        "SCHEDULE"
                    );
                    console.log("✅ Notification successfully created for caretaker!");
                }
            }
        } catch (notifErr) {
            console.error("❌ Notification error in Route:", notifErr);
        }
        // ==================== NOTIFICATION LOGIC END ====================

        const populated = await Schedule.findById(createdSchedules[0]._id)
            .populate('patientId', 'patientId name phone address')
            .populate('caretakerId', 'caretakerId name phone')
        res.status(201).json(populated)
    } catch (e) {
        console.error(e)
        res.status(500).json({ message: 'Server error' })
    }
})

router.patch('/:id/patient-complete', requireAuth(['patient']), async (req, res) => {
    try {
        const patient = await Patient.findOne({ userId: req.user.sub }).select('_id')
        if (!patient) {
            return res.status(404).json({ message: 'Patient profile not found' })
        }
        const schedule = await Schedule.findById(req.params.id)
        if (!schedule) {
            return res.status(404).json({ message: 'Schedule not found' })
        }
        if (schedule.patientId.toString() !== patient._id.toString()) {
            return res.status(403).json({ message: 'Access denied to this schedule' })
        }
        if (schedule.jobCompletedByPatient) {
            return res.json({ message: 'Schedule already marked complete', schedule })
        }
        schedule.jobCompletedByPatient = true
        if (schedule.jobCompletedByAdmin && schedule.paymentToAgency === 'paid' && schedule.paymentToCaretaker === 'success') {
            schedule.status = 'completed'
        }
        await schedule.save()
        const populated = await Schedule.findById(schedule._id)
            .populate('patientId', 'patientId name phone address')
            .populate('caretakerId', 'caretakerId name phone gender skills availability')
        res.json(populated)
    } catch (e) {
        console.error(e)
        res.status(500).json({ message: 'Server error' })
    }
})

router.put('/:id', requireAuth(['admin']), async (req, res) => {
    try {
        const { 
            patientId, caretakerId, startDate, startTime, dayType, wardNo,
            status, paymentToAgency, paymentToCaretaker, 
            jobCompletedByPatient, jobCompletedByAdmin, adminNote, notes 
        } = req.body
        const existingSchedule = await Schedule.findById(req.params.id)
        if (!existingSchedule) return res.status(404).json({ message: 'Schedule not found' })
        const safePatientId = patientId || existingSchedule.patientId
        const safeCaretakerId = caretakerId || existingSchedule.caretakerId
        const safeStartDate = startDate || existingSchedule.startDate
        const safeStartTime = startTime || existingSchedule.startTime
        const safeDayType = dayType || existingSchedule.dayType
        let safeWardNo = wardNo !== undefined ? wardNo : existingSchedule.wardNo
        if (!safeWardNo) {
            const patient = await Patient.findById(safePatientId)
            if (patient && patient.address) {
                safeWardNo = patient.address
            }
        }
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
                wardNo: safeWardNo,
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