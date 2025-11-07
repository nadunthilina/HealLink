import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    passwordHash: { type: String, required: true }, // ✅ MUST MATCH your DB field
    role: { type: String, enum: ['patient', 'caretaker', 'admin'], required: true },
    status: { type: String, default: 'active' },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);

