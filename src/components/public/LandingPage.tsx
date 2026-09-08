import React from 'react';
import { useApp } from '../../context/AppContext';
import { JharkhandEmblem } from '../common/JharkhandEmblem';
import assemblyHeroImg from '../../assets/images/jharkhand_assembly_1788342750288.jpg';
import {
  Lightbulb,
  Users,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setCurrentView } = useApp();

  const handleEnterPortal = () => {
    setCurrentView('role-selection');
  };

  return (
    <div className="w-full h-screen overflow-hidden bg-slate-950 text-white font-sans-body selection:bg-amber-500 selection:text-slate-950">
      {/* ========================================================================= */}
      {/* 1. HERO SOVEREIGN BANNER (MATCHING SCREENSHOT 1 EXACTLY - FULL SCREEN EDGE TO EDGE) */}
      {/* ========================================================================= */}
      <section className="relative w-full h-screen flex flex-col justify-between overflow-hidden bg-slate-950 text-white">
        {/* Background Vidhan Sabha Image with warm sunset & dusk gradient vignette */}
        <div className="absolute inset-0 z-0">
          <img
            src={assemblyHeroImg}
            alt="Jharkhand State Legislative Assembly Vidhan Sabha"
            className="w-full h-full object-cover object-center transform scale-100"
            referrerPolicy="no-referrer"
          />
          {/* Rich cinematic warm dusk overlay & vignettes matching screenshot 1 */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/45 to-black/95 pointer-events-none"></div>
          <div className="absolute inset-0 bg-radial from-transparent via-amber-950/20 to-black/90 pointer-events-none"></div>
          <div className="absolute inset-0 bg-amber-900/15 mix-blend-color-burn pointer-events-none"></div>
        </div>

        {/* Embedded Top Navigation Bar matching Screenshot 1 */}
        <div className="relative z-20 w-full px-6 sm:px-12 lg:px-16 py-6 flex items-center justify-between border-b border-white/10 backdrop-blur-xs">
          {/* Left Brand */}
          <div
            onClick={() => setCurrentView('landing')}
            className="flex items-center gap-3.5 cursor-pointer group select-none"
          >
            <JharkhandEmblem size={48} className="ring-2 ring-amber-400/60 shadow-xl" />
            <div>
              <span className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-white group-hover:text-amber-300 transition-colors block leading-tight font-sans-body">
                JH Innovation Connect
              </span>
              <span className="text-[10px] sm:text-xs text-amber-200/80 font-medium tracking-wide">
                Govt. of Jharkhand &bull; Higher & Technical Education
              </span>
            </div>
          </div>

          {/* Right Login / Register Button */}
          <div className="flex items-center gap-4 sm:gap-8">
            <button
              type="button"
              onClick={handleEnterPortal}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-xl hover:shadow-amber-500/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center gap-1.5"
            >
              <span>Login / Register</span>
            </button>
          </div>
        </div>

        {/* Hero Center Body (Exact Copy & Centered Typography) */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 py-12 text-center flex flex-col items-center justify-center my-auto space-y-6">
          {/* Title in Classical Serif */}
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif-display font-normal tracking-tight text-white leading-tight drop-shadow-lg">
              Where Jharkhand&apos;s
            </h1>
            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif-display font-medium tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-400 drop-shadow-xl leading-tight">
              Challenges Meet Innovation
            </h2>
          </div>

          {/* Subtitle */}
          <p className="text-sm sm:text-lg md:text-xl text-slate-200 font-normal max-w-2xl mx-auto leading-relaxed drop-shadow">
            A collaborative platform for solving societal challenges through knowledge, technology and partnership.
          </p>

          {/* Primary Call to Action Button */}
          <div className="pt-3">
            <button
              type="button"
              onClick={handleEnterPortal}
              className="px-8 sm:px-10 py-3.5 sm:py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-bold text-sm sm:text-base rounded-xl shadow-2xl hover:shadow-amber-500/50 transition-all transform hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2.5 group"
            >
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              <span>Enter Portal</span>
            </button>
          </div>
        </div>

        {/* Bottom 3 Pillars & Quote Banner (Matching Screenshot 1) */}
        <div className="relative z-10 w-full bg-slate-950/85 backdrop-blur-md border-t border-white/10 px-6 sm:px-12 lg:px-16 py-6 space-y-5">
          {/* 3 Value Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-6xl mx-auto divide-y md:divide-y-0 md:divide-x divide-white/10">
            {/* Pillar 1 */}
            <div className="flex items-center gap-4 pt-3 md:pt-0 md:px-6">
              <div className="w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0 text-amber-400">
                <Lightbulb className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-serif-quote italic font-semibold text-amber-300">
                  Together We Innovate
                </h3>
                <p className="text-xs text-slate-300">Ideas for Impact</p>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="flex items-center gap-4 pt-3 md:pt-0 md:px-6">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0 text-emerald-400">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-serif-quote italic font-semibold text-amber-300">
                  Together We Transform
                </h3>
                <p className="text-xs text-slate-300">Collaboration for Change</p>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="flex items-center gap-4 pt-3 md:pt-0 md:px-6">
              <div className="w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0 text-amber-400">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-serif-quote italic font-semibold text-amber-300">
                  Together We Build a Better Jharkhand
                </h3>
                <p className="text-xs text-slate-300">Solutions for Tomorrow</p>
              </div>
            </div>
          </div>

          {/* Golden Quote with Decorative Horizontal Border Lines */}
          <div className="pt-2 flex items-center justify-center gap-4 max-w-3xl mx-auto text-center">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-amber-400/80"></div>
            <p className="text-xs sm:text-sm md:text-base font-serif-quote italic text-amber-200/90 px-3">
              &ldquo;Every challenge is an opportunity to build a better tomorrow.&rdquo;
            </p>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent via-amber-400/40 to-amber-400/80"></div>
          </div>
        </div>
      </section>

    </div>
  );
};
