import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { MOCK_INDUSTRY_PARTNERS } from '../../mock/data';
import { supabaseService, DbIndustryPartner } from '../../services/supabaseService';
import {
  Briefcase,
  DollarSign,
  Building2,
  CheckCircle2,
  Sparkles,
  MapPin,
  Award,
  Search,
  Database,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export const IndustryPage: React.FC = () => {
  const { switchRole, setCurrentView } = useApp();
  const [partners, setPartners] = useState<DbIndustryPartner[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [dataSource, setDataSource] = useState<'supabase' | 'fallback'>('fallback');
  const PAGE_SIZE = 12;

  const fetchPartners = async (page: number, search: string) => {
    setIsLoading(true);
    try {
      const res = await supabaseService.getIndustryPartners({
        limit: PAGE_SIZE,
        offset: (page - 1) * PAGE_SIZE,
        search: search.trim() || undefined,
      });

      if (res.data && res.data.length > 0) {
        setPartners(res.data);
        setTotalCount(res.count || 0);
        setDataSource('supabase');
      } else if (!search) {
        // Fallback to mock if empty
        setDataSource('fallback');
      } else {
        setPartners([]);
        setTotalCount(0);
      }
    } catch (e) {
      console.error('Failed to load industry partners:', e);
      setDataSource('fallback');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPartners(currentPage, searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [currentPage, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
              Corporate & Industrial Alliance
            </span>
            <span className="text-xs text-slate-400">CSR Section 135 Co-Funding</span>
            {dataSource === 'supabase' && (
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
                <Database className="w-3 h-3" /> Live Supabase Synced ({totalCount.toLocaleString()} Enterprises)
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
            Industry & CSR Partner Ecosystem
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Corporations, MSMEs, and startups registered across Jharkhand collaborating with academic cohorts on prototype fabrication and CSR co-funding.
          </p>
        </div>

        <button
          onClick={() => {
            switchRole('industry_msme');
            setCurrentView('industry-dashboard');
          }}
          className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 shrink-0"
        >
          <Briefcase className="w-4 h-4" />
          <span>Industry Partner Portal</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
        <div className="text-xs font-bold text-slate-700">
          Showing {dataSource === 'supabase' ? `${totalCount.toLocaleString()} Registered Enterprises` : 'Featured Partners'}
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search enterprise name, CIN, or sector..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Directory Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center p-12 bg-white rounded-2xl border border-slate-200">
          <RefreshCw className="w-6 h-6 animate-spin text-purple-600 mr-2" />
          <span className="text-sm font-semibold text-slate-600">Querying Supabase partners...</span>
        </div>
      ) : dataSource === 'supabase' && partners.length > 0 ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {partners.map((partner) => (
              <div
                key={partner.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 hover:border-purple-400 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 leading-snug">
                        {partner.company_name || 'Enterprise'}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 flex-wrap">
                        {partner.state && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {partner.state}
                          </span>
                        )}
                        {partner.company_class && (
                          <>
                            <span>&bull;</span>
                            <span className="font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded text-[10px]">
                              {partner.company_class}
                            </span>
                          </>
                        )}
                        {partner.company_status && (
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">
                            {partner.company_status}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {partner.industrial_classification && (
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Industrial Classification
                      </span>
                      <p className="text-xs text-slate-600 line-clamp-2">
                        {partner.industrial_classification}
                      </p>
                    </div>
                  )}

                  {partner.registered_address && (
                    <p className="text-[11px] text-slate-500 line-clamp-2">
                      <strong className="text-slate-700">Registered Address:</strong> {partner.registered_address}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-mono text-[10px]">
                    CIN: {partner.cin || 'N/A'}
                  </span>
                  {partner.authorized_capital ? (
                    <span className="font-bold text-purple-800 text-xs">
                      Cap: ₹{(Number(partner.authorized_capital) / 100000).toFixed(1)}L
                    </span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalCount > PAGE_SIZE && (
            <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 text-xs">
              <span className="text-slate-500">
                Page {currentPage} of {Math.ceil(totalCount / PAGE_SIZE)} ({totalCount.toLocaleString()} total)
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={currentPage >= Math.ceil(totalCount / PAGE_SIZE)}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Fallback Mock Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {MOCK_INDUSTRY_PARTNERS.map((partner) => (
            <div
              key={partner.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 hover:border-purple-400 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 leading-snug">{partner.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {partner.headquarters}
                      </span>
                      <span>&bull;</span>
                      <span className="font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded">
                        {partner.type}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    CSR Thematic Priorities
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {partner.focalDomains?.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded bg-purple-50 text-purple-900 text-[10px] font-medium border border-purple-200"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  Active Projects: <strong>{partner.activeProjectsCount} Pilots</strong>
                </span>
                <span className="font-black text-purple-800 text-sm">
                  ₹{((partner.totalFundingCommitted || 0) / 100000).toFixed(1)} Lakhs Grant
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
