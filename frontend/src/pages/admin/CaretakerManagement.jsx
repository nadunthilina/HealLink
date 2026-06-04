import { useState, useEffect } from 'react'
import { caretakersAPI } from '../../services/api'
import Swal from 'sweetalert2'

export default function CaretakerManagement() {
  const [caretakers, setCaretakers] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCaretaker, setEditingCaretaker] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    skills: '',
    experience: '',
    certifications: ''
  })

  useEffect(() => {
    fetchCaretakers()
  }, [])

  const fetchCaretakers = async () => {
    try {
      setLoading(true)
      const { data } = await caretakersAPI.getAll()
      setCaretakers(data)
      setError('')
    } catch (err) {
      console.error('Error fetching caretakers:', err)
      setError('Failed to load caretakers')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (caretaker = null) => {
    if (caretaker) {
      setEditingCaretaker(caretaker)
      setFormData({
        name: caretaker.name,
        phone: caretaker.phone,
        email: caretaker.email,
        password: '',
        skills: caretaker.skills || '',
        experience: caretaker.experience || '',
        certifications: caretaker.certifications?.join(', ') || ''
      })
    } else {
      setEditingCaretaker(null)
      setFormData({
        name: '',
        phone: '',
        email: '',
        password: '',
        skills: '',
        experience: '',
        certifications: ''
      })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const submitData = {
        ...formData,
        certifications: formData.certifications ? formData.certifications.split(',').map(c => c.trim()) : []
      }

      if (editingCaretaker) {
        // Update existing caretaker
        await caretakersAPI.update(editingCaretaker._id, submitData)
      } else {
        // Create new caretaker
        await caretakersAPI.create(submitData)
      }

      await fetchCaretakers()
      setIsModalOpen(false)
      setFormData({ name: '', phone: '', email: '', password: '', skills: '', experience: '', certifications: '' })
      setEditingCaretaker(null)
      
      Swal.fire({
        icon: 'success',
        title: editingCaretaker ? 'Updated!' : 'Created!',
        text: `Caretaker has been successfully ${editingCaretaker ? 'updated' : 'created'}.`,
        timer: 2000,
        showConfirmButton: false
      })
    } catch (err) {
      console.error('Error saving caretaker:', err)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.response?.data?.message || 'Failed to save caretaker'
      })
    }
  }

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This will also delete their user account and you won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    })

    if (result.isConfirmed) {
      try {
        await caretakersAPI.delete(id)
        await fetchCaretakers()
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Caretaker has been deleted.',
          timer: 2000,
          showConfirmButton: false
        })
      } catch (err) {
        console.error('Error deleting caretaker:', err)
        Swal.fire({
          icon: 'error',
          title: 'Delete Failed',
          text: 'Failed to delete caretaker'
        })
      }
    }
  }

  const handleToggleStatus = async (caretakerId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
      await caretakersAPI.update(caretakerId, { status: newStatus })
      await fetchCaretakers()
      Swal.fire({
        icon: 'success',
        title: 'Status Updated',
        text: `Caretaker is now ${newStatus}.`,
        timer: 1500,
        showConfirmButton: false
      })
    } catch (err) {
      console.error('Error toggling caretaker status:', err)
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'Failed to update status'
      })
    }
  }

  const filteredCaretakers = caretakers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.skills && c.skills.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase()))
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
        <h2 className="text-xl font-semibold">Caretaker Management</h2>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Caretaker
        </button>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-4 mb-4">
          <input
            type="text"
            placeholder="Search caretakers..."
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
                <th className="px-4 py-3 text-left text-gray-700 font-medium">Phone</th>
                <th className="px-4 py-3 text-left text-gray-700 font-medium">Skills</th>
                <th className="px-4 py-3 text-left text-gray-700 font-medium">Status</th>
                <th className="px-4 py-3 text-left text-gray-700 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCaretakers
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map(caretaker => (
                <tr key={caretaker._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{caretaker.name}</td>
                  <td className="px-4 py-3">{caretaker.phone}</td>
                  <td className="px-4 py-3">{caretaker.skills || 'N/A'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      caretaker.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {caretaker.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex items-center gap-2">
                    <button
                      onClick={() => handleToggleStatus(caretaker._id, caretaker.status)}
                      className={`px-3 py-1 rounded text-sm ${
                        caretaker.status === 'active'
                          ? 'bg-orange-500 hover:bg-orange-600 text-white'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                    >
                      {caretaker.status === 'active' ? 'Set Inactive' : 'Set Active'}
                    </button>
                    <button 
                      onClick={() => handleOpenModal(caretaker)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(caretaker._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredCaretakers.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-4 py-12 text-center">
                    <svg className="w-16 h-16 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <p className="text-gray-500 text-lg">No caretakers found</p>
                    <p className="text-gray-400 text-sm mt-1">Add your first caretaker to get started</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredCaretakers.length > 0 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredCaretakers.length)} of {filteredCaretakers.length} caretakers
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {Array.from({ length: Math.ceil(filteredCaretakers.length / itemsPerPage) }, (_, i) => i + 1)
                .filter(page => 
                  page === 1 || 
                  page === Math.ceil(filteredCaretakers.length / itemsPerPage) ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                )
                .map((page, index, array) => (
                  <>
                    {index > 0 && array[index - 1] !== page - 1 && <span className="px-2">...</span>}
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
                onClick={() => setCurrentPage(p => Math.min(Math.ceil(filteredCaretakers.length / itemsPerPage), p + 1))}
                disabled={currentPage >= Math.ceil(filteredCaretakers.length / itemsPerPage)}
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
                {editingCaretaker ? 'Edit Caretaker' : 'Add Caretaker'}
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(false)
                  setEditingCaretaker(null)
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
                  disabled={!!editingCaretaker}
                />
                {editingCaretaker && (
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                )}
              </div>
              {!editingCaretaker && (
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1">Password *</label>
                  <input
                    type="password"
                    required={!editingCaretaker}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Minimum 6 characters"
                  />
                </div>
              )}
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Skills</label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="e.g., Elderly Care, Physical Therapy"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Experience</label>
                <input
                  type="text"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="e.g., 5 years"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Certifications</label>
                <input
                  type="text"
                  value={formData.certifications}
                  onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Separate with commas"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false)
                    setEditingCaretaker(null)
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                  {editingCaretaker ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
