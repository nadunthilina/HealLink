import mongoose from 'mongoose'

const bookingSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    caretaker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    serviceType: {
      type: String,
      required: true,
      trim: true
    },
    preferredDate: {
      type: Date,
      required: true
    },
    additionalNotes: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
      default: 'pending'
    },
    price: {
      type: Number
    },
    confirmedAt: Date,
    startedAt: Date,
    completedAt: Date,
    cancelledAt: Date,
    cancellationReason: String
  },
  { timestamps: true }
)

// Indexes for better query performance
bookingSchema.index({ patient: 1, status: 1 })
bookingSchema.index({ caretaker: 1, status: 1 })
bookingSchema.index({ preferredDate: 1 })

export default mongoose.model('Booking', bookingSchema)
