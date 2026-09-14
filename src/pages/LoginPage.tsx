// COALTECH - Professional Login & Multi-Role Demo Selection Page
import React, { useState } from 'react';
import { useGovernance } from '../context/GovernanceContext';
import { useI18n } from '../context/I18nContext';
import { SEED_USERS } from '../data/seedData';
import {
  Shield,
  ShieldCheck,
  ArrowRight,
  UserCheck,
  HardHat,
  Eye,
  Activity,
  Coins,
  Scale,
  Users,
  Globe,
  Truck,
  AlertTriangle,
} from 'lucide-react';
import { Reveal } from '../components/animations/Reveal';
import { Magnetic } from '../components/animations/Magnetic';

export const LoginPage: React.FC = () => {
  const { login } = useGovernance();
  const { t, language, setLanguage } = useI18n();

  const [selectedRole, setSelectedRole] = useState('Coal Mine Manager');
  const [email, setEmail] = useState('corporate@coaltech.in');
  const [password, setPassword] = useState('••••••••••••');
  const [mfaCode, setMfaCode] = useState('482019');
  const [showMfa, setShowMfa] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [recoverySent, setRecoverySent] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  const getRoleI18nKey = (role: string): string => {
    switch (role) {
      case 'Coal Mine Manager':
        return 'role_cmm';
      case 'Area Manager':
        return 'role_am';
      case 'Mine Head':
        return 'role_mh';
      case 'Safety Officer':
        return 'role_so';
      case 'Inspection Officer':
        return 'role_io';
      case 'Environment Officer':
        return 'role_eo';
      case 'Contractor Manager':
        return 'role_co';
      case 'Finance Officer':
        return 'role_fo';
      case 'Workforce Head':
        return 'role_wo';
      case 'Worker':
        return 'role_worker';
      case 'Regulatory Authority':
        return 'role_dgms';
      case 'Transportation Head':
        return 'role_th';
      case 'Government Department':
        return 'role_gd';
      case 'Corporate Management':
        return 'role_cm';
      case 'System Administrator':
        return 'role_sa';
      default:
        return role;
    }
  };

  const handleRoleSelect = (role: string, userEmail: string) => {
    setSelectedRole(role);
    setEmail(userEmail);
    setMfaCode('482019');
    setLoginError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    if (!showMfa) {
      setShowMfa(true);
      if (!mfaCode) setMfaCode('482019');
      return;
    }

    const success = login(email, selectedRole);
    if (!success) {
      setLoginError(
        language === 'hi'
          ? 'प्रमाणीकरण विफल। चयनित भूमिका के लिए अमान्य क्रेडेंशियल्स।'
          : 'Authentication failed. Invalid role or credentials for this profile.'
      );
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Coal Mine Manager':
      case 'Area Manager':
      case 'Mine Head':
        return <Shield className="w-3.5 h-3.5 text-sky-400" />;
      case 'Safety Officer':
        return <ShieldCheck className="w-3.5 h-3.5 text-red-400" />;
      case 'Inspection Officer':
        return <Eye className="w-3.5 h-3.5 text-cyan-400" />;
      case 'Environment Officer':
        return <Activity className="w-3.5 h-3.5 text-green-400" />;
      case 'Contractor Manager':
        return <Users className="w-3.5 h-3.5 text-orange-400" />;
      case 'Finance Officer':
      case 'Corporate Management':
        return <Coins className="w-3.5 h-3.5 text-amber-400" />;
      case 'Workforce Head':
      case 'Worker':
        return <HardHat className="w-3.5 h-3.5 text-yellow-400" />;
      case 'Regulatory Authority':
      case 'Government Department':
        return <Scale className="w-3.5 h-3.5 text-purple-400" />;
      case 'Transportation Head':
        return <Truck className="w-3.5 h-3.5 text-amber-400" />;
      case 'System Administrator':
        return <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <UserCheck className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background ambient lighting */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Language Switcher */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-xs font-semibold text-[var(--color-text)] hover:bg-[var(--color-surface-2)] transition shadow-card"
        >
          <Globe className="w-3.5 h-3.5 text-blue-400" />
          <span>{language === 'en' ? 'हिन्दी (Hindi)' : 'English'}</span>
        </button>
      </div>

      <div className="max-w-4xl w-full mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10 items-center">
        {/* Left branding & Role quick picker */}
        <Reveal direction="up" delay={0.02} className="md:col-span-6 space-y-6 text-[var(--color-text)] p-4">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text)]">
              {t('app_title', 'COALTECH')}
            </h1>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-400">
              {t('app_subtitle', 'Smart Coal Governance, Safety & Siding Logistics Platform')}
            </p>
            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
              SIH Problem Statement 26024. Closed-loop hazard remediation, statutory rule enforcement under CMR 2017, coal siding logistics, and tamper-evident audit ledger.
            </p>
          </div>

          {/* 15 Selectable Demo Profiles */}
          <div className="space-y-2 pt-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-subtle)] block">
              {language === 'hi' ? 'डेमो भूमिका प्रोफ़ाइल चुनें (15 भूमिकाएं समर्थित):' : 'Select Demo Role Profile (15 Roles Supported):'}
            </span>

            <div className="grid grid-cols-2 gap-1.5 max-h-64 overflow-y-auto pr-1">
              {SEED_USERS.map((u) => {
                const isSelected = selectedRole === u.role;
                const translatedRole = t(getRoleI18nKey(u.role), u.role);
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleRoleSelect(u.role, u.email)}
                    className={`p-2 rounded-xl text-left border transition-all text-xs flex items-center space-x-2 ${
                      isSelected
                        ? 'bg-blue-500/15 border-blue-500/40 text-[var(--color-text)] font-semibold'
                        : 'bg-[var(--color-surface-2)] hover:bg-[var(--color-surface-3)] border-[var(--color-border)] text-[var(--color-text-muted)]'
                    }`}
                  >
                    <span className="p-1 rounded-lg bg-[var(--color-surface-3)] shrink-0">{getRoleIcon(u.role)}</span>
                    <div className="truncate">
                      <div className="truncate text-[11px] leading-tight font-medium">{translatedRole}</div>
                      <div className="text-[9px] text-[var(--color-text-subtle)] truncate">{u.name}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* Right Form Card */}
        <Reveal direction="up" delay={0.06} className="md:col-span-6">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-8 rounded-3xl shadow-card">
            {forgotPassword ? (
              <div className="space-y-4">
                <h3 className="font-bold text-lg text-[var(--color-text)]">
                  {language === 'hi' ? 'क्रेडेंशियल्स रीसेट करें' : 'Reset Credentials'}
                </h3>
                {recoverySent ? (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3.5 rounded-xl text-xs">
                    Statutory recovery dispatch sent to <strong>{recoveryEmail}</strong>.
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setRecoverySent(true);
                    }}
                    className="space-y-3 text-xs"
                  >
                    <div>
                      <label className="block text-[var(--color-text-muted)] font-semibold mb-1">
                        {language === 'hi' ? 'आधिकारिक आईडी / ईमेल' : 'Official ID / Email'}
                      </label>
                      <input
                        type="email"
                        required
                        value={recoveryEmail}
                        onChange={(e) => setRecoveryEmail(e.target.value)}
                        placeholder="e.g. officer@coaltech.in"
                        className="w-full px-3 py-2 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] outline-none focus:border-blue-500"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-xs shadow-md active:scale-[0.98] transition-all"
                    >
                      {language === 'hi' ? 'रिकवरी सत्यापन लिंक भेजें' : 'Send Recovery Verification Link'}
                    </button>
                  </form>
                )}
                <button
                  onClick={() => {
                    setForgotPassword(false);
                    setRecoverySent(false);
                  }}
                  className="text-xs text-[var(--color-text-subtle)] hover:underline block text-center w-full pt-1"
                >
                  {language === 'hi' ? 'साइन इन पर वापस जाएं' : 'Back to Sign In'}
                </button>
              </div>
            ) : showMfa ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="bg-[var(--color-surface-2)] border border-[var(--color-border)] p-4 rounded-xl text-xs space-y-2 text-[var(--color-text)]">
                  <div className="flex items-center space-x-1.5 text-emerald-400 font-semibold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{language === 'hi' ? 'वैधानिक द्वि-कारक प्रमाणीकरण' : 'Statutory Two-Factor Authentication'}</span>
                  </div>
                  <p className="text-[11px] text-[var(--color-text-muted)]">
                    {language === 'hi' ? 'प्रमाणित मोबाइल डिवाइस पर भेजा गया 6-अंकीय ओटीपी:' : 'Simulated 6-digit OTP dispatched to certified mobile device for role:'}
                  </p>
                  <div className="font-bold text-[var(--color-text)] text-xs">
                    {t(getRoleI18nKey(selectedRole), selectedRole)}
                  </div>
                </div>

                <div>
                  <label className="block text-[var(--color-text-subtle)] text-xs font-semibold mb-1 uppercase tracking-wider">
                    {language === 'hi' ? '6-अंकीय ओटीपी टोकन दर्ज करें' : 'Enter 6-Digit OTP Token'}
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value)}
                    placeholder="482019"
                    className="w-full text-center tracking-[0.5em] font-mono text-xl py-2.5 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] outline-none focus:border-blue-500"
                  />
                </div>

                {loginError && (
                  <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowMfa(false)}
                    className="w-1/3 py-2.5 border border-[var(--color-border)] hover:bg-[var(--color-surface-2)] text-[var(--color-text)] rounded-xl font-medium text-xs active:scale-[0.98] transition-all"
                  >
                    {t('btn_cancel', 'Back')}
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-xs shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center space-x-1.5"
                  >
                    <span>{language === 'hi' ? 'प्रमाणित करें और खोलें' : 'Authenticate & Launch'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[var(--color-text-subtle)] text-xs font-semibold mb-1 uppercase tracking-wider">
                    {language === 'hi' ? 'चयनित भूमिका दायरा' : 'Selected Role Scope'}
                  </label>
                  <div className="p-2.5 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] font-semibold text-xs flex items-center justify-between">
                    <span>{t(getRoleI18nKey(selectedRole), selectedRole)}</span>
                    <span className="text-[10px] text-blue-400 font-mono">
                      {language === 'hi' ? 'दायरा: वैधानिक' : 'Scope: Statutory'}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-[var(--color-text-subtle)] text-xs font-semibold mb-1 uppercase tracking-wider">
                    {language === 'hi' ? 'आधिकारिक ईमेल पता' : 'Official Email Address'}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] text-xs outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[var(--color-text-subtle)] text-xs font-semibold uppercase tracking-wider">
                      {language === 'hi' ? 'सुरक्षा पासवर्ड' : 'Security Password'}
                    </label>
                    <button
                      type="button"
                      onClick={() => setForgotPassword(true)}
                      className="text-[11px] text-blue-400 hover:underline"
                    >
                      {language === 'hi' ? 'भूल गए?' : 'Forgot?'}
                    </button>
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] text-xs outline-none focus:border-blue-500"
                  />
                </div>

                {loginError && (
                  <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <Magnetic>
                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-xs shadow-lg shadow-blue-500/25 active:scale-[0.98] transition-all flex items-center justify-center space-x-1.5"
                  >
                    <span>{language === 'hi' ? 'मल्टी-फैक्टर प्रमाणीकरण के साथ आगे बढ़ें' : 'Proceed with Multi-Factor Authentication'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Magnetic>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </div>
  );
};
