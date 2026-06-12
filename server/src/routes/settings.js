import { Router } from 'express'
import Settings from '../models/Settings.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// Get all settings (admin only)
router.get('/', requireAuth(['admin']), async (req, res) => {
  try {
    const settings = await Settings.find()
    const obj = {}
    settings.forEach(s => { obj[s.key] = s.value })

    // Return with defaults if not yet set
    res.json({
      fullDayRate: obj.fullDayRate ?? 2800,
      halfDayRate: obj.halfDayRate ?? 1400
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get payment rates (public for profile pages)
router.get('/rates', async (req, res) => {
  try {
    const fullDayRate = await Settings.getValue('fullDayRate', 2800)
    const halfDayRate = await Settings.getValue('halfDayRate', 1400)
    res.json({ fullDayRate, halfDayRate })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Server error' })
  }
})

// Update settings (admin only)
router.put('/', requireAuth(['admin']), async (req, res) => {
  try {
    const { fullDayRate, halfDayRate } = req.body

    if (fullDayRate !== undefined) {
      await Settings.setValue('fullDayRate', Number(fullDayRate))
    }
    if (halfDayRate !== undefined) {
      await Settings.setValue('halfDayRate', Number(halfDayRate))
    }

    const settings = await Settings.find()
    const obj = {}
    settings.forEach(s => { obj[s.key] = s.value })

    res.json({
      fullDayRate: obj.fullDayRate ?? 2800,
      halfDayRate: obj.halfDayRate ?? 1400
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
