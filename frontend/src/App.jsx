import { Route, Routes } from 'react-router-dom'
import { Suspense, lazy } from 'react'

// Lazy load components for better performance  
const Landing = lazy(() => import('./pages/Landing.jsx'))
const Login = lazy(() => import('./pages/Login.jsx'))
const SignUp = lazy(() => import('./pages/SignUp.jsx'))
const Caretaker = lazy(() => import('./pages/Caretaker.jsx'))

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
 * Member 1 - Landing Page Application
 * 
 * Responsibilities:
 * - Landing Page with system introduction
 * - Service benefits and features
 * - Login & Sign Up functionality
 * - Contact/Support information
 * - Animated healthcare hero section
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

        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}
