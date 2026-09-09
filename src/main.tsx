import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { GovernanceProvider } from './context/GovernanceContext';
import { I18nProvider } from './context/I18nContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GovernanceProvider>
      <I18nProvider>
        <App />
      </I18nProvider>
    </GovernanceProvider>
  </StrictMode>
);
