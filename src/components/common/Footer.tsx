import React from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, ExternalLink, Mail, Phone, MapPin, Award, CheckCircle, FileText } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <footer className="bg-[#2c2b29] text-[#b6b4b1] text-xs border-t border-[#3c3e3d]">
      {/* Top Tri-Color / Sovereign Accent Line */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#6c8570] via-[#e6e2d8] to-[#d89753]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Government Authority */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="bg-white p-0.5 rounded-md shrink-0 border border-slate-600">
                <img src="/gov-jh-logo.jpg" alt="Government of Jharkhand Logo" className="h-8 w-auto rounded-sm object-contain mix-blend-multiply" />
              </div>
              <div>
                <h3 className="font-bold text-[#e6e2d8] text-sm">Government of Jharkhand</h3>
                <p className="text-[11px] text-[#a19f9d]">Department of Higher & Technical Education</p>
              </div>
            </div>
            <p className="text-[#a19f9d] text-xs leading-relaxed">
              An initiative of the <strong>Department of Higher & Technical Education</strong>, Government of Jharkhand, facilitating collaborative grassroots innovation connecting Citizens, Universities, and Industry.
            </p>
            <div className="flex items-center gap-2 text-[#8c78a0] text-[11px] font-semibold pt-1">
              <Shield className="w-4 h-4" />
              <span>Smart India Hackathon 2026 &bull; PS #26043</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-2">
            <h4 className="font-bold text-[#e6e2d8] uppercase tracking-wider text-xs border-b border-[#403e3c] pb-1.5">
              Portal Directory
            </h4>
            <ul className="space-y-1.5 text-xs text-[#a19f9d]">
              <li>
                <button onClick={() => setCurrentView('explore-challenges')} className="hover:text-[#d89753] transition-colors">
                  Explore Societal Challenges
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('submit-challenge')} className="hover:text-[#d89753] transition-colors">
                  Submit a Community Problem
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('map-view')} className="hover:text-[#d89753] transition-colors">
                  Jharkhand Geospatial Heatmap
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('universities')} className="hover:text-[#d89753] transition-colors">
                  Participating HEIs & Incubators
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('industry')} className="hover:text-[#d89753] transition-colors">
                  Industry & CSR Partnerships
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('impact')} className="hover:text-[#d89753] transition-colors">
                  Public Impact Scorecard
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Innovation Domains */}
          <div className="space-y-2">
            <h4 className="font-bold text-[#e6e2d8] uppercase tracking-wider text-xs border-b border-[#403e3c] pb-1.5">
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
                  className="px-2 py-0.5 rounded bg-[#403e3c] text-[#d6d4d1] text-[10px] border border-[#52504e]"
                >
                  {domain}
                </span>
              ))}
            </div>
            <div className="pt-2 text-[11px] text-[#a19f9d]">
              Covering all <strong>24 Districts</strong> and <strong>264 Blocks</strong> across Jharkhand.
            </div>
          </div>

          {/* Col 4: State PMU & Contact */}
          <div className="space-y-2">
            <h4 className="font-bold text-[#e6e2d8] uppercase tracking-wider text-xs border-b border-[#403e3c] pb-1.5">
              State Innovation PMU
            </h4>
            <div className="space-y-1.5 text-xs text-[#a19f9d]">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#868481] shrink-0 mt-0.5" />
                <span>Yojana Bhawan, Doranda, Ranchi, Jharkhand - 834002</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#868481] shrink-0" />
                <span>innovation-he@jharkhand.gov.in</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#868481] shrink-0" />
                <span>Toll-Free PMU Desk: 1800-345-6540</span>
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-[#403e3c] border border-[#52504e] mt-2">
              <span className="text-[10px] text-[#a19f9d] uppercase tracking-wide block font-semibold">
                Nodal Higher Education Council
              </span>
              <span className="text-xs font-bold text-[#d89753]">
                Jharkhand State Higher Education Council (JSHEC)
              </span>
            </div>
          </div>
        </div>

        {/* Bottom copyright and metadata */}
        <div className="mt-8 pt-6 border-t border-[#403e3c] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#868481]">
          <p>
            &copy; {new Date().getFullYear()} Government of Jharkhand. Designed & Developed for Smart India Hackathon 2026 (Phase 1 Frontend Prototype).
          </p>
          <div className="flex items-center gap-4">
            <span className="hover:text-[#b6b4b1] cursor-pointer">Terms of Service</span>
            <span>&bull;</span>
            <span className="hover:text-[#b6b4b1] cursor-pointer">Privacy Policy</span>
            <span>&bull;</span>
            <span className="hover:text-[#b6b4b1] cursor-pointer">Accessibility Statement</span>
            <span>&bull;</span>
            <span className="hover:text-[#b6b4b1] cursor-pointer">NIC Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
