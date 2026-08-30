import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Challenge } from '../../types';
import { ChallengeEvaluationModal } from './ChallengeEvaluationModal';
import { MultidisciplinaryTeamBuilder } from './MultidisciplinaryTeamBuilder';
import { SolutionProposalBuilder } from './SolutionProposalBuilder';
import { AIAnalysisCard } from '../ai/AIAnalysisCard';
import {
  GraduationCap,
  Sparkles,
  Users,
  Briefcase,
  Layers,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  MapPin,
  FileText,
  Building2,
  DollarSign,
} from 'lucide-react';

export const UniversityDashboard: React.FC = () => {
  const {
    currentUser,
    challenges,
    projects,
    navigateToChallenge,
    navigateToProject,
    setCurrentView,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'incoming' | 'projects' | 'team-builder' | 'proposals'>('incoming');
  const [evaluatingChallenge, setEvaluatingChallenge] = useState<Challenge | null>(null);

  // Filter matched challenges for HEI
  const incomingMatched = challenges.filter(
    (c) => c.status === 'University Matching' || c.status === 'Validated' || c.status === 'Submitted'
  );

  const activeProjects = projects;

  const handleEvaluationAccept = (facultyName: string, notes: string) => {
    if (evaluatingChallenge) {
      evaluatingChallenge.status = 'Assigned';
      evaluatingChallenge.assignedUniversityName = currentUser.organization || 'Birla Institute of Technology, Mesra';
      evaluatingChallenge.assignedFacultyName = facultyName;
      showToast('success', 'Assigned to BIT Mesra', `Faculty ${facultyName} designated as Project Director.`);
      setEvaluatingChallenge(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Institutional Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-indigo-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-800/80 border border-indigo-400/40 flex items-center justify-center text-amber-300 text-2xl font-black shrink-0 shadow-lg">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-400/30">
                Higher Education Institution (HEI) Portal
              </span>
              <span className="text-xs text-slate-400 font-mono">JSHEC Accreditation: A++</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
              {currentUser.organization || 'Birla Institute of Technology (BIT Mesra)'}
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              R&D Cell, Incubation Center & Multidisciplinary Capstone Innovation Cohorts.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('team-builder')}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
          >
            <Users className="w-4 h-4" />
            <span>Assemble Student Team</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'AI Matched Challenges', value: incomingMatched.length, icon: Sparkles, color: 'text-amber-800', bg: 'bg-amber-50/70' },
          { label: 'Active R&D Projects', value: activeProjects.length, icon: Layers, color: 'text-indigo-800', bg: 'bg-indigo-50/70' },
          { label: 'Student Innovators', value: '48 Active', icon: Users, color: 'text-emerald-800', bg: 'bg-emerald-50/70' },
          { label: 'R&D / CSR Grants', value: '₹42.5 Lakhs', icon: DollarSign, color: 'text-teal-800', bg: 'bg-teal-50/70' },
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

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-2 gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('incoming')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 shrink-0 ${
            activeTab === 'incoming'
              ? 'border-indigo-700 text-indigo-950'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>AI Matched Incoming Challenges ({incomingMatched.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('projects')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 shrink-0 ${
            activeTab === 'projects'
              ? 'border-indigo-700 text-indigo-950'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Active R&D Projects ({activeProjects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('team-builder')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 shrink-0 ${
            activeTab === 'team-builder'
              ? 'border-indigo-700 text-indigo-950'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Multidisciplinary Team Builder</span>
        </button>

        <button
          onClick={() => setActiveTab('proposals')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 shrink-0 ${
            activeTab === 'proposals'
              ? 'border-indigo-700 text-indigo-950'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Proposal & CSR Grant Formulator</span>
        </button>
      </div>

      {/* Tab Content 1: Incoming AI-Matched Challenges */}
      {activeTab === 'incoming' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-950 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-700 shrink-0" />
              <span>
                These community challenges have been ranked by AI specifically for <strong>BIT Mesra</strong> based on departmental research capacity in Chemical, Water, Solar, and IoT domains.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {incomingMatched.map((ch) => (
              <div
                key={ch.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-indigo-400 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{ch.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">
                      {ch.id}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      94% Domain Match
                    </span>
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                      {ch.urgency} Urgency
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="lg:col-span-2 space-y-2 text-xs text-slate-600">
                    <p className="line-clamp-2 leading-relaxed">{ch.description}</p>
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {ch.block}, {ch.district}
                      </span>
                      <span>&bull;</span>
                      <span>Affected: {(ch.affectedPopulation || 0).toLocaleString()} citizens</span>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between gap-2 border-t lg:border-t-0 lg:border-l border-slate-100 lg:pl-4 pt-2 lg:pt-0">
                    <button
                      onClick={() => setEvaluatingChallenge(ch)}
                      className="w-full py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <GraduationCap className="w-4 h-4" />
                      <span>Evaluate & Assign Faculty Mentor</span>
                    </button>
                    <button
                      onClick={() => navigateToChallenge(ch.id)}
                      className="w-full py-2 border border-slate-300 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 text-center"
                    >
                      View Full Dossier & Evidence &rarr;
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content 2: Active R&D Projects */}
      {activeTab === 'projects' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeProjects.map((p) => {
              const anyP = p as any;
              const title = p.proposal?.title || p.challengeTitle || anyP.title || 'Multidisciplinary R&D Project';
              const trl = p.prototypeStatus?.trlLevel
                ? `TRL ${p.prototypeStatus.trlLevel}`
                : anyP.trlLevel || 'TRL 5';
              const membersCount =
                p.team?.members?.length ||
                anyP.teamMembers?.length ||
                4;
              const partner = p.industryPartners?.[0] || anyP.csrFunding;
              const sponsorName = partner?.partnerName || partner?.sponsorName || 'Open for Co-Sponsor';
              const rawIdx =
                typeof p.currentStageIndex === 'number'
                  ? p.currentStageIndex
                  : 6;
              const progressPct =
                anyP.completionPercentage ||
                Math.min(100, Math.round(((rawIdx + 1) / 14) * 100));

              return (
                <div
                  key={p.id}
                  onClick={() => navigateToProject(p.id)}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-emerald-500 cursor-pointer transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-slate-900 block line-clamp-1">{title}</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {p.id} &bull; {p.universityName}
                      </span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase bg-emerald-100 text-emerald-800">
                      {p.team?.status || anyP.status || 'Active R&D'}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-500">TRL Level:</span>
                      <strong className="text-indigo-800">{trl}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Multidisciplinary Cohort:</span>
                      <span className="font-semibold text-slate-800">{membersCount} Members</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">CSR Sponsor:</span>
                      <span className="font-semibold text-purple-800">{sponsorName}</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div>
                    <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                      <span>Lifecycle Milestone Progress</span>
                      <span>{progressPct}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-600 to-emerald-600"
                        style={{ width: `${progressPct}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab Content 3: Team Builder */}
      {activeTab === 'team-builder' && (
        <MultidisciplinaryTeamBuilder
          challengeId={challenges[0].id}
          onTeamCreated={(teamName, members) => {
            showToast('success', 'Cohort Registered', `${teamName} created and saved to active HEI repository.`);
            setActiveTab('projects');
          }}
        />
      )}

      {/* Tab Content 4: Proposals Builder */}
      {activeTab === 'proposals' && (
        <SolutionProposalBuilder
          challengeId={challenges[0].id}
          onProposalSubmitted={(prop) => {
            showToast('success', 'Proposal Forwarded', 'Proposal forwarded to State PMU for funding clearance.');
            setActiveTab('projects');
          }}
        />
      )}

      {/* Evaluation Modal */}
      {evaluatingChallenge && (
        <ChallengeEvaluationModal
          challenge={evaluatingChallenge}
          isOpen={!!evaluatingChallenge}
          onClose={() => setEvaluatingChallenge(null)}
          onAccept={handleEvaluationAccept}
        />
      )}
    </div>
  );
};
