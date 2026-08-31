import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Layers } from 'lucide-react';

export const Header: React.FC = () => {
  const { currentView, setCurrentView } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'landing', label: 'Home' },
    { id: 'role-selection', label: 'Select Role' },
    { id: 'explore-challenges', label: 'Explore Challenges' },
    { id: 'map-view', label: 'Jharkhand Map' },
    { id: 'universities', label: 'Universities' },
    { id: 'industry', label: 'Industry Partners' },
    { id: 'impact', label: 'Public Impact' },
    { id: 'how-it-works', label: 'How It Works' },
  ];

  return (
    <header className="bg-transparent border-b border-[#e6e2d8]/50 relative z-10">
      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between min-h-[72px] py-2 gap-4">
          {/* Logo & Emblem */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none shrink-0"
            onClick={() => setCurrentView('landing')}
          >
            <img
              src="/gov-jh-emblem.png"
              alt="Government of Jharkhand"
              style={{ height: '64px', width: 'auto', objectFit: 'contain', display: 'block' }}
            />
            <div className="shrink-0 hidden md:block border-l border-slate-300 pl-3 ml-2 py-1">
              <h1 className="text-base sm:text-lg font-extrabold text-slate-800 tracking-tight leading-none">
                Government of Jharkhand
              </h1>
              <p className="text-xs text-slate-500 font-semibold mt-1 whitespace-nowrap">
                Department of Higher &amp; Technical Education
              </p>
            </div>
          </div>

          {/* Center Links (Desktop) */}
          <nav className="hidden xl:flex items-center justify-center gap-1 mx-2 overflow-hidden">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => setCurrentView(link.id as any)}
                className={`px-2 py-2 rounded-lg text-[11px] font-semibold tracking-wide transition-colors whitespace-nowrap ${
                  currentView === link.id
                    ? 'bg-[#fdf5eb] text-[#c9833b] font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-[#f7f5f0]'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Quick Submit Button */}
            {currentView !== 'citizen-login' && currentView !== 'login' && (
              <button
                onClick={() => setCurrentView('submit-challenge')}
                className="hidden sm:inline-flex items-center justify-center gap-1.5 px-3.5 h-10 bg-[#3a5a40] hover:bg-[#2c4431] text-white text-xs font-bold rounded-lg shadow-sm transition-all hover:shadow"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Submit Challenge</span>
              </button>
            )}

            {/* Mobile Navigation Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
            >
              <Layers className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setCurrentView(link.id as any);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold ${
                currentView === link.id ? 'bg-emerald-50 text-emerald-800' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => {
              setCurrentView('submit-challenge');
              setIsMobileMenuOpen(false);
            }}
            className="w-full mt-2 py-2.5 bg-emerald-700 text-white rounded-lg text-xs font-bold"
          >
            Submit a Community Challenge
          </button>
        </div>
      )}
    </header>
  );
};
