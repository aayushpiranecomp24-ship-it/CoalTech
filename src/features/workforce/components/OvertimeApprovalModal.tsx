import React, { useState } from 'react';
import { useGovernance } from '../../../context/GovernanceContext';
import { Clock, ShieldAlert, CheckCircle, XCircle, FileText, X } from 'lucide-react';

interface OvertimeApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedWorkerId?: string;
}

export const OvertimeApprovalModal: React.FC<OvertimeApprovalModalProps> = ({
  isOpen,
  onClose,
  preselectedWorkerId,
}) => {
  const { workers, mines, currentUser, overtimeRecords, approveOvertime } = useGovernance();

  const [activeTab, setActiveTab] = useState<'request' | 'history'>('request');
  const [selectedWorkerId, setSelectedWorkerId] = useState(
    preselectedWorkerId || workers.find((w) => (w.dailyHoursWorked || 0) >= 8)?.id || workers[0]?.id || ''
  );
  const [requestedHours, setRequestedHours] = useState(2.0);
  const [reason, setReason] = useState('Critical de-watering pump maintenance & haulage clearing before rainfall.');
  const [statutoryCitation, setStatutoryCitation] = useState('Mines Act 1952 Section 33 & CMR 2017 Regulation 142 exception');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  if (!isOpen) return null;

  const selectedWorker = workers.find((w) => w.id === selectedWorkerId);
  const workerMine = mines.find((m) => m.id === selectedWorker?.mineId);
  const currentDailyHours = selectedWorker?.dailyHoursWorked || 0;
  const projectedTotal = currentDailyHours + requestedHours;
  const hourlyBaseRate = 350; // standard CoalTech base rate
  const overtimeRate = 2.0; // statutory double time
  const estimatedExtraPay = Math.round(requestedHours * hourlyBaseRate * overtimeRate);

  const handleApprove = (status: 'APPROVED' | 'REJECTED') => {
    if (!selectedWorker) return;
    setIsSubmitting(true);

    approveOvertime({
      workerId: selectedWorker.id,
      workerName: selectedWorker.name,
      mineId: selectedWorker.mineId,
      mineName: workerMine?.name || 'CoalTech Mine Sector',
      date: new Date().toISOString().split('T')[0],
      currentHours: currentDailyHours,
      regularHours: Math.min(currentDailyHours, 8),
      overtimeHours: requestedHours,
      requestedHours,
      approvingOfficer: currentUser ? `${currentUser.name} (${currentUser.role})` : 'Alok Roy (Workforce Head)',
      approverId: currentUser?.id || 'u8',
      approverName: currentUser?.name || 'Alok Roy',
      reason: `${reason.trim()} [Statutory Basis: ${statutoryCitation}]`,
      overtimeRate,
      estimatedExtraPayment: estimatedExtraPay,
      status,
      comments: status === 'APPROVED' ? 'Cleared for deployment beyond 8h statutory limit.' : 'Overtime denied due to safety fatigue restrictions.',
    });

    setIsSubmitting(false);
    setActionSuccess(`Statutory Overtime Authorization ${status === 'APPROVED' ? 'Approved' : 'Rejected'} for ${selectedWorker.name}!`);
    setTimeout(() => {
      setActionSuccess('');
      setActiveTab('history');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center text-white shadow-md">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Statutory Working Hours & Overtime Clearance
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Mines Act 1952 / CMR 2017 Daily 8-Hour Rule & Exception Workflow
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-semibold px-6 pt-3 bg-slate-50/50 dark:bg-slate-800/30">
          <button
            onClick={() => setActiveTab('request')}
            className={`pb-3 px-4 border-b-2 transition ${
              activeTab === 'request'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Authorize Overtime
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-3 px-4 border-b-2 transition flex items-center space-x-2 ${
              activeTab === 'history'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>Authorization Log</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold">
              {overtimeRecords.length}
            </span>
          </button>
        </div>

        {actionSuccess && (
          <div className="m-6 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs flex items-center space-x-2 animate-fadeIn">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-500" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Tab 1: Request & Approve */}
        {activeTab === 'request' && (
          <div className="p-6 space-y-5 text-xs">
            {/* Stat Alert */}
            <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 rounded-xl flex items-start space-x-3">
              <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-bold text-amber-900 dark:text-amber-300">Statutory Working Hour Ceiling</h4>
                <p className="text-amber-800 dark:text-amber-400 leading-relaxed">
                  Under Section 30 of the Mines Act 1952, no miner shall be allowed to work for more than 9 hours on any day or 48 hours in any week. Overtime requires prior written authorization by the Workforce Head and pays double the ordinary rate of wages (Section 33).
                </p>
              </div>
            </div>

            {/* Select Worker */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Select Personnel
              </label>
              <select
                value={selectedWorkerId}
                onChange={(e) => setSelectedWorkerId(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-amber-500 outline-none"
              >
                {workers.map((w) => {
                  const m = mines.find((mine) => mine.id === w.mineId);
                  const isOverlimit = (w.dailyHoursWorked || 0) >= 8;
                  return (
                    <option key={w.id} value={w.id}>
                      {w.name} ({w.workerId || w.badgeNumber}) — {m?.name || 'Mine'} — {w.dailyHoursWorked || 0}h worked {isOverlimit ? '⚠️ [8h Limit Reached]' : ''}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Selected Worker Overview Banner */}
            {selectedWorker && (
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Designation</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedWorker.role}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Current Shift</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedWorker.shift}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Hours Completed</span>
                  <span
                    className={`font-bold ${
                      currentDailyHours >= 8 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {currentDailyHours}h / 8.0h limit
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">DGMS Training</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedWorker.trainingStatus}</span>
                </div>
              </div>
            )}

            {/* Overtime Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Requested Overtime Duration
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="0.5"
                    max="4.0"
                    step="0.5"
                    value={requestedHours}
                    onChange={(e) => setRequestedHours(parseFloat(e.target.value) || 0.5)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                  <span className="font-semibold text-slate-500">hours</span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Projected total: {projectedTotal}h (Max allowed with OT: 12h)
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Statutory Overtime Remuneration
                </label>
                <div className="px-3 py-2 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-between">
                  <span>₹{estimatedExtraPay.toLocaleString('en-IN')}</span>
                  <span className="text-[10px] font-semibold uppercase bg-emerald-200 dark:bg-emerald-800 px-2 py-0.5 rounded">
                    2.0x Double Time
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Calculated automatically per Section 33
                </span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Emergency Justification / Operational Necessity <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={2}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Specify precise cause for overtime deployment..."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Statutory Exemption Citation
              </label>
              <input
                type="text"
                value={statutoryCitation}
                onChange={(e) => setStatutoryCitation(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleApprove('REJECTED')}
                className="px-4 py-2 text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 border border-rose-300 dark:border-rose-800 rounded-xl transition flex items-center space-x-1.5"
              >
                <XCircle className="w-4 h-4" />
                <span>Deny / Block Overtime</span>
              </button>
              <button
                type="button"
                disabled={isSubmitting || !reason.trim()}
                onClick={() => handleApprove('APPROVED')}
                className="px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 rounded-xl shadow-lg transition flex items-center space-x-1.5"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Authorize Statutory Overtime (Double Pay)</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: History Log */}
        {activeTab === 'history' && (
          <div className="p-6 space-y-3 text-xs">
            {overtimeRecords.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No overtime authorization records logged yet.</p>
              </div>
            ) : (
              overtimeRecords.map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 dark:text-white">{rec.workerName}</span>
                      <span className="text-[10px] text-slate-400">({rec.workerId})</span>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        rec.status === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300'
                      }`}
                    >
                      {rec.status}
                    </span>
                  </div>

                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">{rec.reason}</p>

                  <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-500 pt-1 border-t border-slate-200 dark:border-slate-800/60">
                    <span>Approved by: {rec.approvingOfficer || rec.approverName}</span>
                    <span>Duration: +{rec.overtimeHours || rec.requestedHours}h</span>
                    <span>Extra Pay: ₹{(rec.estimatedExtraPayment || 0).toLocaleString('en-IN')} (2x)</span>
                    <span>Date: {rec.date}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
