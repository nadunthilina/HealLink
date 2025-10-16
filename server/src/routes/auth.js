import { Router } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me'
const JWT_EXPIRES_IN = '15m'
const REFRESH_EXPIRES_IN = '7d'

function signTokens(user) {
  const payload = { sub: user._id.toString(), role: user.role, name: user.name }
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
  const refreshToken = jwt.sign({ sub: payload.sub }, JWT_SECRET, { expiresIn: REFRESH_EXPIRES_IN })
  return { accessToken, refreshToken }
}

router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body
    if (!name || !email || !password || !role) return res.status(400).json({ message: 'Missing fields' })

    const exists = await User.findOne({ email })
    if (exists) return res.status(409).json({ message: 'Email already in use' })

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, phone, passwordHash, role })
    const tokens = signTokens(user)

    res.status(201).json({ user: { id: user._id, name, email, role }, ...tokens })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Server error' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ message: 'Invalid credentials' })

    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' })

    const tokens = signTokens(user)
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, ...tokens })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Server error' })
  }
})

router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body
  if (!refreshToken) return res.status(400).json({ message: 'Missing refreshToken' })
  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET)
    const user = await User.findById(decoded.sub)
    if (!user) return res.status(401).json({ message: 'Invalid token' })
    const tokens = signTokens(user)
    res.json(tokens)
  } catch (e) {
    res.status(401).json({ message: 'Invalid token' })
  }
})

export default router
