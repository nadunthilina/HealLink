import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { caretakersAPI, schedulesAPI, settingsAPI } from '../../services/api'
import Swal from 'sweetalert2'

export default function CaretakerProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [caretaker, setCaretaker] = useState(null)
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(true)
  const [rates, setRates] = useState({ fullDayRate: 2800, halfDayRate: 1400 })
  const [profileSearch, setProfileSearch] = useState('')
  const [profileStatusFilter, setProfileStatusFilter] = useState('all')
  const [profilePage, setProfilePage] = useState(1)
  const profilePerPage = 10

  useEffect(() => {
    fetchData()
    fetchRates()
  }, [id])

  const fetchRates = async () => {
    try {
      const { data } = await settingsAPI.getRates()
      setRates(data)
    } catch (e) {
      console.error('Failed to fetch rates:', e)
    }
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      const [careRes, schedRes] = await Promise.all([
        caretakersAPI.getOne(id),
        schedulesAPI.getAll()
      ])
      setCaretaker(careRes.data)
      // Filter schedules for this caretaker
      const mySchedules = schedRes.data.filter(
        s => s.caretakerId?._id === id || s.caretakerId === id
      )
      setSchedules(mySchedules)
    } catch (err) {
      console.error(err)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load caretaker profile.'
      })
    } finally {
      setLoading(false)
    }
  }

  const getPaymentAmount = (schedule) => {
    if (schedule.dailyRate) return schedule.dailyRate;
    return schedule.dayType === 'full' ? rates.fullDayRate : rates.halfDayRate
  }

  const handleProcessPayment = async (schedule) => {
    if (schedule.paymentToCaretaker === 'success') {
      return Swal.fire({
        icon: 'info',
        title: 'Already Paid',
        text: 'This caretaker has already been paid for this schedule.'
      })
    }

    if (schedule.status !== 'completed') {
      const { value: note, isConfirmed } = await Swal.fire({
        title: 'Job Not Completed',
        text: 'The job is not marked as completed. To proceed with payment, you must mark it complete with a note.',
        input: 'textarea',
        inputPlaceholder: 'Enter completion note (e.g. Verified with patient)',
        showCancelButton: true,
        confirmButtonText: 'Force Complete & Pay',
        inputValidator: (value) => {
          if (!value) {
            return 'You need to write a note!'
          }
        }
      })

      if (isConfirmed && note) {
        try {
          await schedulesAPI.update(schedule._id, {
            status: 'completed',
            paymentToCaretaker: 'success',
            jobCompletedByAdmin: true,
            adminNote: note
          })
          Swal.fire('Success', 'Job forced complete and payment marked as success.', 'success')
          fetchData()
        } catch (e) {
          Swal.fire('Error', 'Failed to update schedule.', 'error')
        }
      }
    } else {
      const result = await Swal.fire({
        title: 'Process Payment?',
        text: 'Mark this payment as successfully sent to the caretaker?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, Mark Paid'
      })

      if (result.isConfirmed) {
        try {
          await schedulesAPI.update(schedule._id, { paymentToCaretaker: 'success' })
          Swal.fire('Success', 'Payment marked as success.', 'success')
          fetchData()
        } catch (e) {
          Swal.fire('Error', 'Failed to update schedule.', 'error')
        }
      }
    }
  }

  const showAdminNote = (note) => {
    Swal.fire({
      title: 'Admin Note',
      text: note || 'No note provided.',
      icon: 'info'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!caretaker) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Caretaker not found.</p>
        <button onClick={() => navigate('/admin/caretakers')} className="mt-4 text-blue-600 hover:underline">
          ← Back to Caretakers
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/admin/caretakers')}
        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Caretakers
      </button>

      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white ${
            caretaker.gender === 'female' ? 'bg-pink-500' : 'bg-blue-500'
          }`}>
            {caretaker.name?.charAt(0).toUpperCase()}
          </div>

          {/* Details */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-gray-800">{caretaker.name}</h1>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                caretaker.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {caretaker.status}
              </span>
            </div>
            <p className="text-blue-600 font-medium text-sm mb-3">{caretaker.caretakerId}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Phone</p>
                <p className="text-sm font-medium text-gray-800">{caretaker.phone}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Email</p>
                <p className="text-sm font-medium text-gray-800">{caretaker.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Age</p>
                <p className="text-sm font-medium text-gray-800">{caretaker.age || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Gender</p>
                <p className="text-sm font-medium text-gray-800 capitalize">{caretaker.gender || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assigned Patients / Schedule Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-5 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            Assigned Patients & Schedule History
          </h2>
          <div className="flex flex-wrap gap-3 mt-3">
            <input
              type="text"
              placeholder="Search by Patient ID, name, or phone..."
              value={profileSearch}
              onChange={(e) => { setProfileSearch(e.target.value); setProfilePage(1); }}
              className="flex-1 min-w-[200px] px-3 py-1.5 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
            <select
              value={profileStatusFilter}
              onChange={(e) => { setProfileStatusFilter(e.target.value); setProfilePage(1); }}
              className="px-3 py-1.5 border border-gray-300 rounded text-sm bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="start">Started</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="p-5">
          {(() => {
            const q = profileSearch.toLowerCase()
            const filtered = schedules.filter(s => {
              const matchesSearch = !profileSearch ||
                (s.patientId?.patientId || '').toLowerCase().includes(q) ||
                (s.patientId?.name || '').toLowerCase().includes(q) ||
                (s.patientId?.phone || '').includes(q)
              const matchesStatus = profileStatusFilter === 'all' || s.status === profileStatusFilter
              return matchesSearch && matchesStatus
            })
            const totalPages = Math.ceil(filtered.length / profilePerPage)
            const paginated = filtered.slice((profilePage - 1) * profilePerPage, profilePage * profilePerPage)

            return filtered.length === 0 ? (
            <div className="text-center py-8">
              <svg className="w-14 h-14 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-400">No schedules found.</p>
            </div>
          ) : (
            <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Patient ID</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Patient Name</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Ward No</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Day Type</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Agency Payment</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Job Status</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Caretaker Payment</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map(s => (
                    <tr key={s._id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-blue-600">
                        {s.patientId?.patientId || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-sm">{s.patientId?.name || 'Unknown'}</td>
                      <td className="px-4 py-3 text-sm">{s.wardNo || s.patientId?.address || 'N/A'}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          s.dayType === 'full'
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {s.dayType === 'full' ? 'Full Day (24h)' : 'Half Day (12h)'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {new Date(s.startDate).toLocaleDateString()} at {s.startTime}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex flex-col">
                          <span className="font-medium">Rs. {getPaymentAmount(s).toLocaleString()}</span>
                          <span className={`text-xs ${s.paymentToAgency === 'paid' ? 'text-green-600' : 'text-red-500'}`}>
                            {s.paymentToAgency === 'paid' ? '✓ Paid' : '✗ Unpaid'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            s.status === 'completed' ? 'bg-green-100 text-green-800' :
                            s.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {s.status}
                          </span>
                          {s.jobCompletedByAdmin && (
                            <button
                              onClick={() => showAdminNote(s.adminNote)}
                              className="text-blue-500 hover:text-blue-700"
                              title="View Admin Note"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex flex-col">
                          <span className="font-medium">Rs. {getPaymentAmount(s).toLocaleString()}</span>
                          <span className={`text-xs ${s.paymentToCaretaker === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                            {s.paymentToCaretaker === 'success' ? '✓ Paid' : '✗ Pending'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-right">
                        <button 
                          onClick={() => handleProcessPayment(s)}
                          disabled={s.paymentToCaretaker === 'success'}
                          className={`px-3 py-1 rounded text-xs font-medium text-white ${
                            s.paymentToCaretaker === 'success' 
                              ? 'bg-gray-400 cursor-not-allowed' 
                              : 'bg-blue-600 hover:bg-blue-700'
                          }`}
                        >
                          {s.paymentToCaretaker === 'success' ? 'Settled' : 'Pay Caretaker'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t">
                <p className="text-sm text-gray-500">
                  Showing {(profilePage - 1) * profilePerPage + 1} to {Math.min(profilePage * profilePerPage, filtered.length)} of {filtered.length}
                </p>
                <div className="flex gap-1">
                  <button onClick={() => setProfilePage(p => Math.max(1, p - 1))} disabled={profilePage === 1} className="px-3 py-1 border rounded text-sm disabled:opacity-50">Previous</button>
                  <button onClick={() => setProfilePage(p => Math.min(totalPages, p + 1))} disabled={profilePage >= totalPages} className="px-3 py-1 border rounded text-sm disabled:opacity-50">Next</button>
                </div>
              </div>
            )}
            </>
          )
          })()}
        </div>
      </div>
    </div>
  )
}
