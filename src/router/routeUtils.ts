import { AppView } from '../context/AppContext';

// Utility to convert AppView state string to TanStack route path
export function getViewRoutePath(view: AppView, challengeId?: string | null, projectId?: string | null): string {
  switch (view) {
    case 'landing':
      return '/landing';
    case 'role-selection':
      return '/role-selection';
    case 'login':
      return '/login';
    case 'signup':
      return '/signup';
    case 'explore-challenges':
      return '/explore-challenges';
    case 'submit-challenge':
      return '/submit-challenge';
    case 'challenge-detail':
    case 'citizen-challenge-detail':
      return challengeId ? `/challenge/${challengeId}` : '/challenge-detail';
    case 'universities':
      return '/universities';
    case 'industry':
      return '/industry';
    case 'how-it-works':
      return '/how-it-works';
    case 'impact':
      return '/impact';
    case 'map-view':
      return '/map-view';
    case 'citizen-dashboard':
      return '/dashboard/citizen';
    case 'citizen-my-challenges':
      return '/dashboard/citizen/my-challenges';
    case 'citizen-notifications':
      return '/dashboard/citizen/notifications';
    case 'citizen-profile':
      return '/dashboard/citizen/profile';
    case 'citizen-help':
      return '/dashboard/citizen/help';
    case 'citizen-privacy':
      return '/dashboard/citizen/privacy';
    case 'university-dashboard':
      return '/dashboard/university';
    case 'university-challenges':
      return '/dashboard/university/challenges';
    case 'university-teams':
      return '/dashboard/university/teams';
    case 'university-proposals':
      return '/dashboard/university/proposals';
    case 'university-notifications':
      return '/dashboard/university/notifications';
    case 'university-profile':
      return '/dashboard/university/profile';
    case 'university-guidelines':
      return '/dashboard/university/guidelines';
    case 'industry-dashboard':
      return '/dashboard/industry';
    case 'government-dashboard':
      return '/dashboard/government';
    case 'project-detail':
    case 'project-workspace':
      return projectId ? `/project/${projectId}` : '/project-workspace';
    default:
      return '/landing';
  }
}
