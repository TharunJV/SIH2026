import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MOCK_DISTRICT_METRICS } from '../../mock/data';
import {
  ShieldCheck,
  Building2,
  FileText,
  Download,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Award,
  Users,
  MapPin,
  Sparkles,
  Layers,
  Search,
} from 'lucide-react';

export const GovernmentDashboard: React.FC = () => {
  const {
    currentUser,
    challenges,
    projects,
    navigateToChallenge,
    navigateToProject,
    setCurrentView,
    showToast,
  } = useApp();

  const [filterDistrict, setFilterDistrict] = useState('All');

  const pendingValidation = challenges.filter(
    (c) => c.status === 'Submitted' || c.status === 'Under Review'
  );

  const handleApproveChallenge = (id: string) => {
    const ch = challenges.find((c) => c.id === id);
    if (ch) {
      ch.status = 'Validated';
      showToast('success', 'State Validation Granted', `Challenge ${id} approved by State Nodal Officer for HEI allocation.`);
    }
  };

  const handleExportBrief = () => {
    showToast('success', 'Policy Brief Exported', 'Jharkhand State Societal Innovation & Capstone Policy Brief downloaded.');
  };

  return (
    <div className="space-y-6">
      {/* State Authority Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white rounded-2xl p-6 sm:p-8 border border-amber-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-800/80 border border-emerald-400/40 flex items-center justify-center text-amber-300 text-2xl font-black shrink-0 shadow-lg">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-400/30">
                State Executive PMU & Governance Dashboard
              </span>
              <span className="text-xs text-slate-400">Department of Higher & Technical Education</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
              Jharkhand State Higher Education Council (JSHEC)
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Central triage, district-level resource allocation, HEI performance monitoring, and state policy feedback.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportBrief}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Export State Policy Brief</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Grassroots Submissions', value: '412 Problems', icon: Layers, color: 'text-slate-900', bg: 'bg-white' },
          { label: 'Pending State Validation', value: `${pendingValidation.length} Action Items`, icon: AlertTriangle, color: 'text-amber-800', bg: 'bg-amber-50/70' },
          { label: 'Active University R&D Cohorts', value: '38 Teams', icon: Building2, color: 'text-indigo-800', bg: 'bg-indigo-50/70' },
          { label: 'Total Verified Beneficiaries', value: '1.42 Lakh Citizens', icon: Users, color: 'text-emerald-800', bg: 'bg-emerald-50/70' },
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

      {/* Two Column Grid: Validation Queue & District Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: State Validation Queue (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                State Nodal Problem Validation Queue ({pendingValidation.length})
              </h3>
              <p className="text-xs text-slate-500">Approve community submissions for institutional matching</p>
            </div>
          </div>

          <div className="space-y-3">
            {pendingValidation.map((ch) => (
              <div
                key={ch.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block line-clamp-1">{ch.title}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      ID: {ch.id} &bull; {ch.block}, {ch.district}
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase bg-amber-100 text-amber-800">
                    {ch.urgency}
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{ch.description}</p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                  <span className="text-[11px] text-emerald-800 font-semibold">
                    AI Priority Score: {ch.aiAnalysis.priorityScore}/100
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigateToChallenge(ch.id)}
                      className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-white"
                    >
                      Inspect
                    </button>
                    <button
                      onClick={() => handleApproveChallenge(ch.id)}
                      className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Validate</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: 24 District Performance Index (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                District Innovation Index
              </h3>
              <p className="text-xs text-slate-500">Live tracker across Jharkhand districts</p>
            </div>
            <button
              onClick={() => setCurrentView('map-view')}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-900"
            >
              Open Geo-Heatmap &rarr;
            </button>
          </div>

          <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
            {MOCK_DISTRICT_METRICS.slice(0, 10).map((d) => (
              <div
                key={d.districtName}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs"
              >
                <div>
                  <strong className="text-slate-900 block">{d.districtName}</strong>
                  <span className="text-[10px] text-slate-500">{d.dominantDomain}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900 block">{d.totalChallenges} Submissions</span>
                  <span className="text-[10px] text-emerald-800 font-semibold">{d.inProgressProjects} Active R&D</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
