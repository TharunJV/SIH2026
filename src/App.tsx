import React from 'react';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { DemoProvider } from './context/DemoContext';
import { AppProvider } from './context/AppContext';
import { AppShell } from './router/AppShell';

/**
 * App is the provider composition root.
 *
 * It is rendered by the router as the root layout element, so all providers
 * have access to React Router hooks (useNavigate, useLocation, etc.).
 *
 * Provider stack (outer → inner):
 *   ToastProvider  — global toasts, no deps
 *   AuthProvider   — user authentication state, no deps
 *   DataProvider   — data fetching, depends on AuthContext
 *   DemoProvider   — demo tour navigation, depends on ToastContext + useNavigate
 *   AppProvider    — compatibility shim, composes all above
 *   AppShell       — layout: Header → <Outlet /> → Footer
 *
 * The old switch(currentView) block is completely removed.
 * Page routing is entirely handled by React Router via AppShell's <Outlet />.
 */
export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <DataProvider>
          <DemoProvider>
            <AppProvider>
              <AppShell />
            </AppProvider>
          </DemoProvider>
        </DataProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
