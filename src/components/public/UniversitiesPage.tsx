import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { MOCK_UNIVERSITIES } from '../../mock/data';
import { supabaseService, DbUniversity, DbCollege } from '../../services/supabaseService';
import {
  GraduationCap,
  Building2,
  CheckCircle2,
  Award,
  Layers,
  Sparkles,
  MapPin,
  Users,
  Search,
  Database,
  RefreshCw,
} from 'lucide-react';

export const UniversitiesPage: React.FC = () => {
  const { switchRole, setCurrentView } = useApp();
  const [dbUniversities, setDbUniversities] = useState<DbUniversity[]>([]);
  const [dbColleges, setDbColleges] = useState<DbCollege[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'universities' | 'colleges'>('universities');
  const [searchTerm, setSearchTerm] = useState('');
  const [dataSource, setDataSource] = useState<'supabase' | 'fallback'>('fallback');

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [univRes, collegeRes] = await Promise.all([
        supabaseService.getUniversities(),
        supabaseService.getColleges(),
      ]);

      if (univRes.data && univRes.data.length > 0) {
        setDbUniversities(univRes.data);
        setDataSource('supabase');
      }

      if (collegeRes.data && collegeRes.data.length > 0) {
        setDbColleges(collegeRes.data);
        setDataSource('supabase');
      }
    } catch (e) {
      console.error('Failed to load from Supabase:', e);
      setDataSource('fallback');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredUniversities = (
    dbUniversities.length > 0 ? dbUniversities : MOCK_UNIVERSITIES
  ).filter((u: any) =>
    (u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.district?.name || u.district || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredColleges = dbColleges.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.city || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.university?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
              Higher Education Network
            </span>
            <span className="text-xs text-slate-400">Jharkhand State Higher Education Council</span>
            {dataSource === 'supabase' && (
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
                <Database className="w-3 h-3" /> Live Supabase Synced
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
            Participating Universities, Colleges & HEIs
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Premier academic institutes leading multidisciplinary research cohorts, student incubation, and grassroots field deployments across Jharkhand.
          </p>
        </div>

        <button
          onClick={() => {
            switchRole('university_admin');
            setCurrentView('university-dashboard');
          }}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 shrink-0"
        >
          <GraduationCap className="w-4 h-4" />
          <span>University Portal Login</span>
        </button>
      </div>

      {/* Filter and Tab Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('universities')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'universities'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Universities ({dbUniversities.length || MOCK_UNIVERSITIES.length})
          </button>
          <button
            onClick={() => setActiveTab('colleges')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'colleges'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Colleges & Institutes ({dbColleges.length})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Directory Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center p-12 bg-white rounded-2xl border border-slate-200">
          <RefreshCw className="w-6 h-6 animate-spin text-indigo-600 mr-2" />
          <span className="text-sm font-semibold text-slate-600">Loading database records from Supabase...</span>
        </div>
      ) : activeTab === 'universities' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredUniversities.map((univ: any) => (
            <div
              key={univ.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 hover:border-indigo-400 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 leading-snug">{univ.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {univ.district?.name || univ.district || 'Jharkhand'}
                      </span>
                      {univ.aishe_code && (
                        <>
                          <span>&bull;</span>
                          <span className="font-mono text-[10px] text-slate-500">AISHE: {univ.aishe_code}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {univ.domainStrengths && (
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Key Research Domains
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {univ.domainStrengths.map((d: string) => (
                        <span
                          key={d}
                          className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium border border-slate-200"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-center text-xs">
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-black text-slate-900 block">{univ.activeProjects || 8}</span>
                  <span className="text-[10px] text-slate-500">Active R&D Projects</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-black text-emerald-800 block">{univ.resolvedChallenges || 5}</span>
                  <span className="text-[10px] text-slate-500">Implemented Solutions</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredColleges.map((college) => (
            <div
              key={college.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 hover:border-indigo-400 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 leading-snug">{college.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 flex-wrap">
                      <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-semibold">
                        {college.college_type}
                      </span>
                      {college.city && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {college.city}
                        </span>
                      )}
                      {college.aishe_code && (
                        <span className="font-mono text-[10px] text-slate-500">
                          AISHE: {college.aishe_code}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {college.university && (
                  <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Affiliated University:</span>
                    <span className="font-medium">{college.university.name}</span>
                  </div>
                )}

                {(college.phone || college.email || college.website) && (
                  <div className="text-[11px] text-slate-500 space-y-0.5 pt-1">
                    {college.email && <div>Email: {college.email}</div>}
                    {college.phone && <div>Phone: {college.phone}</div>}
                    {college.website && (
                      <div>
                        Website:{' '}
                        <a
                          href={college.website.startsWith('http') ? college.website : `https://${college.website}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-indigo-600 underline"
                        >
                          {college.website}
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
