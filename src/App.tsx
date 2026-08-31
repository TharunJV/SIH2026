import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/ToastContainer';
import { AuthModal } from './components/common/AuthModal';

// Pages & Modules
import { WelcomePage } from './components/public/WelcomePage';
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
  const { currentView, setCurrentView } = useApp();

  if (currentView === 'welcome') {
    return <WelcomePage onEnter={() => setCurrentView('landing')} />;
  }

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
    <div className="min-h-screen bg-[#f7f5f0] text-slate-800 font-sans antialiased selection:bg-[#6c8570] selection:text-white py-0 sm:py-6 lg:py-8 px-0 sm:px-6 lg:px-10 overflow-hidden">
      <div className="flex flex-col min-h-[calc(100vh-3rem)] max-w-[1440px] mx-auto bg-[#FCFAF5] shadow-2xl shadow-slate-300/40 rounded-none sm:rounded-[24px] border-0 sm:border border-[#e6e2d8] overflow-hidden relative">
        {/* Sticky Top Navigation */}
        <div className="sticky top-0 z-40 flex flex-col bg-white/95 backdrop-blur-md border-b border-[#e6e2d8]/60">
          <Header />
        </div>

        {/* Main View Area */}
        <main className="flex-1 w-full mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-10">
          {renderView()}
        </main>

        {/* Global Alerts & Modals */}
        <ToastContainer />
        <AuthModal />

        {/* Footer */}
        <div className="bg-[#f2efe9] border-t border-[#e6e2d8]">
          <Footer />
        </div>
      </div>
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
