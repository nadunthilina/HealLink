import mongoose from 'mongoose'

const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    address: { type: String },
    condition: { type: String }, // Medical condition
    emergencyContact: {
      name: { type: String },
      phone: { type: String },
      relation: { type: String }
    },
    assignedCaretaker: { type: mongoose.Schema.Types.ObjectId, ref: 'Caretaker' },
    assignmentStartDate: { type: Date },
    assignmentEndDate: { type: Date },
    assignmentStartTime: { type: String },
    assignmentEndTime: { type: String },
    assignmentIsFullDay: { type: Boolean, default: false },
    autoScheduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Schedule' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Link to User account if they have one
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    notes: { type: String }
  },
  { timestamps: true }
)

export default mongoose.model('Patient', patientSchema)
