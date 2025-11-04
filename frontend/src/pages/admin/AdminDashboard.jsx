import { useState, useEffect } from 'react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalCaretakers: 0,
    totalPatients: 0,
    todaySchedules: 0,
    pendingRequests: 0
  })

  useEffect(() => {
    // Fetch stats from API
    // For now, using placeholder data
    setStats({
      totalCaretakers: 48,
      totalPatients: 124,
      todaySchedules: 32,
      pendingRequests: 15
    })
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-5 rounded-lg shadow-sm">
        <h3 className="text-gray-500 text-sm mb-2">Total Caretakers</h3>
        <div className="text-3xl font-bold text-blue-900">{stats.totalCaretakers}</div>
      </div>
      <div className="bg-white p-5 rounded-lg shadow-sm">
        <h3 className="text-gray-500 text-sm mb-2">Total Patients</h3>
        <div className="text-3xl font-bold text-blue-900">{stats.totalPatients}</div>
      </div>
      <div className="bg-white p-5 rounded-lg shadow-sm">
        <h3 className="text-gray-500 text-sm mb-2">Today's Schedules</h3>
        <div className="text-3xl font-bold text-blue-900">{stats.todaySchedules}</div>
      </div>
      <div className="bg-white p-5 rounded-lg shadow-sm">
        <h3 className="text-gray-500 text-sm mb-2">Pending Requests</h3>
        <div className="text-3xl font-bold text-blue-900">{stats.pendingRequests}</div>
      </div>
    </div>
  )
}
