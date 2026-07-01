import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate()
  
  // Filtering & Pagination State
  const [filterToday, setFilterToday] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  
  const [formData, setFormData] = useState({
    patientId: '',
    caretakerId: '',
    wardNo: '',
    startDate: '',
    endDate: '',
    startTime: '',
    dayType: 'full',
    paymentToAgency: 'unpaid',
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
        wardNo: schedule.wardNo || '',
        startDate: new Date(schedule.startDate).toISOString().split('T')[0],
        endDate: new Date(schedule.startDate).toISOString().split('T')[0],
        startTime: schedule.startTime || '',
        dayType: schedule.dayType || 'full',
        paymentToAgency: schedule.paymentToAgency || 'unpaid',
        status: schedule.status || 'pending',
        notes: schedule.notes || ''
      })
    } else {
      setEditingSchedule(null)
      setFormData({
        patientId: '',
        caretakerId: '',
        wardNo: '',
        startDate: '',
        endDate: '',
        startTime: '',
        dayType: 'full',
        paymentToAgency: 'unpaid',
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

  const isToday = (startDate) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const start = new Date(startDate)
    start.setHours(0, 0, 0, 0)
    return today.getTime() === start.getTime()
  }

  // Filter Logic
  let filteredSchedules = schedules

  if (filterToday) {
    filteredSchedules = filteredSchedules.filter(s => isToday(s.startDate))
  }

  if (statusFilter !== 'all') {
    filteredSchedules = filteredSchedules.filter(s => s.status === statusFilter)
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase()
    filteredSchedules = filteredSchedules.filter(s => 
      (s.patientId?.name || '').toLowerCase().includes(q) ||
      (s.patientId?.patientId || '').toLowerCase().includes(q) ||
      (s.patientId?.phone || '').includes(q) ||
      (s.caretakerId?.name || '').toLowerCase().includes(q) ||
      (s.caretakerId?.caretakerId || '').toLowerCase().includes(q) ||
      (s.caretakerId?.phone || '').includes(q) ||
      (s.notes || '').toLowerCase().includes(q)
    )
  }

  // Pagination Logic
  const totalPages = Math.ceil(filteredSchedules.length / itemsPerPage)
  const displayedSchedules = filteredSchedules.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const formatTimeRange = (startTime, dayType) => {
    return dayType === 'full' ? 'Full Day (24h)' : `Half Day (12h) from ${startTime}`
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
            placeholder="Search by Patient/Caretaker ID, name, or phone..."
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
                    <div className="font-medium">{new Date(schedule.startDate).toLocaleDateString()}</div>
                    {isToday(schedule.startDate) && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Active Today</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {formatTimeRange(schedule.startTime, schedule.dayType)}
                  </td>
                  <td className="px-4 py-3">{schedule.patientId?.patientId}</td>
                  <td className="px-4 py-3">{schedule.caretakerId?.caretakerId}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      schedule.status === 'completed' ? 'bg-green-100 text-green-800' :
                      schedule.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {schedule.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => navigate(`/admin/patients/${schedule.patientId?._id}`)} 
                        className="bg-purple-500 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-purple-600 transition-colors shadow-sm"
                      >
                        View
                      </button>
                      {schedule.status === 'pending' ? (
                        <>
                          <button 
                            onClick={() => handleOpenModal(schedule)} 
                            className="bg-green-500 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-green-600 transition-colors shadow-sm"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(schedule._id)} 
                            className="bg-red-500 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-red-600 transition-colors shadow-sm"
                          >
                            Delete
                          </button>
                        </>
                      ) : (
                        <span className="text-gray-400 text-xs italic bg-gray-100 px-3 py-1.5 rounded border border-gray-200">Locked</span>
                      )}
                    </div>
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
          <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-5 pb-3 border-b">
              <h3 className="text-xl font-bold text-gray-800">{editingSchedule ? '✏️ Edit Schedule' : '📅 New Schedule'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-red-100 hover:text-red-500 transition-colors">&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Patient & Caretaker Section */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Assignment</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Patient *</label>
                    <input
                      type="text"
                      required
                      list="patientsList"
                      placeholder="Search by ID..."
                      value={
                        patients.find(p => p._id === formData.patientId)?.patientId || formData.patientId
                      }
                      onChange={(e) => {
                        const selected = patients.find(p => p.patientId === e.target.value || p._id === e.target.value)
                        setFormData({...formData, patientId: selected ? selected._id : e.target.value})
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                    <datalist id="patientsList">
                      {patients.map(p => <option key={p._id} value={p.patientId}>{p.name}</option>)}
                    </datalist>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Caretaker *</label>
                    <input
                      type="text"
                      required
                      list="caretakersList"
                      placeholder="Search by ID..."
                      value={
                        caretakers.find(c => c._id === formData.caretakerId)?.caretakerId || formData.caretakerId
                      }
                      onChange={(e) => {
                        const selected = caretakers.find(c => c.caretakerId === e.target.value || c._id === e.target.value)
                        setFormData({...formData, caretakerId: selected ? selected._id : e.target.value})
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                    <datalist id="caretakersList">
                      {caretakers
                        .filter(c => {
                          if (!formData.patientId) return true
                          const patient = patients.find(p => p._id === formData.patientId)
                          return patient ? c.gender === patient.gender : true
                        })
                        .map(c => <option key={c._id} value={c.caretakerId}>{c.name}</option>)}
                    </datalist>
                    {formData.patientId && <p className="text-xs text-blue-500 mt-1">Filtered by patient's gender</p>}
                  </div>
                </div>
              </div>

              {/* Schedule Details Section */}
              <div className="bg-blue-50 rounded-lg p-4 space-y-3 border border-blue-100">
                <h4 className="text-sm font-semibold text-blue-700 uppercase tracking-wider">📆 Schedule Details</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                    <input
                      type="date"
                      required
                      min={!editingSchedule ? new Date().toISOString().split('T')[0] : undefined}
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="date"
                      min={formData.startDate || (!editingSchedule ? new Date().toISOString().split('T')[0] : undefined)}
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time *</label>
                    <input
                      type="time"
                      required
                      value={formData.startTime}
                      onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ward No</label>
                    <input
                      type="text"
                      value={formData.wardNo}
                      onChange={(e) => setFormData({...formData, wardNo: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Day Type *</label>
                    <select
                      value={formData.dayType}
                      onChange={(e) => setFormData({...formData, dayType: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                      <option value="full">Full Day (24h)</option>
                      <option value="half">Half Day (12h)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Agency Payment</label>
                    <select
                      value={formData.paymentToAgency}
                      onChange={(e) => setFormData({...formData, paymentToAgency: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                      <option value="unpaid">Unpaid</option>
                      <option value="paid">Paid</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm">{editingSchedule ? 'Update Schedule' : 'Create Schedule'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
