// MINEGOV AI - Mobile Field Worker Experience & Emulator Page
import React, { useState } from 'react';
import { useGovernance } from '../context/GovernanceContext';
import { useI18n } from '../context/I18nContext';
import {
  Smartphone,
  Wifi,
  WifiOff,
  LogOut,
  PlusCircle,
  FileText,
  ShieldCheck,
  AlertTriangle,
  Mic,
  MapPin,
  Send,
  MessageSquare,
  CheckCircle2,
} from 'lucide-react';

export const MobileWorkerPage: React.FC = () => {
  const {
    currentUser,
    logout,
    submitReport,
    isOffline,
    toggleOfflineMode,
    offlineQueue,
    syncOfflineQueue,
    violations,
    submitGrievance,
  } = useGovernance();
  const { language, setLanguage, t } = useI18n();

  const [activeTab, setActiveTab] = useState<'home' | 'report' | 'myreports' | 'grievance'>('home');

  // Report form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Electrical Safety');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('MEDIUM');
  const [zone, setZone] = useState('Zone 1 (Shaft Entrance)');
  const gps = '23.754°N, 86.421°E (Auto-captured)';
  const [photoUrl, setPhotoUrl] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [submitSuccessMsg, setSubmitSuccessMsg] = useState<string | null>(null);

  // Grievance form state
  const [grvCat, setGrvCat] = useState<'Safety Hazard' | 'Sanitation / Drinking Water' | 'PPE Defect'>('Safety Hazard');
  const [grvDesc, setGrvDesc] = useState('');
  const [grvSuccess, setGrvSuccess] = useState(false);

  const workerViolations = violations.filter(
    (v) => v.reporterName === currentUser?.name || v.reporterName === 'Anil Yadav'
  );

  const handleSimulateVoice = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      setTitle('Water accumulation & open cables near machinery');
      setDescription(
        language === 'hi'
          ? 'मशीन के पास पानी जमा है और बिजली का तार खुला हुआ है।'
          : 'Water logged near mechanical gears with exposed cables in haulage zone.'
      );
      setSeverity('CRITICAL');
      setZone('Zone 4 (Electrical Substations)');
    }, 1200);
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const res = await submitReport({
      title,
      category,
      description,
      severity,
      mineId: currentUser?.mineId || 'm1',
      zone,
      gps,
      beforePhotoUrl: photoUrl || undefined,
    });

    if (res.status === 'OFFLINE_SAVED') {
      setSubmitSuccessMsg('Platform is offline. Report safely stored in local device queue!');
    } else {
      setSubmitSuccessMsg('Report submitted to Central AI Engine! Risk score computed.');
    }

    setTitle('');
    setDescription('');
    setTimeout(() => {
      setSubmitSuccessMsg(null);
      setActiveTab('myreports');
    }, 2000);
  };

  const handleGrievanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!grvDesc.trim()) return;
    submitGrievance(grvCat, grvDesc, true);
    setGrvSuccess(true);
    setGrvDesc('');
    setTimeout(() => {
      setGrvSuccess(false);
      setActiveTab('home');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative font-sans">
      {/* Mobile Device Mockup Frame */}
      <div className="w-full max-w-[390px] h-[820px] bg-slate-900 rounded-[50px] shadow-[0_0_60px_rgba(0,0,0,0.9)] border-[12px] border-slate-800 flex flex-col overflow-hidden relative">
        {/* Notch / Speaker */}
        <div className="absolute top-0 inset-x-0 h-6 bg-slate-900 flex justify-center items-center z-30">
          <div className="w-24 h-4 bg-black rounded-b-xl flex justify-center items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-800 mr-2"></span>
            <span className="w-8 h-1 bg-slate-800 rounded"></span>
          </div>
        </div>

        {/* Status Bar */}
        <div className="h-10 bg-slate-900 flex justify-between items-end px-6 pb-1 text-[11px] text-slate-400 z-20">
          <span className="font-semibold">09:41</span>
          <div className="flex items-center space-x-2">
            <button onClick={toggleOfflineMode} title="Toggle Network State">
              {isOffline ? (
                <span className="flex items-center text-red-400 font-bold text-[10px]">
                  <WifiOff className="w-3.5 h-3.5 mr-0.5 animate-pulse" /> Offline
                </span>
              ) : (
                <span className="flex items-center text-emerald-400 text-[10px]">
                  <Wifi className="w-3.5 h-3.5 mr-0.5" /> 4G LTE
                </span>
              )}
            </button>
            {offlineQueue.length > 0 && (
              <span className="bg-amber-500 text-slate-950 font-bold px-1.5 py-0.2 rounded-full text-[9px] animate-pulse">
                {offlineQueue.length}
              </span>
            )}
            <span>98% 🔋</span>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="bg-slate-950 px-4 pt-3 pb-2 border-b border-slate-850 flex justify-between items-center z-20">
          <div>
            <span className="text-[9px] font-bold text-sky-400 uppercase tracking-wider block">
              {t('mob_worker_portal', 'Worker Field Portal')}
            </span>
            <h2 className="font-bold text-white text-sm leading-tight">{currentUser?.name || 'Anil Yadav'}</h2>
          </div>

          <div className="flex items-center space-x-2">
            {/* Language Selector */}
            <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-[10px]">
              <button
                onClick={() => setLanguage('en')}
                className={`px-1.5 py-0.5 rounded ${language === 'en' ? 'bg-sky-600 text-white font-bold' : 'text-slate-400'}`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-1.5 py-0.5 rounded ${language === 'hi' ? 'bg-sky-600 text-white font-bold' : 'text-slate-400'}`}
              >
                हिन्दी
              </button>
            </div>

            <button onClick={logout} className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-900">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Offline Warning Banner */}
        {isOffline && (
          <div className="bg-red-600 text-white text-[10px] py-1 px-3 flex justify-between items-center font-bold z-20">
            <span className="flex items-center">
              <WifiOff className="w-3 h-3 mr-1" /> OFFLINE MODE ACTIVE
            </span>
            <button
              onClick={async () => {
                toggleOfflineMode();
                await syncOfflineQueue();
              }}
              className="bg-white text-red-600 px-2 py-0.5 rounded font-black text-[9px]"
            >
              Re-sync
            </button>
          </div>
        )}

        {/* Screen Scrollable Body */}
        <div className="flex-1 bg-slate-950 overflow-y-auto px-4 pt-3 pb-20 text-xs">
          {/* 1. Worker Home Tab */}
          {activeTab === 'home' && (
            <div className="space-y-4">
              {/* Shift & Training Info Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-[11px] font-semibold">{t('mob_shift_details', 'Shift Roster')}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    Present
                  </span>
                </div>
                <div className="font-bold text-white text-sm">Morning Shift (A) • 06:00 - 14:00</div>
                <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800">
                  <span>Zone: Excavation Face 3</span>
                  <span className="text-emerald-400 font-semibold flex items-center">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Training Certified
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <button
                onClick={() => setActiveTab('report')}
                className="w-full p-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-2xl font-bold shadow-xl flex items-center justify-between transition"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/10 rounded-xl">
                    <AlertTriangle className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <span className="block text-sm leading-tight">
                      {language === 'hi' ? 'असुरक्षित स्थिति रिपोर्ट करें' : 'Report Hazard / Unsafe'}
                    </span>
                    <span className="text-[10px] text-white/70 font-normal">
                      Instant GPS location & photographic evidence
                    </span>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('grievance')}
                className="w-full p-3.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-white rounded-2xl font-semibold flex items-center justify-between transition"
              >
                <div className="flex items-center space-x-3">
                  <MessageSquare className="w-5 h-5 text-amber-400" />
                  <div className="text-left">
                    <span className="block text-xs font-bold">Anonymous Safety Grievance</span>
                    <span className="text-[10px] text-slate-400 font-normal">PPE defects, drinking water issues</span>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('myreports')}
                className="w-full p-3.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-white rounded-2xl font-semibold flex items-center justify-between transition"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-sky-400" />
                  <div className="text-left">
                    <span className="block text-xs font-bold">My Reported Incidents</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      Track remediation closure & verification
                    </span>
                  </div>
                </div>
              </button>
            </div>
          )}

          {/* 2. Report Hazard Tab */}
          {activeTab === 'report' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-sm">
                  {language === 'hi' ? 'खतरा रिपोर्ट फॉर्म' : 'Field Hazard Report'}
                </h3>
                <button
                  type="button"
                  onClick={handleSimulateVoice}
                  disabled={isListening}
                  className="flex items-center space-x-1 px-2.5 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-lg text-[10px] font-bold"
                >
                  <Mic className={`w-3.5 h-3.5 ${isListening ? 'animate-pulse text-red-500' : ''}`} />
                  <span>{isListening ? 'Transcribing...' : 'Voice (Hindi)'}</span>
                </button>
              </div>

              {submitSuccessMsg && (
                <div className="p-3 bg-emerald-500/20 border border-emerald-500 text-emerald-300 rounded-xl text-xs flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{submitSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handleReportSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Observation Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Exposed 11kV cable near water"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none"
                  >
                    <option value="Electrical Safety">Electrical Safety</option>
                    <option value="Ventilation & Dust Control">Ventilation & Dust Control</option>
                    <option value="Safety Barrier">Safety Barrier</option>
                    <option value="Gas Concentration">Gas Concentration</option>
                    <option value="Roof Bolting & Strata">Roof Bolting & Strata</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Observation Details</label>
                  <textarea
                    required
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe condition and proximity to workers..."
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-red-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Severity</label>
                    <select
                      value={severity}
                      onChange={(e) => setSeverity(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none"
                    >
                      <option value="LOW">LOW</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="HIGH">HIGH</option>
                      <option value="CRITICAL">CRITICAL</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Zone</label>
                    <select
                      value={zone}
                      onChange={(e) => setZone(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none text-[11px]"
                    >
                      <option value="Zone 1 (Shaft Entrance)">Zone 1 (Shaft Entrance)</option>
                      <option value="Zone 2 (Haulage Way)">Zone 2 (Haulage Way)</option>
                      <option value="Zone 3 (Excavation Face)">Zone 3 (Excavation Face)</option>
                      <option value="Zone 4 (Electrical Substations)">Zone 4 (Electrical Substation)</option>
                      <option value="Zone 5 (Tailings Pond)">Zone 5 (Tailings Pond)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Evidence Photo URL</label>
                  <input
                    type="text"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="https://... or photo url"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none"
                  />
                </div>

                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex items-center space-x-2 text-slate-400 text-[10px]">
                  <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span>GPS: {gps}</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold text-xs shadow-lg transition flex items-center justify-center space-x-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>{isOffline ? 'Save to Device (Offline)' : 'Dispatch Immediate Alert'}</span>
                </button>
              </form>
            </div>
          )}

          {/* 3. My Reports Tab */}
          {activeTab === 'myreports' && (
            <div className="space-y-3">
              <h3 className="font-bold text-white text-sm">My Reported Hazards ({workerViolations.length})</h3>

              <div className="space-y-2">
                {workerViolations.map((v) => (
                  <div key={v.id} className="bg-slate-900 border border-slate-800 p-3 rounded-xl space-y-1.5">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-white text-xs">{v.title}</span>
                      <span
                        className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                          v.status === 'CLOSED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        {v.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2">{v.description}</p>
                    <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800 flex justify-between">
                      <span>Zone: {v.zone}</span>
                      <span className="font-mono text-red-400">Risk: {v.riskScore}/100</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Grievance Tab */}
          {activeTab === 'grievance' && (
            <div className="space-y-3">
              <h3 className="font-bold text-white text-sm">Confidential Safety Grievance</h3>
              <p className="text-[11px] text-slate-400">
                Your identity is strictly protected. Grievances are submitted directly to the Welfare Directorate.
              </p>

              {grvSuccess && (
                <div className="p-3 bg-emerald-500/20 border border-emerald-500 text-emerald-300 rounded-xl text-xs flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Grievance registered anonymously.</span>
                </div>
              )}

              <form onSubmit={handleGrievanceSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Category</label>
                  <select
                    value={grvCat}
                    onChange={(e) => setGrvCat(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none"
                  >
                    <option value="Safety Hazard">Safety Hazard</option>
                    <option value="PPE Defect">PPE Defect</option>
                    <option value="Sanitation / Drinking Water">Sanitation / Drinking Water</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Description</label>
                  <textarea
                    required
                    rows={4}
                    value={grvDesc}
                    onChange={(e) => setGrvDesc(e.target.value)}
                    placeholder="Describe issue encountered..."
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold text-xs shadow-md transition"
                >
                  File Anonymous Grievance
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Bottom Navigation Bar */}
        <div className="absolute bottom-0 inset-x-0 h-16 bg-slate-900 border-t border-slate-850 flex justify-around items-center z-30 px-3">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center space-y-0.5 ${activeTab === 'home' ? 'text-sky-400' : 'text-slate-500'}`}
          >
            <Smartphone className="w-4 h-4" />
            <span className="text-[9px]">Home</span>
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`flex flex-col items-center space-y-0.5 ${activeTab === 'report' ? 'text-sky-400' : 'text-slate-500'}`}
          >
            <PlusCircle className="w-4 h-4" />
            <span className="text-[9px]">Report</span>
          </button>
          <button
            onClick={() => setActiveTab('myreports')}
            className={`flex flex-col items-center space-y-0.5 ${activeTab === 'myreports' ? 'text-sky-400' : 'text-slate-500'}`}
          >
            <FileText className="w-4 h-4" />
            <span className="text-[9px]">History</span>
          </button>
        </div>
      </div>
    </div>
  );
};
