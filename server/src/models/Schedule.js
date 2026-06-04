import mongoose from 'mongoose'

const scheduleSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    caretakerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Caretaker', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    startTime: { type: String }, 
    endTime: { type: String }, 
    isFullDay: { type: Boolean, default: false },
    status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
    notes: { type: String }
  },
  { timestamps: true }
)

export default mongoose.model('Schedule', scheduleSchema)
