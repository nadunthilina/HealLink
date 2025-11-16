import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import Booking from '../models/Booking.js'
import Notification from '../models/Notification.js'
import User from '../models/User.js'

const router = Router()

// Get patient dashboard statistics and overview
router.get('/patient', requireAuth(['patient']), async (req, res) => {
  try {
    const patientId = req.user.sub

    // Count active services (confirmed or in-progress bookings)
    const activeServices = await Booking.countDocuments({
      patient: patientId,
      status: { $in: ['confirmed', 'in-progress'] }
    })

    // Count upcoming bookings (pending bookings with future dates)
    const now = new Date()
    const upcomingBookings = await Booking.countDocuments({
      patient: patientId,
      status: 'pending',
      preferredDate: { $gte: now }
    })

    // Count unread notifications
    const unreadNotifications = await Notification.countDocuments({
      user: patientId,
      isRead: false
    })

    // Get recent bookings
    const recentBookings = await Booking.find({ patient: patientId })
      .populate('caretaker', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(5)

    // Get recent notifications
    const recentNotifications = await Notification.find({ user: patientId })
      .sort({ createdAt: -1 })
      .limit(5)

    // Get user details
    const user = await User.findById(patientId).select('name email phone')

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone
      },
      statistics: {
        activeServices,
        upcomingBookings,
        notifications: unreadNotifications
      },
      recentBookings,
      recentNotifications
    })
  } catch (error) {
    console.error('Dashboard error:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Get caretaker dashboard statistics
router.get('/caretaker', requireAuth(['caretaker']), async (req, res) => {
  try {
    const caretakerId = req.user.sub

    const pendingRequests = await Booking.countDocuments({
      caretaker: caretakerId,
      status: 'pending'
    })

    const activeBookings = await Booking.countDocuments({
      caretaker: caretakerId,
      status: { $in: ['confirmed', 'in-progress'] }
    })

    const completedBookings = await Booking.countDocuments({
      caretaker: caretakerId,
      status: 'completed'
    })

    const unreadNotifications = await Notification.countDocuments({
      user: caretakerId,
      isRead: false
    })

    const recentBookings = await Booking.find({ caretaker: caretakerId })
      .populate('patient', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(5)

    const user = await User.findById(caretakerId).select('name email phone')

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone
      },
      statistics: {
        pendingRequests,
        activeBookings,
        completedBookings,
        notifications: unreadNotifications
      },
      recentBookings
    })
  } catch (error) {
    console.error('Caretaker dashboard error:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

export default router
