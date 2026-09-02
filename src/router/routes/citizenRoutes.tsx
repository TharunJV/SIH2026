import React, { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '../ProtectedRoute';

const CitizenDashboard = lazy(() =>
  import('../../components/citizen/CitizenDashboard').then((m) => ({
    default: m.CitizenDashboard,
  }))
);

/**
 * Citizen dashboard route group.
 * Future citizen sub-routes (e.g. /dashboard/citizen/my-challenges) go here
 * without touching any other route file.
 */
export const citizenRoutes: RouteObject[] = [
  {
    path: 'citizen',
    element: (
      <ProtectedRoute allowedRoles={['citizen', 'pri_ulb', 'community_org']}>
        <CitizenDashboard />
      </ProtectedRoute>
    ),
  },
];
