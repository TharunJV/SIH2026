import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { MOCK_USERS } from '../mock/data';

export type StakeholderLoginRole =
  | 'university'
  | 'faculty'
  | 'industry'
  | 'startup'
  | 'government'
  | null;

interface AuthContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  currentRole: UserRole;
  switchRole: (role: UserRole) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  stakeholderLoginRole: StakeholderLoginRole;
  setStakeholderLoginRole: (role: StakeholderLoginRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[0]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [stakeholderLoginRole, setStakeholderLoginRole] = useState<StakeholderLoginRole>(null);

  const switchRole = (role: UserRole) => {
    const userMatch =
      MOCK_USERS.find((u) => u.role === role) || {
        ...MOCK_USERS[0],
        role,
        name: `${role.replace('_', ' ').toUpperCase()} Representative`,
      };
    setCurrentUser(userMatch);
  };

  /**
   * Listen for the `demo:switchUser` custom event dispatched by DemoContext.
   * This avoids a circular dependency between DemoContext → AuthContext while
   * keeping role switching tightly co-located with authentication state.
   */
  useEffect(() => {
    const handleDemoSwitchUser = (e: Event) => {
      const user = (e as CustomEvent<User>).detail;
      if (user) setCurrentUser(user);
    };
    window.addEventListener('demo:switchUser', handleDemoSwitchUser);
    return () => window.removeEventListener('demo:switchUser', handleDemoSwitchUser);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        currentRole: currentUser.role,
        switchRole,
        isAuthModalOpen,
        setIsAuthModalOpen,
        stakeholderLoginRole,
        setStakeholderLoginRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
