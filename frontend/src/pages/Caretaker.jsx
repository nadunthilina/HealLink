import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

export default function Caretaker() {
  const [activePage, setActivePage] = useState("userDetails");
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

  const [caretakerData, setCaretakerData] = useState({
    name: "Sarah Johnson",
    email: "sarah.johnson@heallink.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, Downtown District",
    specialization: "Elderly Care, Physical Therapy",
    experience: "5 years",
    license: "CNA-12345",
    emergencyContact: "+1 (555) 987-6543",
  });

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

  const handleUserDataSave = () => {
    alert("Profile updated successfully!");
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

  const renderUserDetailsPage = () => (
    <div className="cont">
      <div className="bg-sky-100 rounded-lg shadow-sm border p-6  ">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Edit User Details
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUserDataSave();
          }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={caretakerData.name}
                onChange={(e) =>
                  setCaretakerData({ ...caretakerData, name: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={caretakerData.email}
                onChange={(e) =>
                  setCaretakerData({ ...caretakerData, email: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={caretakerData.phone}
                onChange={(e) =>
                  setCaretakerData({ ...caretakerData, phone: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                License Number
              </label>
              <input
                type="text"
                value={caretakerData.license}
                onChange={(e) =>
                  setCaretakerData({
                    ...caretakerData,
                    license: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <input
              type="text"
              value={caretakerData.address}
              onChange={(e) =>
                setCaretakerData({ ...caretakerData, address: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specialization
            </label>
            <textarea
              value={caretakerData.specialization}
              onChange={(e) =>
                setCaretakerData({
                  ...caretakerData,
                  specialization: e.target.value,
                })
              }
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="List your areas of specialization..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Emergency Contact
            </label>
            <input
              type="tel"
              value={caretakerData.emergencyContact}
              onChange={(e) =>
                setCaretakerData({
                  ...caretakerData,
                  emergencyContact: e.target.value,
                })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button type="submit" className="btn-primary">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );

  const renderAssignedPatientsPage = () => (
    <div className="cont space-y-6">
      <div className="rounded-lg h-16 w-full bg-sky-100  ">
        <h2 className="text-2xl font-bold text-gray-900 p-4">
          Assigned Patients
        </h2>
      </div>
      {assignedPatients.map((patient) => (
        <div
          key={patient.id}
          className=" bg-sky-100 rounded-lg shadow-sm border p-6"
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
              <p className="text-sm text-gray-600 mb-1">📍 {patient.address}</p>
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
  );

  const renderAvailabilityPage = () => (
    <div className="ava bg-sky-100  rounded-lg shadow-sm border p-6 ">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Availability Settings
      </h2>

      <div className="space-y-8">
        <div className="flex items-center justify-between p-6 bg-gray-50 rounded-lg">
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
    <div className="cont space-y-8">
      {/* Daily Report Form */}
      <div className=" bg-sky-100  rounded-lg shadow-sm border p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Submit Daily Report
        </h2>
        <form onSubmit={handleReportSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={dailyReportForm.date}
                onChange={(e) =>
                  setDailyReportForm({
                    ...dailyReportForm,
                    date: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Time
              </label>
              <input
                type="time"
                value={dailyReportForm.startTime}
                onChange={(e) =>
                  setDailyReportForm({
                    ...dailyReportForm,
                    startTime: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Time
              </label>
              <input
                type="time"
                value={dailyReportForm.endTime}
                onChange={(e) =>
                  setDailyReportForm({
                    ...dailyReportForm,
                    endTime: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Patient
            </label>
            <select
              value={dailyReportForm.patient}
              onChange={(e) =>
                setDailyReportForm({
                  ...dailyReportForm,
                  patient: e.target.value,
                })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Patient</option>
              {assignedPatients.map((patient) => (
                <option key={patient.id} value={patient.name}>
                  {patient.name}
                </option>
              ))}
            </select>
          </div>

          {/* Vital Signs */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Vital Signs
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Blood Pressure
                </label>
                <input
                  type="text"
                  placeholder="120/80"
                  value={dailyReportForm.vitals.bloodPressure}
                  onChange={(e) =>
                    setDailyReportForm({
                      ...dailyReportForm,
                      vitals: {
                        ...dailyReportForm.vitals,
                        bloodPressure: e.target.value,
                      },
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Temperature (°F)
                </label>
                <input
                  type="text"
                  placeholder="98.6"
                  value={dailyReportForm.vitals.temperature}
                  onChange={(e) =>
                    setDailyReportForm({
                      ...dailyReportForm,
                      vitals: {
                        ...dailyReportForm.vitals,
                        temperature: e.target.value,
                      },
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Heart Rate
                </label>
                <input
                  type="text"
                  placeholder="72 bpm"
                  value={dailyReportForm.vitals.heartRate}
                  onChange={(e) =>
                    setDailyReportForm({
                      ...dailyReportForm,
                      vitals: {
                        ...dailyReportForm.vitals,
                        heartRate: e.target.value,
                      },
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Oxygen Sat (%)
                </label>
                <input
                  type="text"
                  placeholder="98%"
                  value={dailyReportForm.vitals.oxygenSaturation}
                  onChange={(e) =>
                    setDailyReportForm({
                      ...dailyReportForm,
                      vitals: {
                        ...dailyReportForm.vitals,
                        oxygenSaturation: e.target.value,
                      },
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Activities Performed
            </label>
            <textarea
              value={dailyReportForm.activities}
              onChange={(e) =>
                setDailyReportForm({
                  ...dailyReportForm,
                  activities: e.target.value,
                })
              }
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
              placeholder="Describe activities performed during the visit..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Medications Administered
            </label>
            <textarea
              value={dailyReportForm.medications}
              onChange={(e) =>
                setDailyReportForm({
                  ...dailyReportForm,
                  medications: e.target.value,
                })
              }
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
              placeholder="List medications given, dosages, and times..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Patient Observations
            </label>
            <textarea
              value={dailyReportForm.observations}
              onChange={(e) =>
                setDailyReportForm({
                  ...dailyReportForm,
                  observations: e.target.value,
                })
              }
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
              placeholder="Note patient's condition, mood, responsiveness, etc..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Concerns or Issues
            </label>
            <textarea
              value={dailyReportForm.concerns}
              onChange={(e) =>
                setDailyReportForm({
                  ...dailyReportForm,
                  concerns: e.target.value,
                })
              }
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
              placeholder="Report any concerns, incidents, or unusual observations..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes for Next Visit
            </label>
            <textarea
              value={dailyReportForm.nextVisitNotes}
              onChange={(e) =>
                setDailyReportForm({
                  ...dailyReportForm,
                  nextVisitNotes: e.target.value,
                })
              }
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
              placeholder="Instructions or reminders for the next caretaker visit..."
            />
          </div>

          <button type="submit" className="btn-primary">
            Submit Daily Report
          </button>
        </form>
      </div>

      {/* Care Notes History */}
      <div className="bg-sky-100 rounded-lg shadow-sm border p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Recent Care Notes
        </h2>
        <div className="space-y-4">
          {careNotes.map((note) => (
            <div
              key={note.id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {note.patient}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {note.date} at {note.time}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    note.category === "Progress"
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {note.category}
                </span>
              </div>
              <p className="text-gray-700">{note.note}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex pt-16">
        {/* Sidebar */}
        <div className="cont2">
          <div className=" bg-sky-300 shadow-lg border-r min-h-full ">
            <div className="p-6">
              {/* User Profile Section */}
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    {caretakerData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <p className="text-gray-500 font-light">Welcome</p>
                <h2 className="text-xl font-bold text-gray-900">
                  {caretakerData.name}
                </h2>
              </div>

              {/* Action Circles */}
              <div className="flex justify-center space-x-6 mb-8">
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

                <button
                  onClick={() => setActivePage("email")}
                  className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center hover:bg-purple-200 transition-colors"
                >
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z"
                    />
                  </svg>
                </button>
              </div>

              {/* Navigation Menu */}
              <nav className="space-y-2">
                {[
                  { id: "userDetails", label: "User Details", icon: "👤" },
                  {
                    id: "assignedPatients",
                    label: "Assigned Patients",
                    icon: "🏥",
                  },
                  {
                    id: "availability",
                    label: "Availability Toggle",
                    icon: "⏰",
                  },
                  {
                    id: "reports",
                    label: "Daily Reports & Care Notes",
                    icon: "📋",
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActivePage(item.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center space-x-3 ${
                      activePage === item.id
                        ? "bg-blue-100 text-blue-700 font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-">
          {activePage === "userDetails" && renderUserDetailsPage()}
          {activePage === "assignedPatients" && renderAssignedPatientsPage()}
          {activePage === "availability" && renderAvailabilityPage()}
          {activePage === "reports" && renderReportsPage()}

          {activePage === "notifications" && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Notifications
              </h2>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border-l-4 ${
                      notification.unread
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 bg-gray-50"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p
                          className={`${
                            notification.unread
                              ? "text-blue-900 font-medium"
                              : "text-gray-700"
                          }`}
                        >
                          {notification.message}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {notification.time}
                        </p>
                      </div>
                      {notification.unread && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activePage === "email" && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Email Center
              </h2>
              <div className="text-center py-12">
                <svg
                  className="w-16 h-16 text-gray-400 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z"
                  />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Email Integration
                </h3>
                <p className="text-gray-600">
                  Email functionality will be integrated here for communication
                  with patients and medical staff.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
