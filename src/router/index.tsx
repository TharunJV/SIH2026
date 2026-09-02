import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../App';
import { publicRoutes } from './routes/publicRoutes';
import { citizenRoutes } from './routes/citizenRoutes';
import { universityRoutes } from './routes/universityRoutes';
import { industryRoutes } from './routes/industryRoutes';
import { governmentRoutes } from './routes/governmentRoutes';
import { projectRoutes } from './routes/projectRoutes';

/**
 * Central router definition.
 *
 * The root element is `App`, which:
 *  1. Wraps everything in context providers (Toast, Auth, Data, Demo, AppShim)
 *  2. Renders `AppShell` which contains Header → <Outlet /> → Footer
 *
 * All routes are children of this root, receiving the layout for free.
 *
 * To add a new page:
 *  1. Create the component in src/components/<module>/
 *  2. Add a lazy import + RouteObject in the appropriate route group file
 *     (src/router/routes/<module>Routes.tsx)
 *  3. Done — no changes needed here or in App.tsx
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      // Public routes — /, /home, /login/*, /explore/*, /submit, etc.
      ...publicRoutes,

      // Dashboard route group — /dashboard/*
      {
        path: 'dashboard',
        children: [
          ...citizenRoutes,
          ...universityRoutes,
          ...industryRoutes,
          ...governmentRoutes,
        ],
      },

      // Project workspace — /project/:projectId
      {
        path: 'project',
        children: projectRoutes,
      },

      // Root-level dashboard aliases
      { path: 'citizen-dashboard', element: <Navigate to="/dashboard/citizen" replace /> },
      { path: 'university-dashboard', element: <Navigate to="/dashboard/university" replace /> },
      { path: 'industry-dashboard', element: <Navigate to="/dashboard/industry" replace /> },
      { path: 'government-dashboard', element: <Navigate to="/dashboard/government" replace /> },

      // Fallback: redirect unknown paths to home
      {
        path: '*',
        element: <Navigate to="/home" replace />,
      },
    ],
  },
]);
