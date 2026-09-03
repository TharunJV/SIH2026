import React, { useEffect, useState } from 'react';
import { checkSupabaseConnection } from '../../lib/supabase';
import { Database, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';

export const SupabaseStatusBadge: React.FC = () => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [details, setDetails] = useState<string>('Testing Supabase connection...');
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  const verifyConnection = async () => {
    setStatus('checking');
    setDetails('Pinging Supabase backend...');
    const result = await checkSupabaseConnection();
    if (result.connected) {
      setStatus('connected');
      setDetails(result.message || 'Connected to Supabase PostgreSQL & Auth');
    } else {
      setStatus('disconnected');
      setDetails(result.error || 'Disconnected from Supabase');
    }
  };

  useEffect(() => {
    verifyConnection();
  }, []);

  return (
    <div 
      className="relative inline-flex items-center"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <button
        onClick={verifyConnection}
        type="button"
        title="Supabase Database Status (Click to re-check)"
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all duration-200 border ${
          status === 'connected'
            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
            : status === 'checking'
            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
        }`}
      >
        <Database className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Supabase</span>
        {status === 'checking' && (
          <RefreshCw className="w-3 h-3 animate-spin text-amber-500" />
        )}
        {status === 'connected' && (
          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
        )}
        {status === 'disconnected' && (
          <AlertTriangle className="w-3 h-3 text-rose-500" />
        )}
      </button>

      {showTooltip && (
        <div className="absolute top-full right-0 mt-2 w-64 p-3 bg-slate-900 text-slate-100 text-xs rounded-xl shadow-xl border border-slate-700 z-50 animate-in fade-in zoom-in-95 duration-150 pointer-events-none">
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800 font-bold">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Database className="w-3.5 h-3.5" />
              Supabase Status
            </span>
            <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold ${
              status === 'connected' ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' : 'bg-rose-950 text-rose-300 border border-rose-700'
            }`}>
              {status}
            </span>
          </div>
          <p className="text-slate-300 leading-relaxed font-mono text-[11px]">
            {details}
          </p>
        </div>
      )}
    </div>
  );
};
