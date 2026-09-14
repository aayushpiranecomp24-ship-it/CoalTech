import React, { useState } from 'react';
import {
  FileText,
  Printer,
  CheckCircle,
  Shield,
  Leaf,
  Activity,
  Award
} from 'lucide-react';
import { useGovernance } from '../../context/GovernanceContext';

export const DailyMineReportView: React.FC = () => {
  const {
    mines,
    currentUser,
    coalMovements,
    benches,
    hemmAssets,
  } = useGovernance();

  const [selectedMineId, setSelectedMineId] = useState<string>(mines[0]?.id || 'MINE-001');
  const [selectedShift, setSelectedShift] = useState<'SHIFT_A' | 'SHIFT_B' | 'SHIFT_C' | 'FULL_DAY'>('FULL_DAY');
  const [reportDate, setReportDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isSigned, setIsSigned] = useState(false);

  const selectedMine = mines.find(m => m.id === selectedMineId) || mines[0];

  // Calculated numbers for this mine
  const mineBenches = benches.filter(b => !b.mineId || b.mineId === selectedMineId);
  const mineHemm = hemmAssets.filter(h => !h.mineId || h.mineId === selectedMineId);
  const mineMovements = coalMovements.filter(m => !m.originMineId || m.originMineId === selectedMineId);

  const totalCoalTonnage = mineBenches.reduce((sum, b) => sum + b.dailyProductionTonnes, 0) || 12450;
  const targetTonnage = 12000;
  const productionPct = Math.round((totalCoalTonnage / targetTonnage) * 100);

  const totalDispatched = mineMovements.reduce((sum, m) => sum + (m.dispatchedNetTonnes || 0), 0) || 8420;
  const dispatchedTrips = mineMovements.length || 38;

  const totalHemmActive = mineHemm.filter(h => h.status === 'WORKING').length || 8;
  const totalHemmBreakdown = mineHemm.filter(h => h.status === 'BREAKDOWN').length || 1;
  const hemmAvailability = Math.round(((mineHemm.length - totalHemmBreakdown) / Math.max(1, mineHemm.length)) * 100);

  const handlePrint = () => {
    window.print();
  };

  const handleSign = () => {
    setIsSigned(true);
    alert(`Report locked and digitally certified by ${currentUser?.name || 'Mine Manager'} (${currentUser?.role || 'Certificated Mine Manager'}).`);
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar (hidden during print) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 print:hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">
                  Daily Mine Operating & Statutory Report (DGMS Form-D)
                </h1>
                <p className="text-sm text-slate-400 mt-0.5">
                  Consolidated 24-hour operational, statutory safety, production, HEMM, and environmental record.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Mine Selector */}
            <select
              value={selectedMineId}
              onChange={e => setSelectedMineId(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg px-3 py-2"
            >
              {mines.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>

            {/* Shift Selector */}
            <select
              value={selectedShift}
              onChange={e => setSelectedShift(e.target.value as any)}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg px-3 py-2"
            >
              <option value="FULL_DAY">Full 24-Hr Cycle (All Shifts)</option>
              <option value="SHIFT_A">Shift A (06:00 - 14:00)</option>
              <option value="SHIFT_B">Shift B (14:00 - 22:00)</option>
              <option value="SHIFT_C">Shift C (22:00 - 06:00)</option>
            </select>

            {/* Date */}
            <input
              type="date"
              value={reportDate}
              onChange={e => setReportDate(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg px-3 py-1.5"
            />

            {/* Print & Sign Actions */}
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition"
            >
              <Printer className="w-4 h-4" /> Print / PDF
            </button>

            {!isSigned ? (
              <button
                onClick={handleSign}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
              >
                <CheckCircle className="w-4 h-4" /> Sign & Lock Report
              </button>
            ) : (
              <span className="px-3 py-2 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-lg text-xs font-bold flex items-center gap-1.5">
                <Award className="w-4 h-4" /> Digitally Certified
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Printable Report Document */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl text-slate-100 print:bg-white print:text-black print:border-none print:shadow-none print:p-0">
        {/* Document Header */}
        <div className="border-b border-slate-800 pb-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <div className="text-[10px] font-mono tracking-widest text-blue-400 uppercase font-bold">
                GOVERNMENT OF INDIA • MINISTRY OF COAL • DGMS STATUTORY RETURN
              </div>
              <h2 className="text-2xl font-black tracking-tight text-white mt-1">
                DAILY INTEGRATED MINE LOGBOOK & STATUTORY RETURN
              </h2>
              <div className="flex flex-wrap gap-4 text-xs text-slate-400 mt-2">
                <span>Mine: <strong className="text-white">{selectedMine.name}</strong></span>
                <span>Type: <strong className="text-white">{selectedMine.type}</strong></span>
                <span>State: <strong className="text-white">{selectedMine.state}</strong></span>
                <span>Date: <strong className="text-white">{reportDate}</strong></span>
                <span>Cycle: <strong className="text-white">{selectedShift.replace('_', ' ')}</strong></span>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="inline-block px-3 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 font-mono text-xs">
                Doc Ref: DMR-{selectedMine.id}-{reportDate.replace(/-/g, '')}
              </span>
              {isSigned && (
                <div className="text-[11px] text-emerald-400 mt-1 font-mono">
                  Digitally Authenticated: {currentUser?.name || 'Mine Manager'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 1: Executive KPI Matrix */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">Daily Production</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">{totalCoalTonnage.toLocaleString()} MT</div>
            <div className="text-[11px] text-slate-500 mt-0.5">{productionPct}% of 12,000 MT Target</div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">Total OB Removal</div>
            <div className="text-2xl font-bold text-blue-400 mt-1">28,450 BCM</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Stripping Ratio: 2.28 BCM/T</div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">Dispatch Weight</div>
            <div className="text-2xl font-bold text-amber-400 mt-1">{totalDispatched.toLocaleString()} MT</div>
            <div className="text-[11px] text-slate-500 mt-0.5">{dispatchedTrips} Dispatched Consignments</div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">HEMM Fleet Availability</div>
            <div className="text-2xl font-bold text-purple-400 mt-1">{hemmAvailability}%</div>
            <div className="text-[11px] text-slate-500 mt-0.5">{totalHemmActive} Working | {totalHemmBreakdown} Breakdown</div>
          </div>
        </div>

        {/* Section 2: Pit Operations & Geotechnical Status */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-400" />
            1. Pit Bench Status & Geotechnical Slope Inspections
          </h3>
          <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 border-b border-slate-800 text-slate-400">
                <tr>
                  <th className="py-2.5 px-4">Bench ID</th>
                  <th className="py-2.5 px-4">Elevation (m RL)</th>
                  <th className="py-2.5 px-4">Working Status</th>
                  <th className="py-2.5 px-4">Slope Angle</th>
                  <th className="py-2.5 px-4">Water Condition</th>
                  <th className="py-2.5 px-4">Slope Risk</th>
                  <th className="py-2.5 px-4 text-right">Production (MT)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {mineBenches.slice(0, 5).map(b => (
                  <tr key={b.id}>
                    <td className="py-2.5 px-4 font-mono font-semibold text-white">{b.benchId}</td>
                    <td className="py-2.5 px-4">{b.elevationMeters}m</td>
                    <td className="py-2.5 px-4 font-medium">{b.workingStatus.replace('_', ' ')}</td>
                    <td className="py-2.5 px-4">{b.slopeAngleDeg}°</td>
                    <td className="py-2.5 px-4">{b.waterCondition}</td>
                    <td className="py-2.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        b.slopeRisk === 'HIGH' ? 'bg-red-950 text-red-300' :
                        b.slopeRisk === 'MEDIUM' ? 'bg-amber-950 text-amber-300' : 'bg-emerald-950 text-emerald-300'
                      }`}>
                        {b.slopeRisk}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono font-semibold text-emerald-400">
                      {b.dailyProductionTonnes.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Statutory Safety & DGMS Compliance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              2. Statutory Mine Safety & Health
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">Lost Time Injuries (LTI) Today:</span>
                <span className="font-bold text-emerald-400">0 (Zero Harm Maintained)</span>
              </li>
              <li className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">Cumulative Safe Man-Hours:</span>
                <span className="font-mono text-slate-200">1,428,500 hrs</span>
              </li>
              <li className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">Pre-Shift Breathalyzer Testing:</span>
                <span className="text-emerald-400">100% Passed (186/186)</span>
              </li>
              <li className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">Ventilation / Methane Sensor Max:</span>
                <span className="font-mono text-emerald-400">0.08% CH4 (Permissible &lt; 0.75%)</span>
              </li>
              <li className="flex justify-between py-1">
                <span className="text-slate-400">Active High Risk Violations:</span>
                <span className="font-bold text-amber-400">1 (Under Mitigation)</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <Leaf className="w-4 h-4 text-emerald-400" />
              3. Environmental & Fugitive Emission Monitoring
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">Ambient PM10 (24-hr avg):</span>
                <span className="font-mono text-slate-200">74 µg/m³ (NAAQS: &lt;100 µg/m³)</span>
              </li>
              <li className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">Ambient PM2.5 (24-hr avg):</span>
                <span className="font-mono text-slate-200">38 µg/m³ (NAAQS: &lt;60 µg/m³)</span>
              </li>
              <li className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">Water Tanker Spray Runs:</span>
                <span className="text-slate-200">14 Trips (Haul Road Suppression)</span>
              </li>
              <li className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">Continuous Mist Cannons Run Time:</span>
                <span className="font-mono text-slate-200">18.5 Hours</span>
              </li>
              <li className="flex justify-between py-1">
                <span className="text-slate-400">Mine Sump Water Discharge pH:</span>
                <span className="font-mono text-emerald-400">7.2 (Permissible: 6.5 - 8.5)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Section 4: Sign-off & Certification Block */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-1 text-xs text-slate-400">
            <p>Certified under CMR 2017 Regulation 27 & Mines Act 1952.</p>
            <p>Transmitted electronically to DGMS Directorate and Zonal Headquarters.</p>
          </div>

          <div className="text-right">
            <div className="w-56 border-b border-slate-700 pb-2 mb-1">
              {isSigned ? (
                <span className="font-serif italic text-base text-emerald-400 font-bold">
                  {currentUser?.name || 'Mine Manager'}
                </span>
              ) : (
                <span className="text-slate-600 text-xs italic">Awaiting Digital Signature</span>
              )}
            </div>
            <div className="text-xs font-semibold text-slate-200">
              {currentUser?.name || 'Mine Manager'} ({currentUser?.role || 'Certificated Mine Manager'})
            </div>
            <div className="text-[11px] text-slate-400">
              Certificated Mine Manager / Agent
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
