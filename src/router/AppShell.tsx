import React, { Suspense, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { ToastContainer } from '../components/common/ToastContainer';
import { AuthModal } from '../components/common/AuthModal';
import { AIChatbot } from '../components/chatbot/AIChatbot';

/**
 * AppShell is the persistent layout wrapper for all routes.
 *
 * It renders the sticky Header, delegates page content to <Outlet />,
 * conditionally shows the Footer, and displays the AI Chatbot globally.
 */
const ROUTES_WITHOUT_HEADER = ['/', '/welcome'];

const ROUTES_WITHOUT_FOOTER = [
  '/',
  '/welcome',
  '/login/citizen',
  '/citizen-login',
  '/citizen-register',
  '/login',
  '/dashboard/citizen',
  '/citizen-dashboard',
];

const ROUTES_WITH_FULL_VIEWPORT = [
  '/',
  '/welcome',
  '/dashboard/citizen',
  '/citizen-dashboard',
];

export const AppShell: React.FC = () => {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();

  // Normalize incoming hash URLs (e.g. #/citizen-login -> /citizen-login)
  useEffect(() => {
    if (hash && hash.startsWith('#/')) {
      const cleanPath = hash.replace(/^#/, '');

      if (cleanPath && cleanPath !== pathname) {
        navigate(cleanPath, { replace: true });
      }
    }
  }, [hash, pathname, navigate]);

  const showHeader = !ROUTES_WITHOUT_HEADER.some(
    (r) => pathname === r
  );

  const showFooter = !ROUTES_WITHOUT_FOOTER.some(
    (r) => pathname === r || pathname.startsWith(r)
  );

  const isFullViewport = ROUTES_WITH_FULL_VIEWPORT.some(
    (r) => pathname === r || pathname.startsWith(r)
  );

  const isWelcomePage =
    pathname === '/' || pathname === '/welcome';

  return (
    <div
      className={`min-h-screen bg-[#f7f5f0] text-slate-800 font-sans antialiased selection:bg-[#6c8570] selection:text-white ${isWelcomePage
          ? 'p-0 m-0 w-screen h-screen overflow-hidden'
          : 'py-0 sm:py-6 lg:py-8 px-0 sm:px-6 lg:px-10 overflow-hidden'
        }`}
    >
      <div
        className={`flex flex-col relative ${isWelcomePage
            ? 'w-full h-full m-0 p-0 rounded-none border-0 shadow-none overflow-hidden'
            : `min-h-[calc(100vh-3rem)] max-w-[1440px] mx-auto bg-[#FCFAF5] shadow-2xl shadow-slate-300/40 rounded-none sm:rounded-[24px] border-0 sm:border border-[#e6e2d8] ${isFullViewport
              ? 'overflow-x-hidden overflow-y-visible'
              : 'overflow-hidden'
            }`
          }`}
      >
        {/* Sticky Top Navigation */}
        {showHeader && (
          <div className="sticky top-0 z-40 flex flex-col bg-white/95 backdrop-blur-md border-b border-[#e6e2d8]/60">
            <Header />
          </div>
        )}

        {/* Main Page Content */}
        <main
          className={`flex-1 w-full mx-auto ${isWelcomePage
              ? 'p-0 m-0 w-full h-full'
              : isFullViewport
                ? 'px-0 py-0'
                : pathname === '/login/citizen'
                  ? 'px-4 sm:px-8 lg:px-12 py-2 sm:py-3'
                  : 'px-4 sm:px-8 lg:px-12 py-6 sm:py-10'
            }`}
        >
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 border-4 border-[#3a5a40] border-t-transparent rounded-full animate-spin" />
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </main>

        {/* AI Chatbot — Available on Every Page */}
        <AIChatbot />

        {/* Global Alerts & Modals */}
        <ToastContainer />
        <AuthModal />

        {/* Footer — hidden on login & full-viewport dashboard routes */}
        {showFooter && (
          <div className="bg-[#f2efe9] border-t border-[#e6e2d8]">
            <Footer />
          </div>
        )}
      </div>
    </div>
  );
};