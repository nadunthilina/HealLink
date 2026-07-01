import { useState, useEffect } from 'react'
import { settingsAPI } from '../../services/api'
import Swal from 'sweetalert2'

export default function Settings() {
  const [formData, setFormData] = useState({
    fullDayRate: '',
    halfDayRate: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const { data } = await settingsAPI.getAll()
      setFormData({
        fullDayRate: data.fullDayRate || '',
        halfDayRate: data.halfDayRate || ''
      })
    } catch (error) {
      console.error('Failed to fetch settings:', error)
      Swal.fire('Error', 'Failed to load settings', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await settingsAPI.update(formData)
      Swal.fire({
        icon: 'success',
        title: 'Saved!',
        text: 'Settings have been updated successfully.',
        timer: 1500,
        showConfirmButton: false
      })
    } catch (error) {
      console.error('Failed to update settings:', error)
      Swal.fire('Error', 'Failed to save settings', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">⚙️ Payment Settings</h2>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">Notice on Rate Changes</h3>
            <p className="text-sm text-blue-700">
              Updating these rates will apply to all <strong>newly created</strong> schedules and any schedules currently in <strong>pending</strong> state.
              Any schedules that are already marked as completed or started will retain their originally booked rates to preserve financial history.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Day Rate (Rs.)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">Rs.</span>
                </div>
                <input
                  type="number"
                  min="0"
                  step="100"
                  required
                  value={formData.fullDayRate}
                  onChange={(e) => setFormData({...formData, fullDayRate: e.target.value})}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. 24000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Half Day Rate (Rs.)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">Rs.</span>
                </div>
                <input
                  type="number"
                  min="0"
                  step="100"
                  required
                  value={formData.halfDayRate}
                  onChange={(e) => setFormData({...formData, halfDayRate: e.target.value})}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. 12000"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 font-medium disabled:bg-blue-400 transition-colors flex items-center gap-2"
            >
              {saving && (
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
