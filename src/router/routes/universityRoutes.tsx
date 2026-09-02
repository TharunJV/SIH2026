import React, { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '../ProtectedRoute';

const UniversityDashboard = lazy(() =>
  import('../../components/university/UniversityDashboard').then((m) => ({
    default: m.UniversityDashboard,
  }))
);

/**
 * University dashboard route group.
 * Future sub-routes (e.g. /dashboard/university/teams, /dashboard/university/proposals)
 * can be added here without touching any other route file.
 */
export const universityRoutes: RouteObject[] = [
  {
    path: 'university',
    element: (
      <ProtectedRoute allowedRoles={['university_admin', 'faculty_mentor', 'student']}>
        <UniversityDashboard />
      </ProtectedRoute>
    ),
  },
];
