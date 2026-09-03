import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { JudgeDemoTourBar } from './components/common/JudgeDemoTourBar';
import { ToastContainer } from './components/common/ToastContainer';
import { AuthModal } from './components/common/AuthModal';

// Standalone Public & Auth Pages
import { LandingPage } from './components/public/LandingPage';
import { RoleSelectionPage } from './components/public/RoleSelectionPage';
import { LoginPage } from './components/auth/LoginPage';
import { SignUpPage } from './components/auth/SignUpPage';

// Citizen Dedicated Layout & Pages
import { CitizenLayout } from './components/citizen/CitizenLayout';
import { CitizenDashboard } from './components/citizen/CitizenDashboard';
import { SubmitChallengeForm } from './components/citizen/SubmitChallengeForm';
import { CitizenMyChallengesPage } from './components/citizen/CitizenMyChallengesPage';
import { CitizenChallengeDetail } from './components/citizen/CitizenChallengeDetail';
import { CitizenNotificationsPage } from './components/citizen/CitizenNotificationsPage';
import { CitizenProfilePage } from './components/citizen/CitizenProfilePage';
import { CitizenHelpPage } from './components/citizen/CitizenHelpPage';
import { CitizenPrivacyPage } from './components/citizen/CitizenPrivacyPage';

// University Dedicated Layout & Pages
import { UniversityLayout } from './components/university/UniversityLayout';
import { UniversityDashboard } from './components/university/UniversityDashboard';
import { UniversityChallengesPage } from './components/university/UniversityChallengesPage';
import { UniversityTeamsPage } from './components/university/UniversityTeamsPage';
import { UniversityProposalsPage } from './components/university/UniversityProposalsPage';
import { UniversityNotificationsPage } from './components/university/UniversityNotificationsPage';
import { UniversityProfilePage } from './components/university/UniversityProfilePage';
import { UniversityGuidelinesPage } from './components/university/UniversityGuidelinesPage';

// Other Roles & Dashboards
import { ExploreChallengesPage } from './components/public/ExploreChallengesPage';
import { UniversitiesPage } from './components/public/UniversitiesPage';
import { IndustryPage } from './components/public/IndustryPage';
import { HowItWorksPage } from './components/public/HowItWorksPage';
import { IndustryDashboard } from './components/industry/IndustryDashboard';
import { GovernmentDashboard } from './components/government/GovernmentDashboard';
import { ProjectWorkspace } from './components/project/ProjectWorkspace';
import { JharkhandMap } from './components/map/JharkhandMap';
import { PublicImpactDashboard } from './components/impact/PublicImpactDashboard';

