import React, { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';

// Lazy-loaded public page components
const WelcomePage = lazy(() =>
  import('../../components/public/WelcomePage').then((m) => ({ default: m.WelcomePage }))
);
const LandingPage = lazy(() =>
  import('../../components/public/LandingPage').then((m) => ({ default: m.LandingPage }))
);
const RoleSelectionPage = lazy(() =>
  import('../../components/public/RoleSelectionPage').then((m) => ({ default: m.RoleSelectionPage }))
);
const CitizenLoginPage = lazy(() =>
  import('../../components/citizen/CitizenLoginPage').then((m) => ({ default: m.CitizenLoginPage }))
);
const StakeholderLoginPage = lazy(() =>
  import('../../components/stakeholder/StakeholderLoginPage').then((m) => ({
    default: m.StakeholderLoginPage,
  }))
);
const ExploreChallengesPage = lazy(() =>
  import('../../components/public/ExploreChallengesPage').then((m) => ({
    default: m.ExploreChallengesPage,
  }))
);
const CitizenChallengeDetail = lazy(() =>
  import('../../components/citizen/CitizenChallengeDetail').then((m) => ({
    default: m.CitizenChallengeDetail,
  }))
);
const ReportIssue = lazy(() =>
  import('../../components/ReportIssue/ReportIssue').then((m) => ({
    default: m.default,
  }))
);
const UniversitiesPage = lazy(() =>
  import('../../components/public/UniversitiesPage').then((m) => ({ default: m.UniversitiesPage }))
);
const IndustryPage = lazy(() =>
  import('../../components/public/IndustryPage').then((m) => ({ default: m.IndustryPage }))
);
const PublicImpactDashboard = lazy(() =>
  import('../../components/impact/PublicImpactDashboard').then((m) => ({
    default: m.PublicImpactDashboard,
  }))
);
const HowItWorksPage = lazy(() =>
  import('../../components/public/HowItWorksPage').then((m) => ({ default: m.HowItWorksPage }))
);
const JharkhandMap = lazy(() =>
  import('../../components/map/JharkhandMap').then((m) => ({ default: m.JharkhandMap }))
);

/**
 * All public-facing route definitions.
 * Adding a new public page only requires touching this file.
 */
export const publicRoutes: RouteObject[] = [
  {
    index: true,
    element: <WelcomePage />,
  },
  {
    path: 'home',
    element: <LandingPage />,
  },
  {
    path: 'welcome',
    element: <WelcomePage />,
  },
  {
    path: 'login',
    children: [
      {
        index: true,
        element: <RoleSelectionPage />,
      },
      {
        path: 'citizen',
        element: <CitizenLoginPage />,
      },
      {
        path: 'stakeholder',
        element: <StakeholderLoginPage />,
      },
      {
        path: 'university',
        element: <StakeholderLoginPage defaultRole="university" />,
      },
      {
        path: 'industry',
        element: <StakeholderLoginPage defaultRole="industry" />,
      },
      {
        path: 'government',
        element: <StakeholderLoginPage defaultRole="government" />,
      },
    ],
  },
  {
    path: 'select-role',
    element: <RoleSelectionPage />,
  },
  {
    path: 'citizen-login',
    element: <CitizenLoginPage />,
  },
  {
    path: 'citizen-register',
    element: <CitizenLoginPage initialRegisterMode={true} />,
  },
  {
    path: 'university-login',
    element: <StakeholderLoginPage defaultRole="university" />,
  },
  {
    path: 'industry-login',
    element: <StakeholderLoginPage defaultRole="industry" />,
  },
  {
    path: 'government-login',
    element: <StakeholderLoginPage defaultRole="government" />,
  },
  {
    path: 'explore',
    children: [
      {
        index: true,
        element: <ExploreChallengesPage />,
      },
      {
        path: ':challengeId',
        element: <CitizenChallengeDetail />,
      },
    ],
  },
  {
    path: 'explore-challenges',
    element: <ExploreChallengesPage />,
  },
  {
    path: 'submit',
    element: <ReportIssue />,
  },
  {
    path: 'submit-challenge',
    element: <ReportIssue />,
  },
  {
    path: 'universities',
    element: <UniversitiesPage />,
  },
  {
    path: 'industry',
    element: <IndustryPage />,
  },
  {
    path: 'impact',
    element: <PublicImpactDashboard />,
  },
  {
    path: 'how-it-works',
    element: <HowItWorksPage />,
  },
  {
    path: 'map',
    element: <JharkhandMap />,
  },
  {
    path: 'map-view',
    element: <JharkhandMap />,
  },
];
