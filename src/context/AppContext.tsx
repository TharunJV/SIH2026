import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, Challenge, ProjectLifecycle, NotificationItem } from '../types';
import { MOCK_USERS, MOCK_CHALLENGES, MOCK_PROJECTS, MOCK_NOTIFICATIONS } from '../mock/data';
import { challengeService } from '../services/challengeService';
import { projectService } from '../services/projectService';
import { communicationService } from '../services/communicationService';

export type AppView =
  | 'landing'
  | 'role-selection'
  | 'login'
  | 'about'
  | 'how-it-works'
  | 'explore-challenges'
  | 'challenge-detail'
  | 'submit-challenge'
  | 'universities'
  | 'industry'
  | 'impact'
  | 'map-view'
  | 'messages'
  | 'citizen-dashboard'
  | 'citizen-my-challenges'
  | 'university-dashboard'
  | 'university-challenges'
  | 'university-teams'
  | 'university-proposals'
  | 'university-milestones'
  | 'industry-dashboard'
  | 'industry-partnerships'
  | 'industry-funding'
  | 'project-detail'
  | 'government-dashboard'
  | 'admin-dashboard';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

export interface DemoStep {
  stepNumber: number;
  title: string;
  role: UserRole;
  targetView: AppView;
  targetId?: string;
  description: string;
  highlightAction: string;
}

