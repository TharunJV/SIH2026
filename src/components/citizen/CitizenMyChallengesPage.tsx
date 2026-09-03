import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { JHARKHAND_DISTRICTS } from '../../mock/data';
import { getCitizenStatusLabel, getCitizenTrustStatus } from './CitizenDashboard';
import {
  FileText,
  Search,
  Filter,
  PlusCircle,
  MapPin,
  Calendar,
  Clock,
  ArrowRight,
  Eye,
  Camera,
  Layers,
  ChevronRight,
  Sparkles,
  RotateCcw,
} from 'lucide-react';

export const CitizenMyChallengesPage: React.FC = () => {
  const { challenges, navigateToChallenge, setCurrentView } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');

  // Filter list
  const filteredChallenges = challenges.filter((ch) => {
    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        ch.title.toLowerCase().includes(q) ||
        ch.description.toLowerCase().includes(q) ||
        ch.id.toLowerCase().includes(q) ||
        ch.district.toLowerCase().includes(q) ||
        (ch.village && ch.village.toLowerCase().includes(q));
      if (!match) return false;
    }

    // District filter
    if (selectedDistrict !== 'All' && ch.district !== selectedDistrict) {
      return false;
    }

    // Status filter
    if (selectedStatus !== 'All') {
      if (selectedStatus === 'Submitted' && ch.status !== 'Submitted') return false;
      if (selectedStatus === 'Under Review' && ch.status !== 'Under Review') return false;
      if (selectedStatus === 'Published' && ch.status !== 'Validated') return false;
      if (selectedStatus === 'Open for Solutions' && ch.status !== 'University Matching') return false;
      if (
        selectedStatus === 'Solution in Progress' &&
        ch.status !== 'Assigned' &&
        ch.status !== 'In Development' &&
        ch.status !== 'Pilot' &&
        ch.status !== 'Project Proposed'
      )
        return false;
      if (
        selectedStatus === 'Completed' &&
        ch.status !== 'Implemented' &&
        ch.status !== 'Impact Measured'
      )
        return false;
      if (selectedStatus === 'Open for Another Attempt' && !ch.isReopened) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6 font-sans-body">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <button
              onClick={() => setCurrentView('citizen-dashboard')}
              className="hover:text-amber-700 cursor-pointer"
            >
              Dashboard
            </button>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-900 font-medium">My Challenges</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            My Reported Challenges
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Follow the full progress, university solutions, and public outcomes for all your reports.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCurrentView('submit-challenge')}
          className="px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 text-slate-950" />
          <span>+ Report a Problem</span>
        </button>
      </div>

      {/* Filters (Section 18) */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search Box */}
          <div className="relative sm:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, keyword, or village..."
              className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
            >
              <option value="All">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="Published">Published</option>
              <option value="Open for Solutions">Open for Solutions</option>
              <option value="Solution in Progress">Solution in Progress</option>
              <option value="Completed">Completed</option>
              <option value="Open for Another Attempt">Open for Another Attempt</option>
            </select>
          </div>

          {/* District Filter */}
          <div>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
            >
              <option value="All">All 24 Districts</option>
              {JHARKHAND_DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d} District
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Count & Reset */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>
            Showing <strong>{filteredChallenges.length}</strong> of {challenges.length} reports
          </span>
          {(searchQuery || selectedStatus !== 'All' || selectedDistrict !== 'All') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedStatus('All');
                setSelectedDistrict('All');
              }}
              className="text-amber-700 hover:text-amber-800 font-bold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Challenges List (Cards format) */}
      {filteredChallenges.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-2xs space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 mx-auto flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">No Challenges Match Your Filter</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query or selecting a different status filter.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredChallenges.map((ch) => {
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
                className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-amber-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-5 group"
              >
                {/* Left Info */}
                <div className="space-y-2 flex-1">
                  {/* Top Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
                      {ch.id}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${trustInfo.bg} ${trustInfo.color}`}
                    >
                      {trustInfo.label}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${statusInfo.bg} ${statusInfo.border} ${statusInfo.color}`}
                    >
                      {statusInfo.label}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      Category: <strong>{ch.category}</strong>
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h2
                      onClick={() => navigateToChallenge(ch.id)}
                      className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-amber-800 transition-colors cursor-pointer"
                    >
                      {ch.title}
                    </h2>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-1">
                      {ch.description}
                    </p>
                  </div>

                  {/* Meta Details Row */}
                  <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1 font-medium text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-amber-600" />
                      {ch.village ? `${ch.village}, ` : ''}{ch.block ? `${ch.block}, ` : ''}{ch.district} District
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Reported: {formattedDate}
                    </span>
                    {photoCount > 0 && (
                      <span className="flex items-center gap-1 text-slate-600">
                        <Camera className="w-3.5 h-3.5 text-slate-400" />
                        {photoCount} {photoCount === 1 ? 'Photo Attached' : 'Photos Attached'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Action Button */}
                <div className="shrink-0 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => navigateToChallenge(ch.id)}
                    className="w-full md:w-auto px-5 py-2.5 bg-slate-100 hover:bg-amber-500 hover:text-slate-950 text-slate-800 font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
