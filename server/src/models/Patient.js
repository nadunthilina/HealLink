import mongoose from 'mongoose'

const patientSchema = new mongoose.Schema(
  {
    patientId: { type: String, unique: true }, // Format: PAT-00000001
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['male', 'female'], required: true },
    phone: { type: String, required: true },
    email: { type: String },
    address: { type: String },
    emergencyContact: {
      name: { type: String },
      phone: { type: String },
      relation: { type: String }
    },
    assignedCaretaker: { type: mongoose.Schema.Types.ObjectId, ref: 'Caretaker' },
    assignmentStartDate: { type: Date },
    assignmentEndDate: { type: Date },
    assignmentStartTime: { type: String },
    assignmentDayType: { type: String, enum: ['full', 'half'] },
    autoScheduleIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Schedule' }],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Link to User account if they have one
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    notes: { type: String }
  },
  { timestamps: true }
)

export default mongoose.model('Patient', patientSchema)
