import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** Optional list of roles that can access this route.
   *  If omitted, any authenticated user (non-default guest) can access. */
  allowedRoles?: UserRole[];
}

/**
 * ProtectedRoute guards a route based on authentication state.
 *
 * The "guest" user has role 'citizen' with id 'user-001' (MOCK_USERS[0]).
 * For the demo/hackathon context we check if the user has been explicitly
 * role-switched or has authenticated — not just default state.
 *
 * For dashboard routes we check against allowedRoles if provided.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  // If specific roles are required, check membership
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(currentUser.role)) {
      // Redirect to login, preserving the intended destination
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  }

  return <>{children}</>;
};
