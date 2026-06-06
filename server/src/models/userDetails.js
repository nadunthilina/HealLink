import mongoose from "mongoose";

const userDetailsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String },

    specialization: { type: String },
    experience: { type: String },
    license: { type: String },

    emergencyContact: { type: String },

    availability: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const UserDetails = mongoose.model("UserDetails", userDetailsSchema);

export default UserDetails;