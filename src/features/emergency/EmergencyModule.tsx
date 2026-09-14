import React, { useState } from 'react';
import {
  AlertTriangle,
  Flame,
  Users,
  Radio,
  Clock,
  CheckCircle2,
  XCircle,
  PhoneCall,
  Activity,
  Layers,
  ChevronRight,
  Plus,
  Compass
} from 'lucide-react';
import { useGovernance } from '../../context/GovernanceContext';
import type { RootCauseAnalysisRecord } from '../../types';

export const EmergencyModule: React.FC = () => {
  const {
    emergencyCommand,
    emergencyDrills,
    rootCauseAnalyses,
    triggerEmergencySiren,
    updateMusterRollCall,
    saveRootCauseAnalysis,
    mines,
    currentUser
  } = useGovernance();

  const [activeTab, setActiveTab] = useState<'command' | 'muster' | 'drills' | 'rca' | 'sos'>('command');

  // Siren Trigger Form
  const [showSirenModal, setShowSirenModal] = useState(false);
  const [incidentType, setIncidentType] = useState('SLOPE_FAILURE');
  const [affectedZone, setAffectedZone] = useState('Bench B3 - South Pit Face');
  const [sopAction, setSopAction] = useState('Sound General Mine Evacuation Siren; Halt all conveyor belts and haul traffic; Direct personnel to Assembly Point #3.');

  // Roll call local filter / unconfirmed workers mock list
  const [unconfirmedRoster, setUnconfirmedRoster] = useState([
    { id: 'W-082', name: 'Rameshwar Mahato', designation: 'Shovel Operator', lastZone: 'Bench B3 - South Face', phone: '+91 98320 41289' },
    { id: 'W-104', name: 'Birendra Hansda', designation: 'Drill Rig Helper', lastZone: 'Blast Zone East', phone: '+91 94311 88421' },
    { id: 'W-145', name: 'Suraj Kumar Singh', designation: 'Haulage Driver', lastZone: 'Haul Road Ramp 2', phone: '+91 98351 09243' },
    { id: 'W-162', name: 'Gautam Soren', designation: 'Conveyor Attendant', lastZone: 'Siding Transfer Tower 2', phone: '+91 91223 76540' },
    { id: 'W-178', name: 'Mohan Lal Verma', designation: 'Pumping Station Technician', lastZone: 'Sump Basin Floor', phone: '+91 98012 34567' },
    { id: 'W-191', name: 'Anil Tudu', designation: 'Blaster Assistant', lastZone: 'Explosives Magazine Outskirts', phone: '+91 94301 22987' },
    { id: 'W-203', name: 'Dharmendra Paswan', designation: 'Electrician (Pit Substation)', lastZone: 'Substation #4', phone: '+91 91228 43210' }
  ]);

  // RCA interactive creation
  const [selectedRca, setSelectedRca] = useState<RootCauseAnalysisRecord | null>(rootCauseAnalyses[0] || null);
  const [showNewRcaModal, setShowNewRcaModal] = useState(false);
  const [newRcaForm, setNewRcaForm] = useState({
    issueTitle: 'Spontaneous Bench Slope Slump at Pit C-2',
    mineId: mines[0]?.id || 'MINE-001',
    why1: 'Tension crack propagated 14 meters along crest',
    why2: 'Sub-surface hydrostatic head increased during heavy monsoon rainfall',
    why3: 'Sub-bench horizontal drainage holes were clogged with fine silt',
    why4: 'Routine desiltation was deferred due to priority overburden stripping targets',
    why5: 'Geotechnical slope maintenance schedule was not dynamically coupled with rainfall radar thresholds',
    immediateCause: 'Hydrostatic pore-water pressure exceeding shear strength along weak shale bedding plane.',
    underlyingCause: 'Inadequate preventive maintenance of sub-horizontal depressurization drains during peak monsoon.',
    rootCauseSummary: 'Absence of automated rainfall-to-piezometer drainage maintenance trigger protocols under DGMS monsoon circular.',
    preventiveActionPlan: 'Install vibrating wire piezometers linked to SCADA; Mandate weekly bore jetting whenever cumulative rainfall exceeds 50mm in 48h.',
    machinery: 'High pressure hydro-jetting rig required for drain unclogging',
    methods: 'Geotechnical monitoring SOP revised to include pore-pressure thresholds',
    workforce: 'Depute dedicated drainage crew during June-September monsoon period',
    environment: 'High intensity monsoon runoff (114mm/24h)',
    management: 'Production pressure prioritizing overburden removal over drainage upkeep'
  });

  const handleTriggerSiren = (e: React.FormEvent) => {
    e.preventDefault();
    triggerEmergencySiren(emergencyCommand?.mineId || mines[0]?.id || 'm1', incidentType as any);
    setShowSirenModal(false);
  };

  const handleMarkSafe = (workerId: string) => {
    setUnconfirmedRoster(prev => prev.filter(w => w.id !== workerId));
    if (emergencyCommand) {
      updateMusterRollCall(emergencyCommand.mineId, 1);
    }
  };

  const handleCreateRca = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: RootCauseAnalysisRecord = {
      id: `RCA-${Date.now()}`,
      issueId: `INC-${Math.floor(1000 + Math.random() * 9000)}`,
      issueTitle: newRcaForm.issueTitle,
      mineId: newRcaForm.mineId,
      methodology: '5_WHY',
      whys: [
        newRcaForm.why1,
        newRcaForm.why2,
        newRcaForm.why3,
        newRcaForm.why4,
        newRcaForm.why5
      ],
      fishboneCategories: {
        machinery: newRcaForm.machinery,
        methods: newRcaForm.methods,
        workforce: newRcaForm.workforce,
        environment: newRcaForm.environment,
        management: newRcaForm.management
      },
      immediateCause: newRcaForm.immediateCause,
      underlyingCause: newRcaForm.underlyingCause,
      rootCauseSummary: newRcaForm.rootCauseSummary,
      preventiveActionPlan: newRcaForm.preventiveActionPlan,
      investigatorName: currentUser?.name || 'Lead Investigator',
      date: new Date().toISOString().split('T')[0],
      recurringPatternDetected: false
    };
    saveRootCauseAnalysis(newRecord);
    setSelectedRca(newRecord);
    setShowNewRcaModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg">
                <Radio className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-white tracking-tight">
                    Mine Emergency Command, Muster & Investigation Hub
                  </h1>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800/60 font-semibold">
                    DGMS Section 22 / EPRP Ready
                  </span>
                </div>
                <p className="text-sm text-slate-400 mt-0.5">
                  Real-time siren activation, evacuation roll call accounting, mock drill benchmarking, and 5-Why root cause investigation.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {emergencyCommand?.sirenActivated ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-red-600/20 border border-red-500 text-red-300 rounded-lg animate-pulse font-medium text-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                ACTIVE SIREN: {emergencyCommand.emergencyType.replace('_', ' ')}
              </div>
            ) : (
              <button
                onClick={() => setShowSirenModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm transition font-medium text-sm"
              >
                <Flame className="w-4 h-4" />
                Trigger Emergency Protocol
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 mt-6 -mb-6">
          <button
            onClick={() => setActiveTab('command')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition flex items-center gap-2 ${
              activeTab === 'command'
                ? 'border-red-500 text-red-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className="w-4 h-4" />
            Command Center
          </button>
          <button
            onClick={() => setActiveTab('muster')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition flex items-center gap-2 ${
              activeTab === 'muster'
                ? 'border-red-500 text-red-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            Muster Roll Call & Evacuation
            <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-red-900/60 text-red-300 border border-red-700/50">
              {unconfirmedRoster.length} Unconfirmed
            </span>
          </button>
          <button
            onClick={() => setActiveTab('drills')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition flex items-center gap-2 ${
              activeTab === 'drills'
                ? 'border-red-500 text-red-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            Mock Drills & SOPs
          </button>
          <button
            onClick={() => setActiveTab('rca')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition flex items-center gap-2 ${
              activeTab === 'rca'
                ? 'border-red-500 text-red-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            5-Why & Fishbone RCA
          </button>
          <button
            onClick={() => setActiveTab('sos')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition flex items-center gap-2 ${
              activeTab === 'sos'
                ? 'border-red-500 text-red-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <PhoneCall className="w-4 h-4" />
            SOS & Rescue Directory
          </button>
        </div>
      </div>

      {/* Tab 1: Emergency Command Center */}
      {activeTab === 'command' && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Command Status</div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">
                  {emergencyCommand?.status.replace('_', ' ') || 'STANDBY'}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-400">Commander: {emergencyCommand?.incidentCommander || 'Safety In-Charge'}</p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Muster Accountability</div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-emerald-400">
                  {emergencyCommand ? Math.round((emergencyCommand.accountedWorkers / emergencyCommand.totalWorkersOnSite) * 100) : 96}%
                </span>
                <span className="text-xs text-slate-400">
                  ({emergencyCommand?.accountedWorkers || 179}/{emergencyCommand?.totalWorkersOnSite || 186} workers)
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
                <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '96.2%' }} />
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Unconfirmed Missing</div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-red-400">
                  {unconfirmedRoster.length}
                </span>
                <span className="text-xs text-red-400/80">Pending roll call sign-off</span>
              </div>
              <p className="mt-1 text-xs text-slate-400">Target safe muster: Point #3</p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Statutory Notifications</div>
              <div className="mt-2 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">DGMS Zonal Alert:</span>
                  <span className="text-emerald-400 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Transmitted
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Mine Rescue Station:</span>
                  <span className="text-emerald-400 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Deployed
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Current Incident Timeline & SOP card */}
          {emergencyCommand && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  Active Incident Profile: {emergencyCommand.emergencyType.replace('_', ' ')}
                </h3>
                <span className="px-2.5 py-1 text-xs rounded-full bg-red-500/20 text-red-300 font-medium border border-red-500/30">
                  Severity: {emergencyCommand.severity}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-950/60 p-4 rounded-lg border border-slate-800/80">
                <div>
                  <div className="text-xs text-slate-400">Incident Location:</div>
                  <div className="text-sm font-semibold text-white mt-0.5">{emergencyCommand.incidentLocation}</div>
                  <div className="text-xs text-slate-400 mt-2">Reported At:</div>
                  <div className="text-sm text-slate-300 font-mono mt-0.5">{emergencyCommand.reportedAt}</div>
                </div>

                <div>
                  <div className="text-xs text-slate-400">Designated Assembly Zone:</div>
                  <div className="text-sm font-semibold text-emerald-400 mt-0.5">{emergencyCommand.musterZoneSafe}</div>
                  <div className="text-xs text-slate-400 mt-2">Incident Commander:</div>
                  <div className="text-sm text-slate-300 mt-0.5">{emergencyCommand.incidentCommander}</div>
                </div>

                <div>
                  <div className="text-xs text-slate-400">Statutory Action Checklist:</div>
                  <ul className="mt-1 space-y-1 text-xs text-slate-300">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Automated Mine Siren Tripped
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Haulage Belt Power Tripped
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Medical Ambulance Staged at Gate 2
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Rescue Team Breathing Apparatus Checked
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Emergency Protocols SOP Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-base font-semibold text-white mb-4">
              Pre-Configured Emergency Response Plans (ERPs)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-xs">
                    <th className="pb-3 font-semibold">Incident Code</th>
                    <th className="pb-3 font-semibold">Emergency Scenario</th>
                    <th className="pb-3 font-semibold">DGMS Guideline</th>
                    <th className="pb-3 font-semibold">Automatic Interlock Action</th>
                    <th className="pb-3 font-semibold">Evacuation Target</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300 text-xs">
                  <tr>
                    <td className="py-3 font-mono font-semibold text-red-400">ERP-01</td>
                    <td className="py-3 font-medium text-white">Pit Slope Failure / Rockslide</td>
                    <td className="py-3 text-slate-400">DGMS Tech Cir (Tech) 03/2020</td>
                    <td className="py-3 text-slate-300">Geotech radar alarm, trip shovel power</td>
                    <td className="py-3 text-emerald-400">Assembly Ridge #1 (5 mins)</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-mono font-semibold text-red-400">ERP-02</td>
                    <td className="py-3 font-medium text-white">Underground Inundation / Water Inrush</td>
                    <td className="py-3 text-slate-400">CMR 2017 Reg 149</td>
                    <td className="py-3 text-slate-300">Start emergency dewatering pumps, cage recall</td>
                    <td className="py-3 text-emerald-400">Pit Bottom Shaft Incline (8 mins)</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-mono font-semibold text-red-400">ERP-03</td>
                    <td className="py-3 font-medium text-white">Overland Conveyor Fire</td>
                    <td className="py-3 text-slate-400">CMR 2017 Reg 139</td>
                    <td className="py-3 text-slate-300">Trip conveyor drive, activate deluge foam</td>
                    <td className="py-3 text-emerald-400">Transfer Siding Yard (4 mins)</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-mono font-semibold text-red-400">ERP-04</td>
                    <td className="py-3 font-medium text-white">Methane Gas Spike (&gt;1.25%)</td>
                    <td className="py-3 text-slate-400">CMR 2017 Reg 169</td>
                    <td className="py-3 text-slate-300">Main electrical power cut, boost intake fan</td>
                    <td className="py-3 text-emerald-400">Main Intake Drift (6 mins)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Muster Roll Call */}
      {activeTab === 'muster' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-semibold text-white">
                  Real-Time Personnel Evacuation & Muster Accounting
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  RFID badge gates cross-referenced with shift biometric roster at designated assembly points.
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div className="px-3 py-1.5 bg-emerald-950/60 border border-emerald-800/80 rounded-lg text-emerald-300">
                  Accounted: <span className="font-bold text-emerald-200">179</span>
                </div>
                <div className="px-3 py-1.5 bg-red-950/60 border border-red-800/80 rounded-lg text-red-300">
                  Unconfirmed: <span className="font-bold text-red-200">{unconfirmedRoster.length}</span>
                </div>
              </div>
            </div>

            {/* Unconfirmed Roster Table */}
            <div className="border border-slate-800 rounded-lg overflow-hidden">
              <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" /> Personnel Not Yet Accounted at Assembly Point
                </span>
                <span className="text-xs text-slate-400">Search and rescue teams dispatched to last known coordinates</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 text-xs bg-slate-900/60">
                      <th className="py-2.5 px-4 font-semibold">Worker ID</th>
                      <th className="py-2.5 px-4 font-semibold">Full Name</th>
                      <th className="py-2.5 px-4 font-semibold">Designation</th>
                      <th className="py-2.5 px-4 font-semibold">Last Known Working Zone</th>
                      <th className="py-2.5 px-4 font-semibold">Emergency Contact</th>
                      <th className="py-2.5 px-4 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300 text-xs">
                    {unconfirmedRoster.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-emerald-400">
                          <CheckCircle2 className="w-8 h-8 mx-auto mb-2 opacity-80" />
                          All personnel accounted for at designated safe assembly points!
                        </td>
                      </tr>
                    ) : (
                      unconfirmedRoster.map(w => (
                        <tr key={w.id} className="hover:bg-slate-800/40">
                          <td className="py-3 px-4 font-mono font-semibold text-slate-200">{w.id}</td>
                          <td className="py-3 px-4 font-medium text-white">{w.name}</td>
                          <td className="py-3 px-4 text-slate-300">{w.designation}</td>
                          <td className="py-3 px-4 text-amber-300 flex items-center gap-1.5">
                            <Compass className="w-3.5 h-3.5 text-amber-400" /> {w.lastZone}
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-400">{w.phone}</td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => handleMarkSafe(w.id)}
                              className="px-3 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 rounded transition font-medium text-xs inline-flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3 h-3" /> Mark Verified Safe
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Mock Drills */}
      {activeTab === 'drills' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-white">
                  Statutory Emergency Mock Drills (Quarterly DGMS Log)
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Benchmarking mine evacuation response times and addressing identified operational gaps.
                </p>
              </div>
              <button
                onClick={() => alert('New mock drill schedule wizard opened')}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Schedule Mock Drill
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {emergencyDrills.map(drill => (
                <div key={drill.id} className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-semibold text-blue-400">{drill.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      drill.actualResponseTimeSec <= drill.targetResponseTimeSec
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}>
                      Score: {drill.ratingScore}/100
                    </span>
                  </div>

                  <h4 className="text-sm font-semibold text-white mb-2">{drill.scenario}</h4>

                  <div className="space-y-1.5 text-xs text-slate-400 border-t border-b border-slate-800/80 py-2.5 my-2.5">
                    <div className="flex justify-between">
                      <span>Drill Date:</span>
                      <span className="text-slate-200">{drill.drillDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Participants:</span>
                      <span className="text-slate-200">{drill.participantsCount} Personnel</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Target vs Actual Time:</span>
                      <span className="font-mono text-slate-200">
                        {Math.floor(drill.targetResponseTimeSec / 60)}m : {Math.floor(drill.actualResponseTimeSec / 60)}m
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Evacuation Compliance:</span>
                      <span className="text-emerald-400 font-bold">{drill.evacuationComplianceRate}%</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">Identified Gaps:</div>
                    <ul className="text-xs text-slate-400 space-y-1 mb-2">
                      {drill.identifiedGaps.map((gap, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <XCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span>{gap}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="p-2 bg-slate-900 border border-slate-800 rounded text-[11px] text-slate-300">
                      <span className="text-blue-400 font-semibold">CAPA:</span> {drill.correctiveActionAssigned}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: 5-Why & Fishbone RCA */}
      {activeTab === 'rca' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-400" />
                  Incident Root Cause Analysis (5-Why & Ishikawa Fishbone)
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Structured forensic investigation determining immediate, underlying, and systemic root causes with corrective action planning.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowNewRcaModal(true)}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition"
                >
                  <Plus className="w-4 h-4" /> Start New RCA Investigation
                </button>
              </div>
            </div>

            {/* Existing RCAs selector */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {rootCauseAnalyses.map(rca => (
                <button
                  key={rca.id}
                  onClick={() => setSelectedRca(rca)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap border transition ${
                    selectedRca?.id === rca.id
                      ? 'bg-blue-600/20 text-blue-300 border-blue-500/50'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {rca.issueTitle}
                </button>
              ))}
            </div>

            {selectedRca && (
              <div className="space-y-6">
                {/* 5-Why Sequential Chain */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
                  <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 text-xs flex items-center justify-center font-bold">5</span>
                    The 5-Why Investigative Sequence
                  </h4>

                  <div className="space-y-3">
                    {selectedRca.whys.map((why, index) => (
                      <div key={index} className="flex items-start gap-3 bg-slate-900/70 p-3 rounded-lg border border-slate-800">
                        <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-bold text-xs">
                          Why #{index + 1}
                        </span>
                        <div className="text-xs text-slate-200 flex-1">{why}</div>
                        {index < 4 && <ChevronRight className="w-4 h-4 text-slate-500 mt-0.5" />}
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 p-3 bg-red-950/40 border border-red-800/60 rounded-lg">
                    <span className="text-xs font-bold text-red-300 uppercase tracking-wider">Root Cause Summary:</span>
                    <p className="text-xs text-slate-200 mt-1">{selectedRca.rootCauseSummary}</p>
                  </div>
                </div>

                {/* Fishbone (Ishikawa) Categories */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
                  <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-400" />
                    Ishikawa Fishbone Dimension Breakdown
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                      <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-1">Machinery</div>
                      <p className="text-xs text-slate-300">{selectedRca.fishboneCategories.machinery}</p>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                      <div className="text-[11px] font-bold text-blue-400 uppercase tracking-wider mb-1">Methods</div>
                      <p className="text-xs text-slate-300">{selectedRca.fishboneCategories.methods}</p>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                      <div className="text-[11px] font-bold text-purple-400 uppercase tracking-wider mb-1">Workforce</div>
                      <p className="text-xs text-slate-300">{selectedRca.fishboneCategories.workforce}</p>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                      <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-1">Environment</div>
                      <p className="text-xs text-slate-300">{selectedRca.fishboneCategories.environment}</p>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                      <div className="text-[11px] font-bold text-red-400 uppercase tracking-wider mb-1">Management</div>
                      <p className="text-xs text-slate-300">{selectedRca.fishboneCategories.management}</p>
                    </div>
                  </div>
                </div>

                {/* Preventive Action Plan */}
                <div className="bg-emerald-950/30 border border-emerald-800/60 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                        Mandated CAPA Preventive Action:
                      </span>
                      <p className="text-sm text-emerald-100 mt-1">{selectedRca.preventiveActionPlan}</p>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">
                      Lead Investigator: {selectedRca.investigatorName} | {selectedRca.date}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 5: SOS Directory */}
      {activeTab === 'sos' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-base font-semibold text-white mb-2">
              Mine Emergency SOS & Statutory Escalation Directory
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Instant hotline contacts for mine rescue stations, DGMS zonal inspectors, trauma hospitals, and district disaster management.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-white">Central Mine Rescue Station (CMRS)</h4>
                    <p className="text-xs text-slate-400">Dhanbad / Ramgarh Unit</p>
                  </div>
                  <span className="p-1.5 bg-red-500/10 text-red-400 rounded">
                    <PhoneCall className="w-4 h-4" />
                  </span>
                </div>
                <div className="mt-3 font-mono text-sm font-bold text-red-400">+91 326 220 3411</div>
                <p className="text-[11px] text-slate-400 mt-1">Deployment Readiness: 15 minutes</p>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-white">DGMS Zonal Inspector of Mines</h4>
                    <p className="text-xs text-slate-400">Eastern / Central Coalfields Zone</p>
                  </div>
                  <span className="p-1.5 bg-blue-500/10 text-blue-400 rounded">
                    <PhoneCall className="w-4 h-4" />
                  </span>
                </div>
                <div className="mt-3 font-mono text-sm font-bold text-blue-400">+91 326 222 1010</div>
                <p className="text-[11px] text-slate-400 mt-1">Direct Statutory Incident Hotline</p>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-white">District Disaster Mgmt Authority</h4>
                    <p className="text-xs text-slate-400">Collectorate Emergency Control Room</p>
                  </div>
                  <span className="p-1.5 bg-amber-500/10 text-amber-400 rounded">
                    <PhoneCall className="w-4 h-4" />
                  </span>
                </div>
                <div className="mt-3 font-mono text-sm font-bold text-amber-400">1077 / +91 651 240 0112</div>
                <p className="text-[11px] text-slate-400 mt-1">24x7 District Magistrate Dispatch</p>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-white">Central Hospital & Trauma ICU</h4>
                    <p className="text-xs text-slate-400">Mine Apex Specialty Hospital</p>
                  </div>
                  <span className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded">
                    <PhoneCall className="w-4 h-4" />
                  </span>
                </div>
                <div className="mt-3 font-mono text-sm font-bold text-emerald-400">+91 326 220 1199</div>
                <p className="text-[11px] text-slate-400 mt-1">4 Advanced Life Support Ambulances</p>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-white">Explosives Safety Officer (PESO)</h4>
                    <p className="text-xs text-slate-400">Deputy Chief Controller of Explosives</p>
                  </div>
                  <span className="p-1.5 bg-purple-500/10 text-purple-400 rounded">
                    <PhoneCall className="w-4 h-4" />
                  </span>
                </div>
                <div className="mt-3 font-mono text-sm font-bold text-purple-400">+91 326 230 4589</div>
                <p className="text-[11px] text-slate-400 mt-1">Magazine Emergency & Blast Control</p>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-white">State Industrial Security Force</h4>
                    <p className="text-xs text-slate-400">Mine Perimeter & Gate Control</p>
                  </div>
                  <span className="p-1.5 bg-slate-500/10 text-slate-300 rounded">
                    <PhoneCall className="w-4 h-4" />
                  </span>
                </div>
                <div className="mt-3 font-mono text-sm font-bold text-slate-300">+91 326 223 9081</div>
                <p className="text-[11px] text-slate-400 mt-1">Cordon & Traffic Diversion</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trigger Siren Modal */}
      {showSirenModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-red-500/50 rounded-xl p-6 max-w-lg w-full shadow-2xl">
            <div className="flex items-center gap-3 text-red-400 mb-4">
              <Flame className="w-6 h-6" />
              <h3 className="text-lg font-bold text-white">Trigger Mine Emergency Evacuation Protocol</h3>
            </div>
            <form onSubmit={handleTriggerSiren} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Emergency Incident Type</label>
                <select
                  value={incidentType}
                  onChange={e => setIncidentType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200"
                >
                  <option value="SLOPE_FAILURE">SLOPE FAILURE / ROCK MASS DISPLACEMENT</option>
                  <option value="UNDERGROUND_INUNDATION">UNDERGROUND INUNDATION / AQUIFER INRUSH</option>
                  <option value="HEMM_COLLISION">HEMM CRITICAL VEHICULAR COLLISION</option>
                  <option value="CONVEYOR_FIRE">CONVEYOR TRUNK FIRE</option>
                  <option value="METHANE_GAS_ACCUMULATION">METHANE GAS SPIKE (&gt;1.25%)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Affected Mine Zone / Bench</label>
                <input
                  type="text"
                  value={affectedZone}
                  onChange={e => setAffectedZone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Recommended Emergency SOP</label>
                <textarea
                  value={sopAction}
                  onChange={e => setSopAction(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200"
                  required
                />
              </div>

              <div className="p-3 bg-red-950/40 border border-red-800 rounded text-xs text-red-300 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  <strong>Statutory Notice:</strong> Activating the siren will trip haulage conveyors, sound visual alarms, broadcast SMS to mine workers, and register an emergency incident with DGMS.
                </span>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSirenModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg shadow flex items-center gap-1.5"
                >
                  <Radio className="w-3.5 h-3.5 animate-pulse" /> Confirm & Sound Emergency Siren
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New RCA Modal */}
      {showNewRcaModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Start 5-Why & Fishbone Forensic RCA</h3>
            <form onSubmit={handleCreateRca} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Incident Title</label>
                <input
                  type="text"
                  value={newRcaForm.issueTitle}
                  onChange={e => setNewRcaForm({ ...newRcaForm, issueTitle: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200"
                  required
                />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-blue-400">Sequential 5-Why Analysis:</span>
                <input
                  type="text"
                  placeholder="Why 1: Immediate symptom"
                  value={newRcaForm.why1}
                  onChange={e => setNewRcaForm({ ...newRcaForm, why1: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200"
                  required
                />
                <input
                  type="text"
                  placeholder="Why 2: Physical cause"
                  value={newRcaForm.why2}
                  onChange={e => setNewRcaForm({ ...newRcaForm, why2: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200"
                  required
                />
                <input
                  type="text"
                  placeholder="Why 3: Procedural gap"
                  value={newRcaForm.why3}
                  onChange={e => setNewRcaForm({ ...newRcaForm, why3: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200"
                  required
                />
                <input
                  type="text"
                  placeholder="Why 4: Management / Planning factor"
                  value={newRcaForm.why4}
                  onChange={e => setNewRcaForm({ ...newRcaForm, why4: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200"
                  required
                />
                <input
                  type="text"
                  placeholder="Why 5: Systemic root cause"
                  value={newRcaForm.why5}
                  onChange={e => setNewRcaForm({ ...newRcaForm, why5: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Systemic Root Cause Summary</label>
                <textarea
                  value={newRcaForm.rootCauseSummary}
                  onChange={e => setNewRcaForm({ ...newRcaForm, rootCauseSummary: e.target.value })}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Preventive Action Plan (CAPA)</label>
                <textarea
                  value={newRcaForm.preventiveActionPlan}
                  onChange={e => setNewRcaForm({ ...newRcaForm, preventiveActionPlan: e.target.value })}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewRcaModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg shadow"
                >
                  Save RCA Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
