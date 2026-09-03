import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getCitizenStatusLabel, getCitizenTrustStatus } from './CitizenDashboard';
import {
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  GraduationCap,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  FileText,
  ThumbsUp,
  Share2,
  Camera,
  Layers,
  History,
  Info,
  Check,
  X,
  ExternalLink,
  Award,
  Users,
  TrendingUp,
  RotateCcw,
  Maximize2,
} from 'lucide-react';
import { MultimediaEvidence } from '../../types';

export const CitizenChallengeDetail: React.FC = () => {
  const {
    selectedChallengeId,
    challenges,
    setCurrentView,
    showToast,
  } = useApp();

  const [endorsed, setEndorsed] = useState(false);
  const [following, setFollowing] = useState(false);
  const [activePhotoModal, setActivePhotoModal] = useState<MultimediaEvidence | null>(null);

  const challenge = challenges.find((c) => c.id === selectedChallengeId) || challenges[0];

  if (!challenge) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Challenge Not Found</h2>
        <p className="text-xs text-slate-500">The requested problem could not be located.</p>
        <button
          onClick={() => setCurrentView('citizen-dashboard')}
          className="px-5 py-2.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const statusInfo = getCitizenStatusLabel(challenge.status, challenge.isReopened);
  const trustInfo = getCitizenTrustStatus(challenge);
  const isResolved = challenge.status === 'Implemented' || challenge.status === 'Impact Measured';
  const isReopened = challenge.isReopened || challenge.status === 'Rejected';

  const handleEndorse = () => {
    if (!endorsed) {
      challenge.endorsementsCount += 1;
      setEndorsed(true);
      showToast('success', 'Problem Endorsed', 'Your community endorsement helps prioritize this issue.');
    }
  };

  const handleFollow = () => {
    setFollowing(!following);
    showToast(
      'info',
      following ? 'Unfollowed Challenge' : 'Following Challenge',
      following ? 'You will no longer receive live SMS/portal updates.' : 'You will receive notifications on university assignments and solution progress.'
    );
  };

  // Human-Friendly Timeline Steps (Section 20)
  const timelineStages = [
    {
      id: 'submitted',
      label: 'Problem Reported',
      date: challenge.submittedAt ? new Date(challenge.submittedAt).toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' }) : '28 Aug 2026',
      done: true,
      description: 'Citizen report received and registered in the state system.',
    },
    {
      id: 'evidence',
      label: 'Evidence Submitted',
      date: challenge.submittedAt ? new Date(challenge.submittedAt).toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' }) : '28 Aug 2026',
      done: (challenge.evidence || []).length > 0,
      description: `${(challenge.evidence || []).length} photos and geotag data attached.`,
    },
    {
      id: 'reviewed',
      label: 'Report Reviewed',
      date: '29 Aug 2026',
      done: challenge.status !== 'Submitted',
      description: 'Nodal verification team inspected details.',
    },
    {
      id: 'published',
      label: 'Challenge Published',
      date: '30 Aug 2026',
      done: challenge.status !== 'Submitted' && challenge.status !== 'Under Review',
      description: 'Open on the state innovation portal for institutions.',
    },
    {
      id: 'interest',
      label: 'University Expressed Interest',
      date: '02 Sep 2026',
      done:
        challenge.status === 'University Matching' ||
        challenge.status === 'Assigned' ||
        challenge.status === 'In Development' ||
        challenge.status === 'Pilot' ||
        challenge.status === 'Implemented',
      description: challenge.assignedUniversityName
        ? `${challenge.assignedUniversityName} reviewed problem domain.`
        : 'Universities reviewing technical feasibility.',
    },
    {
      id: 'assigned',
      label: 'University Assigned',
      date: '04 Sep 2026',
      done:
        challenge.status === 'Assigned' ||
        challenge.status === 'In Development' ||
        challenge.status === 'Pilot' ||
        challenge.status === 'Implemented',
      description: challenge.assignedUniversityName
        ? `Officially allocated to ${challenge.assignedUniversityName}.`
        : 'Allocation pending.',
    },
    {
      id: 'in_progress',
      label: 'Solution in Progress',
      date: 'Active',
      done: challenge.status === 'In Development' || challenge.status === 'Pilot' || challenge.status === 'Implemented',
      isCurrent: challenge.status === 'In Development' || challenge.status === 'Pilot',
      description: 'Prototype development and field testing underway.',
    },
    {
      id: 'outcome',
      label: isResolved ? 'Problem Addressed' : 'Public Outcome',
      date: isResolved ? 'Completed' : 'Pending',
      done: isResolved,
      description: isResolved ? 'Successful implementation verified on site.' : 'Awaiting final rollout verification.',
    },
  ];

  // Mock previous failed attempts for institutional memory (Section 22)
  const previousAttempts = challenge.previousAttempts || (isReopened ? [
    {
      attemptNumber: 1,
      universityName: 'Ranchi Regional Institute of Technology',
      outcome: 'Unsuccessful' as const,
      completedDate: '15 June 2026',
      publicSummary: 'Initial solar filtration system faced seasonal water silt clogging during heavy monsoon testing.',
      publicReportUrl: '#',
    },
  ] : []);

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans-body">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setCurrentView('citizen-my-challenges')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-amber-700 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Challenges</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleFollow}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1.5 ${
              following
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{following ? 'Following Updates' : 'Follow Challenge'}</span>
          </button>

          <button
            type="button"
            onClick={handleEndorse}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              endorsed
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
            }`}
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>{endorsed ? 'Endorsed' : 'Endorse'} ({challenge.endorsementsCount || 0})</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. HEADER & BASIC DETAILS (SECTION 19) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-5">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
              Challenge ID: {challenge.id}
            </span>
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full border ${trustInfo.bg} ${trustInfo.color}`}
            >
              {trustInfo.label}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full border ${statusInfo.bg} ${statusInfo.border} ${statusInfo.color}`}
            >
              {statusInfo.label}
            </span>
            <span className="text-xs font-bold bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-300/60">
              {challenge.category}
            </span>
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {challenge.title}
          </h1>
          <p className="text-sm text-slate-700 leading-relaxed">
            {challenge.description}
          </p>
        </div>

        {/* Location & Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5">
            <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Location</span>
              <span className="text-xs font-bold text-slate-900">
                {challenge.village ? `${challenge.village}, ` : ''}{challenge.district}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5">
            <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Reported On</span>
              <span className="text-xs font-bold text-slate-900">
                {challenge.submittedAt ? new Date(challenge.submittedAt).toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent'}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5">
            <Users className="w-4 h-4 text-slate-500 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Community Impact</span>
              <span className="text-xs font-bold text-slate-900">
                {(challenge.affectedPopulation || 500).toLocaleString()} residents affected
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. REOPENED CHALLENGE BANNER (SECTION 23) */}
      {/* ========================================================================= */}
      {isReopened && (
        <div className="bg-amber-50 rounded-3xl p-6 border-2 border-amber-300 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-sm sm:text-base">
            <RotateCcw className="w-5 h-5 text-amber-700" />
            <span>Open for Another Attempt</span>
          </div>
          <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">
            The previous solution attempt was unsuccessful. The challenge remains open so another capable university team or innovation partner can try.
          </p>
          <div className="text-[11px] text-amber-800 font-medium">
            &bull; The platform automatically matches new institutions. You do not need to take any action.
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. SUCCESSFUL OUTCOME CARD (SECTION 24) */}
      {/* ========================================================================= */}
      {isResolved && (
        <div className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 rounded-3xl p-6 sm:p-8 border-2 border-emerald-400 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 text-emerald-900">
            <Award className="w-6 h-6 text-emerald-600" />
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 uppercase">
                Success
              </span>
              <h2 className="text-lg font-bold text-emerald-950 mt-0.5">
                Solution Successfully Implemented
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {challenge.publicOutcome?.summary ||
              'A low-cost, gravity-fed filtration system was engineered by Birla Institute of Technology (BIT) Mesra with Tata Steel support, providing verified clean potable water to local residents.'}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-2xl bg-white border border-emerald-200">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Beneficiaries</span>
              <span className="text-lg font-black text-emerald-800">
                {(challenge.publicOutcome?.beneficiariesCount || 2400).toLocaleString()} residents
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-white border border-emerald-200">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Districts Affected</span>
              <span className="text-lg font-black text-slate-900">
                {challenge.publicOutcome?.districtsCount || 1} District
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-white border border-emerald-200 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Deployment Status</span>
              <span className="text-xs font-bold text-emerald-800">
                {challenge.publicOutcome?.deploymentStatus || 'Pilot Completed & Handed Over'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. VISUAL CHALLENGE TIMELINE (SECTION 20) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Challenge Progress Timeline
          </h2>
          <p className="text-xs text-slate-500">
            Real-time status tracking as your problem moves from verification to solution deployment.
          </p>
        </div>

        <div className="relative pl-6 sm:pl-8 space-y-6 border-l-2 border-slate-200 ml-3">
          {timelineStages.map((st, idx) => (
            <div key={st.id} className="relative group">
              {/* Timeline Bullet Icon */}
              <div
                className={`absolute -left-[31px] sm:-left-[39px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-transform ${
                  st.done
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : st.isCurrent
                    ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-100 animate-pulse'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {st.done ? <Check className="w-3.5 h-3.5" /> : idx + 1}
              </div>

              {/* Content */}
              <div className="space-y-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h3
                    className={`text-xs sm:text-sm font-bold ${
                      st.done
                        ? 'text-slate-900'
                        : st.isCurrent
                        ? 'text-amber-800'
                        : 'text-slate-500'
                    }`}
                  >
                    {st.label}
                  </h3>
                  <span className="text-[10px] text-slate-600 font-medium">
                    &bull; {st.date}
                  </span>
                </div>
                <p className="text-xs text-slate-600">{st.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. SOLUTION PARTNER (UNIVERSITY) PUBLIC INFORMATION (SECTION 21) */}
      {/* ========================================================================= */}
      {challenge.assignedUniversityName && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-purple-600" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Solution Partner
            </h2>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-purple-50/60 border border-purple-200/80 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] uppercase font-bold text-purple-800 tracking-wider">
                  Assigned Institution
                </span>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  {challenge.assignedUniversityName}
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white text-purple-900 border border-purple-300 self-start sm:self-auto">
                Higher Education Institution
              </span>
            </div>

            {/* Public Progress */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Solution Development Progress</span>
                <span className="font-black text-purple-900">65% Completed</span>
              </div>
              <div className="w-full h-2 bg-purple-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-600 rounded-full w-[65%]" />
              </div>
            </div>

            {/* Public Summary */}
            <p className="text-xs text-slate-700 pt-1">
              <strong>Public Project Scope:</strong> Multidisciplinary research team is developing and field-testing a localized low-cost filtration prototype designed for tribal settlements.
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. PREVIOUS FAILED ATTEMPTS (SECTION 22 - INSTITUTIONAL MEMORY) */}
      {/* ========================================================================= */}
      {previousAttempts.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-900">
            <History className="w-5 h-5 text-slate-600" />
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Previous Attempts History
              </h2>
              <p className="text-xs text-slate-500">
                These previous attempts help future teams understand what has already been tried.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {previousAttempts.map((att) => (
              <div
                key={att.attemptNumber}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">
                    Attempt {att.attemptNumber} &bull; {att.universityName}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 border border-rose-200">
                    {att.outcome}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {att.publicSummary}
                </p>
                <div className="text-[10px] text-slate-600 font-medium">
                  Tested: {att.completedDate}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. EVIDENCE GALLERY */}
      {/* ========================================================================= */}
      {(challenge.evidence || []).length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-amber-600" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Submitted Photos & Evidence
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              {(challenge.evidence || []).length} items attached
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {challenge.evidence.map((ev) => (
              <div
                key={ev.id}
                onClick={() => setActivePhotoModal(ev)}
                className="relative group rounded-2xl overflow-hidden border border-slate-200 aspect-4/3 cursor-pointer bg-slate-100"
              >
                <img
                  src={ev.url}
                  alt={ev.caption || 'Evidence Photo'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <Maximize2 className="w-5 h-5" />
                </div>
                {ev.isGeotagged && (
                  <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[9px] font-bold text-emerald-300 flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5" />
                    <span>Geotagged</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Photo Preview Modal */}
      {activePhotoModal && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActivePhotoModal(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-slate-900 text-white rounded-3xl overflow-hidden p-4 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-300">
                {activePhotoModal.caption || 'Evidence Preview'}
              </span>
              <button
                type="button"
                onClick={() => setActivePhotoModal(null)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <img
              src={activePhotoModal.url}
              alt="Preview"
              className="w-full max-h-[70vh] object-contain rounded-xl"
            />
            {activePhotoModal.geotagLocation && (
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{activePhotoModal.geotagLocation}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
