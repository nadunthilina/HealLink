import { useState, useEffect } from 'react'
import { adminAPI, usersAPI, patientsAPI, caretakersAPI } from '../../services/api'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalCaretakers: 0,
    totalPatients: 0,
    totalUsers: 0,
    availableCaretakers: 0,
    recentPatients: 0,
    todaySchedules: 0,
    pendingRequests: 0
  })
  const [recentActivities, setRecentActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }
      
      const [statsRes, usersRes, patientsRes, caretakersRes] = await Promise.all([
        adminAPI.getStats(),
        usersAPI.getAll(),
        patientsAPI.getAll(),
        caretakersAPI.getAll()
      ])
      
      setStats(statsRes.data)
      
      // Build recent activities
      const activities = []
      
      // Recent users
      usersRes.data.slice(0, 3).forEach(user => {
        activities.push({
          type: 'user',
          action: 'New user registered',
          name: user.name,
          role: user.role,
          time: new Date(user.createdAt).toLocaleString()
        })
      })
      
      // Recent patients
      patientsRes.data.slice(0, 3).forEach(patient => {
        activities.push({
          type: 'patient',
          action: 'New patient added',
          name: patient.name,
          time: new Date(patient.createdAt).toLocaleString()
        })
      })
      
      // Recent caretakers
      caretakersRes.data.slice(0, 2).forEach(caretaker => {
        activities.push({
          type: 'caretaker',
          action: 'New caretaker registered',
          name: caretaker.name,
          time: new Date(caretaker.createdAt).toLocaleString()
        })
      })
      
      // Sort by time and limit to 5
      activities.sort((a, b) => new Date(b.time) - new Date(a.time))
      setRecentActivities(activities.slice(0, 5))
      
      setError('')
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    fetchDashboardData(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div>
      {/* Header with Refresh */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Overview</h2>
          <p className="text-sm text-gray-500 mt-1">Key metrics and recent activities</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center justify-center sm:justify-start w-full sm:w-auto space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
        >
          <svg 
            className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm mb-2">Total Users</h3>
              <div className="text-3xl font-bold text-blue-900">{stats.totalUsers}</div>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm mb-2">Total Caretakers</h3>
              <div className="text-3xl font-bold text-blue-900">{stats.totalCaretakers}</div>
              <p className="text-xs text-green-600 mt-1">{stats.availableCaretakers} available</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm mb-2">Total Patients</h3>
              <div className="text-3xl font-bold text-blue-900">{stats.totalPatients}</div>
              <p className="text-xs text-blue-600 mt-1">{stats.recentPatients} this week</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm mb-2">Today's Schedules</h3>
              <div className="text-3xl font-bold text-blue-900">{stats.todaySchedules}</div>
              <p className="text-xs text-orange-600 mt-1">{stats.pendingRequests} pending</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/caretakers"
            className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <div className="bg-blue-100 p-2 rounded-lg mr-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900">Add Caretaker</p>
              <p className="text-xs text-gray-500">Register new caretaker</p>
            </div>
          </a>

          <a
            href="/admin/patients"
            className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
          >
            <div className="bg-purple-100 p-2 rounded-lg mr-3">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900">Add Patient</p>
              <p className="text-xs text-gray-500">Register new patient</p>
            </div>
          </a>

          <a
            href="/admin/users"
            className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
          >
            <div className="bg-green-100 p-2 rounded-lg mr-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900">Manage Users</p>
              <p className="text-xs text-gray-500">View all system users</p>
            </div>
          </a>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <h3 className="text-lg font-semibold">Recent Activities</h3>
          <span className="text-xs text-gray-500">{recentActivities.length} recent activities</span>
        </div>
        
        {recentActivities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p>No recent activities</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`p-2 rounded-full ${
                  activity.type === 'user' ? 'bg-blue-100' :
                  activity.type === 'patient' ? 'bg-purple-100' :
                  'bg-green-100'
                }`}>
                  <svg className={`w-5 h-5 ${
                    activity.type === 'user' ? 'text-blue-600' :
                    activity.type === 'patient' ? 'text-purple-600' :
                    'text-green-600'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {activity.type === 'user' && (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    )}
                    {activity.type === 'patient' && (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    )}
                    {activity.type === 'caretaker' && (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    )}
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">{activity.name}</span>
                    {activity.role && <span className="text-gray-400 ml-2 capitalize">• {activity.role}</span>}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
