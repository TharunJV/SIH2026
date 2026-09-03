import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  PlusCircle,
  Compass,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Calendar,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Eye,
  Camera,
  Layers,
} from 'lucide-react';
import { Challenge } from '../../types';

// Helper for human-readable citizen status mapping
export const getCitizenStatusLabel = (status: string, isReopened?: boolean): { label: string; color: string; bg: string; border: string } => {
  if (isReopened) {
    return {
      label: 'Open for Another Attempt',
      color: 'text-amber-800',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
    };
  }

  switch (status) {
    case 'Submitted':
      return { label: 'Submitted', color: 'text-slate-700', bg: 'bg-slate-100', border: 'border-slate-200' };
    case 'Under Review':
      return { label: 'Under Review', color: 'text-amber-800', bg: 'bg-amber-50', border: 'border-amber-200' };
    case 'Validated':
      return { label: 'Published', color: 'text-blue-800', bg: 'bg-blue-50', border: 'border-blue-200' };
    case 'University Matching':
      return { label: 'Open for Solutions', color: 'text-indigo-800', bg: 'bg-indigo-50', border: 'border-indigo-200' };
    case 'Assigned':
      return { label: 'University Assigned', color: 'text-purple-800', bg: 'bg-purple-50', border: 'border-purple-200' };
    case 'In Development':
    case 'Project Proposed':
    case 'Pilot':
      return { label: 'Solution in Progress', color: 'text-emerald-800', bg: 'bg-emerald-50', border: 'border-emerald-200' };
    case 'Implemented':
    case 'Impact Measured':
      return { label: 'Completed', color: 'text-teal-800', bg: 'bg-teal-50', border: 'border-teal-200' };
    case 'Rejected':
      return { label: 'Attempt Unsuccessful', color: 'text-rose-800', bg: 'bg-rose-50', border: 'border-rose-200' };
    default:
      return { label: status, color: 'text-slate-700', bg: 'bg-slate-100', border: 'border-slate-200' };
  }
};

// Helper for citizen trust status
export const getCitizenTrustStatus = (ch: Challenge): { label: string; color: string; bg: string } => {
  if (ch.trustStatus) {
    switch (ch.trustStatus) {
      case 'Verified':
        return { label: 'Verified', color: 'text-emerald-800', bg: 'bg-emerald-50 border-emerald-200' };
      case 'Under Review':
        return { label: 'Under Review', color: 'text-amber-800', bg: 'bg-amber-50 border-amber-200' };
      case 'Evidence Submitted':
        return { label: 'Evidence Submitted', color: 'text-blue-800', bg: 'bg-blue-50 border-blue-200' };
      default:
        return { label: 'Community Report', color: 'text-slate-700', bg: 'bg-slate-100 border-slate-200' };
    }
  }

  // Fallback calculation
  const hasEvidence = (ch.evidence || []).length > 0;
  const isVerified =
    ch.status === 'Validated' ||
    ch.status === 'University Matching' ||
    ch.status === 'Assigned' ||
    ch.status === 'In Development' ||
    ch.status === 'Pilot' ||
    ch.status === 'Implemented';

  if (isVerified) {
    return { label: 'Verified', color: 'text-emerald-800', bg: 'bg-emerald-50 border-emerald-200' };
  }
  if (ch.status === 'Under Review') {
    return { label: 'Under Review', color: 'text-amber-800', bg: 'bg-amber-50 border-amber-200' };
  }
  if (hasEvidence) {
    return { label: 'Evidence Submitted', color: 'text-blue-800', bg: 'bg-blue-50 border-blue-200' };
  }
  return { label: 'Community Report', color: 'text-slate-700', bg: 'bg-slate-100 border-slate-200' };
};

