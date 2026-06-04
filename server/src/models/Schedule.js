import mongoose from 'mongoose'

const scheduleSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    caretakerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Caretaker', required: true },
    wardNo: { type: String },
    startDate: { type: Date, required: true },
    startTime: { type: String, required: true }, 
    dayType: { type: String, enum: ['full', 'half'], required: true }, // full=24h, half=12h
    status: { type: String, enum: ['pending', 'start', 'completed', 'cancelled'], default: 'pending' },
    dailyRate: { type: Number },
    paymentToAgency: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' },
    paymentToCaretaker: { type: String, enum: ['unpaid', 'success'], default: 'unpaid' },
    jobCompletedByPatient: { type: Boolean, default: false },
    jobCompletedByAdmin: { type: Boolean, default: false },
    adminNote: { type: String },
    notes: { type: String }
  },
  { timestamps: true }
)

export default mongoose.model('Schedule', scheduleSchema)
