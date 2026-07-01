import mongoose from 'mongoose'

const settingsSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, required: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true }
  },
  { timestamps: true }
)

// Static helper to get a setting with a default fallback
settingsSchema.statics.getValue = async function (key, defaultValue) {
  const doc = await this.findOne({ key })
  return doc ? doc.value : defaultValue
}

// Static helper to set a setting
settingsSchema.statics.setValue = async function (key, value) {
  return this.findOneAndUpdate(
    { key },
    { key, value },
    { upsert: true, new: true }
  )
}

export default mongoose.model('Settings', settingsSchema)
