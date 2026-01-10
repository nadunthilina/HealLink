import mongoose from 'mongoose'

const caretakerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    skills: { type: String }, // e.g., "Elderly Care, Physical Therapy"
    experience: { type: String }, // Years of experience or description
    certifications: [{ type: String }],
    availability: { type: String, enum: ['available', 'busy', 'off-duty'], default: 'available' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Link to User account
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    rating: { type: Number, default: 0 }, // Average rating
    assignedPatients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }]
  },
  { timestamps: true }
)

export default mongoose.model('Caretaker', caretakerSchema)
