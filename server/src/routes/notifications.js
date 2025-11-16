import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import Notification from '../models/Notification.js'

const router = Router()

// Get all notifications for current user
router.get('/', requireAuth(['patient', 'caretaker', 'admin']), async (req, res) => {
  try {
    const { isRead, limit = 20, page = 1 } = req.query
    const query = { user: req.user.sub }

    // Filter by read status if provided
    if (isRead !== undefined) {
      query.isRead = isRead === 'true'
    }

    const notifications = await Notification.find(query)
      .populate('relatedBooking')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))

    const total = await Notification.countDocuments(query)
    const unreadCount = await Notification.countDocuments({ 
      user: req.user.sub, 
      isRead: false 
    })

    res.json({
      notifications,
      unreadCount,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    })
  } catch (error) {
    console.error('Get notifications error:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Mark notification as read
router.patch('/:id/read', requireAuth(['patient', 'caretaker', 'admin']), async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id)

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' })
    }

    // Check if notification belongs to user
    if (notification.user.toString() !== req.user.sub) {
      return res.status(403).json({ message: 'Forbidden' })
    }

    notification.isRead = true
    notification.readAt = new Date()
    await notification.save()

    res.json({ message: 'Notification marked as read', notification })
  } catch (error) {
    console.error('Mark notification read error:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Mark all notifications as read
router.patch('/read-all', requireAuth(['patient', 'caretaker', 'admin']), async (req, res) => {
  try {
    const result = await Notification.updateMany(
      { user: req.user.sub, isRead: false },
      { isRead: true, readAt: new Date() }
    )

    res.json({ 
      message: 'All notifications marked as read', 
      count: result.modifiedCount 
    })
  } catch (error) {
    console.error('Mark all notifications read error:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

export default router
