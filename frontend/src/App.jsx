import { Route, Routes } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import ProtectedRoute from './components/ProtectedRoute'

// Lazy load components for better performance  
const Landing = lazy(() => import('./pages/Landing.jsx'))
const Login = lazy(() => import('./pages/Login.jsx'))
const SignUp = lazy(() => import('./pages/SignUp.jsx'))
const Caretaker = lazy(() => import('./pages/Caretaker.jsx'))

// Admin components (Member 2)
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout.jsx'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard.jsx'))
const CaretakerManagement = lazy(() => import('./pages/admin/CaretakerManagement.jsx'))
const PatientManagement = lazy(() => import('./pages/admin/PatientManagement.jsx'))
const UserManagement = lazy(() => import('./pages/admin/UserManagement.jsx'))
const ScheduleManagement = lazy(() => import('./pages/admin/ScheduleManagement.jsx'))

// 🩺 Member 5: Patient pages
const PatientDashboard = lazy(() => import('./pages/patient/PatientDashboard.jsx'))
const CaretakerDirectory = lazy(() => import('./pages/patient/CaretakerDirectory.jsx'))

// Loading component
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  )
}

// This is Member 1's Landing Page Component - focuses on:
// - System introduction (HealLink – Caretaker Management System)
// - About the service and its benefits  
// - Call-to-action buttons (Login and Sign Up)
// - Contact/Support info
// - Animated hero section with healthcare illustration

// 404 Not Found Component
function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
        <a 
          href="/" 
          className="bg-primary hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Go Back Home
        </a>
      </div>
    </div>
  )
}

/**
 * HealLink MERN Application
 * 
 * Member 1: Landing Page with system introduction
 * Member 2: Admin Dashboard + Management Pages (Dashboard, Caretakers, Patients, Users)
 * Member 3: Scheduling & Notifications
 * Member 4: Caretaker Interfaces
 * Member 5: Patient / Family Interfaces
 * Member 6: Shared Interfaces (Account & Support)
 */
export default function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Member 1's Routes - Landing Page Focus */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/caretaker" element={<Caretaker />} />

        {/* Member 2's Routes - Admin Dashboard + Management (Protected - Admin Only) */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="caretakers" element={<CaretakerManagement />} />
          <Route path="patients" element={<PatientManagement />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="schedule" element={<ScheduleManagement />} />
        </Route>

        {/* 🩺 Member 5 Routes - Patient Dashboard & Caretaker Directory */}
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/patient/caretakers" element={<CaretakerDirectory />} />

        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}
