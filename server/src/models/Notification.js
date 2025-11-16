import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    type: {
      type: String,
      enum: ['booking', 'system', 'message', 'reminder'],
      required: true
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    relatedBooking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking'
    },
    isRead: {
      type: Boolean,
      default: false
    },
    readAt: Date
  },
  { timestamps: true }
)

// Index for faster queries
notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 })

export default mongoose.model('Notification', notificationSchema)
