import { useState, useEffect } from 'react'
import { authAPI } from '../services/api'
import Swal from 'sweetalert2'

export default function SudoGuard({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkSudo()
  }, [])

  const checkSudo = async () => {
    // Check if sudo is active and not expired in sessionStorage
    const sudoExpiry = sessionStorage.getItem('sudoExpiry')
    if (sudoExpiry && Date.now() < parseInt(sudoExpiry)) {
      setIsAuthenticated(true)
      setLoading(false)
      return
    }

    // Otherwise, prompt for password
    promptSudo()
  }

  const promptSudo = async () => {
    setLoading(false)
    const { value: password } = await Swal.fire({
      title: 'Security Check',
      text: 'Please enter your password to access this sensitive area.',
      input: 'password',
      inputPlaceholder: 'Enter your password',
      inputAttributes: {
        autocapitalize: 'off',
        autocorrect: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Verify',
      confirmButtonColor: '#3b82f6',
      allowOutsideClick: false,
      allowEscapeKey: false
    })

    if (password) {
      try {
        setLoading(true)
        await authAPI.verifyPassword(password)
        
        // Save sudo state for 15 minutes
        const expiry = Date.now() + 15 * 60 * 1000
        sessionStorage.setItem('sudoExpiry', expiry.toString())
        
        Swal.fire({
          icon: 'success',
          title: 'Access Granted',
          timer: 1000,
          showConfirmButton: false
        })
        
        setIsAuthenticated(true)
      } catch (error) {
        setLoading(false)
        await Swal.fire({
          icon: 'error',
          title: 'Authentication Failed',
          text: error.response?.data?.message || 'Incorrect password'
        })
        // Redirect back or just prompt again
        window.history.back()
      }
    } else {
      // User cancelled
      window.history.back()
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // They either cancelled or failed, waiting to go back
  }

  return children
}
