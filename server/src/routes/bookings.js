import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import Booking from '../models/Booking.js'
import Notification from '../models/Notification.js'
import User from '../models/User.js'

const router = Router()

// Create a new booking (patient only)
router.post('/', requireAuth(['patient']), async (req, res) => {
  try {
    const { serviceType, preferredDate, additionalNotes, caretakerId } = req.body

    if (!serviceType || !preferredDate) {
      return res.status(400).json({ message: 'Service type and preferred date are required' })
    }

    // Validate date is in the future
    const bookingDate = new Date(preferredDate)
    if (bookingDate < new Date()) {
      return res.status(400).json({ message: 'Preferred date must be in the future' })
    }

    // If caretaker specified, validate they exist and are a caretaker
    if (caretakerId) {
      const caretaker = await User.findById(caretakerId)
      if (!caretaker || caretaker.role !== 'caretaker') {
        return res.status(400).json({ message: 'Invalid caretaker selected' })
      }
      if (caretaker.status !== 'active') {
        return res.status(400).json({ message: 'Selected caretaker is not available' })
      }
    }

    const booking = await Booking.create({
      patient: req.user.sub,
      caretaker: caretakerId || null,
      serviceType,
      preferredDate: bookingDate,
      additionalNotes,
      status: 'pending'
    })

    // Populate patient details
    await booking.populate('patient', 'name email phone')
    if (caretakerId) {
      await booking.populate('caretaker', 'name email phone')
    }

    // Create notification for patient
    await Notification.create({
      user: req.user.sub,
      type: 'booking',
      title: 'Booking Created',
      message: `Your booking request for ${serviceType} has been submitted.`,
      relatedBooking: booking._id
    })

    // If caretaker assigned, notify them too
    if (caretakerId) {
      await Notification.create({
        user: caretakerId,
        type: 'booking',
        title: 'New Booking Request',
        message: `You have a new booking request for ${serviceType}.`,
        relatedBooking: booking._id
      })
    }

    res.status(201).json({ message: 'Booking created successfully', booking })
  } catch (error) {
    console.error('Booking creation error:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Get all bookings for current user (patient or caretaker)
router.get('/', requireAuth(['patient', 'caretaker']), async (req, res) => {
  try {
    const { status, limit = 50, page = 1 } = req.query
    const query = {}

    // Filter by user role
    if (req.user.role === 'patient') {
      query.patient = req.user.sub
    } else if (req.user.role === 'caretaker') {
      query.caretaker = req.user.sub
    }

    // Filter by status if provided
    if (status) {
      query.status = status
    }

    const bookings = await Booking.find(query)
      .populate('patient', 'name email phone')
      .populate('caretaker', 'name email phone')
      .sort({ preferredDate: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))

    const total = await Booking.countDocuments(query)

    res.json({
      bookings,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    })
  } catch (error) {
    console.error('Get bookings error:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Get single booking by ID
router.get('/:id', requireAuth(['patient', 'caretaker', 'admin']), async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('patient', 'name email phone')
      .populate('caretaker', 'name email phone')

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    // Check authorization
    if (
      req.user.role !== 'admin' &&
      booking.patient._id.toString() !== req.user.sub &&
      (!booking.caretaker || booking.caretaker._id.toString() !== req.user.sub)
    ) {
      return res.status(403).json({ message: 'Forbidden' })
    }

    res.json({ booking })
  } catch (error) {
    console.error('Get booking error:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Cancel booking (patient only)
router.patch('/:id/cancel', requireAuth(['patient']), async (req, res) => {
  try {
    const { cancellationReason } = req.body
    const booking = await Booking.findById(req.params.id)

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    // Check if patient owns this booking
    if (booking.patient.toString() !== req.user.sub) {
      return res.status(403).json({ message: 'Forbidden' })
    }

    // Can't cancel completed or already cancelled bookings
    if (['completed', 'cancelled'].includes(booking.status)) {
      return res.status(400).json({ message: `Cannot cancel a ${booking.status} booking` })
    }

    booking.status = 'cancelled'
    booking.cancelledAt = new Date()
    booking.cancellationReason = cancellationReason || 'Cancelled by patient'
    await booking.save()

    // Notify caretaker if assigned
    if (booking.caretaker) {
      await Notification.create({
        user: booking.caretaker,
        type: 'booking',
        title: 'Booking Cancelled',
        message: `A booking has been cancelled by the patient.`,
        relatedBooking: booking._id
      })
    }

    res.json({ message: 'Booking cancelled successfully', booking })
  } catch (error) {
    console.error('Cancel booking error:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

export default router
