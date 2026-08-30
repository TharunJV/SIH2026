import React from 'react';
import { useApp } from '../../context/AppContext';
import { TrustStatusBadge } from '../common/TrustStatusBadge';
import {
  Sparkles,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  MapPin,
  ChevronRight,
  TrendingUp,
  Award,
  Bell,
  Eye,
} from 'lucide-react';

export const CitizenDashboard: React.FC = () => {
  const {
    currentUser,
    challenges,
    navigateToChallenge,
    setCurrentView,
    notifications,
    markNotificationAsRead,
  } = useApp();

  const userChallenges = challenges; // In prototype, display community challenges

  const stats = {
    total: userChallenges.length,
    underReview: userChallenges.filter((c) => c.status === 'Under Review' || c.status === 'Submitted').length,
    validated: userChallenges.filter((c) => c.status === 'Validated' || c.status === 'University Matching').length,
    assigned: userChallenges.filter((c) => c.status === 'Assigned' || c.status === 'Project Proposed').length,
    inProgress: userChallenges.filter((c) => c.status === 'In Development' || c.status === 'Pilot').length,
    resolved: userChallenges.filter((c) => c.status === 'Implemented' || c.status === 'Impact Measured').length,
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              Citizen & Community Portal
            </span>
            <span className="text-xs text-slate-400">Welcome, {currentUser.name}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
            Community Challenge Dashboard
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Track your submitted grassroots problems as they advance through State investigation, University research allocation, and Industry pilot deployment.
          </p>
        </div>

        <button
          onClick={() => setCurrentView('submit-challenge')}
          className="px-5 py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 shrink-0 hover:scale-102"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Submit New Challenge</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Total Submitted', value: stats.total, color: 'text-slate-900', bg: 'bg-white' },
          { label: 'Under Review', value: stats.underReview, color: 'text-amber-800', bg: 'bg-amber-50/60' },
          { label: 'State Validated', value: stats.validated, color: 'text-blue-800', bg: 'bg-blue-50/60' },
          { label: 'Assigned to HEIs', value: stats.assigned, color: 'text-indigo-800', bg: 'bg-indigo-50/60' },
          { label: 'In R&D / Pilot', value: stats.inProgress, color: 'text-emerald-800', bg: 'bg-emerald-50/60' },
          { label: 'Resolved', value: stats.resolved, color: 'text-teal-800', bg: 'bg-teal-50/60' },
        ].map((item, idx) => (
          <div key={idx} className={`${item.bg} p-4 rounded-xl border border-slate-200 shadow-2xs`}>
            <span className="text-[11px] font-semibold text-slate-600 block">{item.label}</span>
            <span className={`text-xl font-black ${item.color} mt-1 block`}>{item.value}</span>
          </div>
        ))}
      </div>

      {/* Main Grid: My Challenges List + Live Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Challenges List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                My Community Problem Submissions ({userChallenges.length})
              </h3>
              <button
                onClick={() => setCurrentView('explore-challenges')}
                className="text-xs font-semibold text-emerald-800 hover:text-emerald-900"
              >
                Browse All State Challenges &rarr;
              </button>
            </div>

            <div className="space-y-3">
              {userChallenges.map((ch) => {
                const isVerified =
                  ch.status === 'Validated' ||
                  ch.status === 'University Matching' ||
                  ch.status === 'Assigned' ||
                  ch.status === 'In Development' ||
                  ch.status === 'Pilot' ||
                  ch.status === 'Implemented';

                return (
                  <div
                    key={ch.id}
                    onClick={() => navigateToChallenge(ch.id)}
                    className="p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/20 cursor-pointer transition-all space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-xs font-bold text-slate-900 line-clamp-1 hover:text-emerald-800">
                          {ch.title}
                        </span>
                        <span className="text-[10px] text-slate-600 font-mono font-semibold">
                          ID: {ch.id} &bull; {ch.category}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase shrink-0 ${
                          ch.urgency === 'Critical'
                            ? 'bg-rose-100 text-rose-800'
                            : ch.urgency === 'High'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {ch.urgency}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{ch.description}</p>

                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-600 gap-2">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-600" />
                        {ch.block}, {ch.district}
                      </span>
                      <div className="flex items-center gap-2">
                        <TrustStatusBadge
                          status={ch.status}
                          hasEvidence={(ch.evidence || []).length > 0}
                          isVerified={isVerified}
                          size="sm"
                        />
                        <span className="text-slate-900 font-bold flex items-center gap-0.5">
                          Details <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Live Notifications & Quick Help */}
        <div className="space-y-6">
          {/* Notifications Box */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-emerald-800" />
                Live Status Updates
              </h4>
              <span className="text-[10px] text-slate-600">{notifications.length} alerts</span>
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => {
                    markNotificationAsRead(notif.id);
                    if (notif.relatedId?.startsWith('JH-')) {
                      navigateToChallenge(notif.relatedId);
                    }
                  }}
                  className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    !notif.read
                      ? 'bg-emerald-50/70 border-emerald-200'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className="font-bold text-slate-900 line-clamp-1">{notif.title}</span>
                    <span className="text-[9px] text-slate-600 shrink-0">{notif.timestamp.split(' ')[0]}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">{notif.message}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Citizen Guide Card */}
          <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-2xl p-5 border border-emerald-700/50 shadow-md space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h4 className="font-bold text-xs uppercase tracking-wider text-amber-300">
                Citizen Empowerment Promise
              </h4>
            </div>
            <p className="text-xs text-emerald-100 leading-relaxed">
              Every verified challenge submitted to the portal is reviewed by Jharkhand Higher Education Institutions and prioritized for student hackathon capstone R&D and CSR funding.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
