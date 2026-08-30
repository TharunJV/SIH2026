import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LifecycleTimeline } from '../common/LifecycleTimeline';
import { AIAnalysisCard } from '../ai/AIAnalysisCard';
import { TrustStatusBadge } from '../common/TrustStatusBadge';
import { StakeholderPerspectiveBar } from '../common/StakeholderPerspectiveBar';
import { IntelligentRoutingCard } from '../common/IntelligentRoutingCard';
import {
  MapPin,
  Calendar,
  Users,
  AlertTriangle,
  Sparkles,
  Share2,
  ThumbsUp,
  GraduationCap,
  Building2,
  Briefcase,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  FileText,
  MessageSquare,
  Info,
  Camera,
  Maximize2,
  X,
} from 'lucide-react';
import { MultimediaEvidence } from '../../types';

export const CitizenChallengeDetail: React.FC = () => {
  const {
    selectedChallengeId,
    challenges,
    currentUser,
    switchRole,
    navigateToProject,
    setCurrentView,
    showToast,
  } = useApp();

  const [endorsed, setEndorsed] = useState(false);
  const [activeEvidenceModal, setActiveEvidenceModal] = useState<MultimediaEvidence | null>(null);

  const challenge = challenges.find((c) => c.id === selectedChallengeId) || challenges[0];

  if (!challenge) {
    return <div className="p-8 text-center text-slate-500">Challenge not found.</div>;
  }


  const handleEndorse = () => {
    if (!endorsed) {
      challenge.endorsementsCount += 1;
      setEndorsed(true);
      showToast('success', 'Endorsed Problem', 'Your community endorsement has been recorded by the State PMU.');
    }
  };

  const isVerifiedState =
    challenge.status === 'Validated' ||
    challenge.status === 'University Matching' ||
    challenge.status === 'Assigned' ||
    challenge.status === 'In Development' ||
    challenge.status === 'Pilot' ||
    challenge.status === 'Implemented';

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Banner with Tracking ID & Trust Status */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              {challenge.category}
            </span>
            <span className="text-slate-400 text-xs font-mono font-bold bg-slate-800 px-2 py-0.5 rounded">
              ID: {challenge.id}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <TrustStatusBadge
              status={challenge.status}
              hasEvidence={(challenge.evidence || []).length > 0}
              isVerified={isVerifiedState}
              size="sm"
            />
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${
                challenge.urgency === 'Critical'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : challenge.urgency === 'High'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
              }`}
            >
              {challenge.urgency} Urgency
            </span>
          </div>
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
            {challenge.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 mt-2">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              {challenge.village}, {challenge.block}, {challenge.district}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Submitted {new Date(challenge.submittedAt).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              Affected: {(challenge.affectedPopulation || 0).toLocaleString()} citizens
            </span>
          </div>
        </div>

        {/* Trust Workflow Explainer */}
        <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs text-slate-300 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed text-[11px]">
            <strong>Verification Notice:</strong> This record originated as a community report. The platform investigates and field-verifies submissions with local nodal officers before deploying university R&D or state resources.
          </p>
        </div>

        {/* Action controls */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={handleEndorse}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                endorsed
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700'
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>{endorsed ? 'Endorsed by You' : 'Endorse Problem'} ({challenge.endorsementsCount})</span>
            </button>
            <button
              onClick={() => {
                showToast('info', 'Share Link Copied', 'Challenge URL copied to clipboard for Gram Sabha circulation.');
              }}
              className="p-1.5 bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-700"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {challenge.projectId && (
              <button
                onClick={() => navigateToProject(challenge.projectId!)}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5"
              >
                <span>Inspect Active R&D Project &rarr;</span>
              </button>
            )}
            <button
              onClick={() => {
                switchRole('university_admin');
                setCurrentView('university-dashboard');
              }}
              className="px-3.5 py-1.5 bg-indigo-900/80 hover:bg-indigo-800 text-indigo-200 border border-indigo-700 text-xs font-semibold rounded-lg flex items-center gap-1"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Evaluate as HEI</span>
            </button>
          </div>
        </div>
      </div>

      {/* Multi-Stakeholder Perspective View */}
      <StakeholderPerspectiveBar
        challengeId={challenge.id}
        category={challenge.category}
        status={challenge.status}
        assignedUniversity={challenge.assignedUniversityName}
      />

      {/* Intelligent Solution Pathway Card */}
      <IntelligentRoutingCard
        category={challenge.category}
        recommendedPathway={challenge.category === 'Public Service Delivery' ? 'public_service' : 'innovation_rnd'}
      />

      {/* 10-Stage Lifecycle Visual Stepper */}
      <LifecycleTimeline currentStatus={challenge.status} />

      {/* AI Problem Analysis Card */}
      <AIAnalysisCard analysis={challenge.aiAnalysis} />

      {/* Detailed Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Problem Narrative, Impact, Evidence (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Detailed Narrative */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              Problem Description & Background
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {challenge.description}
            </p>

            <div className="pt-3 border-t border-slate-100">
              <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider mb-1.5">
                Expected Societal Impact
              </h4>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 leading-relaxed font-medium">
                {challenge.expectedImpact}
              </div>
            </div>

            {challenge.additionalInformation && (
              <div className="pt-2">
                <span className="text-xs font-bold text-slate-700 block mb-1">Local Context & Site Readiness:</span>
                <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  {challenge.additionalInformation}
                </p>
              </div>
            )}
          </div>

          {/* Multimedia Evidence Gallery */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center justify-between">
              <span>Multimedia Evidence & Lab Verification</span>
              <span className="text-[10px] text-slate-500 font-normal">{(challenge.evidence || []).length} Files Attached</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(challenge.evidence || []).map((ev) => (
                <div key={ev.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 group">
                  {ev.type === 'image' ? (
                    <div className="relative rounded-lg overflow-hidden h-44 bg-slate-900 border border-slate-200">
                      <img
                        src={ev.url}
                        alt={ev.caption}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      />
                      {/* Top Geotag Stamp */}
                      <div className="absolute top-0 inset-x-0 bg-slate-950/80 backdrop-blur-xs text-white p-1.5 px-2 flex items-center justify-between text-[10px] font-mono border-b border-white/10">
                        <span className="flex items-center gap-1 text-emerald-300 font-bold">
                          <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                          {(ev.gpsCoordinates?.lat || challenge.gpsCoordinates?.lat || 22.9567).toFixed(4)}° N,{' '}
                          {(ev.gpsCoordinates?.lng || challenge.gpsCoordinates?.lng || 85.0844).toFixed(4)}° E
                        </span>
                        <span className="text-slate-300 text-[9px]">{ev.timestamp}</span>
                      </div>

                      {/* Bottom Location Watermark & Inspect Button */}
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent text-white p-1.5 px-2 flex items-center justify-between text-[10px]">
                        <span className="truncate text-slate-200 font-medium text-[10px]">
                          📍 {ev.geotagLocation || `${challenge.block}, ${challenge.district}`}
                        </span>
                        <button
                          type="button"
                          onClick={() => setActiveEvidenceModal(ev)}
                          className="p-1 rounded-md bg-white/20 hover:bg-white/40 text-white shrink-0 ml-1 transition-all"
                          title="Inspect Geotag Details"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-44 bg-slate-200 rounded-lg flex flex-col items-center justify-center text-slate-600 gap-2">
                      <FileText className="w-10 h-10 text-slate-400" />
                      <span className="text-xs font-bold">PDF Verification Document</span>
                    </div>
                  )}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-bold text-xs text-slate-900 block line-clamp-1">{ev.caption}</span>
                      <span className="text-[10px] text-slate-500">
                        {ev.isGeotagged !== false ? '🟢 GPS Verified Geotag' : 'Verified Evidence'} &bull; {ev.timestamp}
                      </span>
                    </div>
                    {ev.type === 'image' && (
                      <button
                        onClick={() => setActiveEvidenceModal(ev)}
                        className="text-[10px] font-bold text-emerald-700 hover:underline shrink-0"
                      >
                        Inspect
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Submitter Info, Allocation, Timeline (1 col) */}
        <div className="space-y-6">
          {/* Submitter Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Challenge Submitted By
            </span>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
                {(challenge.submittedBy?.userName || 'A').charAt(0)}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">{challenge.submittedBy?.userName || 'Anonymous Submitter'}</h4>
                <p className="text-[11px] text-slate-600 capitalize">
                  {challenge.submittedBy?.organization || challenge.submittedBy?.userRole?.replace('_', ' ') || 'Citizen'}
                </p>
                <p className="text-[10px] text-slate-500">{challenge.submittedBy?.contactNumber || ''}</p>
              </div>
            </div>
          </div>

          {/* Assigned University & Mentors */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              University Allocation
            </span>
            {challenge.assignedUniversityName ? (
              <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-1.5">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-indigo-700" />
                  <span className="text-xs font-bold text-indigo-950">{challenge.assignedUniversityName}</span>
                </div>
                {challenge.assignedFacultyName && (
                  <p className="text-[11px] text-indigo-900">
                    <strong>Mentor:</strong> {challenge.assignedFacultyName}
                  </p>
                )}
              </div>
            ) : (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500">
                Pending evaluation by recommended HEIs (BIT Mesra / IIT ISM).
              </div>
            )}
          </div>

          {/* Historical Activity Log */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              Lifecycle Activity History
            </h4>
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {(challenge.timeline || []).map((item, idx) => (
                <div key={idx} className="relative pl-5 border-l-2 border-slate-200 text-xs space-y-0.5">
                  <span className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-emerald-600"></span>
                  <div className="flex items-center justify-between text-[11px]">
                    <strong className="text-slate-900">{item.stage}</strong>
                    <span className="text-[10px] text-slate-400">{item.date}</span>
                  </div>
                  <p className="text-[11px] text-slate-600">{item.description}</p>
                  <span className="text-[10px] text-slate-400 block italic">Actor: {item.actor}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* LIGHTBOX EVIDENCE MODAL */}
      {activeEvidenceModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 text-white rounded-3xl max-w-2xl w-full overflow-hidden border border-slate-800 shadow-2xl space-y-4">
            <div className="p-4 px-6 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white">
                  Field Evidence & Geotag Inspection
                </span>
              </div>
              <button
                onClick={() => setActiveEvidenceModal(null)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 space-y-4">
              <div className="relative rounded-2xl overflow-hidden aspect-video bg-black border border-slate-800">
                <img
                  src={activeEvidenceModal.url}
                  alt={activeEvidenceModal.caption}
                  className="w-full h-full object-contain"
                />
                <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-xs text-emerald-300 px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 border border-emerald-500/30">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  {(activeEvidenceModal.gpsCoordinates?.lat || challenge.gpsCoordinates?.lat || 22.9567).toFixed(4)}° N,{' '}
                  {(activeEvidenceModal.gpsCoordinates?.lng || challenge.gpsCoordinates?.lng || 85.0844).toFixed(4)}° E
                </div>
              </div>

              {/* Geotag metadata card */}
              <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                  <span className="font-bold text-slate-200">{activeEvidenceModal.caption}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-500/40">
                    🟢 Verified GPS Geotag
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-slate-300 pt-1">
                  <div>
                    <span className="text-slate-500 block text-[10px]">District & Location</span>
                    <strong className="text-white">
                      {activeEvidenceModal.geotagLocation || `${challenge.block}, ${challenge.district}`}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Recorded Timestamp</span>
                    <strong className="text-white">{activeEvidenceModal.timestamp}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Challenge ID</span>
                    <strong className="text-amber-400 font-mono">{challenge.id}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 px-6 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setActiveEvidenceModal(null)}
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all"
              >
                Close Inspection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
