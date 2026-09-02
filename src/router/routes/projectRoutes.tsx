import React, { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '../ProtectedRoute';

const ProjectWorkspace = lazy(() =>
  import('../../components/project/ProjectWorkspace').then((m) => ({
    default: m.ProjectWorkspace,
  }))
);

/**
 * Project workspace route group.
 * The :projectId param is available via useParams() inside ProjectWorkspace.
 */
export const projectRoutes: RouteObject[] = [
  {
    path: ':projectId',
    element: (
      <ProtectedRoute>
        <ProjectWorkspace />
      </ProtectedRoute>
    ),
  },
];
