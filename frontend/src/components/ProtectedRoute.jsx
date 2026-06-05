import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute Component
 * Protects routes based on authentication and user roles
 *
 * @param {ReactNode} children - Components to render if authorized
 * @param {string[]} allowedRoles - Array of roles allowed to access this route
 * @returns {ReactNode} - Protected content or redirect
 */
export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, isAuthenticated, loading } = useAuth();

  // Show loading state while checking
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to user's correct dashboard based on their role
    const dashboards = {
      admin: "/admin",
      caretaker: "/caretaker",
      patient: "/patient/dashboard",
    };
    const redirectPath = dashboards[user.role] || "/login";
    return <Navigate to={redirectPath} replace />;
  }

  // User is authenticated and authorized
  return children;
}
