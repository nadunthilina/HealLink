import { useState, useEffect } from 'react'
import { schedulesAPI, patientsAPI, caretakersAPI } from '../../services/api'
import Swal from 'sweetalert2'

export default function ScheduleManagement() {
  const [schedules, setSchedules] = useState([])
  const [patients, setPatients] = useState([])
  const [caretakers, setCaretakers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState(null)
  
  // Filtering & Pagination State
  const [filterToday, setFilterToday] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  
  const [formData, setFormData] = useState({
    patientId: '',
    caretakerId: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    isFullDay: false,
    status: 'pending',
    notes: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [schedRes, patRes, careRes] = await Promise.all([
        schedulesAPI.getAll(),
        patientsAPI.getAll(),
        caretakersAPI.getAll()
      ])
      setSchedules(schedRes.data)
      setPatients(patRes.data)
      setCaretakers(careRes.data)
      setError('')
    } catch (err) {
      console.error('Error fetching data:', err)
      setError('Failed to load schedules data')
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to load schedules data!',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (schedule = null) => {
    if (schedule) {
      setEditingSchedule(schedule)
      setFormData({
        patientId: schedule.patientId?._id || '',
        caretakerId: schedule.caretakerId?._id || '',
        startDate: new Date(schedule.startDate).toISOString().split('T')[0],
        endDate: new Date(schedule.endDate).toISOString().split('T')[0],
        startTime: schedule.startTime || '',
        endTime: schedule.endTime || '',
        isFullDay: schedule.isFullDay || false,
        status: schedule.status || 'pending',
        notes: schedule.notes || ''
      })
    } else {
      setEditingSchedule(null)
      setFormData({
        patientId: '',
        caretakerId: '',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        isFullDay: false,
        status: 'pending',
        notes: ''
      })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingSchedule) {
        await schedulesAPI.update(editingSchedule._id, formData)
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Schedule updated successfully.',
          timer: 2000,
          showConfirmButton: false
        })
      } else {
        await schedulesAPI.create(formData)
        Swal.fire({
          icon: 'success',
          title: 'Created!',
          text: 'New schedule created successfully.',
          timer: 2000,
          showConfirmButton: false
        })
      }
      await fetchData()
      setIsModalOpen(false)
    } catch (err) {
      console.error('Error saving schedule:', err)
      Swal.fire({
        icon: 'error',
        title: 'Save Failed',
        text: err.response?.data?.message || 'Failed to save schedule'
      })
    }
  }

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    })

    if (result.isConfirmed) {
      try {
        await schedulesAPI.delete(id)
        await fetchData()
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'The schedule has been deleted.',
          timer: 2000,
          showConfirmButton: false
        })
      } catch (err) {
        console.error('Error deleting schedule:', err)
        Swal.fire({
          icon: 'error',
          title: 'Delete Failed',
          text: 'Failed to delete schedule.'
        })
      }
    }
  }

  const isToday = (startDate, endDate) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const start = new Date(startDate)
    start.setHours(0, 0, 0, 0)
    const end = new Date(endDate)
    end.setHours(23, 59, 59, 999)
    return today >= start && today <= end
  }

  // Filter Logic
  let filteredSchedules = schedules

  if (filterToday) {
    filteredSchedules = filteredSchedules.filter(s => isToday(s.startDate, s.endDate))
  }

  if (statusFilter !== 'all') {
    filteredSchedules = filteredSchedules.filter(s => s.status === statusFilter)
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase()
    filteredSchedules = filteredSchedules.filter(s => 
      (s.patientId?.name || '').toLowerCase().includes(q) ||
      (s.caretakerId?.name || '').toLowerCase().includes(q) ||
      (s.notes || '').toLowerCase().includes(q)
    )
  }

  // Pagination Logic
  const totalPages = Math.ceil(filteredSchedules.length / itemsPerPage)
  const displayedSchedules = filteredSchedules.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const formatDateRange = (startDate, endDate) => {
    const s = new Date(startDate).toLocaleDateString()
    const e = new Date(endDate).toLocaleDateString()
    return s === e ? s : `${s} – ${e}`
  }

  const formatTimeRange = (startTime, endTime, isFullDay) => {
    if (isFullDay) return 'Full Day'
    if (startTime && endTime) return `${startTime} – ${endTime}`
    if (startTime) return `From ${startTime}`
    return 'Time not set'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center p-5 border-b">
        <h2 className="text-xl font-semibold">Schedules & Appointments</h2>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setFilterToday(!filterToday)
              setCurrentPage(1)
            }}
            className={`px-4 py-2 rounded border transition-colors ${
              filterToday
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {filterToday ? '✓ Today Only' : 'Show Today'}
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Schedule
          </button>
        </div>
      </div>

      <div className="p-5 border-b bg-gray-50 flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search by patient, caretaker, or notes..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setCurrentPage(1)
            }}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value))
              setCurrentPage(1)
            }}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="10">10 per page</option>
            <option value="20">20 per page</option>
            <option value="50">50 per page</option>
          </select>
        </div>
      </div>

      <div className="p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-4 py-3 font-medium text-gray-600">Date Range</th>
                <th className="px-4 py-3 font-medium text-gray-600">Time</th>
                <th className="px-4 py-3 font-medium text-gray-600">Patient</th>
                <th className="px-4 py-3 font-medium text-gray-600">Caretaker</th>
                <th className="px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedSchedules.map((schedule) => (
                <tr key={schedule._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium">{formatDateRange(schedule.startDate, schedule.endDate)}</div>
                    {isToday(schedule.startDate, schedule.endDate) && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Active Today</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {formatTimeRange(schedule.startTime, schedule.endTime, schedule.isFullDay)}
                  </td>
                  <td className="px-4 py-3">{schedule.patientId?.name || 'Unknown'}</td>
                  <td className="px-4 py-3">{schedule.caretakerId?.name || 'Unknown'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      schedule.status === 'completed' ? 'bg-green-100 text-green-800' :
                      schedule.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {schedule.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleOpenModal(schedule)} className="bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600">Edit</button>
                    <button onClick={() => handleDelete(schedule._id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
                  </td>
                </tr>
              ))}
              {displayedSchedules.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-4 py-12 text-center">
                    <svg className="w-16 h-16 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-500 text-lg">No schedules found</p>
                    <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-600">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredSchedules.length)} of {filteredSchedules.length}
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === page ? 'bg-blue-600 text-white' : 'hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{editingSchedule ? 'Edit Schedule' : 'New Schedule'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-2xl hover:text-gray-700">&times;</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Patient *</label>
                <select
                  required
                  value={formData.patientId}
                  onChange={(e) => setFormData({...formData, patientId: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="">Select Patient</option>
                  {patients.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Caretaker *</label>
                <select
                  required
                  value={formData.caretakerId}
                  onChange={(e) => setFormData({...formData, caretakerId: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="">Select Caretaker</option>
                  {caretakers.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>

              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <label className="block text-gray-700 mb-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-gray-700 mb-1">End Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFullDay}
                    onChange={(e) => setFormData({...formData, isFullDay: e.target.checked, startTime: '', endTime: ''})}
                    className="w-4 h-4 accent-blue-500"
                  />
                  <span className="text-gray-700">Full Day (All Day)</span>
                </label>
              </div>

              {!formData.isFullDay && (
                <div className="flex gap-4 mb-4">
                  <div className="flex-1">
                    <label className="block text-gray-700 mb-1">Start Time</label>
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-gray-700 mb-1">End Time</label>
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded"
                  rows="3"
                ></textarea>
              </div>

              <div className="flex gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400">Cancel</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">{editingSchedule ? 'Update' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
