import { Route, Routes } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import socket from "./services/socket";

// Toastify Imports
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Lazy load components for better performance
const Landing = lazy(() => import("./pages/Landing.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const SignUp = lazy(() => import("./pages/SignUp.jsx"));
const Caretaker = lazy(() => import("./pages/Caretaker.jsx"));

// Admin components (Member 2)
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout.jsx"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard.jsx"));
const CaretakerManagement = lazy(() =>
import("./pages/admin/CaretakerManagement.jsx")
);
const PatientManagement = lazy(() =>
import("./pages/admin/PatientManagement.jsx")
);
const UserManagement = lazy(() => import("./pages/admin/UserManagement.jsx"));
const ScheduleManagement = lazy(() => import("./pages/admin/ScheduleManagement.jsx"));
const CaretakerProfile = lazy(() => import("./pages/admin/CaretakerProfile.jsx"));
const PatientProfile = lazy(() => import("./pages/admin/PatientProfile.jsx"));
const Settings = lazy(() => import("./pages/admin/Settings.jsx"));
import SudoGuard from "./components/SudoGuard.jsx";

// 🩺 Member 5: Patient pages
const PatientDashboard = lazy(() =>
import("./pages/patient/PatientDashboard.jsx")
);
const CaretakerDirectory = lazy(() =>
import("./pages/patient/CaretakerDirectory.jsx")
);

// Loading component
function LoadingSpinner() {
return (
<div className="flex items-center justify-center min-h-screen">
<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
</div>
);
}

// 404 Not Found Component
function NotFound() {
return (
<div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
<div className="text-center">
<h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
<h2 className="text-2xl font-semibold text-gray-700 mb-4">
Page Not Found
</h2>
<p className="text-gray-600 mb-8">
The page you're looking for doesn't exist.
</p>
<a
href="/"
className="bg-primary hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
>
Go Back Home
</a>
</div>
</div>
);
}

export default function App() {
// ==================== SOCKET.IO & NOTIFICATION SETUP START ====================
useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user')); 
    const userId = user?.id || user?._id;

    if (userId) {
        if (!socket.connected) {
            socket.connect();
        }

        socket.on('connect', () => {
            console.log("🔌 Socket physically connected to server!");
            socket.emit('join', userId);
            console.log("🚀 Socket joined room for user:", userId);
        });

        socket.on('connect_error', (err) => {
            console.error("❌ Socket Connection Error:", err.message);
        });

        
        socket.off('new_notification');

        socket.on('new_//notification', (data) => {
        });
        
        socket.on('new_notification', (data) => {
            console.log("🔔 New Notification Received:", data);
            toast.info(`🔔 ${data.message}`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        });
        // ---------------------------------------------------------
    } else {
        console.log("⚠️ No User ID found in localStorage, skipping socket connection.");
    }

    return () => {
        socket.off('connect');
        socket.off('connect_error');
        socket.off('new_notification');
        socket.disconnect();
    };
}, []);
// ==================== SOCKET.IO SETUP END ====================

    return (
        <Suspense fallback={<LoadingSpinner />}>
            {/* Toast Notifications */}
            <ToastContainer />
            <Routes>
                {/* Public Routes - Landing Page Focus */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />

                {/* Protected Routes - Caretaker Dashboard (Caretaker Only) */}
                <Route
                    path="/caretaker"
                    element={
                        <ProtectedRoute allowedRoles={["caretaker"]}>
                            <Caretaker />
                        </ProtectedRoute>
                    }
                />

                {/* Protected Routes - Admin Dashboard + Management (Admin Only) */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                            <AdminLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<AdminDashboard />} />
                    <Route path="caretakers" element={<CaretakerManagement />} />
                    <Route path="patients" element={<PatientManagement />} />
                    <Route path="users" element={<SudoGuard><UserManagement /></SudoGuard>} />
                    <Route path="schedules" element={<ScheduleManagement />} />
                    <Route path="settings" element={<SudoGuard><Settings /></SudoGuard>} />
                    <Route path="caretakers/:id" element={<CaretakerProfile />} />
                    <Route path="patients/:id" element={<PatientProfile />} />
                </Route>

                {/* Protected Routes - Patient Dashboard & Caretaker Directory (Patient Only) */}
                <Route
                    path="/patient/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={["patient"]}>
                            <PatientDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/patient/caretakers"
                    element={
                        <ProtectedRoute allowedRoles={["patient"]}>
                            <CaretakerDirectory />
                        </ProtectedRoute>
                    }
                />

                {/* Catch-all route for 404 */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Suspense>
    );
}