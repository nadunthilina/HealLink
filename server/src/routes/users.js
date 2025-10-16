import { Router } from 'express'
import User from '../models/User.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// Admin list users
router.get('/', requireAuth(['admin']), async (req, res) => {
  const { role } = req.query
  const filter = role ? { role } : {}
  const users = await User.find(filter).select('-passwordHash')
  res.json(users)
})

// Me profile
router.get('/me', requireAuth(), async (req, res) => {
  const user = await User.findById(req.user.sub).select('-passwordHash')
  res.json(user)
})

export default router
