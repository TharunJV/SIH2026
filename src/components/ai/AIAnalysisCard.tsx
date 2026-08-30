import React from 'react';
import { AIAnalysis } from '../../types';
import {
  Sparkles,
  AlertTriangle,
  Layers,
  GraduationCap,
  CopyCheck,
  CheckCircle2,
  Info,
  Building2,
  TrendingUp,
  Cpu,
  Brain,
} from 'lucide-react';

interface AIAnalysisCardProps {
  analysis: AIAnalysis;
  compact?: boolean;
}

export const AIAnalysisCard: React.FC<AIAnalysisCardProps> = ({ analysis, compact = false }) => {
  const getPriorityBadge = (score: number, urgency: string) => {
    if (score >= 90 || urgency === 'Critical') {
      return {
        bg: 'bg-rose-50 border-rose-200 text-rose-800',
        bar: 'bg-rose-500',
        label: 'Critical Priority',
      };
    }
    if (score >= 80 || urgency === 'High') {
      return {
        bg: 'bg-amber-50 border-amber-200 text-amber-800',
        bar: 'bg-amber-500',
        label: 'High Priority',
      };
    }
    return {
      bg: 'bg-blue-50 border-blue-200 text-blue-800',
      bar: 'bg-blue-500',
      label: 'Medium Priority',
    };
  };

  const priorityMeta = getPriorityBadge(analysis.priorityScore, analysis.priority);

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 text-white rounded-2xl p-5 border border-emerald-500/30 shadow-xl relative overflow-hidden">
      {/* Subtle background circuit watermark */}
      <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none">
        <Cpu className="w-64 h-64 text-emerald-400" />
      </div>

      {/* Header with Prototype Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3.5 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-amber-300">
            <Brain className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm text-white tracking-tight">
                AI Problem Triage & University Recommendation
              </h4>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40 uppercase tracking-wider">
                AI-generated analysis (prototype)
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Confidence Score: {(analysis.confidenceScore * 100).toFixed(0)}% &bull; NLP Semantic Triage Pipeline
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Priority Score</span>
            <span className="text-base font-black text-amber-400 leading-none">
              {analysis.priorityScore}<span className="text-xs text-slate-400 font-normal">/100</span>
            </span>
          </div>
        </div>
      </div>

      {/* Grid: 4 Core AI Outputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* 1. Categorization & Reasoning */}
        <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/70 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-200 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              1. Automated Categorization
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
              {analysis.category}
            </span>
          </div>
          <div>
            <div className="text-[11px] text-slate-300 font-medium">{analysis.subCategory}</div>
            <p className="text-slate-400 text-[11px] mt-1 leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 italic">
              &ldquo;{analysis.reasoning}&rdquo;
            </p>
          </div>
        </div>

        {/* 2. Priority Scoring & Duplicate Detection */}
        <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/70 space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-slate-200 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                2. Societal Impact Priority Index
              </span>
              <span className="font-bold text-amber-300 text-xs">{analysis.priority} Urgency</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-700 overflow-hidden">
              <div
                className={`h-full ${priorityMeta.bar} transition-all duration-700`}
                style={{ width: `${analysis.priorityScore}%` }}
              ></div>
            </div>
          </div>

          {/* Duplicate Detection */}
          <div className="pt-2 border-t border-slate-700/60">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                <CopyCheck className="w-3.5 h-3.5 text-sky-400" />
                3. Semantic Duplicate Detection
              </span>
              <span className="px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800 text-[10px] font-bold">
                {analysis.similarChallengesCount} Similar Problems Detected
              </span>
            </div>
            <p className="text-slate-400 text-[11px] mt-1">
              Cross-referenced with Palamu & Latehar blocks. Recommends clustering research resources to maximize field impact.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Recommended Disciplines & University Matching */}
      <div className="mt-4 pt-3.5 border-t border-slate-800/80 space-y-3">
        <div>
          <span className="font-bold text-slate-300 uppercase tracking-wider text-[10px] flex items-center gap-1.5 mb-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
            Recommended Academic Disciplines
          </span>
          <div className="flex flex-wrap gap-1.5">
            {analysis.recommendedDisciplines.map((disc) => (
              <span
                key={disc}
                className="px-2.5 py-1 rounded-md bg-indigo-950/70 text-indigo-200 border border-indigo-800/60 text-[11px] font-medium"
              >
                {disc}
              </span>
            ))}
          </div>
        </div>

        {/* Ranked Recommended Universities */}
        <div>
          <span className="font-bold text-slate-300 uppercase tracking-wider text-[10px] flex items-center gap-1.5 mb-2">
            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
            4. Recommended Higher Education Institutions (Ranked by Domain Match)
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {analysis.recommendedUniversities.map((univ, index) => (
              <div
                key={univ.universityId}
                className="p-3 rounded-xl bg-slate-800/90 border border-slate-700 flex flex-col justify-between hover:border-emerald-500/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-1">
                  <span className="text-xs font-bold text-white line-clamp-1">
                    {index + 1}. {univ.universityName}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold text-[11px] shrink-0 border border-emerald-800">
                    {univ.matchScore}% match
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{univ.domainExcellence}</p>
                <div className="mt-2 text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{univ.matchingFacultyCount} Matching Faculty Labs</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
