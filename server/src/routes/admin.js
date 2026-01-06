import { Router } from 'express'
import User from '../models/User.js'
import Patient from '../models/Patient.js'
import Caretaker from '../models/Caretaker.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// Get dashboard statistics (Admin only)
router.get('/stats', requireAuth(['admin']), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments()
    const totalPatients = await Patient.countDocuments({ status: 'active' })
    const totalCaretakers = await Caretaker.countDocuments({ status: 'active' })
    const availableCaretakers = await Caretaker.countDocuments({ 
      status: 'active', 
      availability: 'available' 
    })

    // Recent activity counts (could be enhanced with actual activity tracking)
    const recentPatients = await Patient.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    })

    res.json({
      totalUsers,
      totalPatients,
      totalCaretakers,
      availableCaretakers,
      recentPatients,
      todaySchedules: 0, // Placeholder for future scheduling feature
      pendingRequests: 0  // Placeholder for future request feature
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