const AppContent: React.FC = () => {
  const { currentView, currentRole } = useApp();

  // Standalone full-screen views (landing, role selection, login, signup)
  const isStandalonePublicView =
    currentView === 'landing' ||
    currentView === 'role-selection' ||
    currentView === 'login' ||
    currentView === 'signup';

  // Role Checks
  const isCitizenRole = currentRole === 'citizen' || currentRole === 'community_org' || currentRole === 'pri_ulb';
  const isUniversityRole =
    currentRole === 'university_admin' || currentRole === 'faculty_mentor' || currentRole === 'student';

  // Render Citizen Specific Views inside CitizenLayout
  const renderCitizenView = () => {
    switch (currentView) {
      case 'citizen-dashboard':
        return <CitizenDashboard />;
      case 'submit-challenge':
        return <SubmitChallengeForm />;
      case 'citizen-my-challenges':
        return <CitizenMyChallengesPage />;
      case 'challenge-detail':
      case 'citizen-challenge-detail':
        return <CitizenChallengeDetail />;
      case 'explore-challenges':
        return <ExploreChallengesPage />;
      case 'citizen-notifications':
        return <CitizenNotificationsPage />;
      case 'citizen-profile':
        return <CitizenProfilePage />;
      case 'citizen-help':
        return <CitizenHelpPage />;
      case 'citizen-privacy':
        return <CitizenPrivacyPage />;
      case 'map-view':
        return <JharkhandMap />;
      case 'impact':
        return <PublicImpactDashboard />;
      case 'how-it-works':
        return <HowItWorksPage />;
      default:
        return <CitizenDashboard />;
    }
  };

  // Render University Specific Views inside UniversityLayout
  const renderUniversityView = () => {
    switch (currentView) {
      case 'university-dashboard':
        return <UniversityDashboard />;
      case 'university-challenges':
        return <UniversityChallengesPage />;
      case 'university-teams':
        return <UniversityTeamsPage />;
      case 'university-proposals':
        return <UniversityProposalsPage />;
      case 'project-workspace':
      case 'project-detail':
      case 'university-projects':
      case 'university-milestones':
        return <ProjectWorkspace />;
      case 'challenge-detail':
      case 'citizen-challenge-detail':
        return <CitizenChallengeDetail />;
      case 'explore-challenges':
        return <ExploreChallengesPage />;
      case 'university-notifications':
        return <UniversityNotificationsPage />;
      case 'university-profile':
        return <UniversityProfilePage />;
      case 'university-guidelines':
        return <UniversityGuidelinesPage />;
      case 'map-view':
        return <JharkhandMap />;
      case 'impact':
        return <PublicImpactDashboard />;
      case 'how-it-works':
        return <HowItWorksPage />;
      default:
        return <UniversityDashboard />;
    }
  };

  // Render Standard Portal Views
  const renderStandardView = () => {
    switch (currentView) {
      case 'explore-challenges':
        return <ExploreChallengesPage />;
      case 'submit-challenge':
        return <SubmitChallengeForm />;
      case 'challenge-detail':
        return <CitizenChallengeDetail />;
      case 'citizen-dashboard':
        return <CitizenDashboard />;
      case 'university-dashboard':
        return <UniversityDashboard />;
      case 'industry-dashboard':
        return <IndustryDashboard />;
      case 'government-dashboard':
        return <GovernmentDashboard />;
      case 'project-workspace':
        return <ProjectWorkspace />;
      case 'map-view':
        return <JharkhandMap />;
      case 'universities':
        return <UniversitiesPage />;
      case 'industry':
        return <IndustryPage />;
      case 'impact':
        return <PublicImpactDashboard />;
      case 'how-it-works':
        return <HowItWorksPage />;
      default:
        return <LandingPage />;
    }
  };

  // 1. Standalone Full-Screen View for Public Entry Points (Landing, Role Selection, Login, Sign Up)
  if (isStandalonePublicView) {
    return (
      <div className="min-h-screen w-full bg-slate-950 text-slate-100 font-sans antialiased selection:bg-amber-500 selection:text-slate-950 flex flex-col">
        <main className="flex-1 w-full">
          {currentView === 'landing' && <LandingPage />}
          {currentView === 'role-selection' && <RoleSelectionPage />}
          {currentView === 'login' && <LoginPage initialRole={currentRole} />}
          {currentView === 'signup' && <SignUpPage initialRole={currentRole} />}
        </main>
        <ToastContainer />
        <AuthModal />
      </div>
    );
  }

  // 2. Dedicated Standalone Citizen Experience with sidebar, bottom nav, and full-screen layout
  if (isCitizenRole) {
    return (
      <>
        <CitizenLayout>
          {renderCitizenView()}
        </CitizenLayout>
        <ToastContainer />
        <AuthModal />
      </>
    );
  }

  // 3. Dedicated Standalone University Experience with institutional sidebar, bottom nav, and full-screen layout
  if (isUniversityRole) {
    return (
      <>
        <UniversityLayout>
          {renderUniversityView()}
        </UniversityLayout>
        <ToastContainer />
        <AuthModal />
      </>
    );
  }

  // 3. Regular Portal Layout for Other Roles (University, Industry, Government, Public)
  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900 font-sans antialiased selection:bg-emerald-500 selection:text-white">
      {/* Header */}
      <Header />

      {/* Fast-Track 2-3 Min Judge Tour Bar */}
      <JudgeDemoTourBar />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {renderStandardView()}
      </main>

      {/* Global Alerts & Modals */}
      <ToastContainer />
      <AuthModal />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
