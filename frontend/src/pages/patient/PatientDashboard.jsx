import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext";
import {
  caretakersAPI,
  patientsAPI,
  schedulesAPI,
  settingsAPI,
} from "../../services/api";

const NAV_ITEMS = [
  {
    id: "profile",
    label: "My Profile",
    title: "Patient Profile",
    icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  },
  {
    id: "caretakers",
    label: "Find Caretakers",
    title: "Matched Caretakers",
    icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
  },
  {
    id: "schedules",
    label: "Schedule History",
    title: "Schedule History",
    icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  },
];

const defaultRates = { fullDayRate: 2800, halfDayRate: 1400 };

export default function PatientDashboard() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [patient, setPatient] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [caretakers, setCaretakers] = useState([]);
  const [matchedCaretakers, setMatchedCaretakers] = useState([]);
  const [rates, setRates] = useState(defaultRates);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("profile");
  const [showCaretakers, setShowCaretakers] = useState(false);
  const [selectedCaretaker, setSelectedCaretaker] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    wardNo: "",
    startDate: "",
    endDate: "",
    startTime: "",
    dayType: "full",
    paymentToAgency: "unpaid",
    notes: "",
  });

  const profileRef = useRef(null);
  const caretakersRef = useRef(null);
  const schedulesRef = useRef(null);
  const bookingSubmitLockRef = useRef(false);

  const normalizeDateKey = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toISOString().split("T")[0];
  };

  const dedupeSchedules = (items) => {
    const byCompositeKey = new Map();

    items.forEach((schedule) => {
      const compositeKey = [
        schedule.patientId?._id || patient?._id || "patient",
        schedule.caretakerId?._id || "caretaker",
        normalizeDateKey(schedule.startDate),
        schedule.startTime || "",
        schedule.dayType || "",
      ].join("::");

      const existing = byCompositeKey.get(compositeKey);
      if (!existing) {
        byCompositeKey.set(compositeKey, schedule);
        return;
      }

      const existingCreated = new Date(existing.createdAt || 0).getTime();
      const currentCreated = new Date(schedule.createdAt || 0).getTime();

      if (currentCreated >= existingCreated) {
        byCompositeKey.set(compositeKey, schedule);
      }
    });

    return Array.from(byCompositeKey.values()).sort(
      (left, right) => new Date(left.startDate) - new Date(right.startDate)
    );
  };

  const groupSchedulesForDisplay = (items) => {
    const sorted = [...items].sort((left, right) => {
      const createdDiff = new Date(left.createdAt || 0) - new Date(right.createdAt || 0);
      if (createdDiff !== 0) return createdDiff;
      return new Date(left.startDate) - new Date(right.startDate);
    });

    const groups = [];

    sorted.forEach((schedule) => {
      const lastGroup = groups[groups.length - 1];
      if (!lastGroup) {
        groups.push({
          id: schedule._id,
          schedules: [schedule],
          caretakerId: schedule.caretakerId,
          startTime: schedule.startTime,
          dayType: schedule.dayType,
          status: schedule.status,
          paymentToAgency: schedule.paymentToAgency,
          createdAt: schedule.createdAt,
          firstDate: schedule.startDate,
          lastDate: schedule.startDate,
          wardNo: schedule.wardNo,
          adminNote: schedule.adminNote,
          jobCompletedByAdmin: schedule.jobCompletedByAdmin,
          jobCompletedByPatient: schedule.jobCompletedByPatient,
        });
        return;
      }

      const lastSchedule = lastGroup.schedules[lastGroup.schedules.length - 1];
      const sameCaretaker = lastSchedule.caretakerId?._id === schedule.caretakerId?._id;
      const sameTime = lastSchedule.startTime === schedule.startTime;
      const sameDayType = lastSchedule.dayType === schedule.dayType;
      const sameStatus = lastSchedule.status === schedule.status;
      const samePayment = lastSchedule.paymentToAgency === schedule.paymentToAgency;
      const createdWindow = Math.abs(
        new Date(lastGroup.createdAt || 0).getTime() - new Date(schedule.createdAt || 0).getTime()
      ) <= 5000;
      const previousDate = new Date(lastSchedule.startDate);
      const currentDate = new Date(schedule.startDate);
      const dayDiff = Math.round((currentDate - previousDate) / (24 * 60 * 60 * 1000));
      const consecutiveDay = dayDiff === 1;

      if (sameCaretaker && sameTime && sameDayType && sameStatus && samePayment && createdWindow && consecutiveDay) {
        lastGroup.schedules.push(schedule);
        lastGroup.lastDate = schedule.startDate;
        lastGroup.jobCompletedByAdmin = lastGroup.jobCompletedByAdmin || schedule.jobCompletedByAdmin;
        lastGroup.jobCompletedByPatient = lastGroup.jobCompletedByPatient || schedule.jobCompletedByPatient;
        if (!lastGroup.adminNote && schedule.adminNote) {
          lastGroup.adminNote = schedule.adminNote;
        }
        return;
      }

      groups.push({
        id: schedule._id,
        schedules: [schedule],
        caretakerId: schedule.caretakerId,
        startTime: schedule.startTime,
        dayType: schedule.dayType,
        status: schedule.status,
        paymentToAgency: schedule.paymentToAgency,
        createdAt: schedule.createdAt,
        firstDate: schedule.startDate,
        lastDate: schedule.startDate,
        wardNo: schedule.wardNo,
        adminNote: schedule.adminNote,
        jobCompletedByAdmin: schedule.jobCompletedByAdmin,
        jobCompletedByPatient: schedule.jobCompletedByPatient,
      });
    });

    return groups.reverse();
  };

  useEffect(() => {
    fetchDashboardData();
    fetchRates();
  }, []);

  const fetchRates = async () => {
    try {
      const { data } = await settingsAPI.getRates();
      setRates(data);
    } catch (error) {
      console.error("Failed to fetch rates:", error);
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [patientRes, schedulesRes, caretakersRes] = await Promise.all([
        patientsAPI.getMine(),
        schedulesAPI.getMine(),
        caretakersAPI.getAll(),
      ]);

      const patientData = patientRes.data;
      const caretakerList = caretakersRes.data.filter(
        (caretaker) => caretaker.status === "active"
      );

      setPatient(patientData);
      setSchedules(dedupeSchedules(schedulesRes.data));
      setCaretakers(caretakerList);
      setMatchedCaretakers(filterCaretakers(caretakerList, patientData.gender));
    } catch (error) {
      console.error("Failed to load patient dashboard:", error);
      Swal.fire({
        icon: "error",
        title: "Load Failed",
        text: error.response?.data?.message || "Failed to load patient dashboard.",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterCaretakers = (list, gender) => {
    return list
      .filter((caretaker) => caretaker.gender === gender)
      .sort((left, right) => {
        if (left.availability === right.availability) return left.name.localeCompare(right.name);
        if (left.availability === "available") return -1;
        if (right.availability === "available") return 1;
        return left.name.localeCompare(right.name);
      });
  };

  const scrollToSection = (sectionId) => {
    const refMap = {
      profile: profileRef,
      caretakers: caretakersRef,
      schedules: schedulesRef,
    };

    setActiveSection(sectionId);
    setIsSidebarOpen(false);
    refMap[sectionId]?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleFindCaretakers = () => {
    if (!patient) return;
    setMatchedCaretakers(filterCaretakers(caretakers, patient.gender));
    setShowCaretakers(true);
    scrollToSection("caretakers");
  };

  const handleOpenBookingModal = (caretaker) => {
    setSelectedCaretaker(caretaker);
    setBookingForm({
      wardNo: patient?.address || "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      startTime: "",
      dayType: "full",
      paymentToAgency: "unpaid",
      notes: "",
    });
    setIsBookingOpen(true);
  };

  const handleBookingSubmit = async (event) => {
    event.preventDefault();
    if (!selectedCaretaker || bookingSubmitLockRef.current) return;

    try {
      bookingSubmitLockRef.current = true;
      setBookingSubmitting(true);
      await schedulesAPI.create({
        caretakerId: selectedCaretaker._id,
        wardNo: bookingForm.wardNo,
        startDate: bookingForm.startDate,
        endDate: bookingForm.endDate || bookingForm.startDate,
        startTime: bookingForm.startTime,
        dayType: bookingForm.dayType,
        paymentToAgency: bookingForm.paymentToAgency,
        notes: bookingForm.notes,
      });

      setIsBookingOpen(false);
      setSelectedCaretaker(null);
      await fetchDashboardData();
      scrollToSection("schedules");

      Swal.fire({
        icon: "success",
        title: "Booked",
        text: "Your caretaker booking has been created successfully.",
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Booking failed:", error);
      Swal.fire({
        icon: "error",
        title: "Booking Failed",
        text: error.response?.data?.message || "Unable to create the booking.",
      });
    } finally {
      bookingSubmitLockRef.current = false;
      setBookingSubmitting(false);
    }
  };

  const handleCompleteSchedule = async (scheduleGroup) => {
    const pendingSchedules = scheduleGroup.schedules.filter(
      (schedule) => !schedule.jobCompletedByPatient && schedule.status !== "completed" && schedule.status !== "cancelled"
    );

    if (pendingSchedules.length === 0) {
      return;
    }

    const result = await Swal.fire({
      title: "Mark schedule as complete?",
      text:
        pendingSchedules.length > 1
          ? `This will mark ${pendingSchedules.length} schedules in this booking as complete.`
          : "This confirms that the caretaker service for this schedule has been completed.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Complete",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await Promise.all(
        pendingSchedules.map((schedule) => schedulesAPI.markPatientComplete(schedule._id))
      );
      await fetchDashboardData();
      Swal.fire({
        icon: "success",
        title: "Marked Complete",
        text: "The schedule has been marked as completed from your side.",
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Failed to complete schedule:", error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.response?.data?.message || "Could not update the schedule.",
      });
    }
  };

  const showAdminNote = (note) => {
    Swal.fire({
      title: "Admin Note",
      text: note || "No note provided.",
      icon: "info",
    });
  };

  const getPaymentAmount = (schedule) => {
    if (schedule.dailyRate) return schedule.dailyRate;
    return schedule.dayType === "full" ? rates.fullDayRate : rates.halfDayRate;
  };

  const formatScheduleDateRange = (group) => {
    const firstDate = new Date(group.firstDate);
    const lastDate = new Date(group.lastDate);

    if (normalizeDateKey(group.firstDate) === normalizeDateKey(group.lastDate)) {
      return `${firstDate.toLocaleDateString()} at ${group.startTime}`;
    }

    return `${firstDate.toLocaleDateString()} - ${lastDate.toLocaleDateString()} at ${group.startTime}`;
  };

  const displayedScheduleGroups = groupSchedulesForDisplay(schedules);

  const pendingSchedules = schedules.filter((schedule) => schedule.status === "pending").length;
  const completedSchedules = schedules.filter((schedule) => schedule.status === "completed").length;
  const pageTitle = NAV_ITEMS.find((item) => item.id === activeSection)?.title || "Patient Profile";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-6">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center max-w-lg w-full">
          <p className="text-gray-600 text-lg">Patient profile not found.</p>
          <button
            onClick={handleLogout}
            className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <div
        className={`fixed left-0 top-0 w-64 h-screen bg-gradient-to-b from-blue-900 to-blue-800 text-white p-5 flex flex-col shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex items-center space-x-3 mb-8">
          <div className="bg-white p-2 rounded-lg">
            <svg className="w-8 h-8 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

        <div className="bg-blue-800 bg-opacity-50 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 rounded-full p-3 text-sm font-bold min-w-12 text-center">
              {patient.name?.charAt(0)?.toUpperCase() || "P"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{patient.name}</p>
              <p className="text-xs text-blue-200 capitalize">{user?.role || "patient"}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`w-full flex items-center space-x-3 py-3 px-4 rounded-lg transition-all duration-200 ${
                activeSection === item.id
                  ? "bg-white text-blue-900 shadow-md"
                  : "text-blue-100 hover:bg-white hover:bg-opacity-10"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="w-full py-2.5 px-4 mt-4 bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      <div className="flex-1 md:ml-64 w-full h-screen overflow-y-auto">
        <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden mr-3 p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{pageTitle}</h1>
                <p className="hidden sm:block text-sm text-gray-500 mt-1">Manage your bookings and caretaker requests</p>
              </div>
            </div>
            <div className="hidden lg:block text-sm text-gray-600">
              {new Date().toLocaleDateString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-sm p-5 border-l-4 border-blue-500">
              <p className="text-sm text-gray-500">Matched Caretakers</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{matchedCaretakers.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-5 border-l-4 border-amber-500">
              <p className="text-sm text-gray-500">Pending Schedules</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{pendingSchedules}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-5 border-l-4 border-green-500">
              <p className="text-sm text-gray-500">Completed Schedules</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{completedSchedules}</p>
            </div>
          </div>

          <section ref={profileRef} className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white ${
                    patient.gender === "female" ? "bg-pink-500" : "bg-teal-500"
                  }`}
                >
                  {patient.name?.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <h2 className="text-2xl font-bold text-gray-800">{patient.name}</h2>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        patient.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {patient.status}
                    </span>
                  </div>
                  <p className="text-teal-600 font-medium text-sm mb-4">{patient.patientId}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Phone</p>
                      <p className="text-sm font-medium text-gray-800">{patient.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Email</p>
                      <p className="text-sm font-medium text-gray-800">{patient.email || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Age</p>
                      <p className="text-sm font-medium text-gray-800">{patient.age}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Gender</p>
                      <p className="text-sm font-medium text-gray-800 capitalize">{patient.gender || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Address</p>
                      <p className="text-sm font-medium text-gray-800">{patient.address || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Emergency Contact</p>
                      <p className="text-sm font-medium text-gray-800">
                        {patient.emergencyContact?.name || "N/A"}
                      </p>
                    </div>
                    {patient.assignedCaretaker && (
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Assigned Caretaker</p>
                        <p className="text-sm font-medium text-gray-800">{patient.assignedCaretaker.name}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section ref={caretakersRef} className="bg-white rounded-lg shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 border-b">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Find Caretakers</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Load caretakers matched to your gender and create a booking request.
                </p>
              </div>
              <button
                onClick={handleFindCaretakers}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Find Caretaker
              </button>
            </div>

            <div className="p-5">
              {!showCaretakers ? (
                <div className="text-center py-10 border border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500">Use the Find Caretaker button to load matching caretakers.</p>
                </div>
              ) : matchedCaretakers.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500">No caretakers found for your profile at the moment.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {matchedCaretakers.map((caretaker) => (
                    <div key={caretaker._id} className="border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-shadow">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-lg font-semibold text-gray-900">{caretaker.name}</h3>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                caretaker.availability === "available"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              {caretaker.availability}
                            </span>
                          </div>
                          <p className="text-sm text-blue-600 font-medium">{caretaker.caretakerId}</p>
                        </div>
                        <div className="text-sm text-gray-500">{caretaker.rating || 0} ★</div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider">Phone</p>
                          <p className="font-medium text-gray-800">{caretaker.phone}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider">Experience</p>
                          <p className="font-medium text-gray-800">{caretaker.experience || "N/A"}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-xs text-gray-500 uppercase tracking-wider">Skills</p>
                          <p className="font-medium text-gray-800">{caretaker.skills || "No skills listed"}</p>
                        </div>
                      </div>

                      <div className="mt-5 flex justify-end">
                        <button
                          onClick={() => handleOpenBookingModal(caretaker)}
                          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                          Book
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section ref={schedulesRef} className="bg-white rounded-lg shadow-sm">
            <div className="p-5 border-b">
              <h2 className="text-lg font-semibold text-gray-800">Schedule History</h2>
              <p className="text-sm text-gray-500 mt-1">
                {schedules.length} schedule{schedules.length !== 1 ? "s" : ""} found
              </p>
            </div>

            <div className="p-5">
              {schedules.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-14 h-14 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-400">No schedules found for this patient.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Caretaker ID</th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Caretaker Name</th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Ward No</th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Day Type</th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Agency Payment</th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Job Status</th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedScheduleGroups.map((scheduleGroup) => (
                        <tr key={scheduleGroup.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-blue-600">
                            {scheduleGroup.caretakerId?.caretakerId || "N/A"}
                          </td>
                          <td className="px-4 py-3 text-sm">{scheduleGroup.caretakerId?.name || "Unknown"}</td>
                          <td className="px-4 py-3 text-sm">{scheduleGroup.wardNo || patient.address || "N/A"}</td>
                          <td className="px-4 py-3 text-sm">
                            <span
                              className={`px-2 py-0.5 rounded text-xs font-medium ${
                                scheduleGroup.dayType === "full"
                                  ? "bg-indigo-100 text-indigo-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {scheduleGroup.dayType === "full" ? "Full Day (24h)" : "Half Day (12h)"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <div>{formatScheduleDateRange(scheduleGroup)}</div>
                            {scheduleGroup.schedules.length > 1 && (
                              <div className="text-xs text-gray-500 mt-1">
                                {scheduleGroup.schedules.length} scheduled days
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex flex-col">
                              <span className="font-medium">Rs. {getPaymentAmount(scheduleGroup.schedules[0]).toLocaleString()}</span>
                              <span className={`text-xs ${scheduleGroup.paymentToAgency === "paid" ? "text-green-600" : "text-red-500"}`}>
                                {scheduleGroup.paymentToAgency === "paid" ? "✓ Paid" : "✗ Unpaid"}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  scheduleGroup.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : scheduleGroup.status === "cancelled"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {scheduleGroup.status}
                              </span>
                              {scheduleGroup.jobCompletedByPatient && scheduleGroup.status !== "completed" && (
                                <span className="text-xs text-blue-600 font-medium">Awaiting admin</span>
                              )}
                              {scheduleGroup.jobCompletedByAdmin && (
                                <button
                                  onClick={() => showAdminNote(scheduleGroup.adminNote)}
                                  className="text-blue-500 hover:text-blue-700"
                                  title="View Admin Note"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </button>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-right">
                            <button
                              onClick={() => handleCompleteSchedule(scheduleGroup)}
                              disabled={
                                scheduleGroup.status === "cancelled" ||
                                scheduleGroup.status === "completed" ||
                                scheduleGroup.schedules.every(
                                  (schedule) => schedule.jobCompletedByPatient || schedule.status === "completed"
                                )
                              }
                              className={`px-3 py-1 rounded text-xs font-medium text-white ${
                                scheduleGroup.status === "cancelled" ||
                                scheduleGroup.status === "completed" ||
                                scheduleGroup.schedules.every(
                                  (schedule) => schedule.jobCompletedByPatient || schedule.status === "completed"
                                )
                                  ? "bg-gray-400 cursor-not-allowed"
                                  : "bg-blue-600 hover:bg-blue-700"
                              }`}
                            >
                              {scheduleGroup.status === "completed" ||
                              scheduleGroup.schedules.every(
                                (schedule) => schedule.jobCompletedByPatient || schedule.status === "completed"
                              )
                                ? "Completed"
                                : "Complete"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {isBookingOpen && selectedCaretaker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Book {selectedCaretaker.name}</h3>
                <p className="text-sm text-gray-500">Enter schedule details for this caretaker booking.</p>
              </div>
              <button
                onClick={() => {
                  setIsBookingOpen(false);
                  setSelectedCaretaker(null);
                }}
                className="text-2xl leading-none hover:text-gray-700"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleBookingSubmit}>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 rounded-lg mb-5 border border-blue-200">
                <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Schedule Details
                </p>
                  <div className="grid md:grid-cols-3 gap-3 mb-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-0.5">Start Date *</label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split("T")[0]}
                      value={bookingForm.startDate}
                      onChange={(event) => setBookingForm({ ...bookingForm, startDate: event.target.value })}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-0.5">End Date</label>
                      <input
                        type="date"
                        min={bookingForm.startDate || new Date().toISOString().split("T")[0]}
                        value={bookingForm.endDate}
                        onChange={(event) => setBookingForm({ ...bookingForm, endDate: event.target.value })}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-0.5">Start Time *</label>
                    <input
                      type="time"
                      required
                      value={bookingForm.startTime}
                      onChange={(event) => setBookingForm({ ...bookingForm, startTime: event.target.value })}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-3 mb-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-0.5">Ward No</label>
                    <input
                      type="text"
                      value={bookingForm.wardNo}
                      onChange={(event) => setBookingForm({ ...bookingForm, wardNo: event.target.value })}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 01"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-0.5">Day Type *</label>
                    <select
                      value={bookingForm.dayType}
                      onChange={(event) => setBookingForm({ ...bookingForm, dayType: event.target.value })}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                      <option value="full">Full Day (24h)</option>
                      <option value="half">Half Day (12h)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-0.5">Payment</label>
                    <select
                      value={bookingForm.paymentToAgency}
                      onChange={(event) => setBookingForm({ ...bookingForm, paymentToAgency: event.target.value })}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                      <option value="unpaid">Unpaid</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-0.5">Additional Notes</label>
                  <textarea
                    rows="4"
                    value={bookingForm.notes}
                    onChange={(event) => setBookingForm({ ...bookingForm, notes: event.target.value })}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add any service notes or special requirements"
                  ></textarea>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-5 grid md:grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Caretaker ID</p>
                  <p className="font-medium text-gray-800">{selectedCaretaker.caretakerId}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Estimated Rate</p>
                  <p className="font-medium text-gray-800">
                    Rs. {(bookingForm.dayType === "full" ? rates.fullDayRate : rates.halfDayRate).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsBookingOpen(false);
                    setSelectedCaretaker(null);
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingSubmitting}
                  className={`flex-1 text-white py-2 rounded ${
                    bookingSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {bookingSubmitting ? "Booking..." : "Book"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
