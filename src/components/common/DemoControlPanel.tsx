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
  ChevronDown,
  ChevronUp,
  Truck,
  Mountain,
  Wrench,
  Radio,
  FileCheck2,
  Shield
} from 'lucide-react';
import { SEED_USERS } from '../../data/seedData';

interface DemoControlPanelProps {
  onNavigateTab: (tab: string) => void;
  onShowToast: (msg: string, type?: 'success' | 'warning' | 'error') => void;
}

export const DemoControlPanel: React.FC<DemoControlPanelProps> = ({ onNavigateTab, onShowToast }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [activeScenarioTab, setActiveScenarioTab] = useState<'scenarios' | 'roles' | 'quick'>('scenarios');
  const { t } = useI18n();

  const {
    violations,
    coalMovements,
    recordWeighbridgeReceipt,
    submitReport,
    assignViolation,
    submitCorrectiveAction,
    verifyCorrectiveAction,
    triggerManualEscalation,
    resetDemoData,
    toggleOfflineMode,
    syncOfflineQueue,
    isOffline,
    currentUser,
    quickSwitchUser,
    reportHemmBreakdown,
    complianceItems,
    addEnvironmentalReading,
    updateComplianceStatus,
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
    submitCorrectiveAction(
      target.id,
      'Auxiliary sump discharge line rerouted 15m away from cable trench. Complete moisture barrier installed.',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80',
      'Secondary verification confirms 100% dry trench and normal insulator resistance.'
    );
    setTimeout(() => {
      verifyCorrectiveAction(target.id, true, 'Inspected and certified compliant under CMR 2017.');
      onShowToast('Step 5: Inspector APPROVED closure! Risk cleared and transaction anchored to Blockchain.', 'success');
      onNavigateTab('audit-trail');
    }, 400);
  };

  // SCENARIO 2: Transport Loss (1000T Dispatch → 970T Receipt = 30T Discrepancy & CAPA)
  const handleScenario2 = () => {
    let target = coalMovements.find((m) => m.id === 'CM-2026-1013');
    if (!target) {
      target = coalMovements.find((m) => m.status === 'IN_TRANSIT' || m.status === 'DISPATCHED');
    }
    if (target) {
      const tare = target.dispatchedTareTonnes;
      const receivedGross = tare + 970.0;
      recordWeighbridgeReceipt(
        target.id,
        receivedGross,
        tare,
        false,
        'Statutory Siding Discrepancy: En-route Shortage of 30.00 MT (1000T Dispatched → 970T Received). Electronic seal tampered.'
      );
      onShowToast(
        `Scenario 2 Complete: 1000T Dispatched → 970T Received (-30 MT Variance). Critical CAPA & Audit Flagged!`,
        'warning'
      );
      onNavigateTab('transportation-reconciliation');
    } else {
      onShowToast('No active movement available. Please reset demo data to reload CM-2026-1013.', 'error');
    }
  };

  // SCENARIO 3: Worker Shift Overlap & 8h Daily Limit Conflict
  const handleScenario3 = () => {
    onShowToast(
      'Scenario 3: Worker w9 (Ganesh Kewat) 8.0h limit reached; Worker w5 cross-mine assignment blocked under CMR 2017 & Mines Act Sec 33.',
      'error'
    );
    onNavigateTab('workforce');
  };

  // SCENARIO 4: Vehicle Maintenance Dispatch Lock
  const handleScenario4 = () => {
    onShowToast(
      'Scenario 4: Vehicle V-305 is in Workshop Maintenance. Siding Dispatch Wizard deterministically blocks haulage clearance.',
      'warning'
    );
    onNavigateTab('transportation-maintenance');
  };

  // SCENARIO 5: Expired Driver Commercial License
  const handleScenario5 = () => {
    onShowToast(
      'Scenario 5: Driver D-508 (Shyamal Murmu) Commercial Heavy Vehicle License is Expired. Statutory assignment blocked.',
      'error'
    );
    onNavigateTab('transportation-drivers');
  };

  // SCENARIO 6: Environmental Sensor Anomaly Spike
  const handleScenario6 = () => {
    addEnvironmentalReading('m1', 'Methane Level (CH4)', 1.85);
    onShowToast(
      'Scenario 6 Complete: Methane CH4 spiked to 1.85% (Statutory Ceiling: 1.25%)! Environmental Task & Alert triggered.',
      'error'
    );
    onNavigateTab('environment');
  };

  // SCENARIO 7: HEMM Dump Truck Overheat & Work Order
  const handleScenario7 = () => {
    reportHemmBreakdown({
      assetId: 'HEMM-104',
      assetName: 'Dump Truck HT-04',
      assetType: 'Rear Dump Truck (100T)',
      mineId: 'm1',
      reportedAt: new Date().toISOString().split('T')[0],
      location: 'Haul Road Incline Ramp 3',
      operatorName: 'Someshwar Roy',
      failureCategory: 'ENGINE_OVERHEAT',
      description: 'Coolant temperature spiked to 108°C; auxiliary radiator fan relay faulted during loaded climb',
      severity: 'HIGH',
      downtimeHours: 0,
      assignedTechnician: 'Rameshwar Tudu',
    });
    onShowToast('Scenario 7: Dump Truck HT-04 engine overheat breakdown logged; Work order & technician assigned.', 'warning');
    onNavigateTab('hemm-assets');
  };

  // SCENARIO 8: Overdue Statutory Compliance Mandate
  const handleScenario8 = () => {
    const comp = complianceItems.find((c) => c.status !== 'Compliant') || complianceItems[0];
    if (comp) {
      updateComplianceStatus(comp.id, 'Violation');
      onShowToast(
        `Scenario 8 Complete: Mandate "${comp.requirement.substring(0, 32)}..." marked Violation! Automated CAPA generated.`,
        'warning'
      );
      onNavigateTab('compliance');
    }
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
          <span>{t('demo_title', 'SIH Demo Controls & Scenarios')}</span>
          <ChevronUp className="w-4 h-4" />
        </button>
      ) : (
        /* Expanded Control Panel */
        <div className="w-[420px] max-h-[85vh] overflow-y-auto bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl p-4 text-white text-xs space-y-3 relative backdrop-blur-md">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="font-extrabold text-sm tracking-tight text-white">
                CoalTech Evaluator Showcase & Control Panel
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-850"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Sub-tabs */}
          <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setActiveScenarioTab('scenarios')}
              className={`flex-1 py-1 text-center rounded-md font-medium text-[11px] transition ${
                activeScenarioTab === 'scenarios' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              8 Scenarios
            </button>
            <button
              onClick={() => setActiveScenarioTab('roles')}
              className={`flex-1 py-1 text-center rounded-md font-medium text-[11px] transition ${
                activeScenarioTab === 'roles' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Role Switch (RBAC)
            </button>
            <button
              onClick={() => setActiveScenarioTab('quick')}
              className={`flex-1 py-1 text-center rounded-md font-medium text-[11px] transition ${
                activeScenarioTab === 'quick' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Statutory Tests
            </button>
          </div>

          {/* Tab 1: 8 Canonical Scenarios */}
          {activeScenarioTab === 'scenarios' && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block">
                Canonical Evaluator Scenarios (1-Click Run)
              </span>

              {/* Scenario 1 dropdown or step by step */}
              <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg space-y-1.5">
                <span className="text-[11px] font-bold text-amber-300 flex items-center justify-between">
                  <span>Scenario 1: Closed-Loop Hazard (Zone 4)</span>
                  <span className="text-[10px] font-mono text-slate-400">Step {activeStep}/5</span>
                </span>
                <div className="grid grid-cols-5 gap-1">
                  <button
                    onClick={handleStep1}
                    className={`py-1 text-[10px] font-bold rounded border ${
                      activeStep === 1 ? 'bg-sky-600 text-white border-sky-400' : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    1. Log
                  </button>
                  <button
                    onClick={handleStep2}
                    className={`py-1 text-[10px] font-bold rounded border ${
                      activeStep === 2 ? 'bg-sky-600 text-white border-sky-400' : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    2. Assign
                  </button>
                  <button
                    onClick={handleStep3}
                    className={`py-1 text-[10px] font-bold rounded border ${
                      activeStep === 3 ? 'bg-sky-600 text-white border-sky-400' : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    3. Proof
                  </button>
                  <button
                    onClick={handleStep4}
                    className={`py-1 text-[10px] font-bold rounded border ${
                      activeStep === 4 ? 'bg-rose-600 text-white border-rose-400' : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    4. Rework
                  </button>
                  <button
                    onClick={handleStep5}
                    className={`py-1 text-[10px] font-bold rounded border ${
                      activeStep === 5 ? 'bg-emerald-600 text-white border-emerald-400' : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    5. Close
                  </button>
                </div>
              </div>

              {/* Scenarios 2 to 8 */}
              <button
                onClick={handleScenario2}
                className="w-full text-left p-2 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 flex items-center justify-between transition"
              >
                <span className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span className="text-[11px] font-semibold">2. Transport Loss: 1000T → 970T (30T Variance)</span>
                </span>
                <Play className="w-3 h-3 text-sky-400" />
              </button>

              <button
                onClick={handleScenario3}
                className="w-full text-left p-2 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 flex items-center justify-between transition"
              >
                <span className="flex items-center gap-2">
                  <Mountain className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="text-[11px] font-semibold">3. Worker Conflict: 8h Limit & Cross-Mine Overlap</span>
                </span>
                <Play className="w-3 h-3 text-sky-400" />
              </button>

              <button
                onClick={handleScenario4}
                className="w-full text-left p-2 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 flex items-center justify-between transition"
              >
                <span className="flex items-center gap-2">
                  <Wrench className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span className="text-[11px] font-semibold">4. Vehicle Maintenance Lock: V-305 Siding Block</span>
                </span>
                <Play className="w-3 h-3 text-sky-400" />
              </button>

              <button
                onClick={handleScenario5}
                className="w-full text-left p-2 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 flex items-center justify-between transition"
              >
                <span className="flex items-center gap-2">
                  <AlertOctagon className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                  <span className="text-[11px] font-semibold">5. Expired Driver License: D-508 Haulage Block</span>
                </span>
                <Play className="w-3 h-3 text-sky-400" />
              </button>

              <button
                onClick={handleScenario6}
                className="w-full text-left p-2 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 flex items-center justify-between transition"
              >
                <span className="flex items-center gap-2">
                  <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse shrink-0" />
                  <span className="text-[11px] font-semibold">6. Environmental Anomaly: CH4 Methane 1.85% Spike</span>
                </span>
                <Play className="w-3 h-3 text-sky-400" />
              </button>

              <button
                onClick={handleScenario7}
                className="w-full text-left p-2 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 flex items-center justify-between transition"
              >
                <span className="flex items-center gap-2">
                  <Wrench className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="text-[11px] font-semibold">7. Equipment Breakdown: HT-04 Dump Truck Overheat</span>
                </span>
                <Play className="w-3 h-3 text-sky-400" />
              </button>

              <button
                onClick={handleScenario8}
                className="w-full text-left p-2 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 flex items-center justify-between transition"
              >
                <span className="flex items-center gap-2">
                  <FileCheck2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span className="text-[11px] font-semibold">8. Overdue Statutory Compliance & Automated CAPA</span>
                </span>
                <Play className="w-3 h-3 text-sky-400" />
              </button>
            </div>
          )}

          {/* Tab 2: 1-Click Role Switcher */}
          {activeScenarioTab === 'roles' && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block">
                Instant RBAC Profile Switcher
              </span>
              <p className="text-[11px] text-slate-400">
                Click any persona to instantly test sidebar scoping, permissions, and role guards:
              </p>

              <div className="grid grid-cols-2 gap-1.5 max-h-60 overflow-y-auto">
                {SEED_USERS.map((u) => {
                  const isCurrent = currentUser?.id === u.id;
                  return (
                    <button
                      key={u.id}
                      onClick={() => {
                        quickSwitchUser(u);
                        onShowToast(`Switched user to ${u.name} (${u.role})`, 'success');
                      }}
                      className={`p-2 rounded-lg text-left border transition ${
                        isCurrent
                          ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-semibold'
                          : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="text-[11px] font-bold truncate flex items-center gap-1">
                        <Shield className="w-3 h-3 shrink-0" />
                        <span className="truncate">{u.name}</span>
                      </div>
                      <div className="text-[9px] text-slate-400 truncate">{u.role}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 3: Quick Statutory DGMS Tests */}
          {activeScenarioTab === 'quick' && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                Statutory DGMS Rule Conflict Tests
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

              <button
                onClick={() => {
                  onShowToast(
                    'Driver D-508 (Shyamal Murmu): Commercial License Expired! Dispatch Wizard will strictly reject assignment.',
                    'error'
                  );
                  onNavigateTab('transportation');
                }}
                className="w-full p-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg text-left"
              >
                <span className="text-[11px] font-semibold text-rose-400 block">Driver License Expired</span>
                <span className="text-[9px] text-slate-400 block">D-508 (Shyamal M. - Commercial DL Expired)</span>
              </button>

              <button
                onClick={() => {
                  onShowToast(
                    'Worker w9 (Ganesh Kewat): 8.0h / 8.0h Daily Limit Reached! Shift blocked under CMR 2017 & Mines Act Sec 33 without Manager Authorization.',
                    'error'
                  );
                  onNavigateTab('workforce');
                }}
                className="w-full p-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg text-left"
              >
                <span className="text-[11px] font-semibold text-amber-400 block">Worker 8h OT Limit</span>
                <span className="text-[9px] text-slate-400 block">w9 (Ganesh Kewat - 8h Statutory Limit Reached)</span>
              </button>

              <button
                onClick={() => {
                  onShowToast(
                    'Vehicle V-305 (MP-66-DK-9021): Workshop Maintenance Lock! Dispatch Wizard strictly blocks allocation.',
                    'error'
                  );
                  onNavigateTab('transportation');
                }}
                className="w-full p-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg text-left flex items-center justify-between"
              >
                <div>
                  <span className="text-[11px] font-semibold text-amber-400 block">Maintenance Vehicle Dispatch Lock</span>
                  <span className="text-[9px] text-slate-400 block">V-305 (MP-66-DK-9021 in Workshop Maintenance)</span>
                </div>
                <Play className="w-3 h-3 text-amber-400" />
              </button>

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
            </div>
          )}

          {/* Reset Baseline */}
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
      )}
    </div>
  );
};
