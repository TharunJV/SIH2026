import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProjectLifecycle } from '../../types';
import {
  Briefcase,
  DollarSign,
  Award,
  Sparkles,
  Building2,
  CheckCircle2,
  Users,
  Layers,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react';

export const IndustryDashboard: React.FC = () => {
  const {
    currentUser,
    projects,
    challenges,
    navigateToProject,
    navigateToChallenge,
    setCurrentView,
    showToast,
  } = useApp();

  const [selectedFundingProject, setSelectedFundingProject] = useState<ProjectLifecycle | any | null>(null);
  const [pledgeAmount, setPledgeAmount] = useState<number>(350000);
  const [csrFocus, setCsrFocus] = useState('Rural Water Security & Tribal Health');

  const handlePledgeCSR = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFundingProject) return;

    if (selectedFundingProject.industryPartners) {
      selectedFundingProject.industryPartners.push({
        partnerId: 'partner-ind-01',
        partnerName: currentUser.organization || 'Tata Steel CSR Foundation',
        contributionType: 'Funding',
        fundingAmount: pledgeAmount,
        mentorName: 'Dedicated Senior Materials & Solar Engineer',
      });
    }

    const projectTitle =
      selectedFundingProject.proposal?.title ||
      selectedFundingProject.challengeTitle ||
      selectedFundingProject.title ||
      'Selected Innovation Project';

    showToast(
      'success',
      'CSR Grant Committed',
      `Committed ₹${(pledgeAmount || 0).toLocaleString()} to ${projectTitle}.`
    );
    setSelectedFundingProject(null);
  };

  return (
    <div className="space-y-6">
      {/* Industry Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-purple-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-800/80 border border-purple-400/40 flex items-center justify-center text-amber-300 text-2xl font-black shrink-0 shadow-lg">
            <Briefcase className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-400/30">
                Industry, CSR & MSME Partnership Hub
              </span>
              <span className="text-xs text-slate-400 font-mono">Jharkhand CSR Portal Integrated</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
              {currentUser.organization || 'Tata Steel Sustainability & CSR Foundation'}
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Co-funding university R&D prototypes, providing industrial testing testbeds, and commercializing indigenous solutions.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView('explore-challenges')}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Discover Unfunded Challenges</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'CSR Capital Committed', value: '₹1.85 Cr', icon: DollarSign, color: 'text-purple-800', bg: 'bg-purple-50/70' },
          { label: 'Active Sponsored Pilots', value: '12 Deployments', icon: Layers, color: 'text-indigo-800', bg: 'bg-indigo-50/70' },
          { label: 'Technical Mentors Assigned', value: '28 Engineers', icon: Users, color: 'text-emerald-800', bg: 'bg-emerald-50/70' },
          { label: 'Commercialized Solutions', value: '4 Startups', icon: Award, color: 'text-teal-800', bg: 'bg-teal-50/70' },
        ].map((item, idx) => (
          <div key={idx} className={`${item.bg} p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between`}>
            <div>
              <span className="text-xs font-bold text-slate-600">{item.label}</span>
              <span className={`text-xl font-black ${item.color} mt-1 block`}>{item.value}</span>
            </div>
            <item.icon className={`w-8 h-8 opacity-30 ${item.color}`} />
          </div>
        ))}
      </div>

      {/* Projects Open for Industry / CSR Matching Grants */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
              University R&D Projects Seeking CSR & Industry Testbeds
            </h3>
            <p className="text-xs text-slate-500">
              Vetted by Jharkhand State Higher Education Council (JSHEC) & Department of Higher & Technical Education
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((p) => {
            const anyP = p as any;
            const title = p.proposal?.title || p.challengeTitle || anyP.title || 'Multidisciplinary Solution';
            const summary =
              p.proposal?.proposedSolution ||
              p.proposal?.problemUnderstanding ||
              anyP.executiveSummary ||
              'Innovative academic engineering prototype targeted at grassroots community deployment.';
            const trl = p.prototypeStatus?.trlLevel
              ? `TRL ${p.prototypeStatus.trlLevel}`
              : anyP.trlLevel || 'TRL 5';
            const budget =
              p.proposal?.totalBudget ||
              p.proposal?.totalBudgetINR ||
              anyP.totalBudgetINR ||
              480000;
            const partner = p.industryPartners?.[0] || anyP.csrFunding;
            const sponsorName = partner?.partnerName || partner?.sponsorName;
            const hasSponsor = !!sponsorName;

            return (
              <div
                key={p.id}
                className="p-5 rounded-2xl border border-slate-200 hover:border-purple-400 bg-slate-50/50 hover:bg-white transition-all space-y-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block line-clamp-1">{title}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Lead HEI: <strong>{p.universityName}</strong>
                    </span>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                      hasSponsor ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {hasSponsor ? 'Funded' : 'Seeking Sponsor'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{summary}</p>

                {/* Tech & Budget info */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">TRL Readiness:</span>
                    <strong className="text-indigo-800">{trl}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Pilot Budget Required:</span>
                    <strong className="text-slate-900">₹{(budget || 0).toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Current CSR Partner:</span>
                    <span className="font-semibold text-purple-800">
                      {sponsorName || 'Open for Co-Sponsorship'}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => setSelectedFundingProject(p)}
                    className="flex-1 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>Pledge CSR Grant / Mentorship</span>
                  </button>

                  <button
                    onClick={() => navigateToProject(p.id)}
                    className="px-3.5 py-2.5 border border-slate-300 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-700"
                  >
                    14-Stage Lifecycle &rarr;
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pledge Modal */}
      {selectedFundingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 bg-gradient-to-r from-slate-900 to-purple-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm">Pledge CSR Sponsorship & Mentorship</h3>
              </div>
              <button
                onClick={() => setSelectedFundingProject(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePledgeCSR} className="p-5 sm:p-6 space-y-4">
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs text-purple-950">
                <strong>Project:</strong>{' '}
                {selectedFundingProject.proposal?.title ||
                  selectedFundingProject.challengeTitle ||
                  selectedFundingProject.title ||
                  'Innovation Project'}{' '}
                ({selectedFundingProject.universityName})
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  CSR Grant Allocation (INR) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min={50000}
                  step={10000}
                  value={pledgeAmount}
                  onChange={(e) => setPledgeAmount(Number(e.target.value))}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  CSR Thematic Priority Domain
                </label>
                <input
                  type="text"
                  value={csrFocus}
                  onChange={(e) => setCsrFocus(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Eligible for 100% Jharkhand State CSR Compliance Credit under Section 135 & JSHEC Innovation Guidelines.
                </span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedFundingProject(null)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold shadow-md"
                >
                  Confirm CSR Commitment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
