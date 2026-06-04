import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { patientsAPI, schedulesAPI, settingsAPI } from '../../services/api'
import Swal from 'sweetalert2'

export default function PatientProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [patient, setPatient] = useState(null)
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(true)
  const [rates, setRates] = useState({ fullDayRate: 2800, halfDayRate: 1400 })

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
      const [patRes, schedRes] = await Promise.all([
        patientsAPI.getOne(id),
        schedulesAPI.getAll()
      ])
      setPatient(patRes.data)
      // Filter schedules for this patient
      const mySchedules = schedRes.data.filter(
        s => s.patientId?._id === id || s.patientId === id
      )
      setSchedules(mySchedules)
    } catch (err) {
      console.error(err)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load patient profile.'
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
    if (schedule.paymentToAgency === 'paid') {
      return Swal.fire({
        icon: 'info',
        title: 'Already Paid',
        text: 'The agency payment for this schedule has already been settled.'
      })
    }

    const result = await Swal.fire({
      title: 'Process Agency Payment?',
      text: 'Mark the agency payment as successfully received from the patient?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Mark Paid'
    })

    if (result.isConfirmed) {
      try {
        await schedulesAPI.update(schedule._id, { paymentToAgency: 'paid' })
        Swal.fire('Success', 'Agency payment marked as paid.', 'success')
        fetchData()
      } catch (e) {
        Swal.fire('Error', 'Failed to update schedule.', 'error')
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

  if (!patient) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Patient not found.</p>
        <button onClick={() => navigate('/admin/patients')} className="mt-4 text-blue-600 hover:underline">
          ← Back to Patients
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/admin/patients')}
        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Patients
      </button>

      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white ${
            patient.gender === 'female' ? 'bg-pink-500' : 'bg-teal-500'
          }`}>
            {patient.name?.charAt(0).toUpperCase()}
          </div>

          {/* Details */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-gray-800">{patient.name}</h1>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                patient.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {patient.status}
              </span>
            </div>
            <p className="text-teal-600 font-medium text-sm mb-3">{patient.patientId}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Phone</p>
                <p className="text-sm font-medium text-gray-800">{patient.phone}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Email</p>
                <p className="text-sm font-medium text-gray-800">{patient.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Age</p>
                <p className="text-sm font-medium text-gray-800">{patient.age}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Gender</p>
                <p className="text-sm font-medium text-gray-800 capitalize">{patient.gender || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Address</p>
                <p className="text-sm font-medium text-gray-800">{patient.address || 'N/A'}</p>
              </div>
              {patient.assignedCaretaker && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Assigned Caretaker</p>
                  <p className="text-sm font-medium text-gray-800">{patient.assignedCaretaker.name}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Schedule History */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-5 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            Schedule History
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {schedules.length} schedule{schedules.length !== 1 ? 's' : ''} found
          </p>
        </div>

        <div className="p-5">
          {schedules.length === 0 ? (
            <div className="text-center py-8">
              <svg className="w-14 h-14 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-400">No schedules found for this patient.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Caretaker ID</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Caretaker Name</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Ward No</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Day Type</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Agency Payment</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Job Status</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {schedules.map(s => (
                    <tr key={s._id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-blue-600">
                        {s.caretakerId?.caretakerId || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-sm">{s.caretakerId?.name || 'Unknown'}</td>
                      <td className="px-4 py-3 text-sm">{s.wardNo || patient?.address || 'N/A'}</td>
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
                      <td className="px-4 py-3 text-sm text-right">
                        <button 
                          onClick={() => handleProcessPayment(s)}
                          disabled={s.paymentToAgency === 'paid'}
                          className={`px-3 py-1 rounded text-xs font-medium text-white ${
                            s.paymentToAgency === 'paid' 
                              ? 'bg-gray-400 cursor-not-allowed' 
                              : 'bg-blue-600 hover:bg-blue-700'
                          }`}
                        >
                          {s.paymentToAgency === 'paid' ? 'Settled' : 'Pay Agency'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
