import express from 'express'
import axios from 'axios'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import userDetailsRoutes from "./routes/userDetails.js";



dotenv.config()


const app = express()

app.use(cors())
app.use(helmet())
app.use(express.json())
app.use(morgan('dev'))



app.get('/health', (_req, res) => res.json({ ok: true, ts: Date.now() }))

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use("/api/userDetails", userDetailsRoutes)

const PORT = process.env.PORT || 4000
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/heallink'

mongoose.connect(MONGO_URI)
  .then(() => {
       console.log('✅ MongoDB connected successfully')
    app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`))
  })
  .catch((err) => {
    console.error('Mongo connection error', err)
    process.exit(1)
  })
