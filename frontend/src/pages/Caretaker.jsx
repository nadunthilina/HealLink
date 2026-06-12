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

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      fetchAvailability();
    }
  }, [userId]);

  const fetchAvailability = async () => {
    try {
      if (!userId) return;

      const response = await axios.get(
        `http://localhost:4000/api/userdetails/availability/${userId}`,
      );

      setIsAvailable(response.data.availability ?? true);
    } catch (error) {
      console.error("Availability fetch error:", error);
    }
  };

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
        payload,
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

  const handleAvailabilityChange = async (e) => {
    const newStatus = e.target.checked;

    try {
      setIsAvailable(newStatus);

      await axios.patch(
        `http://localhost:4000/api/userdetails/availability/${userId}`,
        {
          availability: newStatus,
        },
      );
    } catch (error) {
      console.error("Availability update failed:", error);

      setIsAvailable(!newStatus);

      alert("Failed to update availability");
    }
  };

  const handleLogout = () => {
    logout(); // Use the logout from useAuth context
    navigate("/login");
  };

  // ---------------- Render Functions ----------------

  const renderNotificationsPage = () => (
    <div className="max-w-6xl mx-auto mr-10">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-primary/5 p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
        </div>

        <div className="p-6">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔔</span>
              </div>
              <p className="text-gray-500">No new notifications.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 rounded-xl border transition-all ${
                    notif.unread
                      ? "bg-primary/5 border-primary/20"
                      : "bg-white border-gray-100 hover:border-primary/20"
                  }`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <p
                      className={`font-medium ${notif.unread ? "text-primary" : "text-gray-700"}`}
                    >
                      {notif.message}
                    </p>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {notif.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderUserDetailsPage = () => (
    <div className="max-w-6xl mx-auto mr-10">
      <div className="bg-blue-50 rounded-xl shadow-sm border border-gray-100 overflow-hidden ">
        <div className="bg-primary/5 p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            Professional Profile
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Keep your professional information up to date
          </p>
        </div>

        <div className="p-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUserDataSave();
            }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  value={caretakerData.name}
                  onChange={(e) =>
                    setCaretakerData({ ...caretakerData, name: e.target.value })
                  }
                  className="w-full border border-gray-200 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-gray-700"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  value={caretakerData.email}
                  onChange={(e) =>
                    setCaretakerData({
                      ...caretakerData,
                      email: e.target.value,
                    })
                  }
                  className="w-full border border-gray-200 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-gray-700"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Phone number
                </label>
                <input
                  type="tel"
                  value={caretakerData.phone}
                  onChange={(e) =>
                    setCaretakerData({
                      ...caretakerData,
                      phone: e.target.value,
                    })
                  }
                  className="w-full border border-gray-200 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-gray-700"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  NIC Number / License
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
                  className="w-full border border-gray-200 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-gray-700"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Home Address
              </label>
              <input
                type="text"
                value={caretakerData.address}
                onChange={(e) =>
                  setCaretakerData({
                    ...caretakerData,
                    address: e.target.value,
                  })
                }
                className="w-full border border-gray-200 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-gray-700"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Specialization & Skills
              </label>
              <textarea
                value={caretakerData.specialization}
                onChange={(e) =>
                  setCaretakerData({
                    ...caretakerData,
                    specialization: e.target.value,
                  })
                }
                className="w-full border border-gray-200 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-gray-700"
                rows={3}
                placeholder="e.g. Elderly Care, Post-surgery, Mobility Assistance..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
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
                className="w-full border border-gray-200 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-gray-700"
                placeholder="Name - Phone Number"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="bg-primary hover:bg-[#0519d9] text-white py-2.5 px-8 rounded-lg font-semibold transition-all shadow-md shadow-primary/20 hover:shadow-lg hover:-translate-y-0.5 w-full md:w-auto active:scale-95"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  const renderAssignedPatientsPage = () => (
    <div className="max-w-6xl mx-auto mr-10">
      <div className="flex items-center justify-between mb-8 px-2">
        <h2 className="text-2xl font-bold text-gray-900">Assigned Patients</h2>
        <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-primary/10">
          {assignedPatients.length} Active Patients
        </span>
      </div>

      <div className="space-y-6">
        {assignedPatients.map((patient) => (
          <div
            key={patient.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group"
          >
            <div className="p-8">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-2xl font-black text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-inner">
                    {patient.name[0]}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                      {patient.name}
                    </h3>
                    <p className="text-sm text-gray-500 font-medium">
                      Age: {patient.age} • Next Appointment:{" "}
                      <span className="text-primary/70">
                        {patient.nextAppointment}
                      </span>
                    </p>
                  </div>
                </div>
                <span className="bg-green-50 text-green-600 px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-green-100 shadow-sm">
                  ● Active Care
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-gray-50 pt-8">
                <div className="space-y-5">
                  <div>
                    <h4 className="text-[10px] font-bold text-primary/40 uppercase tracking-[0.2em] mb-3">
                      Contact Information
                    </h4>
                    <div className="space-y-3 text-sm text-gray-600">
                      <p className="flex items-start gap-3 group/item">
                        <span className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-primary group-hover/item:bg-primary/10 transition-colors">
                          📍
                        </span>
                        <span className="mt-1 font-medium">
                          {patient.address}
                        </span>
                      </p>
                      <p className="flex items-center gap-3 group/item">
                        <span className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-primary group-hover/item:bg-primary/10 transition-colors">
                          📞
                        </span>
                        <span className="font-medium">{patient.phone}</span>
                      </p>
                      <p className="flex items-start gap-3 group/item">
                        <span className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500">
                          🚨
                        </span>
                        <span className="mt-1 font-bold text-red-600/80">
                          {patient.emergencyContact}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <h4 className="text-[10px] font-bold text-primary/40 uppercase tracking-[0.2em] mb-3">
                      Medical Overview
                    </h4>
                    <div className="space-y-4">
                      <div className="bg-primary/5 p-3 rounded-xl border border-primary/10">
                        <p className="text-xs font-bold text-primary/60 uppercase mb-1">
                          Condition
                        </p>
                        <p className="text-sm font-bold text-gray-800">
                          {patient.condition}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase mb-2">
                          Medications
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {patient.medications.map((med, index) => (
                            <span
                              key={index}
                              className="text-[10px] bg-secondary px-3 py-1.5 rounded-full text-primary font-bold border border-primary/10 hover:bg-primary hover:text-white transition-all cursor-default"
                            >
                              {med}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-50">
                <h4 className="text-[10px] font-bold text-primary/40 uppercase tracking-[0.2em] mb-4">
                  Latest Practitioner Notes
                </h4>
                <div className="relative">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/10 rounded-full"></div>
                  <p className="text-sm text-gray-600 pl-6 italic leading-relaxed">
                    "{patient.notes}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAvailabilityPage = () => (
    <div className="max-w-6xl mx-auto mr-10">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-primary/5 p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Work Availability</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage your service status
          </p>
        </div>

        <div className="p-8">
          <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-gray-50 rounded-xl gap-6">
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-bold text-gray-900">Status Toggle</h3>
              <p className="text-sm text-gray-500">
                When active, you are visible for new patient assignments
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer scale-125">
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={handleAvailabilityChange}
                className="sr-only peer"
              />
              <div className="w-14 h-8 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="mt-10 text-center">
            <div
              className={`inline-flex items-center px-8 py-3 rounded-full text-lg font-bold shadow-sm ${
                isAvailable
                  ? "bg-green-50 text-green-700 border border-green-100"
                  : "bg-red-50 text-red-700 border border-red-100"
              }`}
            >
              {isAvailable
                ? "● Available for Assignments"
                : "○ Currently Offline"}
            </div>
          </div>

          <div className="mt-12 bg-primary/5 rounded-xl p-6 border border-primary/10">
            <h4 className="font-bold text-primary mb-4 flex items-center gap-2">
              <span className="text-xl">ℹ️</span> Availability Guidelines
            </h4>
            <ul className="space-y-3">
              {[
                "Visible to patients looking for immediate care",
                "Existing schedules remain active regardless of status",
                "Set to offline during time-off or reached capacity",
                "Emergency overrides may apply for critical cases",
              ].map((text, idx) => (
                <li
                  key={idx}
                  className="text-sm text-gray-600 flex items-start gap-3"
                >
                  <span className="text-primary mt-1">•</span>
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReportsPage = () => (
    <div className="max-w-6xl mx-auto mr-10 space-y-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-primary/5 p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            Log Daily Activity
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Submit progress and care reports
          </p>
        </div>

        <div className="p-6">
          <form onSubmit={handleReportSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">
                  Patient Name
                </label>
                <input
                  type="text"
                  placeholder="Select or enter patient"
                  value={dailyReportForm.patient}
                  onChange={(e) =>
                    setDailyReportForm({
                      ...dailyReportForm,
                      patient: e.target.value,
                    })
                  }
                  className="w-full border border-gray-200 px-4 py-2 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">
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
                  className="w-full border border-gray-200 px-4 py-2 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Activities Performed
              </label>
              <textarea
                placeholder="What care was provided today?"
                value={dailyReportForm.activities}
                onChange={(e) =>
                  setDailyReportForm({
                    ...dailyReportForm,
                    activities: e.target.value,
                  })
                }
                className="w-full border border-gray-200 px-4 py-2 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                rows={4}
                required
              />
            </div>

            <button
              type="submit"
              className="bg-primary hover:bg-[#0519d9] text-white py-2.5 px-8 rounded-lg font-bold transition-all shadow-md shadow-primary/20 hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
            >
              Submit Daily Report
            </button>
          </form>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4 px-2">
          History & Care Notes
        </h3>
        <div className="space-y-3">
          {careNotes.map((note) => (
            <div
              key={note.id}
              className="p-5 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-bold text-gray-900">{note.patient}</h4>
                  <p className="text-xs text-gray-400">
                    {note.date} at {note.time}
                  </p>
                </div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border ${
                    note.category === "Medical"
                      ? "bg-red-50 text-red-600 border-red-100"
                      : "bg-blue-50 text-blue-600 border-blue-100"
                  }`}
                >
                  {note.category}
                </span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {note.note}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden fixed top-4 right-4 z-[60]">
        <button
          onClick={() => {
            const sidebar = document.getElementById("sidebar");
            const overlay = document.getElementById("sidebar-overlay");
            sidebar.classList.remove("-translate-x-full");
            overlay.classList.remove("hidden");
          }}
          className="p-2 bg-blue-900 text-white rounded-lg shadow-lg"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Sidebar - Matching AdminLayout */}
      <aside
        id="sidebar"
        className="fixed inset-y-0 left-0 z-50 w-64 h-screen bg-gradient-to-b from-blue-900 to-blue-800 text-white p-5 flex flex-col shadow-xl transform -translate-x-full md:translate-x-0 transition-transform duration-300 ease-in-out"
      >
        {/* Logo - Matching AdminLayout */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="bg-white p-2 rounded-lg">
            <svg
              className="w-8 h-8 text-blue-900"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <span className="text-2xl font-bold">HealLink</span>
        </div>

        {/* User Profile Card - Matching AdminLayout */}
        <div className="bg-blue-800 bg-opacity-50 rounded-lg p-2 mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 rounded-2xl p-2 border border-blue-400">
              <span className="text-white text-sm font-bold">
                {caretakerData.name
                  ? caretakerData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                  : "CT"}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold truncate w-32">
                {caretakerData.name}
              </p>
              <p className="text-xs text-blue-200">Caretaker</p>
            </div>
          </div>
        </div>

        {/* Navigation - Matching AdminLayout style */}
        <nav className="flex-1 space-y-2">
          {[
            {
              id: "userDetails",
              label: "My Profile",
              icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
            },
            {
              id: "assignedPatients",
              label: "Patients",
              icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
            },
            {
              id: "availability",
              label: "Availability",
              icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
            },
            {
              id: "reports",
              label: "Daily Reports",
              icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
            },
            {
              id: "notifications",
              label: "Notifications",
              icon: "M15 17h5l-5 5v-5zM12 3a9 9 0 11-9 9 9 9 0 019-9z",
            },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActivePage(item.id);
                if (window.innerWidth < 768) {
                  document
                    .getElementById("sidebar")
                    .classList.add("-translate-x-full");
                  document
                    .getElementById("sidebar-overlay")
                    .classList.add("hidden");
                }
              }}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                activePage === item.id
                  ? "bg-blue-600 border border-blue-400 font-medium"
                  : "hover:bg-blue-800 text-blue-100"
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={item.icon}
                />
              </svg>
              <span>{item.label}</span>
              {item.id === "notifications" && unreadCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Logout - Matching AdminLayout */}
        <div className="pt-4 border-t border-blue-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-red-600 hover:text-white transition-colors text-blue-100"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Sidebar Overlay */}
      <div
        onClick={() => {
          document.getElementById("sidebar").classList.add("-translate-x-full");
          document.getElementById("sidebar-overlay").classList.add("hidden");
        }}
        id="sidebar-overlay"
        className="fixed inset-0 bg-black bg-opacity-50 z-40 hidden md:hidden backdrop-blur-sm"
      ></div>

      {/* Main Content Area - Matching AdminLayout */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar - Matching AdminDashboard header pattern */}
        <header className="bg-white shadow-sm border-b border-gray-200 py-4 px-8 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-800 capitalize">
              {activePage === "userDetails"
                ? "Profile"
                : activePage.replace(/([A-Z])/g, " $1")}
            </h1>
            <p className="text-sm text-gray-500">Caretaker Portal Interface</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-900">
                {caretakerData.name}
              </p>
              <p
                className={`text-xs font-medium whitespace-nowrap ${
                  isAvailable ? "text-green-600" : "text-red-600"
                }`}
              >
                {isAvailable ? "● Available" : "● Offline"}
              </p>
            </div>
          </div>
        </header>

        {/* Content Scrolling Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-8xl ml-0">
            {activePage === "notifications" && renderNotificationsPage()}
            {activePage === "userDetails" && renderUserDetailsPage()}
            {activePage === "assignedPatients" && renderAssignedPatientsPage()}
            {activePage === "availability" && renderAvailabilityPage()}
            {activePage === "reports" && renderReportsPage()}
          </div>
        </div>
      </main>
    </div>
  );
}
