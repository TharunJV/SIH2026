import React, { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '../ProtectedRoute';

const IndustryDashboard = lazy(() =>
  import('../../components/industry/IndustryDashboard').then((m) => ({
    default: m.IndustryDashboard,
  }))
);

/**
 * Industry dashboard route group.
 * Future sub-routes (e.g. /dashboard/industry/partnerships, /dashboard/industry/funding)
 * can be added here without touching any other route file.
 */
export const industryRoutes: RouteObject[] = [
  {
    path: 'industry',
    element: (
      <ProtectedRoute allowedRoles={['industry_msme', 'csr_org', 'research_institute']}>
        <IndustryDashboard />
      </ProtectedRoute>
    ),
  },
];
