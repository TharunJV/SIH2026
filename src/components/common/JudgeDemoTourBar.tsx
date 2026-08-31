import React from 'react';
import { useApp, JUDGE_DEMO_STEPS } from '../../context/AppContext';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  HelpCircle,
  X,
  Play,
  RotateCcw,
} from 'lucide-react';

export const JudgeDemoTourBar: React.FC = () => {
  const {
    isDemoTourActive,
    setIsDemoTourActive,
    currentDemoStep,
    goToDemoStep,
    nextDemoStep,
    prevDemoStep,
    currentUser,
  } = useApp();

  if (!isDemoTourActive) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsDemoTourActive(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-full shadow-2xl hover:bg-slate-800 border border-amber-500/40 text-xs font-bold transition-all hover:scale-105"
        >
          <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span>Launch Judge 3-Min Demo Tour</span>
          <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black flex items-center justify-center">
            {currentDemoStep}
          </span>
        </button>
      </div>
    );
  }

  const activeStepObj = JUDGE_DEMO_STEPS.find((s) => s.stepNumber === currentDemoStep) || JUDGE_DEMO_STEPS[0];
  const progressPercent = Math.round((currentDemoStep / JUDGE_DEMO_STEPS.length) * 100);

  return (
    <div className="bg-[#2c2b29] text-[#e6e2d8] border-b border-[#d89753]/30 shadow-sm relative z-0 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        {/* Step Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          {/* Left badge & title */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[11px] font-bold shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Judge Tour &bull; Step {currentDemoStep} of {JUDGE_DEMO_STEPS.length}</span>
            </span>
            <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-white tracking-tight">
              <span>{activeStepObj.title}</span>
            </div>
            <span className="hidden md:inline-flex px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
              Role: {currentUser.role.replace('_', ' ').toUpperCase()}
            </span>
          </div>

          {/* Quick step Jump Buttons & Next/Prev Controls */}
          <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center gap-1">
              {JUDGE_DEMO_STEPS.map((s) => {
                const isCurrent = s.stepNumber === currentDemoStep;
                const isPassed = s.stepNumber < currentDemoStep;
                return (
                  <button
                    key={s.stepNumber}
                    onClick={() => goToDemoStep(s.stepNumber)}
                    className={`w-6 h-6 rounded-full text-[11px] font-black transition-all flex items-center justify-center ${
                      isCurrent
                        ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300 shadow-sm scale-110'
                        : isPassed
                        ? 'bg-emerald-700/60 text-emerald-200 hover:bg-emerald-600'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                    title={`Step ${s.stepNumber}: ${s.title}`}
                  >
                    {isPassed ? '✓' : s.stepNumber}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-1.5 ml-1">
              <button
                onClick={prevDemoStep}
                disabled={currentDemoStep === 1}
                className="px-2 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-0.5"
                title="Previous step"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Prev</span>
              </button>

              <button
                onClick={nextDemoStep}
                className="px-3 h-8 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold flex items-center justify-center gap-1 shadow-sm transition-all"
              >
                <span>{currentDemoStep === JUDGE_DEMO_STEPS.length ? 'Restart Tour' : 'Next Step'}</span>
                <ChevronRight className="w-4 h-4 text-slate-950 font-black" />
              </button>

              <button
                onClick={() => setIsDemoTourActive(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80"
                title="Minimize Tour Bar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Highlight Tip Banner */}
        <div className="mt-1.5 pt-1.5 border-t border-slate-800/80 flex items-start justify-between text-xs text-slate-300 gap-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <span className="text-amber-400 font-bold shrink-0 text-[11px] flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" /> What to evaluate here:
            </span>
            <span className="text-slate-200 text-[11px] sm:text-xs leading-snug">
              {activeStepObj.description} &mdash; <strong className="text-amber-300 font-semibold">{activeStepObj.highlightAction}</strong>
            </span>
          </div>
          <span className="hidden sm:block text-[10px] text-slate-400 shrink-0 mt-0.5">
            {progressPercent}% Journey Complete
          </span>
        </div>
      </div>
    </div>
  );
};
