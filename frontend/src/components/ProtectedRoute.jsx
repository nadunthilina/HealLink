import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const token = localStorage.getItem('token')
  const userStr = localStorage.getItem('user')
  
  if (!token || !userStr) {
    // Not logged in, redirect to login
    return <Navigate to="/login" replace />
  }

  try {
    const user = JSON.parse(userStr)
    
    // Check if user has the required role
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      // User doesn't have permission, redirect to login
      return <Navigate to="/login" replace />
    }

    // User is authenticated and authorized
    return children
  } catch (error) {
    // Invalid user data, redirect to login
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    return <Navigate to="/login" replace />
  }
}
