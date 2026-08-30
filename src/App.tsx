import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { JudgeDemoTourBar } from './components/common/JudgeDemoTourBar';
import { ToastContainer } from './components/common/ToastContainer';
import { AuthModal } from './components/common/AuthModal';

// Pages & Modules
import { LandingPage } from './components/public/LandingPage';
import { ExploreChallengesPage } from './components/public/ExploreChallengesPage';
import { UniversitiesPage } from './components/public/UniversitiesPage';
import { IndustryPage } from './components/public/IndustryPage';
import { HowItWorksPage } from './components/public/HowItWorksPage';
import { SubmitChallengeForm } from './components/citizen/SubmitChallengeForm';
import { CitizenChallengeDetail } from './components/citizen/CitizenChallengeDetail';
import { CitizenDashboard } from './components/citizen/CitizenDashboard';
import { UniversityDashboard } from './components/university/UniversityDashboard';
import { IndustryDashboard } from './components/industry/IndustryDashboard';
import { GovernmentDashboard } from './components/government/GovernmentDashboard';
import { ProjectWorkspace } from './components/project/ProjectWorkspace';
import { JharkhandMap } from './components/map/JharkhandMap';
import { PublicImpactDashboard } from './components/impact/PublicImpactDashboard';
import { RoleSelectionPage } from './components/public/RoleSelectionPage';

const AppContent: React.FC = () => {
  const { currentView } = useApp();

  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage />;
      case 'role-selection':
      case 'login':
        return <RoleSelectionPage />;
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

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900 font-sans antialiased selection:bg-emerald-500 selection:text-white">
      {/* Header */}
      <Header />

      {/* Fast-Track 2-3 Min Judge Tour Bar */}
      <JudgeDemoTourBar />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {renderView()}
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
