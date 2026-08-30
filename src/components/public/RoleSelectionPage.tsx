import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RoleCarousel, SIX_ROLES, RoleConfig } from '../common/RoleCarousel';
import {
  ShieldCheck,
  Lock,
  Building,
  Sparkles,
  CheckCircle2,
  FileCheck2,
  HelpCircle,
  X,
  User,
  Mail,
  KeyRound,
  ArrowRight,
} from 'lucide-react';
import { JHARKHAND_DISTRICTS } from '../../mock/data';

export const RoleSelectionPage: React.FC = () => {
  const { switchRole, setCurrentView, showToast, setIsAuthModalOpen } = useApp();

  const [activeRoleConfig, setActiveRoleConfig] = useState<RoleConfig>(SIX_ROLES[0]);
  const [authDialogMode, setAuthDialogMode] = useState<'login' | 'signup' | null>(null);

  // Form states for login/signup modal
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [orgInput, setOrgInput] = useState('');
  const [districtInput, setDistrictInput] = useState(JHARKHAND_DISTRICTS[0]);

  const handleRoleSelected = (roleConfig: RoleConfig) => {
    setActiveRoleConfig(roleConfig);
    switchRole(roleConfig.role);
    showToast(
      'success',
      `Role Activated: ${roleConfig.name}`,
      `Logged in to ${roleConfig.name} dashboard environment.`
    );
    setCurrentView(roleConfig.targetView as any);
  };

  const handleQuickLogin = (e: React.FormEvent) => {
    e.preventDefault();
    switchRole(activeRoleConfig.role);
    showToast(
      'success',
      'Authentication Successful',
      `Welcome back! Accessing ${activeRoleConfig.name} portal.`
    );
    setAuthDialogMode(null);
    setCurrentView(activeRoleConfig.targetView as any);
  };

  const handleQuickSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput || !emailInput) {
      showToast('warning', 'Missing Fields', 'Please provide your full name and official email.');
      return;
    }
    switchRole(activeRoleConfig.role);
    showToast(
      'success',
      'Registration Submitted',
      `New stakeholder profile registered for ${nameInput} (${activeRoleConfig.name}).`
    );
    setAuthDialogMode(null);
    setCurrentView(activeRoleConfig.targetView as any);
  };

  return (
    <div className="w-full space-y-8 py-2">
      {/* 1. GOVERNMENT PORTAL INTRODUCTION BANNER */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white p-6 sm:p-10 border border-emerald-500/30 shadow-xl">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:18px_18px] pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Government of Jharkhand &bull; Higher & Technical Education</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            JH Innovation Connect &bull; Stakeholder Access Portal
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            Bridging grassroots citizens, higher education institutions (BIT Mesra, IIT ISM, NIT), faculty mentors, industry sponsors, startups, and district administrations in one unified innovation ecosystem.
          </p>
        </div>
      </section>

      {/* 2. SECTION HEADING */}
      <section className="text-center max-w-2xl mx-auto space-y-1.5 pt-2">
        <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Role-Based Access Control (RBAC)
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Select your role to continue
        </h2>
        <p className="text-xs sm:text-sm text-slate-600">
          Choose the role that best describes you
        </p>
      </section>

      {/* 3. INFINITE ROLE CAROUSEL & PAGINATION DOTS */}
      <section className="w-full">
        <RoleCarousel
          onRoleSelect={handleRoleSelected}
          onOpenAuthModal={(role, mode) => {
            setActiveRoleConfig(role);
            setAuthDialogMode(mode);
          }}
        />
      </section>

      {/* 4. "ALREADY HAVE AN ACCOUNT?" [ LOGIN ] [ SIGN UP ] */}
      <section className="max-w-md mx-auto p-5 rounded-2xl bg-white border border-slate-200 shadow-sm text-center space-y-3">
        <div className="text-xs font-bold text-slate-700">
          Already have an account?
        </div>
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setAuthDialogMode('login')}
            className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            <span>Login</span>
          </button>
          <button
            type="button"
            onClick={() => setAuthDialogMode('signup')}
            className="flex-1 py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5"
          >
            <User className="w-3.5 h-3.5" />
            <span>Sign Up</span>
          </button>
        </div>
        <p className="text-[11px] text-slate-500">
          Instant SSO & Demo access available for all hackathon judges and evaluators.
        </p>
      </section>

      {/* 5. SECURITY / TRUST INDICATORS */}
      <section className="border-t border-slate-200 pt-8 pb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-xs text-slate-900 block font-bold">Official State Portal</strong>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Department of Higher & Technical Education (DHTE) & JSHEC PMU.
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
            <Lock className="w-5 h-5 text-indigo-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-xs text-slate-900 block font-bold">Secure Verification</strong>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Role-based authorization with institutional domain verification.
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
            <Building className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-xs text-slate-900 block font-bold">24 District Network</strong>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Integrated across PRIs, Municipal ULBs, and University incubators.
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
            <FileCheck2 className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-xs text-slate-900 block font-bold">SIH 2026 Compliant</strong>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Full-stack Problem Statement #26043 specification alignment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK LOGIN / SIGNUP DIALOG */}
      {authDialogMode && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden space-y-4">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-emerald-950 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  {authDialogMode === 'login' ? 'Stakeholder Authentication' : 'New Stakeholder Registration'}
                </span>
                <h3 className="font-extrabold text-base text-white mt-0.5">
                  {authDialogMode === 'login'
                    ? `Login as ${activeRoleConfig.name}`
                    : `Sign Up as ${activeRoleConfig.name}`}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setAuthDialogMode(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <div className="p-5 sm:p-6 space-y-4">
              {authDialogMode === 'login' ? (
                <form onSubmit={handleQuickLogin} className="space-y-4">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>Demo Fast-Login Active:</strong> Proceed to load pre-configured credentials for {activeRoleConfig.name}.
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Official Email / Mobile / Employee ID
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. user@jharkhand.gov.in / 9876543210"
                      defaultValue={`demo.${activeRoleConfig.id}@jhinnovation.org`}
                      className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Password / OTP
                    </label>
                    <input
                      type="password"
                      defaultValue="••••••••••••"
                      className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setAuthDialogMode(null)}
                      className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={`px-5 py-2 rounded-xl text-xs font-bold shadow-sm ${activeRoleConfig.accentColor.button}`}
                    >
                      Continue to Dashboard &rarr;
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleQuickSignUp} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Representative Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Sunita Soren"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Organization / University / Village
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. BIT Mesra / Gram Panchayat Torpa"
                      value={orgInput}
                      onChange={(e) => setOrgInput(e.target.value)}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="rep@org.in"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Jharkhand District
                      </label>
                      <select
                        value={districtInput}
                        onChange={(e) => setDistrictInput(e.target.value)}
                        className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500"
                      >
                        {JHARKHAND_DISTRICTS.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setAuthDialogMode(null)}
                      className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={`px-5 py-2 rounded-xl text-xs font-bold shadow-sm ${activeRoleConfig.accentColor.button}`}
                    >
                      Complete Sign Up & Continue
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
