import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Layers, X } from 'lucide-react';

export const Header: React.FC = () => {
  const { currentView, setCurrentView } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeNavId, setActiveNavId] = useState<string>('landing');

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

  // Scroll detection to update active nav highlight when on landing view
  useEffect(() => {
    if (currentView !== 'landing') {
      setActiveNavId(currentView);
      return;
    }

    const handleScroll = () => {
      const sections = [
        { id: 'active-challenges', navId: 'explore-challenges' },
        { id: 'discovery', navId: 'how-it-works' },
        { id: 'pathways', navId: 'how-it-works' },
        { id: 'how-it-works', navId: 'how-it-works' },
        { id: 'select-role', navId: 'role-selection' },
        { id: 'hero', navId: 'landing' },
      ];

      const scrollPosition = window.scrollY + 180;

      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveNavId(section.navId);
            return;
          }
        }
      }
      setActiveNavId('landing');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentView]);

  const handleNavClick = (linkId: string) => {
    const sectionMap: Record<string, string> = {
      'landing': 'hero',
      'role-selection': 'select-role',
      'explore-challenges': 'active-challenges',
      'map-view': 'hero',
      'how-it-works': 'how-it-works',
    };

    const targetSectionId = sectionMap[linkId];

    if (targetSectionId) {
      if (currentView !== 'landing') {
        setCurrentView('landing');
        setTimeout(() => {
          const el = document.getElementById(targetSectionId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 120);
      } else {
        const el = document.getElementById(targetSectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else {
      setCurrentView(linkId as any);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="bg-transparent border-b border-[#e6e2d8]/50 relative z-10">
      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-[76px] py-2 gap-2 lg:gap-4">
          {/* Logo & Emblem */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none shrink-0 group"
            onClick={() => {
              setCurrentView('landing');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <img
              src="/gov-jh-emblem.png"
              alt="Government of Jharkhand"
              style={{ height: '62px', width: 'auto', objectFit: 'contain', display: 'block' }}
              className="transition-transform group-hover:scale-[1.02]"
            />
            <div className="shrink-0 hidden md:block border-l border-slate-300/80 pl-3.5 ml-1 py-1">
              <h1 className="text-base sm:text-[17px] font-extrabold text-slate-800 tracking-tight leading-none">
                Government of Jharkhand
              </h1>
              <p className="text-xs text-slate-500 font-semibold mt-1 whitespace-nowrap">
                Department of Higher &amp; Technical Education
              </p>
            </div>
          </div>

          {/* Desktop Navigation Row with Right-Aligned Submit Challenge CTA */}
          <div className="hidden xl:flex items-center gap-2.5">
            <nav className="flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = activeNavId === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-150 whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-[#fdf5eb] text-[#c9833b] font-bold border border-[#f5e3d0]/80 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-[#f7f5f0]'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </nav>

            {/* Primary CTA on the RIGHT side of navigation */}
            {currentView !== 'citizen-login' && currentView !== 'login' && (
              <button
                onClick={() => setCurrentView('submit-challenge')}
                className="ml-2 inline-flex items-center justify-center gap-1.5 px-4 h-10 bg-[#3a5a40] hover:bg-[#2c4431] text-white text-xs font-bold rounded-lg shadow-sm transition-all hover:shadow hover:scale-[1.02] active:scale-[0.98] cursor-pointer shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                <span>Submit Challenge</span>
              </button>
            )}
          </div>

          {/* Medium Screen (lg) Navigation compact fallback */}
          <div className="hidden lg:flex xl:hidden items-center gap-1.5">
            <nav className="flex items-center gap-0.5">
              {navLinks.slice(0, 5).map((link) => {
                const isActive = activeNavId === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`px-2 py-1.5 rounded-lg text-[11px] font-semibold tracking-wide transition-all duration-150 whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-[#fdf5eb] text-[#c9833b] font-bold border border-[#f5e3d0]/80'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-[#f7f5f0]'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </nav>

            {currentView !== 'citizen-login' && currentView !== 'login' && (
              <button
                onClick={() => setCurrentView('submit-challenge')}
                className="ml-1 inline-flex items-center justify-center gap-1.5 px-3 h-9 bg-[#3a5a40] hover:bg-[#2c4431] text-white text-[11px] font-bold rounded-lg shadow-sm transition-all shrink-0 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                <span>Submit Challenge</span>
              </button>
            )}

            {/* Overflow toggle for lg screens */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-9 h-9 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 shrink-0"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
            </button>
          </div>

          {/* Mobile Right Controls (< lg screens) */}
          <div className="flex lg:hidden items-center gap-2 shrink-0">
            {currentView !== 'citizen-login' && currentView !== 'login' && (
              <button
                onClick={() => setCurrentView('submit-challenge')}
                className="inline-flex items-center justify-center gap-1.5 px-3 h-9 bg-[#3a5a40] hover:bg-[#2c4431] text-white text-xs font-bold rounded-lg shadow-sm transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                <span className="hidden sm:inline">Submit Challenge</span>
                <span className="sm:hidden">Submit</span>
              </button>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-9 h-9 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Layers className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white/98 backdrop-blur-md border-t border-slate-200 px-4 pt-3 pb-5 space-y-1.5 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  handleNavClick(link.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  activeNavId === link.id
                    ? 'bg-[#fdf5eb] text-[#c9833b] font-bold border border-[#f5e3d0]'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                setCurrentView('submit-challenge');
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-3 bg-[#3a5a40] hover:bg-[#2c4431] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Submit Challenge</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
