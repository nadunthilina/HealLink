import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

/**
 * Middleware to verify JWT token and check user authentication
 * Extracts token from Authorization header (Bearer token)
 * Verifies token and attaches decoded user info to req.user
 */
export function verifyToken(req, res, next) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

  if (!token) {
    return res.status(401).json({
      message: "Access denied. No token provided.",
      authenticated: false,
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expired. Please login again.",
        authenticated: false,
        expired: true,
      });
    }
    return res.status(401).json({
      message: "Invalid token.",
      authenticated: false,
    });
  }
}

/**
 * Middleware to check if user has required role(s)
 * Must be used after verifyToken middleware
 * @param {string[]} roles - Array of allowed roles
 */
export function requireAuth(roles = []) {
  return (req, res, next) => {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

    if (!token) {
      return res.status(401).json({
        message: "Access denied. No token provided.",
        authenticated: false,
      });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;

      // Check if roles are specified and user has required role
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({
          message: `Access denied. Required role: ${roles.join(
            " or "
          )}. Your role: ${decoded.role}`,
          authenticated: true,
          authorized: false,
          userRole: decoded.role,
          requiredRoles: roles,
        });
      }

      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          message: "Token expired. Please login again.",
          authenticated: false,
          expired: true,
        });
      }
      return res.status(401).json({
        message: "Invalid token.",
        authenticated: false,
      });
    }
  };
}

/**
 * Middleware to check if user account is active
 * Must be used after verifyToken middleware
 */
export async function checkAccountStatus(req, res, next) {
  try {
    const user = await User.findById(req.user.sub);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.status !== "active") {
      return res.status(403).json({
        message: "Account is inactive. Please contact administrator.",
        accountStatus: user.status,
      });
    }

    next();
  } catch (error) {
    console.error("Account status check error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

/**
 * Combined middleware for authentication, authorization, and account status check
 * @param {string[]} roles - Array of allowed roles
 */
export function authorize(roles = []) {
  return [requireAuth(roles), checkAccountStatus];
}
