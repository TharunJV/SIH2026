import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { JharkhandEmblem } from './JharkhandEmblem';
import { ConcurrentMultiUserSwitcher } from '../auth/ConcurrentMultiUserSwitcher';
import {
  Sparkles,
  Bell,
  Search,
  User as UserIcon,
  ChevronDown,
  Globe,
  Building2,
  GraduationCap,
  Briefcase,
  Layers,
  MapPin,
  Compass,
  CheckCircle2,
  LogOut,
  Download,
  Users,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentUser,
    switchRole,
    currentView,
    setCurrentView,
    unreadNotifsCount,
    notifications,
    markNotificationAsRead,
    isDemoTourActive,
    setIsDemoTourActive,
    goToDemoStep,
    currentDemoStep,
    setIsAuthModalOpen,
  } = useApp();

  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMultiUserSwitcherOpen, setIsMultiUserSwitcherOpen] = useState(false);

  const roleLabels: Record<UserRole, { label: string; group: string; color: string }> = {
    citizen: { label: 'Citizen (Sunita Devi)', group: 'Community', color: 'bg-emerald-100 text-emerald-800' },
    pri_ulb: { label: 'PRI Mukhiya (Rajesh Oraon)', group: 'Local Body', color: 'bg-teal-100 text-teal-800' },
    community_org: { label: 'Community NGO (Gram Vikas Kendra)', group: 'Community', color: 'bg-emerald-100 text-emerald-800' },
    university_admin: { label: 'Univ Admin (BIT Mesra)', group: 'Higher Education', color: 'bg-blue-100 text-blue-800' },
    faculty_mentor: { label: 'Faculty Mentor (IIT ISM Dhanbad)', group: 'Higher Education', color: 'bg-indigo-100 text-indigo-800' },
    student: { label: 'Student Innovator (NIT Jsr)', group: 'Higher Education', color: 'bg-sky-100 text-sky-800' },
    industry_msme: { label: 'Industry Lead (Tata Steel)', group: 'Industry & CSR', color: 'bg-purple-100 text-purple-800' },
    csr_org: { label: 'CSR Sponsor (Tata Trusts)', group: 'Industry & CSR', color: 'bg-violet-100 text-violet-800' },
    research_institute: { label: 'Research Institute (CSIR-NML)', group: 'Research', color: 'bg-amber-100 text-amber-800' },
    govt_department: { label: 'Govt Dept (Spl Secretary IAS)', group: 'Government', color: 'bg-rose-100 text-rose-800' },
    platform_admin: { label: 'Platform Admin (JSHEC PMU)', group: 'Administration', color: 'bg-slate-100 text-slate-800' },
  };

  const navLinks = [
    { id: 'landing', label: 'Home' },
    { id: 'role-selection', label: 'Select Role' },
    { id: 'explore-challenges', label: 'Explore Challenges' },
    { id: 'map-view', label: 'Jharkhand Map' },
    { id: 'universities', label: 'Universities' },
    { id: 'industry', label: 'Industry Partners' },
    { id: 'impact', label: 'Public Impact' },
    { id: 'how-it-works', label: 'How It Works' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Official Banner */}
      <div className="bg-slate-900 text-slate-200 text-xs px-4 py-1.5 flex flex-wrap justify-between items-center border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 font-medium text-amber-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            SIH 2026 Problem Statement #26043
          </span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="hidden sm:inline text-slate-300">
            Government of Jharkhand &bull; Department of Higher & Technical Education
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <button
            onClick={() => setIsDemoTourActive(!isDemoTourActive)}
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded font-semibold transition-all cursor-pointer ${
              isDemoTourActive ? 'bg-amber-500 text-slate-950 shadow-sm' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-900 fill-amber-900" />
            <span>Judge Fast-Track Tour</span>
          </button>
          <div className="hidden md:flex items-center gap-1.5 text-slate-400">
            <Globe className="w-3.5 h-3.5" />
            <span className="text-slate-200 font-medium">English</span>
            <span>/</span>
            <span className="hover:text-white cursor-pointer">हिन्दी</span>
            <span>/</span>
            <span className="hover:text-white cursor-pointer">ᱥᱟᱱᱛᱟᱲᱤ</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Emblem */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => setCurrentView('landing')}
          >
            <JharkhandEmblem size={42} className="ring-1.5 ring-emerald-700/40 shadow-xs" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-none">
                  JH Innovation Connect
                </h1>
                <span className="hidden xl:inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Govt of Jharkhand
                </span>
              </div>
              <p className="text-[11px] text-slate-600 font-normal mt-0.5 hidden sm:block">
                Societal Innovation Collaboration Portal &bull; HEIs & Industry
              </p>
            </div>
          </div>

          {/* Center Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => setCurrentView(link.id as any)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-colors cursor-pointer ${
                  currentView === link.id
                    ? 'bg-emerald-50 text-emerald-800 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Submit Button */}
            <button
              onClick={() => setCurrentView('submit-challenge')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-sm transition-all hover:shadow cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Submit Challenge</span>
            </button>

            {/* Concurrent Multi-User Sandbox Button */}
            <button
              onClick={() => setIsMultiUserSwitcherOpen(true)}
              title="Test Concurrent Multi-User Sessions"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold rounded-lg border border-amber-300 shadow-2xs transition-all cursor-pointer"
            >
              <Users className="w-3.5 h-3.5 text-amber-700" />
              <span className="hidden md:inline">Multi-User Sandbox</span>
            </button>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg relative transition-colors cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="p-3 bg-slate-900 text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-amber-400" />
                      <span className="font-semibold text-xs">Live Platform Notifications</span>
                    </div>
                    <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                      {notifications.length} alerts
                    </span>
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.slice(0, 5).map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          markNotificationAsRead(notif.id);
                          if (notif.relatedId?.startsWith('JH-')) {
                            goToDemoStep(3);
                          }
                          setIsNotifOpen(false);
                        }}
                        className={`p-3 text-xs hover:bg-slate-50 cursor-pointer transition-colors ${
                          !notif.read ? 'bg-emerald-50/60 font-medium' : 'text-slate-600'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-bold text-slate-900">{notif.title}</span>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap">{notif.timestamp.split(' ')[1] || notif.timestamp}</span>
                        </div>
                        <p className="text-slate-600 text-[11px] mt-1 line-clamp-2">{notif.message}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 bg-slate-50 border-t border-slate-100 text-center">
                    <button
                      onClick={() => {
                        setCurrentView('citizen-dashboard');
                        setIsNotifOpen(false);
                      }}
                      className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                    >
                      View All in Dashboard &rarr;
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Role Switcher & Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50/80 hover:bg-slate-100 transition-all text-left cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center ring-1 ring-emerald-600/30 overflow-hidden">
                  {currentUser.avatarUrl ? (
                    <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
                  ) : (
                    currentUser.name.charAt(0)
                  )}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[120px]">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-emerald-800 font-semibold leading-tight capitalize">
                    {currentUser.role.replace('_', ' ')}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Role Selection Menu */}
              {isRoleMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="p-3 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-amber-400">Stakeholder Session Switcher</span>
                      <span className="text-[10px] bg-slate-700 px-1.5 py-0.5 rounded text-slate-300">11 Roles</span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-1">
                      Explore the complete multi-stakeholder ecosystem by clicking any user role below:
                    </p>
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 p-1">
                    {(Object.keys(roleLabels) as UserRole[]).map((r) => {
                      const item = roleLabels[r];
                      const isSelected = currentUser.role === r;
                      return (
                        <button
                          key={r}
                          onClick={() => {
                            switchRole(r);
                            setIsRoleMenuOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                            isSelected ? 'bg-emerald-50 text-emerald-950 font-bold' : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div>
                            <div className="font-medium text-slate-900">{item.label}</div>
                            <span className="text-[10px] text-slate-500 font-normal">{item.group}</span>
                          </div>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                  <div className="p-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setCurrentView('login');
                        setIsRoleMenuOpen(false);
                      }}
                      className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Role Login</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsMultiUserSwitcherOpen(true);
                        setIsRoleMenuOpen(false);
                      }}
                      className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>Sandbox Users</span>
                    </button>
                    <button
                      onClick={() => {
                        switchRole('citizen');
                        setCurrentView('landing');
                        setIsRoleMenuOpen(false);
                      }}
                      className="text-xs text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Navigation Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
            >
              <Layers className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setCurrentView(link.id as any);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold cursor-pointer ${
                currentView === link.id ? 'bg-emerald-50 text-emerald-800' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 flex gap-2">
            <button
              onClick={() => {
                setCurrentView('login');
                setIsMobileMenuOpen(false);
              }}
              className="flex-1 py-2.5 bg-slate-900 text-white rounded-lg text-xs font-bold text-center"
            >
              Role Login
            </button>
            <button
              onClick={() => {
                setIsMultiUserSwitcherOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="flex-1 py-2.5 bg-amber-500 text-slate-950 rounded-lg text-xs font-bold text-center"
            >
              Multi-User
            </button>
          </div>
        </div>
      )}

      {/* Concurrent Multi-User Switcher Modal */}
      <ConcurrentMultiUserSwitcher
        isOpen={isMultiUserSwitcherOpen}
        onClose={() => setIsMultiUserSwitcherOpen(false)}
      />
    </header>
  );
};
