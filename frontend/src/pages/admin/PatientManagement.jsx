import { useState, useEffect } from 'react'
import { patientsAPI, caretakersAPI } from '../../services/api'
import Swal from 'sweetalert2'

export default function PatientManagement() {
  const [patients, setPatients] = useState([])
  const [caretakers, setCaretakers] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPatient, setEditingPatient] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    phone: '',
    email: '',
    password: '',
    condition: '',
    address: '',
    assignedCaretaker: '',
    assignmentStartDate: '',
    assignmentEndDate: '',
    assignmentStartTime: '',
    assignmentEndTime: '',
    assignmentIsFullDay: false
  })

  useEffect(() => {
    fetchPatients()
    fetchCaretakers()
  }, [])

  const fetchPatients = async () => {
    try {
      setLoading(true)
      const { data } = await patientsAPI.getAll()
      setPatients(data)
      setError('')
    } catch (err) {
      console.error('Error fetching patients:', err)
      setError('Failed to load patients')
    } finally {
      setLoading(false)
    }
  }

  const fetchCaretakers = async () => {
    try {
      const { data } = await caretakersAPI.getAll()
      setCaretakers(data.filter(c => c.status === 'active'))
    } catch (err) {
      console.error('Error fetching caretakers:', err)
    }
  }

  const handleOpenModal = (patient = null) => {
    if (patient) {
      setEditingPatient(patient)
      setFormData({
        name: patient.name,
        age: patient.age.toString(),
        phone: patient.phone,
        email: patient.email || '',
        password: '',
        condition: patient.condition || '',
        address: patient.address || '',
        assignedCaretaker: patient.assignedCaretaker?._id || '',
        assignmentStartDate: patient.assignmentStartDate ? new Date(patient.assignmentStartDate).toISOString().split('T')[0] : '',
        assignmentEndDate: patient.assignmentEndDate ? new Date(patient.assignmentEndDate).toISOString().split('T')[0] : '',
        assignmentStartTime: patient.assignmentStartTime || '',
        assignmentEndTime: patient.assignmentEndTime || '',
        assignmentIsFullDay: patient.assignmentIsFullDay || false
      })
    } else {
      setEditingPatient(null)
      setFormData({
        name: '',
        age: '',
        phone: '',
        email: '',
        password: '',
        condition: '',
        address: '',
        assignedCaretaker: '',
        assignmentStartDate: '',
        assignmentEndDate: '',
        assignmentStartTime: '',
        assignmentEndTime: '',
        assignmentIsFullDay: false
      })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const submitData = {
        ...formData,
        age: parseInt(formData.age),
        assignedCaretaker: formData.assignedCaretaker || null
      }

      if (editingPatient) {
        await patientsAPI.update(editingPatient._id, submitData)
      } else {
        await patientsAPI.create(submitData)
      }

      await fetchPatients()
      setIsModalOpen(false)
      setFormData({ name: '', age: '', phone: '', email: '', password: '', condition: '', address: '', assignedCaretaker: '', assignmentStartDate: '', assignmentEndDate: '', assignmentStartTime: '', assignmentEndTime: '', assignmentIsFullDay: false })
      setEditingPatient(null)
      
      Swal.fire({
        icon: 'success',
        title: editingPatient ? 'Updated!' : 'Created!',
        text: `Patient has been successfully ${editingPatient ? 'updated' : 'created'}.`,
        timer: 2000,
        showConfirmButton: false
      })
    } catch (err) {
      console.error('Error saving patient:', err)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.response?.data?.message || 'Failed to save patient'
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
        await patientsAPI.delete(id)
        await fetchPatients()
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Patient has been deleted.',
          timer: 2000,
          showConfirmButton: false
        })
      } catch (err) {
        console.error('Error deleting patient:', err)
        Swal.fire({
          icon: 'error',
          title: 'Delete Failed',
          text: 'Failed to delete patient'
        })
      }
    }
  }

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.condition && p.condition.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (p.phone && p.phone.includes(searchQuery))
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          <p>{error}</p>
        </div>
      )}

      <div className="flex justify-between items-center p-5 border-b">
        <h2 className="text-xl font-semibold">Patient Management</h2>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Patient
        </button>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-4 mb-4">
          <input
            type="text"
            placeholder="Search patients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded"
          />
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

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-gray-700 font-medium">Name</th>
                <th className="px-4 py-3 text-left text-gray-700 font-medium">Age</th>
                <th className="px-4 py-3 text-left text-gray-700 font-medium">Condition</th>
                <th className="px-4 py-3 text-left text-gray-700 font-medium">Caretaker</th>
                <th className="px-4 py-3 text-left text-gray-700 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map(patient => (
                <tr key={patient._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{patient.name}</td>
                  <td className="px-4 py-3">{patient.age}</td>
                  <td className="px-4 py-3">{patient.condition || 'N/A'}</td>
                  <td className="px-4 py-3">
                    {patient.assignedCaretaker?.name || (
                      <span className="text-gray-400 italic">Not assigned</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button 
                      onClick={() => handleOpenModal(patient)}
                      className="bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(patient._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredPatients.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-4 py-12 text-center">
                    <svg className="w-16 h-16 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <p className="text-gray-500 text-lg">No patients found</p>
                    <p className="text-gray-400 text-sm mt-1">Add your first patient to get started</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredPatients.length > 0 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredPatients.length)} of {filteredPatients.length} patients
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {Array.from({ length: Math.ceil(filteredPatients.length / itemsPerPage) }, (_, i) => i + 1)
                .filter(page => 
                  page === 1 || 
                  page === Math.ceil(filteredPatients.length / itemsPerPage) ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                )
                .map((page, index, array) => (
                  <>
                    {index > 0 && array[index - 1] !== page - 1 && <span key={`ellipsis-${page}`} className="px-2">...</span>}
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 border rounded ${
                        currentPage === page
                          ? 'bg-blue-500 text-white'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  </>
                ))
              }
              <button
                onClick={() => setCurrentPage(p => Math.min(Math.ceil(filteredPatients.length / itemsPerPage), p + 1))}
                disabled={currentPage >= Math.ceil(filteredPatients.length / itemsPerPage)}
                className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
              <h3 className="text-lg font-semibold">
                {editingPatient ? 'Edit Patient' : 'Add Patient'}
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(false)
                  setEditingPatient(null)
                }}
                className="text-2xl leading-none hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Age *</label>
                <input
                  type="number"
                  required
                  min="0"
                  max="150"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Phone *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="+94 77 123 4567"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                  disabled={!!editingPatient}
                />
                {editingPatient && (
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                )}
              </div>
              {!editingPatient && (
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1">Password *</label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Minimum 6 characters"
                  />
                </div>
              )}
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Medical Condition</label>
                <input
                  type="text"
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="e.g., Post-surgery, Chronic Care"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Address</label>
                <textarea
                  rows="3"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Assigned Caretaker</label>
                <select
                  value={formData.assignedCaretaker}
                  onChange={(e) => setFormData({ ...formData, assignedCaretaker: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="">Not assigned</option>
                  {caretakers.map(caretaker => (
                    <option key={caretaker._id} value={caretaker._id}>
                      {caretaker.name} - {caretaker.skills || 'General Care'}
                    </option>
                  ))}
                </select>
              </div>
              {formData.assignedCaretaker && (
                <>
                  <div className="flex gap-4 mb-4">
                    <div className="flex-1">
                      <label className="block text-gray-700 mb-1">Start Date</label>
                      <input
                        type="date"
                        value={formData.assignmentStartDate}
                        onChange={(e) => setFormData({ ...formData, assignmentStartDate: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-gray-700 mb-1">End Date</label>
                      <input
                        type="date"
                        value={formData.assignmentEndDate}
                        onChange={(e) => setFormData({ ...formData, assignmentEndDate: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.assignmentIsFullDay}
                        onChange={(e) => setFormData({ ...formData, assignmentIsFullDay: e.target.checked, assignmentStartTime: '', assignmentEndTime: '' })}
                        className="w-4 h-4 accent-blue-500"
                      />
                      <span className="text-gray-700">Full Day (All Day)</span>
                    </label>
                  </div>
                  {!formData.assignmentIsFullDay && (
                    <div className="flex gap-4 mb-4">
                      <div className="flex-1">
                        <label className="block text-gray-700 mb-1">Start Time</label>
                        <input
                          type="time"
                          value={formData.assignmentStartTime}
                          onChange={(e) => setFormData({ ...formData, assignmentStartTime: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-gray-700 mb-1">End Time</label>
                        <input
                          type="time"
                          value={formData.assignmentEndTime}
                          onChange={(e) => setFormData({ ...formData, assignmentEndTime: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded"
                        />
                      </div>
                    </div>
                  )}
                </>
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false)
                    setEditingPatient(null)
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                  {editingPatient ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
