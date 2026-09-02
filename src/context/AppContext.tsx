import React, { createContext, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useData } from './DataContext';
import { useToast, ToastMessage } from './ToastContext';
import { useDemo, JUDGE_DEMO_STEPS, VIEW_TO_PATH, AppView, DemoStep } from './DemoContext';
import { User, UserRole, Challenge, ProjectLifecycle, NotificationItem } from '../types';

/**
 * AppContext Compatibility Shim
 *
 * This shim re-exports the complete `useApp()` interface by composing the four
 * focused contexts (AuthContext, DataContext, ToastContext, DemoContext) so that
 * ALL existing components that call `useApp()` continue to work without any
 * change to their own source code.
 *
 * Navigation helpers (`setCurrentView`, `navigateToChallenge`, `navigateToProject`)
 * are implemented using React Router's `useNavigate()` — they translate the old
 * AppView string keys to URL paths via VIEW_TO_PATH from DemoContext.
 *
 * Migration path: components can gradually migrate from `useApp()` to the
 * focused sub-context hooks at their own pace. This shim will be removed once
 * all components have been updated.
 */

// Re-export types that components may import from AppContext
export type { AppView, DemoStep };
export { JUDGE_DEMO_STEPS };

interface AppContextType {
  // Auth
  currentUser: User;
  setCurrentUser: (user: User) => void;
  currentRole: UserRole;
  switchRole: (role: UserRole) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  stakeholderLoginRole: 'university' | 'faculty' | 'industry' | 'startup' | 'government' | null;
  setStakeholderLoginRole: (
    role: 'university' | 'faculty' | 'industry' | 'startup' | 'government' | null
  ) => void;

  // Navigation (shim — maps old view keys to React Router paths)
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  navigateToChallenge: (id: string) => void;
  navigateToProject: (id: string) => void;

  // Data
  challenges: Challenge[];
  projects: ProjectLifecycle[];
  notifications: NotificationItem[];
  unreadNotifsCount: number;
  selectedChallengeId: string | null;
  setSelectedChallengeId: (id: string | null) => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  refreshData: () => Promise<void>;
  markNotificationAsRead: (id: string) => void;

  // Toast
  toasts: ToastMessage[];
  showToast: (type: ToastMessage['type'], title: string, message: string) => void;
  removeToast: (id: string) => void;

  // Demo tour
  isDemoTourActive: boolean;
  setIsDemoTourActive: (active: boolean) => void;
  currentDemoStep: number;
  goToDemoStep: (stepNumber: number) => void;
  nextDemoStep: () => void;
  prevDemoStep: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

/**
 * AppProvider composes all four focused contexts + navigation shim.
 * This must be rendered inside RouterProvider so useNavigate() works.
 */
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const auth = useAuth();
  const data = useData();
  const toast = useToast();
  const demo = useDemo();
  const navigate = useNavigate();

  /** Map an old AppView key to its React Router path and navigate */
  const setCurrentView = (view: AppView) => {
    const path = VIEW_TO_PATH[view] ?? '/home';
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToChallenge = (id: string) => {
    data.setSelectedChallengeId(id);
    navigate(`/explore/${id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToProject = (id: string) => {
    data.setSelectedProjectId(id);
    navigate(`/project/${id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * Derive currentView from current URL so components that read it
   * (e.g. Header active-state logic) still get a sensible value.
   * This is a best-effort reverse mapping for backward compatibility.
   */
  const pathname =
    typeof window !== 'undefined' ? window.location.pathname : '/home';
  const currentView = (Object.entries(VIEW_TO_PATH).find(
    ([, path]) => path === pathname
  )?.[0] ?? 'landing') as AppView;

  const value: AppContextType = {
    // Auth
    currentUser: auth.currentUser,
    setCurrentUser: auth.setCurrentUser,
    currentRole: auth.currentRole,
    switchRole: auth.switchRole,
    isAuthModalOpen: auth.isAuthModalOpen,
    setIsAuthModalOpen: auth.setIsAuthModalOpen,
    stakeholderLoginRole: auth.stakeholderLoginRole,
    setStakeholderLoginRole: auth.setStakeholderLoginRole,

    // Navigation shim
    currentView,
    setCurrentView,
    navigateToChallenge,
    navigateToProject,

    // Data
    challenges: data.challenges,
    projects: data.projects,
    notifications: data.notifications,
    unreadNotifsCount: data.unreadNotifsCount,
    selectedChallengeId: data.selectedChallengeId,
    setSelectedChallengeId: data.setSelectedChallengeId,
    selectedProjectId: data.selectedProjectId,
    setSelectedProjectId: data.setSelectedProjectId,
    refreshData: data.refreshData,
    markNotificationAsRead: data.markNotificationAsRead,

    // Toast
    toasts: toast.toasts,
    showToast: toast.showToast,
    removeToast: toast.removeToast,

    // Demo
    isDemoTourActive: demo.isDemoTourActive,
    setIsDemoTourActive: demo.setIsDemoTourActive,
    currentDemoStep: demo.currentDemoStep,
    goToDemoStep: demo.goToDemoStep,
    nextDemoStep: demo.nextDemoStep,
    prevDemoStep: demo.prevDemoStep,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