export const JUDGE_DEMO_STEPS: DemoStep[] = [
  {
    stepNumber: 1,
    title: 'Public Portal & Problem Statement',
    role: 'citizen',
    targetView: 'landing',
    description: 'Welcome to JH Innovation Connect - Government of Jharkhand portal for crowdsourcing community challenges and connecting Universities & Industry.',
    highlightAction: 'Explore the public ecosystem overview and click "Submit a Challenge".',
  },
  {
    stepNumber: 2,
    title: 'Citizen Challenge Crowdsourcing',
    role: 'citizen',
    targetView: 'submit-challenge',
    description: 'Citizens, PRIs, or NGOs submit local challenges with geotagging, affected population, urgency, and multimedia evidence.',
    highlightAction: 'Review the intuitive submission wizard and auto-generated AI triage.',
  },
  {
    stepNumber: 3,
    title: 'AI Problem Triage & University Routing',
    role: 'citizen',
    targetView: 'challenge-detail',
    targetId: 'JH-2026-001248',
    description: 'AI Engine analyzes urgency (94/100), detects semantic duplicates across blocks, and matches Top 3 Jharkhand Universities with faculty strengths.',
    highlightAction: 'Inspect the AI analysis card and recommended HEIs (BIT Mesra, IIT ISM Dhanbad).',
  },
  {
    stepNumber: 4,
    title: 'University Evaluation & Team Formation',
    role: 'university_admin',
    targetView: 'university-dashboard',
    targetId: 'JH-2026-001248',
    description: 'University evaluates the problem, assigns faculty mentors, and forms a multidisciplinary student team (Chemical + IoT + Civil).',
    highlightAction: 'View assigned challenge evaluation and the multidisciplinary team roster.',
  },
  {
    stepNumber: 5,
    title: 'Solution Proposal & CSR Co-Funding',
    role: 'faculty_mentor',
    targetView: 'university-proposals',
    description: 'Faculty and student leads submit comprehensive technical proposal with budget breakdown, TRL roadmap, and CSR co-funding request.',
    highlightAction: 'Examine the Jal-Shuddhi proposal approved with Tata Trusts grant.',
  },
  {
    stepNumber: 6,
    title: 'Industry & CSR Collaboration Hub',
    role: 'industry_msme',
    targetView: 'industry-dashboard',
    description: 'Industries (Tata Steel, BCCL, SAIL) and CSR foundations commit funding, assign co-mentors, and provide testing facilities.',
    highlightAction: 'See industry funding commitments and active student co-mentorship.',
  },
  {
    stepNumber: 7,
    title: '14-Stage Project Lifecycle & Field Pilot',
    role: 'student',
    targetView: 'project-detail',
    targetId: 'PROJ-JH-2026-0081',
    description: 'Complete 14-stage innovation workflow: Milestones, TRL 5 prototype validation, Patent application, and Village field pilot results.',
    highlightAction: 'Review milestone deliverables, Indian Patent filing, and live water telemetry.',
  },
  {
    stepNumber: 8,
    title: 'Government State Monitoring & Analytics',
    role: 'govt_department',
    targetView: 'government-dashboard',
    description: 'Higher Education Dept & State PMU track 24-district heatmaps, domain distribution, university performance, and societal ROI.',
    highlightAction: 'Filter by district and analyze cross-department societal impact analytics.',
  },
  {
    stepNumber: 9,
    title: 'Interactive Jharkhand Geographical Map',
    role: 'citizen',
    targetView: 'map-view',
    description: 'Geospatial challenge map showing clusters across all 24 districts with domain heat levels and live community endorsements.',
    highlightAction: 'Click district pins (Khunti, Dhanbad, Gumla, Ranchi) to view localized challenges.',
  },
  {
    stepNumber: 10,
    title: 'State Impact Scorecard & Success Stories',
    role: 'citizen',
    targetView: 'impact',
    description: 'Verified public impact: 1.48M+ lives impacted, 58 patents filed, 27 startups incubated, and ₹19.4 Cr CSR mobilized.',
    highlightAction: 'Celebrate the full citizen-to-solution innovation lifecycle!',
  },
];

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  currentRole: UserRole;
  switchRole: (role: UserRole) => void;
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  selectedChallengeId: string | null;
  setSelectedChallengeId: (id: string | null) => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  challenges: Challenge[];
  projects: ProjectLifecycle[];
  notifications: NotificationItem[];
  unreadNotifsCount: number;
  toasts: ToastMessage[];
  showToast: (type: ToastMessage['type'], title: string, message: string) => void;
  removeToast: (id: string) => void;
  // Fast track judge demo tour
  isDemoTourActive: boolean;
  setIsDemoTourActive: (active: boolean) => void;
  currentDemoStep: number;
  goToDemoStep: (stepNumber: number) => void;
  nextDemoStep: () => void;
  prevDemoStep: () => void;
  // Quick navigation helpers
  navigateToChallenge: (id: string) => void;
  navigateToProject: (id: string) => void;
  refreshData: () => Promise<void>;
  markNotificationAsRead: (id: string) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[0]); // Sunita Devi (Citizen)
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>('JH-2026-001248');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>('PROJ-JH-2026-0081');
  const [challenges, setChallenges] = useState<Challenge[]>(MOCK_CHALLENGES);
  const [projects, setProjects] = useState<ProjectLifecycle[]>(MOCK_PROJECTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isDemoTourActive, setIsDemoTourActive] = useState<boolean>(true);
  const [currentDemoStep, setCurrentDemoStep] = useState<number>(1);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const switchRole = (role: UserRole) => {
    const userMatch = MOCK_USERS.find((u) => u.role === role) || {
      ...MOCK_USERS[0],
      role,
      name: `${role.replace('_', ' ').toUpperCase()} Representative`,
    };
    setCurrentUser(userMatch);
    showToast('info', 'User Role Switched', `Logged in as ${userMatch.name} (${userMatch.role.toUpperCase()})`);

    // Auto-navigate to appropriate role dashboard
    if (role === 'citizen' || role === 'community_org' || role === 'pri_ulb') {
      if (currentView.startsWith('university') || currentView.startsWith('industry') || currentView.startsWith('govt') || currentView.startsWith('admin')) {
        setCurrentView('citizen-dashboard');
      }
    } else if (role === 'university_admin' || role === 'faculty_mentor' || role === 'student') {
      setCurrentView('university-dashboard');
    } else if (role === 'industry_msme' || role === 'csr_org' || role === 'research_institute') {
      setCurrentView('industry-dashboard');
    } else if (role === 'govt_department') {
      setCurrentView('government-dashboard');
    } else if (role === 'platform_admin') {
      setCurrentView('admin-dashboard');
    }
  };

  const showToast = (type: ToastMessage['type'], title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const goToDemoStep = (stepNumber: number) => {
    const step = JUDGE_DEMO_STEPS.find((s) => s.stepNumber === stepNumber);
    if (step) {
      setCurrentDemoStep(stepNumber);
      setIsDemoTourActive(true);
      // Switch role matching the step
      const matchedUser = MOCK_USERS.find((u) => u.role === step.role) || MOCK_USERS[0];
      setCurrentUser(matchedUser);
      if (step.targetId) {
        if (step.targetView === 'challenge-detail' || step.targetView === 'university-challenges') {
          setSelectedChallengeId(step.targetId);
        } else if (step.targetView === 'project-detail') {
          setSelectedProjectId(step.targetId);
        }
      }
      setCurrentView(step.targetView);
      showToast('info', `Demo Step ${step.stepNumber}/10: ${step.title}`, step.highlightAction);
    }
  };

  const nextDemoStep = () => {
    if (currentDemoStep < JUDGE_DEMO_STEPS.length) {
      goToDemoStep(currentDemoStep + 1);
    } else {
      goToDemoStep(1);
    }
  };

  const prevDemoStep = () => {
    if (currentDemoStep > 1) {
      goToDemoStep(currentDemoStep - 1);
    }
  };

  const navigateToChallenge = (id: string) => {
    setSelectedChallengeId(id);
    setCurrentView('challenge-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToProject = (id: string) => {
    setSelectedProjectId(id);
    setCurrentView('project-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const refreshData = async () => {
    const chList = await challengeService.getChallenges();
    const prList = await projectService.getProjects();
    const noList = await communicationService.getNotifications(currentUser.id);
    setChallenges(chList);
    setProjects(prList);
    setNotifications(noList);
  };

  const markNotificationAsRead = async (id: string) => {
    await communicationService.markNotificationRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    refreshData();
  }, [currentUser.id]);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        currentRole: currentUser.role,
        switchRole,
        currentView,
        setCurrentView,
        selectedChallengeId,
        setSelectedChallengeId,
        selectedProjectId,
        setSelectedProjectId,
        challenges,
        projects,
        notifications,
        unreadNotifsCount,
        toasts,
        showToast,
        removeToast,
        isDemoTourActive,
        setIsDemoTourActive,
        currentDemoStep,
        goToDemoStep,
        nextDemoStep,
        prevDemoStep,
        navigateToChallenge,
        navigateToProject,
        refreshData,
        markNotificationAsRead,
        isAuthModalOpen,
        setIsAuthModalOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
