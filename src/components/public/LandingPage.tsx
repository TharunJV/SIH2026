import React from 'react';
import JharkhandHeroMap from './JharkhandHeroMap';
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
  Award,
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
      {/* Premium Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#fef8f3] via-[#fdf5eb] to-[#f4f2f7] text-slate-800 p-8 sm:p-14 border border-[#eee9e0] shadow-sm">
        {/* Soft Lavender / Peach Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#eadeeb]/30 rounded-full blur-3xl pointer-events-none -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#fcece3]/50 rounded-full blur-3xl pointer-events-none translate-y-32 -translate-x-32"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10">
          <div className="w-full lg:w-[55%] space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 text-[#605a68] text-xs font-bold border border-[#e6e2d8] shadow-xs backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-[#8c78a0]"></span>
              <span>Government of Jharkhand &bull; Smart India Hackathon 2026</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-800 leading-[1.15]">
              Crowdsourcing Grassroots Challenges <br className="hidden sm:block" />
              <span className="block mt-2 font-semibold text-slate-700 text-3xl sm:text-4xl lg:text-5xl">
                Solving via <span className="text-[#6c8570]">Universities</span> <span className="text-[#8c78a0]">& Industry</span>
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl font-medium">
              A state-wide digital bridge connecting citizens facing water, agro, healthcare, and infrastructure obstacles with Jharkhand's premier Higher Education Institutions (BIT Mesra, IIT ISM, NIT) and CSR Industry Partners.
            </p>

            {/* Core Citizen UX Philosophy Banner */}
            <div className="p-4 bg-white/60 border border-[#e6e2d8] rounded-2xl text-xs text-slate-700 flex items-start gap-3 shadow-sm backdrop-blur-sm max-w-2xl">
              <Sparkles className="w-5 h-5 text-[#d89753] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#72614b] block text-xs uppercase tracking-wide">Core Citizen Principle:</strong>
                <p className="mt-0.5 leading-relaxed text-slate-600 font-medium">
                  &ldquo;You do not need to know how to solve the problem or use technical terms. You just need to help us understand what is happening in your village or town.&rdquo;
                </p>
              </div>
            </div>

            {/* Hero CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <button
                onClick={() => setCurrentView('submit-challenge')}
                className="px-6 h-[52px] bg-[#3a5a40] hover:bg-[#2c4431] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Users className="w-4 h-4 shrink-0" />
                <span>Submit a Community Challenge</span>
              </button>

              <button
                onClick={() => {
                  setIsDemoTourActive(true);
                  goToDemoStep(1);
                }}
                className="px-6 h-[52px] bg-white border border-[#e6e2d8] hover:bg-[#fbf9f6] text-slate-800 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#d89753] shrink-0" />
                <span>Launch 3-Min Fast-Track Judge Tour</span>
              </button>
            </div>
          </div>

          {/* Right Column: Jharkhand Map Visual */}
          <div className="w-full lg:w-[45%] relative flex flex-col items-center justify-center py-4">

            {/* Soft background glow */}
            <div className="absolute inset-0 bg-[#eadeeb]/20 rounded-3xl blur-3xl pointer-events-none"></div>

            {/* ── Stakeholder grid centred on the map ── */}
            <div className="relative w-full flex flex-col items-center gap-2 z-10">

              {/* Top row: Industry Partners */}
              <div className="flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <div className="w-11 h-11 bg-[#fdf5eb] rounded-full shadow-md flex items-center justify-center border border-[#f5e3d0]">
                    <HeartHandshake className="w-5 h-5 text-[#c9833b]" />
                  </div>
                  <div className="text-center mt-1 bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded shadow-sm border border-[#eee9e0]">
                    <div className="text-[10px] font-bold text-slate-800">Industry Partners</div>
                    <div className="text-[8px] text-slate-500">Mentor · Fund · Co-develop</div>
                  </div>
                  {/* Dotted line down to map */}
                  <svg width="2" height="18" className="mt-1"><line x1="1" y1="0" x2="1" y2="18" stroke="#d89753" strokeWidth="1.5" strokeDasharray="3 3"/></svg>
                </div>
              </div>

              {/* Middle row: Universities | MAP | Government */}
              <div className="flex items-center justify-center gap-3 w-full">
                {/* Universities */}
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-11 h-11 bg-white rounded-full shadow-md flex items-center justify-center border border-[#eadeeb]">
                    <GraduationCap className="w-5 h-5 text-[#8c78a0]" />
                  </div>
                  <div className="text-center mt-1 bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded shadow-sm border border-[#eee9e0]">
                    <div className="text-[10px] font-bold text-slate-800">Universities</div>
                    <div className="text-[8px] text-slate-500">Research · Innovate</div>
                  </div>
                </div>

                {/* Dotted line left → map */}
                <svg width="18" height="2" className="shrink-0"><line x1="0" y1="1" x2="18" y2="1" stroke="#8c78a0" strokeWidth="1.5" strokeDasharray="3 3"/></svg>

                {/* The Real Jharkhand Map */}
                <div className="flex-1 min-w-0" style={{ maxWidth: '420px' }}>
                  <JharkhandHeroMap />
                </div>

                {/* Dotted line map → right */}
                <svg width="18" height="2" className="shrink-0"><line x1="0" y1="1" x2="18" y2="1" stroke="#6c8570" strokeWidth="1.5" strokeDasharray="3 3"/></svg>

                {/* Government */}
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-11 h-11 bg-white rounded-full shadow-md flex items-center justify-center border border-[#eee9e0]">
                    <Building2 className="w-5 h-5 text-[#6c8570]" />
                  </div>
                  <div className="text-center mt-1 bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded shadow-sm border border-[#eee9e0]">
                    <div className="text-[10px] font-bold text-slate-800">Government</div>
                    <div className="text-[8px] text-slate-500">Enable · Monitor</div>
                  </div>
                </div>
              </div>

              {/* Bottom row: Citizens */}
              <div className="flex items-center justify-center">
                <div className="flex flex-col items-center">
                  {/* Dotted line up from map */}
                  <svg width="2" height="18" className="mb-1"><line x1="1" y1="0" x2="1" y2="18" stroke="#6c8570" strokeWidth="1.5" strokeDasharray="3 3"/></svg>
                  <div className="w-11 h-11 bg-[#f4f2f7] rounded-full shadow-md flex items-center justify-center border border-[#eadeeb]">
                    <Users className="w-5 h-5 text-[#8c78a0]" />
                  </div>
                  <div className="text-center mt-1 bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded shadow-sm border border-[#eee9e0]">
                    <div className="text-[10px] font-bold text-slate-800">Citizens &amp; Communities</div>
                    <div className="text-[8px] text-slate-500">Identify · Submit · Collaborate</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Statistics Banner */}
        <div className="mt-10 pt-8 border-t border-[#e6e2d8]/60 relative z-10">
          <div className="bg-[#fffdfa] rounded-2xl border border-[#eee9e0] shadow-sm p-4 sm:p-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 divide-x divide-[#eee9e0]/60">
            {/* Stat 1 */}
            <div className="flex items-center gap-3 px-2">
              <div className="w-10 h-10 rounded-full bg-[#f5f2f7] flex items-center justify-center shrink-0 border border-[#eadeeb]">
                <Layers className="w-5 h-5 text-[#8c78a0]" />
              </div>
              <div>
                <span className="text-xl font-black text-slate-800 block leading-none">2,540</span>
                <span className="text-[10px] sm:text-xs text-slate-500 font-medium leading-tight">Challenges<br/>Submitted</span>
              </div>
            </div>
            
            {/* Stat 2 */}
            <div className="flex items-center gap-3 px-2">
              <div className="w-10 h-10 rounded-full bg-[#f0f4f1] flex items-center justify-center shrink-0 border border-[#dce5de]">
                <ShieldCheck className="w-5 h-5 text-[#6c8570]" />
              </div>
              <div>
                <span className="text-xl font-black text-slate-800 block leading-none">1,842</span>
                <span className="text-[10px] sm:text-xs text-slate-500 font-medium leading-tight">Challenges<br/>Validated</span>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="flex items-center gap-3 px-2">
              <div className="w-10 h-10 rounded-full bg-[#fdf5eb] flex items-center justify-center shrink-0 border border-[#f5e3d0]">
                <Building2 className="w-5 h-5 text-[#c9833b]" />
              </div>
              <div>
                <span className="text-xl font-black text-slate-800 block leading-none">47</span>
                <span className="text-[10px] sm:text-xs text-slate-500 font-medium leading-tight">Universities<br/>Onboarded</span>
              </div>
            </div>

            {/* Stat 4 */}
            <div className="flex items-center gap-3 px-2">
              <div className="w-10 h-10 rounded-full bg-[#f5f2f7] flex items-center justify-center shrink-0 border border-[#eadeeb]">
                <Users className="w-5 h-5 text-[#8c78a0]" />
              </div>
              <div>
                <span className="text-xl font-black text-slate-800 block leading-none">136</span>
                <span className="text-[10px] sm:text-xs text-slate-500 font-medium leading-tight">Industry<br/>Partners</span>
              </div>
            </div>

            {/* Stat 5 */}
            <div className="flex items-center gap-3 px-2">
              <div className="w-10 h-10 rounded-full bg-[#fdf5eb] flex items-center justify-center shrink-0 border border-[#f5e3d0]">
                <TrendingUp className="w-5 h-5 text-[#c9833b]" />
              </div>
              <div>
                <span className="text-xl font-black text-slate-800 block leading-none">620</span>
                <span className="text-[10px] sm:text-xs text-slate-500 font-medium leading-tight">Solutions<br/>In Progress</span>
              </div>
            </div>

            {/* Stat 6 */}
            <div className="flex items-center gap-3 px-2">
              <div className="w-10 h-10 rounded-full bg-[#f0eae1] flex items-center justify-center shrink-0 border border-[#d8c8b4]">
                <Award className="w-5 h-5 text-[#d89753]" />
              </div>
              <div>
                <span className="text-xl font-black text-slate-800 block leading-none">178</span>
                <span className="text-[10px] sm:text-xs text-slate-500 font-medium leading-tight">Solutions<br/>Deployed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ONE CHALLENGE • CONNECTED ECOSYSTEM EXPLAINER */}
      <section className="bg-[#fffdfa] rounded-3xl p-6 sm:p-10 border border-[#eee9e0] shadow-sm space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#6c8570]">
            One Platform &bull; One Challenge &bull; Multiple Participants
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
            How a Single Challenge Moves Through the Ecosystem
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            Different stakeholders collaborate with distinct responsibilities around every verified challenge.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-[#eee9e0] shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#f0eae1] text-[#8c78a0] font-bold flex items-center justify-center text-xs">
              1
            </div>
            <h3 className="text-xs font-bold text-slate-800">1. Citizen & Community</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
              Submits plain-language problem report and photos. Tracks journey from review to village testing.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#eee9e0] shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#f0eae1] text-[#6c8570] font-bold flex items-center justify-center text-xs">
              2
            </div>
            <h3 className="text-xs font-bold text-slate-800">2. State PMU & Nodal Officers</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
              Screens credibility, tags status (🟡 Community Report &rarr; 🟢 Verified), and determines resolution path.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#eee9e0] shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#f0eae1] text-[#d89753] font-bold flex items-center justify-center text-xs">
              3
            </div>
            <h3 className="text-xs font-bold text-slate-800">3. Higher Education (HEIs)</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
              BIT Mesra, IIT ISM, and NIT faculty form student cohorts to design prototypes (TRL 1-5).
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#eee9e0] shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#f0eae1] text-[#72614b] font-bold flex items-center justify-center text-xs">
              4
            </div>
            <h3 className="text-xs font-bold text-slate-800">4. Industry & CSR Partners</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
              Tata Steel, CCL, and MSMEs commit CSR funding, testing facilities, and scaled deployment.
            </p>
          </div>
        </div>
      </section>

      {/* INTELLIGENT SOLUTION PATHWAYS SECTION */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-[#eee9e0] shadow-sm space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#fcece3]/40 rounded-full blur-3xl pointer-events-none -translate-y-20 translate-x-10"></div>
        <div className="relative z-10 max-w-2xl space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#d89753]">
            Intelligent Triage & Routing
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
            Two Distinct Pathways for Every Problem
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            The platform distinguishes between operational maintenance and technological research challenges.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          <div className="p-6 rounded-2xl bg-[#fffdfa] border border-[#eee9e0] shadow-xs space-y-3 transition-colors hover:border-[#d89753]/40">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#fdf5eb] text-[#c9833b] border border-[#f5e3d0] uppercase">
              Path A: Public Service Action
            </span>
            <h3 className="text-sm font-bold text-slate-800">Direct Government & Municipal Resolution</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              For operational and routine maintenance issues (e.g. damaged electric transformers, silted irrigation canals, broken handpump levers). Routed directly to District Line Departments for fast administrative action.
            </p>
            <div className="text-[11px] text-slate-500 pt-2 border-t border-[#eee9e0]">
              <strong className="text-slate-700">Workflow:</strong> Citizen &rarr; Nodal Verification &rarr; Line Department Work Order &rarr; Resolved
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#fffdfa] border border-[#eee9e0] shadow-xs space-y-3 transition-colors hover:border-[#8c78a0]/40">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#f5f2f7] text-[#8c78a0] border border-[#eadeeb] uppercase">
              Path B: Innovation & R&D Challenge
            </span>
            <h3 className="text-sm font-bold text-slate-800">University + Industry Co-Creation</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              For complex technological, agricultural, or environmental challenges (e.g. fluoride/arsenic groundwater filtration, lac bio-resin processing, low-cost solar cold storage). Assigned to university student-faculty lab teams with CSR funding.
            </p>
            <div className="text-[11px] text-slate-500 pt-2 border-t border-[#eee9e0]">
              <strong className="text-slate-700">Workflow:</strong> Citizen &rarr; AI Match &rarr; HEI R&D Cohort &rarr; CSR Sponsor &rarr; Village Pilot &rarr; Scale
            </div>
          </div>
        </div>
      </section>

      {/* Role-Based Portals — Infinite Circular Carousel */}
      <section className="space-y-4 pt-4">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#6c8570]">
            Interactive Multi-Stakeholder Ecosystem
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
            Select your role to continue
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Choose the role that best describes you
          </p>
        </div>

        <RoleCarousel />
      </section>

      {/* DISCOVERY & OUTREACH ECOSYSTEM */}
      <section className="bg-[#fffdfa] rounded-3xl p-6 sm:p-8 border border-[#eee9e0] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#eee9e0] pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Grassroots Discovery & Community Outreach Channels
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Ensuring the platform reaches remote hamlets and non-technical citizens across Jharkhand.
            </p>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#f0f4f1] text-[#4f6853] border border-[#dce5de] shrink-0">
            24 Districts Integrated
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-white rounded-xl border border-[#eee9e0] shadow-xs space-y-1">
            <strong className="text-slate-800 block">Panchayats & Mukhiyas</strong>
            <p className="text-[11px] text-slate-500 font-medium">Gram Sabha problem logging and formal site endorsements.</p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-[#eee9e0] shadow-xs space-y-1">
            <strong className="text-slate-800 block">Urban Local Bodies (ULBs)</strong>
            <p className="text-[11px] text-slate-500 font-medium">Municipal ward sanitation, mobility, and water telemetry.</p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-[#eee9e0] shadow-xs space-y-1">
            <strong className="text-slate-800 block">University Field Cells</strong>
            <p className="text-[11px] text-slate-500 font-medium">Student NSS & Unnat Bharat Abhiyan village immersion surveys.</p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-[#eee9e0] shadow-xs space-y-1">
            <strong className="text-slate-800 block">Panchayat QR Kiosks</strong>
            <p className="text-[11px] text-slate-500 font-medium">Scan & speak voice/photo reporting at Common Service Centers.</p>
          </div>
        </div>
      </section>

      {/* Featured Community Challenges */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-[#eee9e0] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#eee9e0] pb-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#6c8570]">
              Grassroots Ingestion
            </span>
            <h3 className="text-xl font-bold text-slate-800 tracking-tight mt-0.5">
              Active Societal Challenges Seeking HEI Solutions
            </h3>
          </div>
          <button
            onClick={() => setCurrentView('explore-challenges')}
            className="px-4 py-2 border border-[#eee9e0] hover:bg-[#fffdfa] rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1 shrink-0 transition-colors shadow-xs"
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
              className="p-5 rounded-2xl border border-[#eee9e0] hover:border-[#6c8570]/50 bg-white hover:bg-[#fffdfa] cursor-pointer transition-all flex flex-col justify-between space-y-4 shadow-xs hover:shadow-sm"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-slate-500 bg-[#f7f5f0] px-2 py-0.5 rounded border border-[#eee9e0]">
                    {ch.id}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                      ch.urgency === 'Critical'
                        ? 'bg-[#fcece3] text-[#c96245]'
                        : ch.urgency === 'High'
                        ? 'bg-[#fdf5eb] text-[#c9833b]'
                        : 'bg-[#f0f4f1] text-[#4f6853]'
                    }`}
                  >
                    {ch.urgency}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-800 leading-snug line-clamp-2">{ch.title}</h4>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-medium">{ch.description}</p>
              </div>

              <div className="pt-3 border-t border-[#eee9e0] flex items-center justify-between text-[11px] text-slate-500 font-medium">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {ch.district}
                </span>
                <span className="font-bold text-[#6c8570]">{ch.status}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
