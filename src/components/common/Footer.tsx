import React from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, ExternalLink, Mail, Phone, MapPin, Award, CheckCircle, FileText } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <footer className="bg-slate-950 text-slate-300 text-xs border-t border-slate-800">
      {/* Top Tri-Color / Sovereign Accent Line */}
      <div className="h-1.5 w-full bg-gradient-to-r from-emerald-600 via-white to-amber-500"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Government Authority */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-800 flex items-center justify-center text-amber-400 font-bold border border-emerald-600/40 text-sm">
                JH
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">JH Innovation Connect</h3>
                <p className="text-[11px] text-slate-400">Govt. of Jharkhand Portal</p>
              </div>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              An initiative of the <strong>Department of Higher & Technical Education</strong>, Government of Jharkhand, facilitating collaborative grassroots innovation connecting Citizens, Universities, and Industry.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 text-[11px] font-semibold pt-1">
              <Shield className="w-4 h-4" />
              <span>Smart India Hackathon 2026 &bull; PS #26043</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs border-b border-slate-800 pb-1.5">
              Portal Directory
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>
                <button onClick={() => setCurrentView('explore-challenges')} className="hover:text-emerald-400 transition-colors">
                  Explore Societal Challenges
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('submit-challenge')} className="hover:text-emerald-400 transition-colors">
                  Submit a Community Problem
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('map-view')} className="hover:text-emerald-400 transition-colors">
                  Jharkhand Geospatial Heatmap
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('universities')} className="hover:text-emerald-400 transition-colors">
                  Participating HEIs & Incubators
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('industry')} className="hover:text-emerald-400 transition-colors">
                  Industry & CSR Partnerships
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('impact')} className="hover:text-emerald-400 transition-colors">
                  Public Impact Scorecard
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Innovation Domains */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs border-b border-slate-800 pb-1.5">
              Focal Innovation Domains
            </h4>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                'Rural Water Management',
                'Agro & Lac Mechanization',
                'Forest Livelihoods',
                'Telemedicine Kiosks',
                'Offline EdTech Pods',
                'Mine Runoff Remediation',
                'Solar Cold Storage',
                'Tribal Metallurgy',
              ].map((domain) => (
                <span
                  key={domain}
                  className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 text-[10px] border border-slate-800"
                >
                  {domain}
                </span>
              ))}
            </div>
            <div className="pt-2 text-[11px] text-slate-400">
              Covering all <strong>24 Districts</strong> and <strong>264 Blocks</strong> across Jharkhand.
            </div>
          </div>

          {/* Col 4: State PMU & Contact */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs border-b border-slate-800 pb-1.5">
              State Innovation PMU
            </h4>
            <div className="space-y-1.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <span>Yojana Bhawan, Doranda, Ranchi, Jharkhand - 834002</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                <span>innovation-he@jharkhand.gov.in</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                <span>Toll-Free PMU Desk: 1800-345-6540</span>
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 mt-2">
              <span className="text-[10px] text-slate-400 uppercase tracking-wide block font-semibold">
                Nodal Higher Education Council
              </span>
              <span className="text-xs font-bold text-amber-400">
                Jharkhand State Higher Education Council (JSHEC)
              </span>
            </div>
          </div>
        </div>

        {/* Bottom copyright and metadata */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} Government of Jharkhand. Designed & Developed for Smart India Hackathon 2026 (Phase 1 Frontend Prototype).
          </p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span>&bull;</span>
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span>&bull;</span>
            <span className="hover:text-slate-400 cursor-pointer">Accessibility Statement</span>
            <span>&bull;</span>
            <span className="hover:text-slate-400 cursor-pointer">NIC Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
