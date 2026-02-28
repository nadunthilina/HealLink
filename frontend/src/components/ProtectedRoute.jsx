import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

/**
 * ProtectedRoute Component
 * Protects routes based on authentication and user roles
 *
 * @param {ReactNode} children - Components to render if authorized
 * @param {string[]} allowedRoles - Array of roles allowed to access this route
 * @returns {ReactNode} - Protected content or redirect
 */
export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const [isChecking, setIsChecking] = useState(true);
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");

  useEffect(() => {
    // Simulate async check (you can add API verification here)
    setIsChecking(false);
  }, []);

  // Show loading state while checking
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!token || !userStr) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userStr);

    // Check if user role is valid
    if (!user.role) {
      localStorage.clear();
      return <Navigate to="/login" replace />;
    }

    // Check if user has required role
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      // Redirect to user's correct dashboard based on their role
      const redirectPath = getRoleDashboard(user.role);
      return <Navigate to={redirectPath} replace />;
    }

    // User is authenticated and authorized
    return children;
  } catch (error) {
    // Invalid user data in localStorage
    console.error("Invalid user data:", error);
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }
}

/**
 * Get the dashboard path for a given role
 * @param {string} role - User role
 * @returns {string} - Dashboard path
 */
function getRoleDashboard(role) {
  const dashboards = {
    admin: "/admin",
    caretaker: "/caretaker",
    patient: "/patient/dashboard",
  };
  return dashboards[role] || "/login";
}
