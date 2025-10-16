import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me'

export function requireAuth(roles = []) {
  return (req, res, next) => {
    const auth = req.headers.authorization || ''
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null
    if (!token) return res.status(401).json({ message: 'Missing token' })
    try {
      const decoded = jwt.verify(token, JWT_SECRET)
      req.user = decoded
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Forbidden' })
      }
      next()
    } catch (e) {
      return res.status(401).json({ message: 'Invalid token' })
    }
  }
}
