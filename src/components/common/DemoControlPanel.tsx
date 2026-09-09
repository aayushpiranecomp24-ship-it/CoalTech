// MINEGOV AI - Interactive Sandbox Demo Controls Panel
import React, { useState } from 'react';
import { useGovernance } from '../../context/GovernanceContext';
import { useI18n } from '../../context/I18nContext';
import {
  Play,
  RotateCcw,
  Sparkles,
  Wifi,
  WifiOff,
  Mic,
  AlertOctagon,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface DemoControlPanelProps {
  onNavigateTab: (tab: string) => void;
  onShowToast: (msg: string, type?: 'success' | 'warning' | 'error') => void;
}

export const DemoControlPanel: React.FC<DemoControlPanelProps> = ({ onNavigateTab, onShowToast }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const { t } = useI18n();

  const {
    violations,
    submitReport,
    assignViolation,
    submitCorrectiveAction,
    verifyCorrectiveAction,
    triggerManualEscalation,
    resetDemoData,
    toggleOfflineMode,
    syncOfflineQueue,
    isOffline,
  } = useGovernance();

  // Scenario 1: Step 1 - Field Worker reports water accumulation near substation
  const handleStep1 = async () => {
    setActiveStep(1);
    const res = await submitReport({
      title: 'Water accumulation near electrical substation',
      category: 'Electrical Safety',
      description:
        'Severe underground water ingress rising within 1.5m of the 11kV transformer substation in Zone 4. High electrocution and equipment fire danger.',
      severity: 'CRITICAL',
      mineId: 'm1',
      zone: 'Zone 4 (Electrical Substations)',
      gps: '23.754N, 86.421E',
      contractorName: 'ABC Mining Services Ltd.',
      beforePhotoUrl:
        'https://images.unsplash.com/photo-1579226905180-636b76d96082?auto=format&fit=crop&w=400&q=80',
    });

    onShowToast(
      `Step 1 Complete: Hazard reported in Zone 4! AI Risk Score: ${res.riskAssessment?.score || 87} (CRITICAL).`,
      'warning'
    );
    onNavigateTab('incidents');
  };

  // Scenario 1: Step 2 - Assign Corrective Officer with 24h SLA
  const handleStep2 = () => {
    const target = violations.find(
      (v) => v.title.includes('Water accumulation') && v.status === 'OPEN'
    );
    if (!target) {
      onShowToast('Please trigger Step 1 first to create the open hazard.', 'error');
      return;
    }
    setActiveStep(2);
    const deadline = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    assignViolation(target.id, 'Rahul Verma', deadline);
    onShowToast('Step 2 Complete: Task assigned to Rahul Verma with 24-hour statutory SLA.', 'success');
    onNavigateTab('corrective');
  };

  // Scenario 1: Step 3 - Submit Action Proof Photo & Log
  const handleStep3 = () => {
    const target = violations.find(
      (v) => v.title.includes('Water accumulation') && v.status === 'ASSIGNED'
    );
    if (!target) {
      onShowToast('Violation must be in ASSIGNED status (complete Step 2 first).', 'error');
      return;
    }
    setActiveStep(3);
    submitCorrectiveAction(
      target.id,
      'High-capacity submersible dewatering pump installed. Water drained, sump drainage channel cleared, and flameproof electrical switchgear pressure-tested.',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80',
      'All moisture cleared. Megger insulation resistance test reads 100MΩ.'
    );
    onShowToast('Step 3 Complete: Corrective repair proof & photo submitted. Verification pending.', 'success');
    onNavigateTab('corrective');
  };

  // Scenario 1: Step 4 - Inspector Rejects for Rework
  const handleStep4 = () => {
    const target = violations.find(
      (v) => v.title.includes('Water accumulation') && v.status === 'ACTION_SUBMITTED'
    );
    if (!target) {
      onShowToast('Action must be in ACTION_SUBMITTED status (complete Step 3 first).', 'error');
      return;
    }
    setActiveStep(4);
    verifyCorrectiveAction(
      target.id,
      false,
      'Thermal imaging still detects residual dampness along cable trench conduits. Re-routing of auxiliary sump discharge required.'
    );
    onShowToast('Step 4: Inspector REJECTED action for rework. Risk score remains high.', 'warning');
    onNavigateTab('corrective');
  };

  // Scenario 1: Step 5 - Resubmit and Approve Closure
  const handleStep5 = () => {
    const target = violations.find(
      (v) => v.title.includes('Water accumulation') && (v.status === 'REWORK_REQUIRED' || v.status === 'ACTION_SUBMITTED')
    );
    if (!target) {
      onShowToast('Violation must be in REWORK_REQUIRED or ACTION_SUBMITTED status.', 'error');
      return;
    }
    setActiveStep(5);
    // Submit final proof
    submitCorrectiveAction(
      target.id,
      'Auxiliary sump discharge line rerouted 15m away from cable trench. Complete moisture barrier installed.',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80',
      'Secondary verification confirms 100% dry trench and normal insulator resistance.'
    );
    // Approve
    setTimeout(() => {
      verifyCorrectiveAction(target.id, true, 'Inspected and certified compliant under CMR 2017.');
      onShowToast('Step 5: Inspector APPROVED closure! Risk cleared and transaction anchored to Blockchain.', 'success');
      onNavigateTab('audit-trail');
    }, 400);
  };

  // Hindi Voice Simulation
  const handleSimulateHindiVoice = () => {
    onShowToast('Voice Speech (Hindi): "मशीन के पास पानी जमा है और बिजली का तार खुला हुआ है।" Transcribed.', 'success');
    submitReport({
      title: 'Water accumulation & exposed cable near machinery',
      category: 'Electrical Safety',
      description: 'Transcribed from Hindi voice input: मशीन के पास पानी जमा है और बिजली का तार खुला हुआ है। (Water logged with exposed cabling).',
      severity: 'CRITICAL',
      mineId: 'm1',
      zone: 'Zone 4 (Electrical Substations)',
      gps: '23.754N, 86.421E',
    });
    onNavigateTab('incidents');
  };

  // SLA Escalation
  const handleSimulateSlaBreach = () => {
    const criticalV = violations.find((v) => v.status !== 'CLOSED' && v.severity === 'CRITICAL');
    if (criticalV) {
      triggerManualEscalation(criticalV.id);
      onShowToast(`Violation ${criticalV.id} escalated to next hierarchical tier due to SLA breach!`, 'warning');
      onNavigateTab('incidents');
    } else {
      onShowToast('No active critical violations available to escalate.', 'error');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Minimized Pill Toggle */}
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white rounded-full shadow-2xl font-bold text-xs border border-sky-400/30 transition transform hover:scale-105"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{t('demo_title', 'SIH Sandbox Demo Controls')}</span>
          <ChevronUp className="w-4 h-4" />
        </button>
      ) : (
        /* Expanded Control Panel */
        <div className="w-96 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl p-4 text-white text-xs space-y-3 relative backdrop-blur-md">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="font-extrabold text-sm tracking-tight text-white">
                {t('demo_title', 'SIH Demo Scenario Controller')}
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-850"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[11px] text-slate-400">
            Execute the complete closed-loop critical risk scenario step-by-step for evaluators:
          </p>

          {/* Scenario 1: Closed-Loop Steps */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block">
              Scenario: Closed-Loop Critical Hazard Lifecycle
            </span>

            <button
              onClick={handleStep1}
              className={`w-full text-left p-2 rounded-lg border transition flex items-center justify-between ${
                activeStep === 1
                  ? 'bg-sky-500/20 border-sky-400 text-white font-semibold'
                  : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-300'
              }`}
            >
              <span className="flex items-center">
                <AlertOctagon className="w-3.5 h-3.5 text-red-400 mr-2 shrink-0" />
                {t('demo_scenario_1', '1. Report Critical Hazard (Zone 4)')}
              </span>
              <Play className="w-3 h-3 text-sky-400" />
            </button>

            <button
              onClick={handleStep2}
              className={`w-full text-left p-2 rounded-lg border transition flex items-center justify-between ${
                activeStep === 2
                  ? 'bg-sky-500/20 border-sky-400 text-white font-semibold'
                  : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-300'
              }`}
            >
              <span className="flex items-center">
                <Play className="w-3.5 h-3.5 text-blue-400 mr-2 shrink-0" />
                {t('demo_scenario_2', '2. Assign Rahul Verma (24h SLA)')}
              </span>
              <Play className="w-3 h-3 text-sky-400" />
            </button>

            <button
              onClick={handleStep3}
              className={`w-full text-left p-2 rounded-lg border transition flex items-center justify-between ${
                activeStep === 3
                  ? 'bg-sky-500/20 border-sky-400 text-white font-semibold'
                  : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-300'
              }`}
            >
              <span className="flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 mr-2 shrink-0" />
                {t('demo_scenario_3', '3. Submit Action Proof & Photo')}
              </span>
              <Play className="w-3 h-3 text-sky-400" />
            </button>

            <button
              onClick={handleStep4}
              className={`w-full text-left p-2 rounded-lg border transition flex items-center justify-between ${
                activeStep === 4
                  ? 'bg-sky-500/20 border-sky-400 text-white font-semibold'
                  : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-300'
              }`}
            >
              <span className="flex items-center">
                <XCircle className="w-3.5 h-3.5 text-rose-400 mr-2 shrink-0" />
                {t('demo_scenario_4', '4. Inspector Rejects (Demand Rework)')}
              </span>
              <Play className="w-3 h-3 text-sky-400" />
            </button>

            <button
              onClick={handleStep5}
              className={`w-full text-left p-2 rounded-lg border transition flex items-center justify-between ${
                activeStep === 5
                  ? 'bg-sky-500/20 border-sky-400 text-white font-semibold'
                  : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-300'
              }`}
            >
              <span className="flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mr-2 shrink-0" />
                {t('demo_scenario_6', '5. Resubmit, Approve & Anchor Blockchain')}
              </span>
              <Play className="w-3 h-3 text-sky-400" />
            </button>
          </div>

          {/* Quick Simulation Features */}
          <div className="pt-2 border-t border-slate-800 space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Additional Evaluator Demos
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleSimulateHindiVoice}
                className="p-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg text-left flex items-center space-x-1.5"
              >
                <Mic className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-[11px]">Hindi Voice Sim</span>
              </button>

              <button
                onClick={handleSimulateSlaBreach}
                className="p-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg text-left flex items-center space-x-1.5"
              >
                <AlertOctagon className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <span className="text-[11px]">SLA Breach Alert</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={toggleOfflineMode}
                className={`p-2 rounded-lg text-left flex items-center space-x-1.5 border ${
                  isOffline
                    ? 'bg-red-500/20 text-red-300 border-red-500/40'
                    : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-300'
                }`}
              >
                {isOffline ? <WifiOff className="w-3.5 h-3.5 text-red-400" /> : <Wifi className="w-3.5 h-3.5 text-emerald-400" />}
                <span className="text-[11px]">{isOffline ? 'Go Online' : 'Go Offline'}</span>
              </button>

              <button
                onClick={async () => {
                  const synced = await syncOfflineQueue();
                  onShowToast(`Synced ${synced} offline queued records to central engine!`, 'success');
                }}
                className="p-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg text-left flex items-center space-x-1.5"
              >
                <Wifi className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span className="text-[11px]">Sync Local Queue</span>
              </button>
            </div>

            <button
              onClick={() => {
                resetDemoData();
                setActiveStep(0);
                onShowToast('Demo data reset to fresh baseline seed state.', 'success');
              }}
              className="w-full mt-1 p-2 bg-rose-950/50 hover:bg-rose-900/50 border border-rose-900 text-rose-300 rounded-lg text-center font-semibold text-[11px] flex items-center justify-center space-x-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Database to Baseline</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
