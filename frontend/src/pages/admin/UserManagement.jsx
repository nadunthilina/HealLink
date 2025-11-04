import { useState, useEffect } from 'react'

export default function UserManagement() {
  const [users, setUsers] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    password: ''
  })

  useEffect(() => {
    // Fetch users from API
    // For now, using placeholder data
    setUsers([
      { id: 1, name: 'Alice Cooper', email: 'alice@email.com', role: 'Patient', status: 'active' },
      { id: 2, name: 'David Lee', email: 'david@email.com', role: 'Caretaker', status: 'active' }
    ])
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    // Add user logic here
    console.log('Add user:', formData)
    setIsModalOpen(false)
    setFormData({ name: '', email: '', phone: '', role: '', password: '' })
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== id))
    }
  }

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center p-5 border-b">
        <h2 className="text-xl font-semibold">User Management</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add User
        </button>
      </div>

      <div className="p-5">
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-gray-700 font-medium">Name</th>
                <th className="px-4 py-3 text-left text-gray-700 font-medium">Email</th>
                <th className="px-4 py-3 text-left text-gray-700 font-medium">Role</th>
                <th className="px-4 py-3 text-left text-gray-700 font-medium">Status</th>
                <th className="px-4 py-3 text-left text-gray-700 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} className="border-t">
                  <td className="px-4 py-3">{user.name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.role}</td>
                  <td className="px-4 py-3">
                    <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-800">
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600">
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
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
              <h3 className="text-lg font-semibold">Add User</h3>
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
                <label className="block text-gray-700 mb-1">Role</label>
                <select
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="">Select role</option>
                  <option value="admin">Admin</option>
                  <option value="caretaker">Caretaker</option>
                  <option value="patient">Patient</option>
                  <option value="family">Family</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
