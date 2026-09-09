// MINEGOV AI - Professional Login & Multi-Role Demo Selection Page
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
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useGovernance();
  const { t, language, setLanguage } = useI18n();

  const [selectedRole, setSelectedRole] = useState('Coal Mine Manager');
  const [email, setEmail] = useState('corporate@coaltech.in');
  const [password, setPassword] = useState('••••••••••••');
  const [mfaCode, setMfaCode] = useState('');
  const [showMfa, setShowMfa] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [recoverySent, setRecoverySent] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');

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
      default:
        return role;
    }
  };

  const handleRoleSelect = (role: string, userEmail: string) => {
    setSelectedRole(role);
    setEmail(userEmail);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showMfa) {
      setShowMfa(true);
      return;
    }

    login(email, selectedRole);
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
        return <Coins className="w-3.5 h-3.5 text-amber-400" />;
      case 'Workforce Head':
      case 'Worker':
        return <HardHat className="w-3.5 h-3.5 text-yellow-400" />;
      case 'Regulatory Authority':
        return <Scale className="w-3.5 h-3.5 text-purple-400" />;
      default:
        return <UserCheck className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background ambient lighting */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-sky-600/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Language Switcher */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition shadow-lg"
        >
          <Globe className="w-3.5 h-3.5 text-sky-400" />
          <span>{language === 'en' ? 'हिन्दी (Hindi)' : 'English'}</span>
        </button>
      </div>

      <div className="max-w-4xl w-full mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10 items-center">
        {/* Left branding & Role quick picker */}
        <div className="md:col-span-6 space-y-6 text-white p-4">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-sky-500/20">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-black tracking-tight font-sans">
              {t('app_title', 'MINEGOV AI')}
            </h1>
            <p className="text-xs font-semibold uppercase tracking-widest text-sky-400">
              {t('app_subtitle', 'Smart Governance & Compliance Platform for Coal Mines')}
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              SIH Problem Statement 26024. Closed-loop hazard remediation, statutory rule enforcement under CMR 2017, and tamper-evident audit ledger.
            </p>
          </div>

          {/* 11 Selectable Demo Profiles */}
          <div className="space-y-2 pt-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              {language === 'hi' ? 'डेमो भूमिका प्रोफ़ाइल चुनें (11 भूमिकाएं समर्थित):' : 'Select Demo Role Profile (11 Roles Supported):'}
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
                    className={`p-2 rounded-xl text-left border transition text-xs flex items-center space-x-2 ${
                      isSelected
                        ? 'bg-sky-500/20 border-sky-400 text-white font-bold'
                        : 'bg-slate-900/80 hover:bg-slate-850 border-slate-800 text-slate-300'
                    }`}
                  >
                    <span className="p-1 rounded-lg bg-slate-800 shrink-0">{getRoleIcon(u.role)}</span>
                    <div className="truncate">
                      <div className="truncate text-[11px] leading-tight">{translatedRole}</div>
                      <div className="text-[9px] text-slate-400 truncate">{u.name}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="md:col-span-6 bg-slate-900/90 border border-slate-800 p-8 rounded-3xl shadow-2xl backdrop-blur-md">
          {forgotPassword ? (
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-white">
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
                    <label className="block text-slate-400 font-semibold mb-1">
                      {language === 'hi' ? 'आधिकारिक आईडी / ईमेल' : 'Official ID / Email'}
                    </label>
                    <input
                      type="email"
                      required
                      value={recoveryEmail}
                      onChange={(e) => setRecoveryEmail(e.target.value)}
                      placeholder="e.g. officer@coaltech.in"
                      className="w-full px-3 py-2 bg-slate-850 border border-slate-750 rounded-xl text-white outline-none focus:border-sky-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold text-xs shadow-md transition"
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
                className="text-xs text-slate-400 hover:underline block text-center w-full pt-1"
              >
                {language === 'hi' ? 'साइन इन पर वापस जाएं' : 'Back to Sign In'}
              </button>
            </div>
          ) : showMfa ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-slate-850 border border-slate-750 p-4 rounded-xl text-xs space-y-2 text-slate-300">
                <div className="flex items-center space-x-1.5 text-emerald-400 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{language === 'hi' ? 'वैधानिक द्वि-कारक प्रमाणीकरण' : 'Statutory Two-Factor Authentication'}</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {language === 'hi' ? 'प्रमाणित मोबाइल डिवाइस पर भेजा गया 6-अंकीय ओटीपी:' : 'Simulated 6-digit OTP dispatched to certified mobile device for role:'}
                </p>
                <div className="font-bold text-white text-xs">
                  {t(getRoleI18nKey(selectedRole), selectedRole)}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-xs font-semibold mb-1 uppercase tracking-wider">
                  {language === 'hi' ? '6-अंकीय ओटीपी टोकन दर्ज करें' : 'Enter 6-Digit OTP Token'}
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  placeholder="482019"
                  className="w-full text-center tracking-[0.5em] font-mono text-xl py-2.5 bg-slate-850 border border-slate-700 rounded-xl text-white outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowMfa(false)}
                  className="w-1/3 py-2.5 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-xl font-semibold text-xs transition"
                >
                  {t('btn_cancel', 'Back')}
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold text-xs shadow-lg transition flex items-center justify-center space-x-1.5"
                >
                  <span>{language === 'hi' ? 'प्रमाणित करें और खोलें' : 'Authenticate & Launch'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-400 text-xs font-semibold mb-1 uppercase tracking-wider">
                  {language === 'hi' ? 'चयनित भूमिका दायरा' : 'Selected Role Scope'}
                </label>
                <div className="p-2.5 bg-slate-850 border border-slate-750 rounded-xl text-white font-bold text-xs flex items-center justify-between">
                  <span>{t(getRoleI18nKey(selectedRole), selectedRole)}</span>
                  <span className="text-[10px] text-sky-400 font-mono">
                    {language === 'hi' ? 'दायरा: वैधानिक' : 'Scope: Statutory'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-xs font-semibold mb-1 uppercase tracking-wider">
                  {language === 'hi' ? 'आधिकारिक ईमेल पता' : 'Official Email Address'}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-850 border border-slate-750 rounded-xl text-white text-xs outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                    {language === 'hi' ? 'सुरक्षा पासवर्ड' : 'Security Password'}
                  </label>
                  <button
                    type="button"
                    onClick={() => setForgotPassword(true)}
                    className="text-[11px] text-sky-400 hover:underline"
                  >
                    {language === 'hi' ? 'भूल गए?' : 'Forgot?'}
                  </button>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-850 border border-slate-750 rounded-xl text-white text-xs outline-none focus:border-sky-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white rounded-xl font-bold text-xs shadow-xl transition flex items-center justify-center space-x-1.5"
              >
                <span>{language === 'hi' ? 'मल्टी-फैक्टर प्रमाणीकरण के साथ आगे बढ़ें' : 'Proceed with Multi-Factor Authentication'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
