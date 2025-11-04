import { useState, useEffect } from 'react'

export default function CaretakerManagement() {
  const [caretakers, setCaretakers] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    skills: '',
    experience: ''
  })

  useEffect(() => {
    // Fetch caretakers from API
    // For now, using placeholder data
    setCaretakers([
      { id: 1, name: 'Sarah Johnson', phone: '+94 77 123 4567', skills: 'Elderly Care', status: 'active' },
      { id: 2, name: 'Michael Brown', phone: '+94 71 234 5678', skills: 'Physical Therapy', status: 'active' }
    ])
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    // Add caretaker logic here
    console.log('Add caretaker:', formData)
    setIsModalOpen(false)
    setFormData({ name: '', phone: '', email: '', skills: '', experience: '' })
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this caretaker?')) {
      setCaretakers(caretakers.filter(c => c.id !== id))
    }
  }

  const filteredCaretakers = caretakers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.skills.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center p-5 border-b">
        <h2 className="text-xl font-semibold">Caretaker Management</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Caretaker
        </button>
      </div>

      <div className="p-5">
        <input
          type="text"
          placeholder="Search caretakers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />

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
              {filteredCaretakers.map(caretaker => (
                <tr key={caretaker.id} className="border-t">
                  <td className="px-4 py-3">{caretaker.name}</td>
                  <td className="px-4 py-3">{caretaker.phone}</td>
                  <td className="px-4 py-3">{caretaker.skills}</td>
                  <td className="px-4 py-3">
                    <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-800">
                      {caretaker.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600">
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(caretaker.id)}
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add Caretaker</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-2xl leading-none hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Skills</label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Experience (years)</label>
                <input
                  type="number"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              >
                Add
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
