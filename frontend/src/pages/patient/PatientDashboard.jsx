import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { dashboardAPI, bookingAPI, authAPI } from "../../services/api";

export default function PatientDashboard() {
  const navigate = useNavigate();
  
  // State management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [formData, setFormData] = useState({
    serviceType: "",
    preferredDate: "",
    additionalNotes: "",
  });
  const [submitLoading, setSubmitLoading] = useState(false);

  // Load dashboard data on component mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardAPI.getPatientDashboard();
      setDashboardData(data);
    } catch (err) {
      console.error("Dashboard error:", err);
      setError(err.message || "Failed to load dashboard data");
      
      // If unauthorized, redirect to login
      if (err.message.includes("token") || err.message.includes("Unauthorized")) {
        authAPI.logout();
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    navigate("/login");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.serviceType || !formData.preferredDate) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setSubmitLoading(true);
      setError(null);
      
      await bookingAPI.create({
        serviceType: formData.serviceType,
        preferredDate: new Date(formData.preferredDate).toISOString(),
        additionalNotes: formData.additionalNotes,
      });

      // Reset form
      setFormData({
        serviceType: "",
        preferredDate: "",
        additionalNotes: "",
      });

      // Show success message
      alert("Booking request submitted successfully!");

      // Reload dashboard data to update statistics
      loadDashboardData();
    } catch (err) {
      console.error("Booking error:", err);
      setError(err.message || "Failed to create booking");
      alert(`Error: ${err.message || "Failed to create booking"}`);
    } finally {
      setSubmitLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 flex items-center justify-center">
        <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={loadDashboardData}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 w-full"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-blue-700">
          Welcome, <span className="text-green-700">{dashboardData?.user?.name || "Patient"}</span>
        </h1>
        <button 
          onClick={handleLogout}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Log Out
        </button>
      </header>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
          <p>{error}</p>
        </div>
      )}

      {/* Overview Section */}
      <section className="bg-white shadow-xl rounded-2xl p-6 mb-8">
        <h2 className="text-2xl font-semibold text-blue-800 mb-2">
          Dashboard Overview
        </h2>
        <p className="text-gray-600 mb-6">
          View your service details, booking status, and recent notifications.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-blue-100 p-5 rounded-xl text-center shadow-sm hover:shadow-md">
            <p className="font-semibold text-blue-800">Active Services</p>
            <p className="text-3xl font-bold text-blue-900 mt-2">
              {dashboardData?.statistics?.activeServices || 0}
            </p>
          </div>
          <div className="bg-green-100 p-5 rounded-xl text-center shadow-sm hover:shadow-md">
            <p className="font-semibold text-green-800">Upcoming Bookings</p>
            <p className="text-3xl font-bold text-green-900 mt-2">
              {dashboardData?.statistics?.upcomingBookings || 0}
            </p>
          </div>
          <div className="bg-yellow-100 p-5 rounded-xl text-center shadow-sm hover:shadow-md">
            <p className="font-semibold text-yellow-800">Notifications</p>
            <p className="text-3xl font-bold text-yellow-900 mt-2">
              {dashboardData?.statistics?.notifications || 0}
            </p>
          </div>
        </div>
      </section>

      {/* Recent Bookings */}
      {dashboardData?.recentBookings && dashboardData.recentBookings.length > 0 && (
        <section className="bg-white shadow-xl rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-semibold text-blue-800 mb-4">Recent Bookings</h2>
          <div className="space-y-3">
            {dashboardData.recentBookings.slice(0, 3).map((booking) => (
              <div
                key={booking._id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-800">{booking.serviceType}</h3>
                    <p className="text-sm text-gray-600">
                      Date: {new Date(booking.preferredDate).toLocaleDateString()}
                    </p>
                    {booking.caretaker && (
                      <p className="text-sm text-gray-600">
                        Caretaker: {booking.caretaker.name}
                      </p>
                    )}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      booking.status === "confirmed"
                        ? "bg-green-100 text-green-800"
                        : booking.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : booking.status === "in-progress"
                        ? "bg-blue-100 text-blue-800"
                        : booking.status === "completed"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Navigation to Caretaker Directory */}
      <div className="flex justify-center mb-8">
        <Link
          to="/patient/caretakers"
          className="bg-gradient-to-r from-blue-600 to-green-500 text-white px-8 py-3 rounded-xl font-semibold shadow-md hover:opacity-90 transition"
        >
          Find a Caretaker
        </Link>
      </div>

      {/* Booking Form */}
      <section
        id="booking"
        className="bg-white shadow-xl rounded-2xl p-6 border-t-4 border-blue-400"
      >
        <h2 className="text-2xl font-semibold text-green-700 mb-4">
          Book Caretaker Service
        </h2>
        <form onSubmit={handleSubmitBooking} className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-1">Service Type</label>
            <select
              name="serviceType"
              value={formData.serviceType}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="">Select a service</option>
              <option value="Home Care">Home Care</option>
              <option value="Hospital Assistance">Hospital Assistance</option>
              <option value="Elderly Care">Elderly Care</option>
              <option value="Specialized Therapy">Specialized Therapy</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Preferred Date</label>
            <input
              type="date"
              name="preferredDate"
              value={formData.preferredDate}
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]}
              className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Caretaker ID</label>
            <input
              type="text"
              name="caretaker"
              value={formData.caretaker}
              onChange={handleInputChange}
              placeholder="Enter Caretaker ID"
              className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Additional Notes</label>
            <textarea
              rows="4"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Write any specific requirements or conditions..."
              className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="md:col-span-2 flex justify-center">
            <button
              type="submit"
              disabled={submitLoading}
              className="bg-green-600 text-white px-8 py-2 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {submitLoading ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
