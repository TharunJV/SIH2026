import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserRole } from '../types';
import { MOCK_USERS } from '../mock/data';
import { useToast } from './ToastContext';
import { useNavigate } from 'react-router-dom';

export type AppView =
  | 'welcome'
  | 'landing'
  | 'role-selection'
  | 'login'
  | 'citizen-login'
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
  | 'admin-dashboard'
  | 'stakeholder-login';

export const VIEW_TO_PATH: Record<AppView, string> = {
  'welcome': '/',
  'landing': '/home',
  'role-selection': '/login',
  'login': '/login',
  'citizen-login': '/login/citizen',
  'about': '/home',
  'how-it-works': '/how-it-works',
  'explore-challenges': '/explore',
  'challenge-detail': '/explore',
  'submit-challenge': '/submit',
  'universities': '/universities',
  'industry': '/industry',
  'impact': '/impact',
  'map-view': '/map',
  'messages': '/messages',
  'citizen-dashboard': '/dashboard/citizen',
  'citizen-my-challenges': '/dashboard/citizen',
  'university-dashboard': '/dashboard/university',
  'university-challenges': '/dashboard/university',
  'university-teams': '/dashboard/university',
  'university-proposals': '/dashboard/university',
  'university-milestones': '/dashboard/university',
  'industry-dashboard': '/dashboard/industry',
  'industry-partnerships': '/dashboard/industry',
  'industry-funding': '/dashboard/industry',
  'project-detail': '/project',
  'government-dashboard': '/dashboard/government',
  'admin-dashboard': '/dashboard/admin',
  'stakeholder-login': '/login/stakeholder',
};

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
    description:
      'Welcome to JH Innovation Connect - Government of Jharkhand portal for crowdsourcing community challenges and connecting Universities & Industry.',
    highlightAction: 'Explore the public ecosystem overview and click "Submit a Challenge".',
  },
  {
    stepNumber: 2,
    title: 'Citizen Challenge Crowdsourcing',
    role: 'citizen',
    targetView: 'submit-challenge',
    description:
      'Citizens, PRIs, or NGOs submit local challenges with geotagging, affected population, urgency, and multimedia evidence.',
    highlightAction: 'Review the intuitive submission wizard and auto-generated AI triage.',
  },
  {
    stepNumber: 3,
    title: 'AI Problem Triage & University Routing',
    role: 'citizen',
    targetView: 'challenge-detail',
    targetId: 'JH-2026-001248',
    description:
      'AI Engine analyzes urgency (94/100), detects semantic duplicates across blocks, and matches Top 3 Jharkhand Universities with faculty strengths.',
    highlightAction: 'Inspect the AI analysis card and recommended HEIs (BIT Mesra, IIT ISM Dhanbad).',
  },
  {
    stepNumber: 4,
    title: 'University Evaluation & Team Formation',
    role: 'university_admin',
    targetView: 'university-dashboard',
    targetId: 'JH-2026-001248',
    description:
      'University evaluates the problem, assigns faculty mentors, and forms a multidisciplinary student team (Chemical + IoT + Civil).',
    highlightAction: 'View assigned challenge evaluation and the multidisciplinary team roster.',
  },
  {
    stepNumber: 5,
    title: 'Solution Proposal & CSR Co-Funding',
    role: 'faculty_mentor',
    targetView: 'university-proposals',
    description:
      'Faculty and student leads submit comprehensive technical proposal with budget breakdown, TRL roadmap, and CSR co-funding request.',
    highlightAction: 'Examine the Jal-Shuddhi proposal approved with Tata Trusts grant.',
  },
  {
    stepNumber: 6,
    title: 'Industry & CSR Collaboration Hub',
    role: 'industry_msme',
    targetView: 'industry-dashboard',
    description:
      'Industries (Tata Steel, BCCL, SAIL) and CSR foundations commit funding, assign co-mentors, and provide testing facilities.',
    highlightAction: 'See industry funding commitments and active student co-mentorship.',
  },
  {
    stepNumber: 7,
    title: '14-Stage Project Lifecycle & Field Pilot',
    role: 'student',
    targetView: 'project-detail',
    targetId: 'PROJ-JH-2026-0081',
    description:
      'Complete 14-stage innovation workflow: Milestones, TRL 5 prototype validation, Patent application, and Village field pilot results.',
    highlightAction: 'Review milestone deliverables, Indian Patent filing, and live water telemetry.',
  },
  {
    stepNumber: 8,
    title: 'Government State Monitoring & Analytics',
    role: 'govt_department',
    targetView: 'government-dashboard',
    description:
      'Higher Education Dept & State PMU track 24-district heatmaps, domain distribution, university performance, and societal ROI.',
    highlightAction: 'Filter by district and analyze cross-department societal impact analytics.',
  },
  {
    stepNumber: 9,
    title: 'Interactive Jharkhand Geographical Map',
    role: 'citizen',
    targetView: 'map-view',
    description:
      'Geospatial challenge map showing clusters across all 24 districts with domain heat levels and live community endorsements.',
    highlightAction: 'Click district pins (Khunti, Dhanbad, Gumla, Ranchi) to view localized challenges.',
  },
  {
    stepNumber: 10,
    title: 'State Impact Scorecard & Success Stories',
    role: 'citizen',
    targetView: 'impact',
    description:
      'Verified public impact: 1.48M+ lives impacted, 58 patents filed, 27 startups incubated, and ₹19.4 Cr CSR mobilized.',
    highlightAction: 'Celebrate the full citizen-to-solution innovation lifecycle!',
  },
];

interface DemoContextType {
  isDemoTourActive: boolean;
  setIsDemoTourActive: (active: boolean) => void;
  currentDemoStep: number;
  goToDemoStep: (stepNumber: number) => void;
  nextDemoStep: () => void;
  prevDemoStep: () => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const DemoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDemoTourActive, setIsDemoTourActive] = useState(true);
  const [currentDemoStep, setCurrentDemoStep] = useState(1);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const goToDemoStep = (stepNumber: number) => {
    const step = JUDGE_DEMO_STEPS.find((s) => s.stepNumber === stepNumber);
    if (!step) return;

    setCurrentDemoStep(stepNumber);
    setIsDemoTourActive(true);

    // Switch role-matched mock user
    const matchedUser = MOCK_USERS.find((u) => u.role === step.role) || MOCK_USERS[0];
    // Dispatch a custom event so AuthContext can pick it up without circular deps
    window.dispatchEvent(new CustomEvent('demo:switchUser', { detail: matchedUser }));

    // Navigate to the correct URL
    let path = VIEW_TO_PATH[step.targetView] || '/home';
    if (step.targetId) {
      if (step.targetView === 'challenge-detail') {
        path = `/explore/${step.targetId}`;
      } else if (step.targetView === 'project-detail') {
        path = `/project/${step.targetId}`;
      }
    }
    navigate(path);
    showToast('info', `Demo Step ${step.stepNumber}/10: ${step.title}`, step.highlightAction);
  };

  const nextDemoStep = () => {
    if (currentDemoStep < JUDGE_DEMO_STEPS.length) goToDemoStep(currentDemoStep + 1);
    else goToDemoStep(1);
  };

  const prevDemoStep = () => {
    if (currentDemoStep > 1) goToDemoStep(currentDemoStep - 1);
  };

  return (
    <DemoContext.Provider
      value={{
        isDemoTourActive,
        setIsDemoTourActive,
        currentDemoStep,
        goToDemoStep,
        nextDemoStep,
        prevDemoStep,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = () => {
  const context = useContext(DemoContext);
  if (!context) throw new Error('useDemo must be used within a DemoProvider');
  return context;
};