export const CitizenDashboard: React.FC = () => {
  const {
    currentUser,
    challenges,
    navigateToChallenge,
    setCurrentView,
  } = useApp();

  // Citizen's reports (all challenges or user's submitted challenges)
  const myReports = challenges;

  // 4 Simple Summary KPI Cards (Section 5)
  const stats = {
    reported: myReports.length,
    underReview: myReports.filter((c) => c.status === 'Under Review' || c.status === 'Submitted').length,
    inProgress: myReports.filter(
      (c) =>
        c.status === 'Assigned' ||
        c.status === 'In Development' ||
        c.status === 'Pilot' ||
        c.status === 'Project Proposed' ||
        c.status === 'University Matching'
    ).length,
    resolved: myReports.filter((c) => c.status === 'Implemented' || c.status === 'Impact Measured').length,
  };

  const recentReports = myReports.slice(0, 4);
  const communityDiscovery = challenges.slice(0, 3);

  return (
    <div className="space-y-8 font-sans-body">
      {/* ========================================================================= */}
      {/* 1. TOP GREETING & CTAs (MATCHING SECTION 4) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300/60">
              Community Portal
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {currentUser.district} District &bull; Verified Member
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Hello, {currentUser.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-xl">
            Help improve your community by reporting real problems.
          </p>
        </div>

        {/* Primary & Secondary CTAs */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setCurrentView('submit-challenge')}
            className="flex-1 sm:flex-initial px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-slate-950" />
            <span>+ Report a Problem</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentView('explore-challenges')}
            className="flex-1 sm:flex-initial px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm rounded-xl border border-slate-300/80 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Compass className="w-4 h-4 text-slate-600" />
            <span>Explore Challenges</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. 4 DASHBOARD SUMMARY CARDS (MATCHING SECTION 5) */}
      {/* ========================================================================= */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Overview of Your Contributions
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Problems Reported */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1 hover:border-amber-300 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-2">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-600 block">
              Problems Reported
            </span>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 block">
              {stats.reported}
            </span>
            <p className="text-[11px] text-slate-500 pt-1">
              Total challenges submitted by you
            </p>
          </div>

          {/* Card 2: Under Review */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1 hover:border-amber-300 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-2">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-600 block">
              Under Review
            </span>
            <span className="text-2xl sm:text-3xl font-black text-amber-800 block">
              {stats.underReview}
            </span>
            <p className="text-[11px] text-slate-500 pt-1">
              Currently being verified by officers
            </p>
          </div>

          {/* Card 3: In Progress */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1 hover:border-emerald-300 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-2">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-600 block">
              In Progress
            </span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-800 block">
              {stats.inProgress}
            </span>
            <p className="text-[11px] text-slate-500 pt-1">
              Active university & team solutions
            </p>
          </div>

          {/* Card 4: Resolved */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1 hover:border-teal-300 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center mb-2">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-600 block">
              Resolved
            </span>
            <span className="text-2xl sm:text-3xl font-black text-teal-800 block">
              {stats.resolved}
            </span>
            <p className="text-[11px] text-slate-500 pt-1">
              Successful public implementations
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. YOUR RECENT REPORTS (MATCHING SECTION 6) */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Your Recent Reports
            </h2>
            <p className="text-xs text-slate-500">
              Track the live progress of problems you reported in your area.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCurrentView('citizen-my-challenges')}
            className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Reports ({myReports.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {recentReports.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-slate-200/90 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 mx-auto flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">No Problems Reported Yet</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Notice an issue with drinking water, road conditions, healthcare, or electricity in your village or town? Report it to get solutions started.
            </p>
            <button
              type="button"
              onClick={() => setCurrentView('submit-challenge')}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs cursor-pointer inline-flex items-center gap-2 mt-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Your First Problem</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentReports.map((ch) => {
              const statusInfo = getCitizenStatusLabel(ch.status, ch.isReopened);
              const trustInfo = getCitizenTrustStatus(ch);
              const photoCount = (ch.evidence || []).filter((e) => e.type === 'image').length;
              const formattedDate = ch.submittedAt
                ? new Date(ch.submittedAt).toLocaleDateString([], {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                : 'Recent';

              return (
                <div
                  key={ch.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-amber-300 transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    {/* ID + Status Row */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                        {ch.id}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {/* Trust Badge */}
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${trustInfo.bg} ${trustInfo.color}`}
                        >
                          {trustInfo.label}
                        </span>
                        {/* Status Badge */}
                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${statusInfo.bg} ${statusInfo.border} ${statusInfo.color}`}
                        >
                          {statusInfo.label}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <div>
                      <h3
                        onClick={() => navigateToChallenge(ch.id)}
                        className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-amber-800 transition-colors line-clamp-2 cursor-pointer"
                      >
                        {ch.title}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-2 mt-1">
                        {ch.description}
                      </p>
                    </div>

                    {/* Location & Meta info */}
                    <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500 pt-1 border-t border-slate-100">
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-amber-600" />
                        {ch.village ? `${ch.village}, ` : ''}{ch.district} District
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        Reported: {formattedDate}
                      </span>
                      {photoCount > 0 && (
                        <span className="flex items-center gap-1 text-slate-600">
                          <Camera className="w-3.5 h-3.5 text-slate-400" />
                          {photoCount} {photoCount === 1 ? 'Photo' : 'Photos'}
                        </span>
                      )}
                    </div>

                    {/* Latest Update Note if any */}
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 flex items-start gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-800">Latest Update: </span>
                        {ch.latestUpdate || (
                          ch.assignedUniversityName
                            ? `${ch.assignedUniversityName} is developing a pilot solution for this location.`
                            : 'Submitted report is under active screening by nodal team.'
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Action Button */}
                  <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                      Category: {ch.category}
                    </span>
                    <button
                      type="button"
                      onClick={() => navigateToChallenge(ch.id)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-100 hover:bg-amber-500 hover:text-slate-950 text-slate-800 font-bold text-xs rounded-xl transition-all cursor-pointer"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 4. EXPLORE COMMUNITY CHALLENGES PREVIEW (MATCHING SECTION 25) */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-br from-amber-50/50 via-white to-amber-50/20 rounded-3xl p-6 sm:p-8 border border-amber-200/70 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-600" />
              <span>Explore Community Challenges in Jharkhand</span>
            </h2>
            <p className="text-xs text-slate-600">
              Browse issues reported across all 24 districts and follow community solutions.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCurrentView('explore-challenges')}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 shadow-2xs transition-colors self-start sm:self-auto cursor-pointer"
          >
            Browse All 24 Districts &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {communityDiscovery.map((ch) => {
            const statusInfo = getCitizenStatusLabel(ch.status, ch.isReopened);
            const trustInfo = getCitizenTrustStatus(ch);

            return (
              <div
                key={ch.id}
                className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-500">
                      {ch.id}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusInfo.bg} ${statusInfo.border} ${statusInfo.color}`}
                    >
                      {statusInfo.label}
                    </span>
                  </div>

                  <h4
                    onClick={() => navigateToChallenge(ch.id)}
                    className="text-xs font-bold text-slate-900 hover:text-amber-800 transition-colors line-clamp-2 cursor-pointer"
                  >
                    {ch.title}
                  </h4>

                  <div className="text-[11px] text-slate-500 space-y-1">
                    <div className="flex items-center gap-1 font-medium text-slate-700">
                      <MapPin className="w-3 h-3 text-amber-600" />
                      <span>{ch.district} District</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Layers className="w-3 h-3 text-slate-400" />
                      <span>{ch.category}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500">
                    {trustInfo.label}
                  </span>
                  <button
                    type="button"
                    onClick={() => navigateToChallenge(ch.id)}
                    className="text-xs font-bold text-amber-700 hover:text-amber-800 cursor-pointer"
                  >
                    View &rarr;
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
