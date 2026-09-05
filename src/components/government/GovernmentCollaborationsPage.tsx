import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { IndustryCollaboration } from '../../types/industry';
import {
  Handshake,
  Search,
  Building2,
  DollarSign,
  Briefcase,
  FileCheck,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Award,
} from 'lucide-react';

export const GovernmentCollaborationsPage: React.FC = () => {
  const { collaborations, projects, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  const filteredCollaborations = collaborations.filter((c) => {
    if (typeFilter !== 'All' && !c.collaboration_types.some((t) => t.includes(typeFilter))) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.industry_name.toLowerCase().includes(q) ||
        c.project_id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalCSRCommitted = collaborations.reduce((acc, c) => {
    return acc + (c.collaboration_types.some((t) => t.toLowerCase().includes('funding')) ? 750000 : 350000);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 uppercase tracking-wider">
            <Handshake className="w-4 h-4" />
            <span>Public-Private & Industry Partnerships</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Industry & MSME Collaboration Management
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor industrial co-development, CSR grant allocations, testing facilities, and commercialization support across university capstones.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs text-xs">
            <span className="text-slate-500">Total CSR Committed:</span>{' '}
            <strong className="text-teal-800 font-bold">
              ₹{(totalCSRCommitted / 100000).toFixed(2)} Lakhs
            </strong>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search company name or project ID..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="w-full sm:w-60">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium"
          >
            <option value="All">All Partnership Types</option>
            <option value="Funding / CSR Support">Funding / CSR Support</option>
            <option value="Manufacturing & Prototyping">Manufacturing & Prototyping</option>
            <option value="Testing & Validation Lab">Testing & Validation Lab</option>
            <option value="Technical Mentorship">Technical Mentorship</option>
            <option value="Pilot Deployment Site">Pilot Deployment Site</option>
          </select>
        </div>
      </div>

      {/* Collaborations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCollaborations.map((collab) => {
          const associatedProject = projects.find((p) => p.id === collab.project_id);

          return (
            <div
              key={collab.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-700">
                      {collab.industry_id}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                      {collab.status}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-1">
                    {collab.industry_name}
                  </h3>
                  <div className="text-xs text-indigo-700 font-medium mt-0.5">
                    Co-developing Project: {collab.project_id}
                    {associatedProject && ` (${associatedProject.title})`}
                  </div>
                </div>

                <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
              </div>

              {/* Supported types */}
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Active Contributions
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {collab.collaboration_types.map((type) => (
                    <span
                      key={type}
                      className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[10px] font-semibold"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contribution details */}
              {collab.contributions && collab.contributions.length > 0 && (
                <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-100 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-teal-900">
                      Documented Deliverables ({collab.contributions.length})
                    </span>
                    <strong className="text-teal-800 text-xs">
                      {collab.contributions[0].contribution_type}
                    </strong>
                  </div>
                  <div className="text-[11px] text-teal-700 mt-1 line-clamp-2">
                    {collab.contributions[0].description}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                <span>Started {collab.started_at ? new Date(collab.started_at).toLocaleDateString() : 'Active'}</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified Entity</span>
                </span>
              </div>
            </div>
          );
        })}

        {filteredCollaborations.length === 0 && (
          <div className="col-span-2 text-center py-12 bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
            No industry partnerships match the selected filter.
          </div>
        )}
      </div>
    </div>
  );
};
