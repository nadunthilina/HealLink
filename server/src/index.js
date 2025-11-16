import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import bookingRoutes from './routes/bookings.js'
import dashboardRoutes from './routes/dashboard.js'
import notificationRoutes from './routes/notifications.js'
import User from './models/User.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(helmet())
app.use(express.json())
app.use(morgan('dev'))

app.get('/health', (_req, res) => res.json({ ok: true, ts: Date.now() }))

app.get('/health/db', (_req, res) => {
  const state = mongoose.connection.readyState // 0=disconnected,1=connected,2=connecting,3=disconnecting
  const info = mongoose.connection?.client?.s?.options || {}
  res.json({
    ok: state === 1,
    state,
    host: info?.srvHost || info?.hosts || undefined,
    dbName: mongoose.connection.name,
    ts: Date.now(),
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/notifications', notificationRoutes)

const PORT = process.env.PORT || 4000
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/heallink'

// Helpful connection event logs
mongoose.connection.on('connected', () => {
  const srvHost = mongoose.connection?.client?.s?.options?.srvHost
  const host = srvHost || mongoose.connection.host
  console.log(`MongoDB connected: ${host}/${mongoose.connection.name}`)
})
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err?.message || err)
})
mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected')
})

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    // Seed admin if not exists
    try {
      const adminExists = await User.findOne({ role: 'admin' })
      if (!adminExists) {
        const bcrypt = (await import('bcryptjs')).default
        const name = process.env.ADMIN_NAME || 'Admin'
        const email = process.env.ADMIN_EMAIL || 'admin@heallink.lk'
        const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!'
        const passwordHash = await bcrypt.hash(password, 10)
        await User.create({ name, email, role: 'admin', passwordHash, status: 'active' })
        console.log(`Seeded default admin: ${email}`)
      }
    } catch (e) {
      console.warn('Admin seed skipped:', e.message)
    }

    app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`))
  })
  .catch((err) => {
    console.error('Mongo connection error', err)
    process.exit(1)
  })
