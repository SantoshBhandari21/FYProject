import React from "react";
import { Navigate } from "react-router-dom";
import { getStoredUser } from "../services/api";

/**
 * COMMENTED OUT: Access control disabled
 * @param {React.ReactNode} children - Component to render if authorized
 * @param {string|string[]} allowedRoles - Role or array of roles that can access this route
 * @param {boolean} requireAuth - If true, user must be logged in (default: true)
 * @returns {React.ReactNode} Either the protected component or a redirect
 */
/* ORIGINAL CODE WITH ACCESS CONTROL:
const ProtectedRoute = ({ children, allowedRoles, requireAuth = true }) => {
  const user = getStoredUser();

  // Check if authentication is required but user is not logged in
  if (requireAuth && !user) {
    console.warn(
      "Access denied: User not authenticated. Redirecting to login.",
    );
    return <Navigate to="/login" replace />;
  }

  // Check user role if allowedRoles is specified
  if (allowedRoles && user) {
    const rolesArray = Array.isArray(allowedRoles)
      ? allowedRoles
      : [allowedRoles];
    const normalizedUserRole = String(user.role || "")
      .trim()
      .toLowerCase();
    const normalizedAllowedRoles = rolesArray.map((role) =>
      String(role || "")
        .trim()
        .toLowerCase(),
    );

    if (!normalizedAllowedRoles.includes(normalizedUserRole)) {
      console.warn(
        `Access denied: User role '${user.role}' not in allowed roles [${allowedRoles}]. Redirecting to home.`,
      );
      return <Navigate to="/" replace />;
    }
  }

  // User is authorized, render the component
  return children;
};
*/

// COMMENTED OUT: Access control disabled - now just returns children without any checks
const ProtectedRoute = ({ children, allowedRoles, requireAuth = true }) => {
  // Access control logic disabled
  return children;
};

export default ProtectedRoute;
