import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';

import { tanstackRouter } from './router/tanstackRouter';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';

import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <AuthProvider>
        <RouterProvider router={tanstackRouter} />
      </AuthProvider>
    </ToastProvider>
  </StrictMode>
);