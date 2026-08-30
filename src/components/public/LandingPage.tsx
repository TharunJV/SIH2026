import React from 'react';
import { useApp } from '../../context/AppContext';
import { RoleCarousel } from '../common/RoleCarousel';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  GraduationCap,
  Briefcase,
  Users,
  Compass,
  CheckCircle2,
  TrendingUp,
  MapPin,
  HeartHandshake,
  Layers,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const {
    setCurrentView,
    switchRole,
    setIsAuthModalOpen,
    setIsDemoTourActive,
    goToDemoStep,
    challenges,
    navigateToChallenge,
  } = useApp();

  return (
    <div className="space-y-12 pb-8">
      {/* Sovereign Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white p-8 sm:p-14 border border-emerald-500/30 shadow-2xl">
        {/* Decorative Grid Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Government of Jharkhand &bull; Smart India Hackathon 2026</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white">
            Crowdsourcing Grassroots Challenges &bull; Solving via Universities & Industry
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-normal">
            A state-wide digital bridge connecting citizens facing water, agro, healthcare, and infrastructure obstacles with Jharkhand's premier Higher Education Institutions (BIT Mesra, IIT ISM, NIT) and CSR Industry Partners.
          </p>

          {/* Core Citizen UX Philosophy Banner */}
          <div className="p-4 bg-emerald-950/70 border border-emerald-400/30 rounded-2xl text-xs text-emerald-100 flex items-start gap-3 shadow-inner">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-300 block text-xs uppercase tracking-wide">Core Citizen Principle:</strong>
              <p className="mt-0.5 leading-relaxed text-slate-200">
                &ldquo;You do not need to know how to solve the problem or use technical terms. You just need to help us understand what is happening in your village or town.&rdquo;
              </p>
            </div>
          </div>

          {/* Hero CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setCurrentView('submit-challenge')}
              className="px-6 h-[52px] bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg hover:shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>Submit a Community Challenge</span>
            </button>

            <button
              onClick={() => {
                setIsDemoTourActive(true);
                goToDemoStep(1);
              }}
              className="px-6 h-[52px] bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-xl text-xs sm:text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-slate-950 fill-slate-950 shrink-0" />
              <span>Launch 3-Min Fast-Track Judge Tour</span>
            </button>
          </div>
        </div>

        {/* Live Counters Banner */}
        <div className="mt-10 pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10">
          <div>
            <span className="text-2xl sm:text-3xl font-black text-amber-400 block">412+</span>
            <span className="text-xs text-slate-400">Crowdsourced Challenges</span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 block">24 Districts</span>
            <span className="text-xs text-slate-400">100% Jharkhand Coverage</span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-indigo-400 block">38 HEI Labs</span>
            <span className="text-xs text-slate-400">Multidisciplinary Cohorts</span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-teal-400 block">₹4.85 Cr</span>
            <span className="text-xs text-slate-400">CSR & State R&D Grants</span>
          </div>
        </div>
      </section>

      {/* ONE CHALLENGE • CONNECTED ECOSYSTEM EXPLAINER */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-800">
            One Platform &bull; One Challenge &bull; Multiple Participants
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            How a Single Challenge Moves Through the Ecosystem
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Different stakeholders collaborate with distinct responsibilities around every verified challenge.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white font-bold flex items-center justify-center text-xs">
              1
            </div>
            <h3 className="text-xs font-bold text-slate-900">1. Citizen & Community</h3>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Submits plain-language problem report and photos. Tracks journey from review to village testing.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-600 text-white font-bold flex items-center justify-center text-xs">
              2
            </div>
            <h3 className="text-xs font-bold text-slate-900">2. State PMU & Nodal Officers</h3>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Screens credibility, tags status (🟡 Community Report &rarr; 🟢 Verified), and determines resolution path.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-700 text-white font-bold flex items-center justify-center text-xs">
              3
            </div>
            <h3 className="text-xs font-bold text-slate-900">3. Higher Education (HEIs)</h3>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              BIT Mesra, IIT ISM, and NIT faculty form student cohorts to design prototypes (TRL 1-5).
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-purple-700 text-white font-bold flex items-center justify-center text-xs">
              4
            </div>
            <h3 className="text-xs font-bold text-slate-900">4. Industry & CSR Partners</h3>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Tata Steel, CCL, and MSMEs commit CSR funding, testing facilities, and scaled deployment.
            </p>
          </div>
        </div>
      </section>

      {/* INTELLIGENT SOLUTION PATHWAYS SECTION */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl space-y-6">
        <div className="max-w-2xl space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400">
            Intelligent Triage & Routing
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Two Distinct Pathways for Every Problem
          </h2>
          <p className="text-xs text-slate-300">
            The platform distinguishes between operational maintenance and technological research challenges.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
              Path A: Public Service Action
            </span>
            <h3 className="text-sm font-bold text-white">Direct Government & Municipal Resolution</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              For operational and routine maintenance issues (e.g. damaged electric transformers, silted irrigation canals, broken handpump levers). Routed directly to District Line Departments for fast administrative action.
            </p>
            <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-700">
              <strong>Workflow:</strong> Citizen &rarr; Nodal Verification &rarr; Line Department Work Order &rarr; Resolved
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase">
              Path B: Innovation & R&D Challenge
            </span>
            <h3 className="text-sm font-bold text-white">University + Industry Co-Creation</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              For complex technological, agricultural, or environmental challenges (e.g. fluoride/arsenic groundwater filtration, lac bio-resin processing, low-cost solar cold storage). Assigned to university student-faculty lab teams with CSR funding.
            </p>
            <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-700">
              <strong>Workflow:</strong> Citizen &rarr; AI Match &rarr; HEI R&D Cohort &rarr; CSR Sponsor &rarr; Village Pilot &rarr; Scale
            </div>
          </div>
        </div>
      </section>

      {/* Role-Based Portals — Infinite Circular Carousel */}
      <section className="space-y-4 pt-4">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-800">
            Interactive Multi-Stakeholder Ecosystem
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Select your role to continue
          </h2>
          <p className="text-xs text-slate-600">
            Choose the role that best describes you
          </p>
        </div>

        <RoleCarousel />
      </section>

      {/* DISCOVERY & OUTREACH ECOSYSTEM */}
      <section className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Grassroots Discovery & Community Outreach Channels
            </h3>
            <p className="text-xs text-slate-600">
              Ensuring the platform reaches remote hamlets and non-technical citizens across Jharkhand.
            </p>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 shrink-0">
            24 Districts Integrated
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
            <strong className="text-slate-900 block">Panchayats & Mukhiyas</strong>
            <p className="text-[11px] text-slate-600">Gram Sabha problem logging and formal site endorsements.</p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
            <strong className="text-slate-900 block">Urban Local Bodies (ULBs)</strong>
            <p className="text-[11px] text-slate-600">Municipal ward sanitation, mobility, and water telemetry.</p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
            <strong className="text-slate-900 block">University Field Cells</strong>
            <p className="text-[11px] text-slate-600">Student NSS & Unnat Bharat Abhiyan village immersion surveys.</p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
            <strong className="text-slate-900 block">Panchayat QR Kiosks</strong>
            <p className="text-[11px] text-slate-600">Scan & speak voice/photo reporting at Common Service Centers.</p>
          </div>
        </div>
      </section>

      {/* Featured Community Challenges */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-800">
              Grassroots Ingestion
            </span>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
              Active Societal Challenges Seeking HEI Solutions
            </h3>
          </div>
          <button
            onClick={() => setCurrentView('explore-challenges')}
            className="px-4 py-2 border border-slate-300 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1 shrink-0"
          >
            <span>Explore All 24 Districts</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {challenges.slice(0, 3).map((ch) => (
            <div
              key={ch.id}
              onClick={() => navigateToChallenge(ch.id)}
              className="p-5 rounded-2xl border border-slate-200 hover:border-emerald-500 bg-slate-50/40 hover:bg-white cursor-pointer transition-all flex flex-col justify-between space-y-4 shadow-2xs"
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

                <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">{ch.title}</h4>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{ch.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                <span className="flex items-center gap-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-slate-600" />
                  {ch.district}
                </span>
                <span className="font-semibold text-emerald-800">{ch.status}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
