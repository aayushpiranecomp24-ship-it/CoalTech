import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { GovernanceProvider } from './context/GovernanceContext';
import { I18nProvider } from './context/I18nContext';
import { ThemeProvider } from './context/ThemeContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <GovernanceProvider>
        <I18nProvider>
          <App />
        </I18nProvider>
      </GovernanceProvider>
    </ThemeProvider>
  </StrictMode>
);

// PWA Service Worker Registration
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.debug('ServiceWorker registration error:', err);
    });
  });
}

