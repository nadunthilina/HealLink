import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function PatientDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-blue-700">
          Welcome, <span className="text-green-700">Patient</span>
        </h1>
        <button
          onClick={handleLogout}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Log Out
        </button>
      </header>

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
            <p className="text-3xl font-bold text-blue-900 mt-2">8</p>
          </div>
          <div className="bg-green-100 p-5 rounded-xl text-center shadow-sm hover:shadow-md">
            <p className="font-semibold text-green-800">Upcoming Bookings</p>
            <p className="text-3xl font-bold text-green-900 mt-2">2</p>
          </div>
          <div className="bg-yellow-100 p-5 rounded-xl text-center shadow-sm hover:shadow-md">
            <p className="font-semibold text-yellow-800">Notifications</p>
            <p className="text-3xl font-bold text-yellow-900 mt-2">3</p>
          </div>
        </div>
      </section>

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
        <form className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-1">Service Type</label>
            <input
              type="text"
              placeholder="Elderly Care / Medical Assistance"
              className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Preferred Date</label>
            <input
              type="date"
              className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
  <label className="block text-gray-700 mb-1">Preferred Time</label>
  <input
    type="time"
    className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-400"
  />
</div>

          <div className="md:col-span-2">
            <label className="block text-gray-700 mb-1">Additional Notes</label>
            <textarea
              rows="4"
              placeholder="Write any specific requirements or conditions..."
              className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="md:col-span-2 flex justify-center">
            <button
              type="submit"
              className="bg-green-600 text-white px-8 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Submit Request
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
