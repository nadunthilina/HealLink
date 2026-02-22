import React, { useState, useEffect } from 'react'
import { usersAPI } from '../../services/api'

export default function ScheduleManagement() {
  const [schedules, setSchedules] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState(null)
  const [caretakers, setCaretakers] = useState([])
  const [patients, setPatients] = useState([])
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    notes: '',
    caretakerId: '',
    patientId: ''
  })

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await usersAPI.getAll()
        // only include caretakers with active status
        setCaretakers(data.filter(u => u.role === 'caretaker' && u.status === 'active'))
        setPatients(data.filter(u => u.role === 'patient'))
      } catch (err) {
        console.error('Failed to load users for schedule dropdowns', err)
      }
    }
    fetchUsers()
  }, [])

  const handleOpenModal = (schedule = null) => {
    if (schedule) {
      setFormData({
        date: schedule.date || '',
        startTime: schedule.startTime || '',
        endTime: schedule.endTime || '',
        notes: schedule.notes || '',
        caretakerId: schedule.caretakerId || '',
        patientId: schedule.patientId || ''
      })
      setEditingSchedule(schedule.id)
    } else {
      setFormData({
        date: '',
        startTime: '',
        endTime: '',
        notes: '',
        caretakerId: '',
        patientId: ''
      })
      setEditingSchedule(null)
    }
    setIsModalOpen(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingSchedule) {
      setSchedules(prev =>
        prev.map(s => (s.id === editingSchedule ? { ...s, ...formData } : s))
      )
      setEditingSchedule(null)
    } else {
      setSchedules(prev => [...prev, { ...formData, id: Date.now().toString() }])
    }
    setIsModalOpen(false)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center p-5 border-b">
        <h2 className="text-xl font-semibold">Schedule Management</h2>
        <button
          onClick={handleOpenModal}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Schedule
        </button>
      </div>

      <div className="p-5">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-gray-700 font-medium">Caretaker</th>
                <th className="px-4 py-3 text-left text-gray-700 font-medium">Patient</th>
                <th className="px-4 py-3 text-left text-gray-700 font-medium">Date</th>
                <th className="px-4 py-3 text-left text-gray-700 font-medium">Start</th>
                <th className="px-4 py-3 text-left text-gray-700 font-medium">End</th>
                <th className="px-4 py-3 text-left text-gray-700 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {schedules.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-4 py-12 text-center">
                    <svg className="w-16 h-16 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-500 text-lg">No schedules found</p>
                    <p className="text-gray-400 text-sm mt-1">Click "Create Schedule" to add one</p>
                  </td>
                </tr>
              )}

              {schedules.map(s => (
                <tr key={s.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {caretakers.find(c => c._id === s.caretakerId)?.name || '—'}
                  </td>
                  <td className="px-4 py-3">
                    {patients.find(p => p._id === s.patientId)?.name || '—'}
                  </td>
                  <td className="px-4 py-3">{s.date || '—'}</td>
                  <td className="px-4 py-3">{s.startTime || '—'}</td>
                  <td className="px-4 py-3">{s.endTime || '—'}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      onClick={() => handleOpenModal(s)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => setSchedules(prev => prev.filter(x => x.id !== s.id))}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{editingSchedule ? 'Edit Schedule' : 'Create Schedule'}</h3>
              <button
                onClick={() => { setIsModalOpen(false); setEditingSchedule(null) }}
                className="text-2xl leading-none hover:text-gray-700"
              >&times;</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Select Caretaker</label>
                <select
                  value={formData.caretakerId}
                  onChange={(e) => setFormData({ ...formData, caretakerId: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="">Select caretaker</option>
                  {caretakers.map(c => (
                    <option key={c._id} value={c._id}>{c.name} ({c.email})</option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Select Patient</label>
                <select
                  value={formData.patientId}
                  onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="">Select patient</option>
                  {patients.map(p => (
                    <option key={p._id} value={p._id}>{p.name} ({p.email})</option>
                  ))}
                </select>
              </div>

              <div className="mb-4 grid grid-cols-3 gap-2">
                <div className="col-span-1">
                  <label className="block text-gray-700 mb-1 text-sm">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 text-sm">Start</label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 text-sm">End</label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                  rows="3"
                />
              </div>

              <div className="flex gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400">Cancel</button>
                <button type="submit" className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
