import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'

export default function AdminLayout() {
  const navigate = useNavigate()
  const [pageTitle, setPageTitle] = useState('Dashboard')

  const navItems = [
    { path: '/admin', label: 'Dashboard', exact: true },
    { path: '/admin/caretakers', label: 'Caretakers' },
    { path: '/admin/patients', label: 'Patients' },
    { path: '/admin/users', label: 'Users' }
  ]

  const handleLogout = () => {
    // Clear stored data
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    
    // Redirect to login page
    navigate('/login')
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 w-52 h-screen bg-blue-900 text-white p-5 flex flex-col">
        <div className="text-2xl font-bold mb-8">HealLink</div>
        <nav className="flex-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              onClick={() => setPageTitle(item.label)}
              className={({ isActive }) =>
                `block py-2.5 px-4 my-1 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors ${
                  isActive ? 'bg-blue-500' : ''
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full py-2.5 px-4 mt-4 bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Logout</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-52">
        {/* Header */}
        <div className="bg-white shadow-sm p-4 mb-5">
          <h1 className="text-2xl font-semibold text-blue-900">{pageTitle}</h1>
        </div>

        {/* Page Content */}
        <div className="p-5">
          <Outlet context={{ setPageTitle }} />
        </div>
      </div>
    </div>
  )
}
