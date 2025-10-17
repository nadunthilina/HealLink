import React, { useState } from "react";
import Navbar from "../components/Navbar.jsx";
import "../styles/Care.css";

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
      <div className="care-card-header">
        <h2 className="care-card-title">Edit User Details</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUserDataSave();
          }}
          className="space-y-6"
        >
          <div className="form-grid two-cols">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                value={caretakerData.name}
                onChange={(e) =>
                  setCaretakerData({ ...caretakerData, name: e.target.value })
                }
                className="form-input"
                required
              />
            </div>{" "}
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                value={caretakerData.email}
                onChange={(e) =>
                  setCaretakerData({ ...caretakerData, email: e.target.value })
                }
                className="form-input"
                required
              />
            </div>{" "}
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                value={caretakerData.phone}
                onChange={(e) =>
                  setCaretakerData({ ...caretakerData, phone: e.target.value })
                }
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">License Number</label>
              <input
                type="text"
                value={caretakerData.license}
                onChange={(e) =>
                  setCaretakerData({
                    ...caretakerData,
                    license: e.target.value,
                  })
                }
                className="form-input"
                required
              />
            </div>
          </div>{" "}
          <div className="form-group">
            <label className="form-label">Address</label>
            <input
              type="text"
              value={caretakerData.address}
              onChange={(e) =>
                setCaretakerData({ ...caretakerData, address: e.target.value })
              }
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Specialization</label>
            <textarea
              value={caretakerData.specialization}
              onChange={(e) =>
                setCaretakerData({
                  ...caretakerData,
                  specialization: e.target.value,
                })
              }
              rows={3}
              className="form-textarea"
              placeholder="List your areas of specialization..."
            />
          </div>
          <div className="form-group">
            <label className="form-label">Emergency Contact</label>
            <input
              type="tel"
              value={caretakerData.emergencyContact}
              onChange={(e) =>
                setCaretakerData({
                  ...caretakerData,
                  emergencyContact: e.target.value,
                })
              }
              className="form-input"
            />
          </div>{" "}
          <button type="submit" className="btn-primary">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
  const renderAssignedPatientsPage = () => (
    <div className="cont space-y-6">
      <div className="care-card-header">
        <h2 className="care-card-title">Assigned Patients</h2>
      </div>
      {assignedPatients.map((patient) => (
        <div key={patient.id} className="patient-card">
          <div className="patient-header">
            <div className="patient-info">
              <h3>{patient.name}</h3>
              <p>
                Age: {patient.age} • Next Visit: {patient.nextAppointment}
              </p>
            </div>
            <span className="status-badge">Active</span>
          </div>

          <div className="patient-details">
            <div className="patient-section">
              <h4>Contact Information</h4>
              <p>📍 {patient.address}</p>
              <p>📞 {patient.phone}</p>
              <p>🚨 {patient.emergencyContact}</p>
            </div>

            <div className="patient-section">
              <h4>Medical Information</h4>
              <p>
                <strong>Condition:</strong> {patient.condition}
              </p>
              <p>
                <strong>Medications:</strong>
              </p>
              <ul>
                {patient.medications.map((med, index) => (
                  <li key={index}>{med}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="patient-notes">
            <h4>Care Notes</h4>
            <p>{patient.notes}</p>
          </div>
        </div>
      ))}
    </div>
  );
  const renderAvailabilityPage = () => (
    <div className="availability-container">
      <h2 className="care-card-title">Availability Settings</h2>

      <div className="availability-section">
        <div className="availability-toggle">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Current Availability Status
            </h3>
            <p className="text-gray-600">
              Toggle your availability for new patient assignments
            </p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
              className="toggle-input"
            />
            <div className="toggle-slider"></div>
          </label>
        </div>

        <div className="availability-status">
          <div
            className={`status-indicator ${
              isAvailable ? "available" : "unavailable"
            }`}
          >
            {isAvailable
              ? "✅ Available for New Assignments"
              : "❌ Currently Unavailable"}
          </div>
        </div>

        <div className="guidelines">
          <h4>Availability Guidelines</h4>
          <ul>
            <li>
              When available, you may receive new patient assignment
              notifications
            </li>
            <li>
              Existing patient schedules remain active regardless of
              availability status
            </li>
            <li>
              Set to unavailable during vacations or when at maximum capacity
            </li>
            <li>Emergency assignments may override availability settings</li>
          </ul>
        </div>
      </div>
    </div>
  );
  const renderReportsPage = () => (
    <div className="cont space-y-8">
      {/* Daily Report Form */}
      <div className="care-card-header">
        <h2 className="care-card-title">Submit Daily Report</h2>
        <form onSubmit={handleReportSubmit} className="space-y-6">
          <div className="form-grid three-cols">
            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                type="date"
                value={dailyReportForm.date}
                onChange={(e) =>
                  setDailyReportForm({
                    ...dailyReportForm,
                    date: e.target.value,
                  })
                }
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Start Time</label>
              <input
                type="time"
                value={dailyReportForm.startTime}
                onChange={(e) =>
                  setDailyReportForm({
                    ...dailyReportForm,
                    startTime: e.target.value,
                  })
                }
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">End Time</label>
              <input
                type="time"
                value={dailyReportForm.endTime}
                onChange={(e) =>
                  setDailyReportForm({
                    ...dailyReportForm,
                    endTime: e.target.value,
                  })
                }
                className="form-input"
                required
              />
            </div>
          </div>{" "}
          <div className="form-group">
            <label className="form-label">Patient</label>
            <select
              value={dailyReportForm.patient}
              onChange={(e) =>
                setDailyReportForm({
                  ...dailyReportForm,
                  patient: e.target.value,
                })
              }
              className="form-select"
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
            <div className="form-grid four-cols">
              <div className="form-group">
                <label className="form-label">Blood Pressure</label>
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
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Temperature (°F)</label>
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
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Heart Rate</label>
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
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Oxygen Sat (%)</label>
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
                  className="form-input"
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
    <div className="caretaker-container">
      <Navbar />

      <div className="caretaker-main">
        {/* Sidebar */}
        <div className="cont2">
          <div className="sidebar">
            {/* User Profile Section */}
            <div className="user-profile">
              <div className="user-avatar">
                <span className="user-avatar-text">
                  {caretakerData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
              <p className="welcome-text">Welcome</p>
              <h2 className="user-name">{caretakerData.name}</h2>
            </div>{" "}
            {/* Action Circles */}
            <div className="action-circles">
              <button
                onClick={() => setActivePage("notifications")}
                className="action-circle"
              >
                <svg
                  className="w-6 h-6 text-white"
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
                  <span className="notification-badge">{unreadCount}</span>
                )}
              </button>

              <button
                onClick={() => setActivePage("userDetails")}
                className="action-circle"
              >
                <svg
                  className="w-6 h-6 text-white"
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
                className="action-circle"
              >
                <svg
                  className="w-6 h-6 text-white"
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
            </div>{" "}
            {/* Navigation Menu */}
            <nav className="nav-menu">
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
                  className={`nav-item ${
                    activePage === item.id ? "active" : ""
                  }`}
                >
                  <span className="nav-item-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}{" "}
            </nav>
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
