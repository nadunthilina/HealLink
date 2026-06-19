import { Router } from 'express'
import User from '../models/User.js'
import Patient from '../models/Patient.js'
import Caretaker from '../models/Caretaker.js'
import Schedule from '../models/Schedule.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// Get dashboard statistics (Admin only)
router.get('/stats', requireAuth(['admin']), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments()
    const totalPatients = await User.countDocuments({ status: 'active', role: 'patient' })
    const totalCaretakers = await User.countDocuments({ status: 'active', role: 'caretaker' })
    const availableCaretakers = await Caretaker.countDocuments({ status: 'active' })

    // Recent activity counts (could be enhanced with actual activity tracking)
    const recentPatients = await Patient.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    })

    // Calculate today's schedules
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date()
    endOfDay.setHours(23, 59, 59, 999)

    const startOfYesterday = new Date()
    startOfYesterday.setDate(startOfYesterday.getDate() - 1)
    startOfYesterday.setHours(0, 0, 0, 0)
    
    const recentSchedules = await Schedule.find({
      startDate: { $gte: startOfYesterday, $lte: endOfDay },
      status: { $ne: 'cancelled' }
    })

    const todaySchedules = recentSchedules.filter(s => {
      const start = new Date(`${new Date(s.startDate).toISOString().split('T')[0]}T${s.startTime}:00`)
      const hoursToAdd = s.dayType === 'full' ? 24 : 12
      const end = new Date(start.getTime() + hoursToAdd * 60 * 60 * 1000)
      return end >= startOfDay && start <= endOfDay
    }).length

    res.json({
      totalUsers,
      totalPatients,
      totalCaretakers,
      availableCaretakers,
      recentPatients,
      todaySchedules,
      pendingRequests: 0  // Placeholder for future request feature
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
