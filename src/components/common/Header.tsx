import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  Sparkles,
  Bell,
  Search,
  User as UserIcon,
  ChevronDown,
  Building2,
  GraduationCap,
  Briefcase,
  Layers,
  MapPin,
  Compass,
  CheckCircle2,
  LogOut,
  Download,
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
    goToDemoStep,
    setIsAuthModalOpen,
  } = useApp();

  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <header className="bg-transparent border-b border-[#e6e2d8]/50 relative z-10">
      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between min-h-[72px] py-2 gap-4">
          {/* Logo & Emblem */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none shrink-0"
            onClick={() => setCurrentView('landing')}
          >
            <img
              src="/gov-jh-emblem.png"
              alt="Government of Jharkhand"
              style={{ height: '64px', width: 'auto', objectFit: 'contain', display: 'block' }}
            />
            <div className="shrink-0 hidden md:block border-l border-slate-300 pl-3 ml-2 py-1">
              <h1 className="text-base sm:text-lg font-extrabold text-slate-800 tracking-tight leading-none">
                Government of Jharkhand
              </h1>
              <p className="text-xs text-slate-500 font-semibold mt-1 whitespace-nowrap">
                Department of Higher &amp; Technical Education
              </p>
            </div>
          </div>

          {/* Center Links (Desktop) */}
          <nav className="hidden xl:flex items-center justify-center gap-1 mx-2 overflow-hidden">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => setCurrentView(link.id as any)}
                className={`px-2 py-2 rounded-lg text-[11px] font-semibold tracking-wide transition-colors whitespace-nowrap ${
                  currentView === link.id
                    ? 'bg-[#fdf5eb] text-[#c9833b] font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-[#f7f5f0]'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Quick Submit Button */}
            <button
              onClick={() => setCurrentView('submit-challenge')}
              className="hidden sm:inline-flex items-center justify-center gap-1.5 px-3.5 h-10 bg-[#3a5a40] hover:bg-[#2c4431] text-white text-xs font-bold rounded-lg shadow-sm transition-all hover:shadow"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Submit Challenge</span>
            </button>

            {/* Download Project ZIP */}
            <a
              href="/jh-innovation-connect.zip"
              download="jh-innovation-connect.zip"
              title="Download Full Project Archive (.ZIP)"
              className="inline-flex items-center justify-center gap-1.5 px-3 h-10 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg border border-slate-300 shadow-2xs transition-all"
            >
              <Download className="w-3.5 h-3.5 text-slate-700" />
              <span className="hidden md:inline">Download ZIP</span>
            </a>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="w-10 h-10 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg relative transition-colors"
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
                      className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
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
                className="flex items-center gap-2 pl-2 pr-3 h-10 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50/80 hover:bg-slate-100 transition-all text-left"
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
                      <span className="font-bold text-amber-400">Prototype Demo Role Switcher</span>
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
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
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
                        setIsAuthModalOpen(true);
                        setIsRoleMenuOpen(false);
                      }}
                      className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1"
                    >
                      <UserIcon className="w-3.5 h-3.5" />
                      <span>Role & Registration</span>
                    </button>
                    <button
                      onClick={() => {
                        switchRole('citizen');
                        setCurrentView('landing');
                        setIsRoleMenuOpen(false);
                      }}
                      className="text-xs text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1"
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
              className="lg:hidden w-10 h-10 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
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
              className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold ${
                currentView === link.id ? 'bg-emerald-50 text-emerald-800' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => {
              setCurrentView('submit-challenge');
              setIsMobileMenuOpen(false);
            }}
            className="w-full mt-2 py-2.5 bg-emerald-700 text-white rounded-lg text-xs font-bold"
          >
            Submit a Community Challenge
          </button>
        </div>
      )}
    </header>
  );
};
