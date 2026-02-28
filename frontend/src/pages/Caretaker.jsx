import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Caretaker() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activePage, setActivePage] = useState("userDetails");
  const [user, setUser] = useState(null);
  const [isAvailable, setIsAvailable] = useState(true);

  const [notifications] = useState([
    {
      id: 1,
      message: "New shift assigned for tomorrow 9 AM",
      time: "5 min ago",
      unread: true,
    },
    {
      id: 2,
      message: "Patient John Smith requested care notes update",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      message: "Weekly report submission due in 2 days",
      time: "3 hours ago",
      unread: false,
    },
  ]);

  const [assignedPatients] = useState([
    {
      id: 1,
      name: "John Smith",
      age: 78,
      condition: "Mobility Issues, Diabetes",
      address: "456 Oak Street",
      phone: "+1 (555) 111-2222",
      emergencyContact: "Jane Smith - +1 (555) 333-4444",
      medications: ["Metformin 500mg", "Lisinopril 10mg"],
      nextAppointment: "2025-10-11",
      notes: "Requires assistance with mobility. Very cooperative patient.",
    },
    {
      id: 2,
      name: "Mary Johnson",
      age: 65,
      condition: "Post-surgery Recovery",
      address: "789 Pine Avenue",
      phone: "+1 (555) 555-6666",
      emergencyContact: "Robert Johnson - +1 (555) 777-8888",
      medications: ["Pain Relief", "Antibiotics"],
      nextAppointment: "2025-10-12",
      notes: "Recovering from hip surgery. Needs help with daily activities.",
    },
  ]);

  const [dailyReportForm, setDailyReportForm] = useState({
    date: new Date().toISOString().split("T")[0],
    patient: "",
    startTime: "",
    endTime: "",
    activities: "",
    vitals: {
      bloodPressure: "",
      temperature: "",
      heartRate: "",
      oxygenSaturation: "",
    },
    medications: "",
    observations: "",
    concerns: "",
    nextVisitNotes: "",
  });

  const [careNotes, setCareNotes] = useState([
    {
      id: 1,
      patient: "John Smith",
      date: "2025-10-09",
      time: "14:30",
      note: "Patient showed improvement in mobility. Completed physical therapy exercises with minimal assistance.",
      category: "Progress",
    },
    {
      id: 2,
      patient: "Mary Johnson",
      date: "2025-10-08",
      time: "10:15",
      note: "Post-surgery wound healing well. Patient in good spirits and following medication schedule.",
      category: "Medical",
    },
  ]);

  const [caretakerData, setCaretakerData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    specialization: "",
    experience: "",
    license: "",
    emergencyContact: "",
  });

  useEffect(() => {
    const fetchUserAndDetails = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        // basic user info (name, email, phone)
        const basicReq = axios
          .get(`http://localhost:4000/api/auth/user/${userId}`)
          .catch(() => ({ data: null }));

        // saved caretaker details (address, specialization, ...)
        // (make sure you have this route on the backend: GET /api/userdetails/details/:userId)
        const detailsReq = axios
          .get(`http://localhost:4000/api/userdetails/details/${userId}`)
          .catch(() => ({ data: null }));

        const [basicRes, detailsRes] = await Promise.all([
          basicReq,
          detailsReq,
        ]);

        // update caretakerData using one state setter (no setAddress/setEmail etc.)
        setCaretakerData((prev) => ({
          ...prev,
          name: basicRes?.data?.name ?? prev.name,
          email: basicRes?.data?.email ?? prev.email,
          phone: basicRes?.data?.phone ?? prev.phone,
          // overwrite with saved details if they exist
          address: detailsRes?.data?.address ?? prev.address,
          specialization:
            detailsRes?.data?.specialization ?? prev.specialization,
          experience: detailsRes?.data?.experience ?? prev.experience,
          license: detailsRes?.data?.license ?? prev.license,
          emergencyContact:
            detailsRes?.data?.emergencyContact ?? prev.emergencyContact,
        }));

        // keep full user object if you need it elsewhere
        if (basicRes?.data) setUser(basicRes.data);
      } catch (err) {
        console.error("Error loading user/details:", err);
      }
    };

    fetchUserAndDetails();
  }, []);

  // ----------------- Replace your handleUserDataSave with this -----------------
  const handleUserDataSave = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return alert("User not logged in.");

      const payload = {
        userId,
        // backend route expects name,email,phone in UserDetails for first save (we send them too)
        name: caretakerData.name,
        email: caretakerData.email,
        phone: caretakerData.phone,
        address: caretakerData.address,
        specialization: caretakerData.specialization,
        experience: caretakerData.experience,
        license: caretakerData.license,
        emergencyContact: caretakerData.emergencyContact,
      };

      const res = await axios.post(
        "http://localhost:4000/api/userdetails/save",
        payload
      );
      alert(res.data?.message ?? "Saved");
      // update local state with saved response (if backend returns details)
      if (res.data?.details)
        setCaretakerData((prev) => ({ ...prev, ...res.data.details }));
    } catch (err) {
      console.error("Error saving details:", err);
      alert("Failed to save details");
    }
  };

  const handleReportSubmit = (e) => {
    e.preventDefault();
    alert("Daily report submitted successfully!");
    setDailyReportForm({
      date: new Date().toISOString().split("T")[0],
      patient: "",
      startTime: "",
      endTime: "",
      activities: "",
      vitals: {
        bloodPressure: "",
        temperature: "",
        heartRate: "",
        oxygenSaturation: "",
      },
      medications: "",
      observations: "",
      concerns: "",
      nextVisitNotes: "",
    });
  };
  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // ---------------- Render Functions ----------------

  const renderNotificationsPage = () => (
    <div className="cont  h-screen ">
      <div className="cont p-6  bg-sky-100 rounded-lg shadow-sm border">
        <h2 className="text-2xl font-bold mb-6">Notifications</h2>

        {notifications.length === 0 ? (
          <p>No new notifications.</p>
        ) : (
          <div className="space-y-4">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 rounded-lg shadow-sm border ${
                  notif.unread ? "bg-blue-50" : "bg-white"
                }`}
              >
                <p className="font-semibold">{notif.message}</p>
                <p className="text-sm text-gray-500">{notif.time}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderUserDetailsPage = () => (
    <div className="cont p-6 bg-sky-100 rounded-lg shadow-sm border">
      <h2 className="text-2xl font-bold mb-6">Edit Caretaker Details</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleUserDataSave();
        }}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label>Full Name</label>
            <input
              type="text"
              value={caretakerData.name}
              onChange={(e) =>
                setCaretakerData({ ...caretakerData, name: e.target.value })
              }
              className="w-full border px-4 py-2 rounded-lg"
              required
            />
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              value={caretakerData.email}
              onChange={(e) =>
                setCaretakerData({ ...caretakerData, email: e.target.value })
              }
              className="w-full border px-4 py-2 rounded-lg"
              required
            />
          </div>
          <div>
            <label>Phone</label>
            <input
              type="tel"
              value={caretakerData.phone}
              onChange={(e) =>
                setCaretakerData({ ...caretakerData, phone: e.target.value })
              }
              className="w-full border px-4 py-2 rounded-lg"
              required
            />
          </div>
          <div>
            <label>NIC Number</label>
            <input
              type="text"
              value={caretakerData.license}
              onChange={(e) =>
                setCaretakerData({ ...caretakerData, license: e.target.value })
              }
              className="w-full border px-4 py-2 rounded-lg"
              required
            />
          </div>
        </div>
        <div>
          <label>Address</label>
          <input
            type="text"
            value={caretakerData.address}
            onChange={(e) =>
              setCaretakerData({ ...caretakerData, address: e.target.value })
            }
            className="w-full border px-4 py-2 rounded-lg"
            required
          />
        </div>
        <div>
          <label>Specialization</label>
          <textarea
            value={caretakerData.specialization}
            onChange={(e) =>
              setCaretakerData({
                ...caretakerData,
                specialization: e.target.value,
              })
            }
            className="w-full border px-4 py-2 rounded-lg"
            rows={3}
          />
        </div>
        <div>
          <label>Emergency Contact</label>
          <input
            type="tel"
            value={caretakerData.emergencyContact}
            onChange={(e) =>
              setCaretakerData({
                ...caretakerData,
                emergencyContact: e.target.value,
              })
            }
            className="w-full border px-4 py-2 rounded-lg"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Save Changes
        </button>
      </form>
    </div>
  );

  const renderAssignedPatientsPage = () => (
    <div className="cont space-y-6">
      <div className="rounded-lg h-16 w-full bg-sky-100">
        <h2 className="text-2xl font-bold text-gray-900 p-4">
          Assigned Patients
        </h2>
      </div>
      <div className="cont p-0">
        {assignedPatients.map((patient) => (
          <div
            key={patient.id}
            className="bg-sky-100 rounded-lg shadow-sm border p-6 mb-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {patient.name}
                </h3>
                <p className="text-gray-600">
                  Age: {patient.age} • Next Visit: {patient.nextAppointment}
                </p>
              </div>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Contact Information
                </h4>
                <p className="text-sm text-gray-600 mb-1">
                  📍 {patient.address}
                </p>
                <p className="text-sm text-gray-600 mb-1">📞 {patient.phone}</p>
                <p className="text-sm text-gray-600">
                  🚨 {patient.emergencyContact}
                </p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Medical Information
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Condition:</strong> {patient.condition}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Medications:</strong>
                </p>
                <ul className="text-sm text-gray-600 list-disc list-inside">
                  {patient.medications.map((med, index) => (
                    <li key={index}>{med}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <h4 className="font-medium text-gray-900 mb-2">Care Notes</h4>
              <p className="text-sm text-gray-600">{patient.notes}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAvailabilityPage = () => (
    <div className="ava bg-sky-100 rounded-lg shadow-sm border p-6">
      <h2 className="text-2xl font-bold text-gray-900 h-fit mb-16">
        Availability Settings
      </h2>

      <div className="space-y-12">
        <div className="flex items-center justify-between p-8 bg-gray-50 rounded-lg">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Current Availability Status
            </h3>
            <p className="text-gray-600">
              Toggle your availability for new patient assignments
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="text-center">
          <div
            className={`inline-flex items-center px-6 py-3 rounded-full text-lg font-semibold ${
              isAvailable
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {isAvailable
              ? "✅ Available for New Assignments"
              : "❌ Currently Unavailable"}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">
            Availability Guidelines
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>
              • When available, you may receive new patient assignment
              notifications
            </li>
            <li>
              • Existing patient schedules remain active regardless of
              availability status
            </li>
            <li>
              • Set to unavailable during vacations or when at maximum capacity
            </li>
            <li>• Emergency assignments may override availability settings</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const renderReportsPage = () => (
    <div className="cont  ">
      <div className=" p-5 mb-6 bg-sky-100 rounded-lg shadow-sm border">
        <h2 className="text-2xl font-bold mb-10">Daily Reports & Care Notes</h2>
      </div>

      <form
        onSubmit={handleReportSubmit}
        className="mb-6 p-4 border rounded-lg bg-sky-100"
      >
        <h3 className="font-semibold  ">Submit Daily Report</h3>
        <div className="space-y-4 mt-4">
          <input
            type="text"
            placeholder="Patient"
            value={dailyReportForm.patient}
            onChange={(e) =>
              setDailyReportForm({
                ...dailyReportForm,
                patient: e.target.value,
              })
            }
            className="w-full mb-2 border px-2 py-1 rounded-lg"
            required
          />
          <textarea
            placeholder="Activities"
            value={dailyReportForm.activities}
            onChange={(e) =>
              setDailyReportForm({
                ...dailyReportForm,
                activities: e.target.value,
              })
            }
            className="w-full mb-2 border px-2 py-1 rounded-lg"
            rows={3}
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Submit
          </button>
        </div>
      </form>

      <h3 className="font-semibold mb-2">Recent Care Notes</h3>
      {careNotes.map((note) => (
        <div
          key={note.id}
          className="mb-2 p-2 border rounded-lg bg-white shadow-sm"
        >
          <p>
            <strong>{note.patient}</strong> ({note.date} at {note.time})
          </p>
          <p>{note.note}</p>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex ">
        {/* Sidebar */}
        <div className="w-20 bg-sky-300 shadow-lg border-r p-4 flex flex-col md:w-80">
          {/* User Profile */}
          <div className="text-center mb-8">
            <div className="w-10 h-10 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center md:w-24 md:h-24">
              <span className="text-white text-2xl font-bold">
                {caretakerData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
            <p className="text-gray-500 text-xs font-light md:text-xl">
              Welcome
            </p>
            <h2 className="text-xs font-bold text-gray-900 md:text-xl">
              {caretakerData.name}
            </h2>
          </div>
          {/* Action Circles */}
          <div className="flex justify-center space-x-6 mb-3">
            <button
              onClick={() => setActivePage("notifications")}
              className="relative w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors"
            >
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-5 5v-5zM12 3a9 9 0 11-9 9 9 9 0 019-9z"
                />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActivePage("userDetails")}
              className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center hover:bg-green-200 transition-colors"
            >
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </button>
          </div>{" "}
          {/* Navigation */}
          <nav className="space-y-2 mt-3">
            {[
              { id: "userDetails", label: "User Details", icon: "👤" },
              {
                id: "assignedPatients",
                label: "Assigned Patients",
                icon: "🏥",
              },
              { id: "availability", label: "Availability Toggle", icon: "⏰" },
              {
                id: "reports",
                label: "Daily Reports & Care Notes",
                icon: "📋",
              },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`w-10  text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors md:w-full   ${
                  activePage === item.id
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="ml-4 hidden md:block">{item.label}</span>
              </button>
            ))}
          </nav>
          {/* Logout Button */}
          <div className="mt-auto pt-4">
            <button
              onClick={handleLogout}
              className="w-10 md:w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors text-red-600 hover:bg-red-50 font-medium"
            >
              <span className="text-lg">🚪</span>
              <span className="ml-4 hidden md:block">Logout</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {activePage === "notifications" && renderNotificationsPage()}
          {activePage === "userDetails" && renderUserDetailsPage()}
          {activePage === "assignedPatients" && renderAssignedPatientsPage()}
          {activePage === "availability" && renderAvailabilityPage()}
          {activePage === "reports" && renderReportsPage()}
        </div>
      </div>
    </div>
  );
}
