import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Challenge, ProjectLifecycle, NotificationItem } from '../types';
import { MOCK_CHALLENGES, MOCK_PROJECTS, MOCK_NOTIFICATIONS } from '../mock/data';
import { challengeService } from '../services/challengeService';
import { projectService } from '../services/projectService';
import { communicationService } from '../services/communicationService';
import { useAuth } from './AuthContext';

interface DataContextType {
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
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();

  const [challenges, setChallenges] = useState<Challenge[]>(MOCK_CHALLENGES);
  const [projects, setProjects] = useState<ProjectLifecycle[]>(MOCK_PROJECTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>('JH-2026-001248');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>('PROJ-JH-2026-0081');

  const refreshData = async () => {
    const [chList, prList, noList] = await Promise.all([
      challengeService.getChallenges(),
      projectService.getProjects(),
      communicationService.getNotifications(currentUser.id),
    ]);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser.id]);

  return (
    <DataContext.Provider
      value={{
        challenges,
        projects,
        notifications,
        unreadNotifsCount,
        selectedChallengeId,
        setSelectedChallengeId,
        selectedProjectId,
        setSelectedProjectId,
        refreshData,
        markNotificationAsRead,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
