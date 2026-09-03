import React, { useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { JharkhandEmblem } from '../common/JharkhandEmblem';
import assemblyHeroImg from '../../assets/images/jharkhand_assembly_1788342750288.jpg';
import {
  Lightbulb,
  Users,
  TrendingUp,
  ArrowRight,
  ChevronDown,
  Sparkles,
  MapPin,
  ShieldCheck,
  GraduationCap,
  Building2,
  CheckCircle2,
  Compass,
  Layers,
  FileCheck2,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const {
    setCurrentView,
    switchRole,
    setIsDemoTourActive,
    goToDemoStep,
    challenges,
    navigateToChallenge,
    showToast,
  } = useApp();

  const detailsSectionRef = useRef<HTMLDivElement>(null);

  const handleScrollToDetails = () => {
    detailsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleEnterPortal = () => {
    setCurrentView('role-selection');
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-white font-sans-body selection:bg-amber-500 selection:text-slate-950">
      {/* ========================================================================= */}
      {/* 1. HERO SOVEREIGN BANNER (MATCHING SCREENSHOT 1 EXACTLY - FULL SCREEN EDGE TO EDGE) */}
      {/* ========================================================================= */}
      <section className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden bg-slate-950 text-white">
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

          {/* Right Links & Login / Register Button */}
          <div className="flex items-center gap-4 sm:gap-8">
            <nav className="hidden md:flex items-center gap-7 text-xs sm:text-sm font-medium text-slate-200">
              <button
                onClick={() => setCurrentView('how-it-works')}
                className="hover:text-amber-300 transition-colors cursor-pointer"
              >
                About Us
              </button>
              <button
                onClick={() => setCurrentView('how-it-works')}
                className="hover:text-amber-300 transition-colors cursor-pointer"
              >
                How It Works
              </button>
              <button
                onClick={() => setCurrentView('impact')}
                className="hover:text-amber-300 transition-colors cursor-pointer"
              >
                Impact
              </button>
              <button
                onClick={() => setCurrentView('universities')}
                className="hover:text-amber-300 transition-colors cursor-pointer"
              >
                Resources
              </button>
              <button
                onClick={() => setCurrentView('industry')}
                className="hover:text-amber-300 transition-colors cursor-pointer"
              >
                Contact
              </button>
            </nav>

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

          {/* Learn More Scroll Indicator */}
          <button
            type="button"
            onClick={handleScrollToDetails}
            className="text-xs sm:text-sm text-amber-200/90 hover:text-white font-medium flex items-center gap-1.5 pt-4 transition-colors cursor-pointer"
          >
            <span>Learn More</span>
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </button>
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

      {/* ========================================================================= */}
      {/* 2. EXPLORE MORE DETAILS SECTION (ON SCROLL) */}
      {/* ========================================================================= */}
      <div ref={detailsSectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 text-slate-900">
        {/* Ecosystem Overview Cards */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Grassroots to R&D Pipeline
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif-display font-bold text-slate-900 tracking-tight">
              One Platform &bull; Four Synergistic Stakeholders
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Every citizen challenge logged from Jharkhand&apos;s 24 districts is reviewed, matched to top HEIs, funded by CSR/Industry, and executed in field pilots.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* 1. Citizen */}
            <div
              onClick={() => {
                switchRole('citizen');
                setCurrentView('role-selection');
              }}
              className="p-6 rounded-2xl bg-amber-50/60 border border-amber-200 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer space-y-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-sm shadow-sm group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">1. Citizen & Community</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Report local water, agro, health, and civic challenges without complex jargon. Track progress from review to village testing.
              </p>
              <div className="text-[11px] font-semibold text-amber-800 flex items-center gap-1 pt-1">
                <span>Access Citizen Portal</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* 2. University */}
            <div
              onClick={() => {
                switchRole('university_admin');
                setCurrentView('role-selection');
              }}
              className="p-6 rounded-2xl bg-emerald-50/60 border border-emerald-200 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer space-y-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-sm group-hover:scale-110 transition-transform">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">2. Higher Education (HEIs)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                BIT Mesra, IIT ISM Dhanbad, and NIT Jamshedpur faculty-student cohorts research, prototype, and build scalable solutions.
              </p>
              <div className="text-[11px] font-semibold text-emerald-800 flex items-center gap-1 pt-1">
                <span>Access University Portal</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* 3. Industry */}
            <div
              onClick={() => {
                switchRole('csr_org');
                setCurrentView('role-selection');
              }}
              className="p-6 rounded-2xl bg-blue-50/60 border border-blue-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer space-y-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-sm group-hover:scale-110 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">3. Industry & CSR</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tata Steel, Coal India, and MSMEs commit CSR funding, industrial test benches, mentorship, and commercial scale-up.
              </p>
              <div className="text-[11px] font-semibold text-blue-800 flex items-center gap-1 pt-1">
                <span>Access Industry Portal</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* 4. Government */}
            <div
              onClick={() => {
                switchRole('govt_department');
                setCurrentView('role-selection');
              }}
              className="p-6 rounded-2xl bg-purple-50/60 border border-purple-200 hover:border-purple-400 hover:shadow-md transition-all cursor-pointer space-y-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white font-bold flex items-center justify-center text-sm shadow-sm group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">4. Government & PMU</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Line departments verify authenticity, fast-track municipal action or sanction state R&D grants for multi-district deployment.
              </p>
              <div className="text-[11px] font-semibold text-purple-800 flex items-center gap-1 pt-1">
                <span>Access Government Portal</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </section>

        {/* Live State Coverage Metrics */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 text-white rounded-3xl p-8 sm:p-10 border border-emerald-500/20 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <span className="text-[10px] font-bold tracking-widest uppercase text-amber-400">
                State Innovation Telemetry
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                Impact Across Jharkhand&apos;s 24 Districts
              </h3>
            </div>
            <button
              onClick={() => setCurrentView('map-view')}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
            >
              <MapPin className="w-4 h-4" />
              <span>Explore Interactive GIS Map</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700">
              <span className="text-3xl sm:text-4xl font-black text-amber-400 block">412+</span>
              <span className="text-xs text-slate-300 font-medium">Logged Grassroots Challenges</span>
            </div>
            <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700">
              <span className="text-3xl sm:text-4xl font-black text-emerald-400 block">24 / 24</span>
              <span className="text-xs text-slate-300 font-medium">Districts with Active Solutions</span>
            </div>
            <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700">
              <span className="text-3xl sm:text-4xl font-black text-indigo-400 block">38 Labs</span>
              <span className="text-xs text-slate-300 font-medium">Interdisciplinary University Teams</span>
            </div>
            <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700">
              <span className="text-3xl sm:text-4xl font-black text-teal-400 block">₹4.85 Cr</span>
              <span className="text-xs text-slate-300 font-medium">Sanctioned CSR & Innovation Grants</span>
            </div>
          </div>
        </section>

        {/* Featured Recent Challenges */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-800">
                Live Community Submissions
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                Recent Challenges Seeking Solutions
              </h3>
            </div>
            <button
              onClick={() => setCurrentView('explore-challenges')}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
            >
              <span>View All Challenges</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {challenges.slice(0, 3).map((ch) => (
              <div
                key={ch.id}
                onClick={() => navigateToChallenge(ch.id)}
                className="p-5 rounded-2xl border border-slate-200 hover:border-emerald-500 bg-slate-50/50 hover:bg-white cursor-pointer transition-all flex flex-col justify-between space-y-4 shadow-2xs group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {ch.id}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                        ch.urgency === 'Critical'
                          ? 'bg-rose-100 text-rose-800'
                          : ch.urgency === 'High'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {ch.urgency}
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug group-hover:text-emerald-800 transition-colors line-clamp-2">
                    {ch.title}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {ch.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                  <span className="flex items-center gap-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    {ch.district}
                  </span>
                  <span className="font-bold text-emerald-800">{ch.status}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick CTA banner */}
          <div className="pt-4 text-center">
            <button
              onClick={handleEnterPortal}
              className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Access Stakeholder Role Selection Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
