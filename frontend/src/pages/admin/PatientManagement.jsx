import { useState, useEffect } from 'react'

export default function PatientManagement() {
  const [patients, setPatients] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    phone: '',
    condition: '',
    address: ''
  })

  useEffect(() => {
    // Fetch patients from API
    // For now, using placeholder data
    setPatients([
      { id: 1, name: 'John Smith', age: 72, condition: 'Post-surgery', caretaker: 'Sarah Johnson' },
      { id: 2, name: 'Mary Wilson', age: 68, condition: 'Chronic Care', caretaker: 'Michael Brown' }
    ])
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    // Add patient logic here
    console.log('Add patient:', formData)
    setIsModalOpen(false)
    setFormData({ name: '', age: '', phone: '', condition: '', address: '' })
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      setPatients(patients.filter(p => p.id !== id))
    }
  }

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.condition.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center p-5 border-b">
        <h2 className="text-xl font-semibold">Patient Management</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Patient
        </button>
      </div>

      <div className="p-5">
        <input
          type="text"
          placeholder="Search patients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />

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
              {filteredPatients.map(patient => (
                <tr key={patient.id} className="border-t">
                  <td className="px-4 py-3">{patient.name}</td>
                  <td className="px-4 py-3">{patient.age}</td>
                  <td className="px-4 py-3">{patient.condition}</td>
                  <td className="px-4 py-3">{patient.caretaker}</td>
                  <td className="px-4 py-3">
                    <button className="bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600">
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(patient.id)}
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
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add Patient</h3>
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
                <label className="block text-gray-700 mb-1">Age</label>
                <input
                  type="number"
                  required
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
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
                <label className="block text-gray-700 mb-1">Medical Condition</label>
                <input
                  type="text"
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
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
