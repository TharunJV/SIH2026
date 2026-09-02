import React, { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '../ProtectedRoute';

const GovernmentDashboard = lazy(() =>
  import('../../components/government/GovernmentDashboard').then((m) => ({
    default: m.GovernmentDashboard,
  }))
);

/**
 * Government dashboard route group.
 * Future sub-routes (e.g. /dashboard/government/analytics, /dashboard/government/districts)
 * can be added here without touching any other route file.
 */
export const governmentRoutes: RouteObject[] = [
  {
    path: 'government',
    element: (
      <ProtectedRoute allowedRoles={['govt_department', 'platform_admin']}>
        <GovernmentDashboard />
      </ProtectedRoute>
    ),
  },
];
