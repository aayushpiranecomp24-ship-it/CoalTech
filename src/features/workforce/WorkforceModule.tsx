import React, { useState } from 'react';
import { useGovernance } from '../../context/GovernanceContext';
import { useI18n } from '../../context/I18nContext';
import type { WorkerGrievance } from '../../types';
import {
  HardHat,
  Search,
  MessageSquare,
  UserPlus,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import { AddWorkerModal } from '../masterData/components/AddWorkerModal';
import { OvertimeApprovalModal } from './components/OvertimeApprovalModal';
import { ResourceAvailabilityService } from '../../services/resourceAvailabilityService';

export const WorkforceModule: React.FC = () => {
  const { workers, grievances, submitGrievance, mines, overtimeRecords, updateWorker } = useGovernance();
  const { t } = useI18n();

  const [activeTab, setActiveTab] = useState<'roster' | 'grievances'>('roster');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedShift, setSelectedShift] = useState<string>('All');

  // Master Data & Overtime Modals
  const [showAddWorkerModal, setShowAddWorkerModal] = useState(false);
  const [showOvertimeModal, setShowOvertimeModal] = useState(false);
  const [preselectedWorkerIdForOT, setPreselectedWorkerIdForOT] = useState<string | undefined>(undefined);

  // Shift & Mine Deployment Assignment Modal
  const [assignWorker, setAssignWorker] = useState<any | null>(null);
  const [targetMineId, setTargetMineId] = useState<string>('m1');
  const [targetShift, setTargetShift] = useState<string>('Morning Shift (A)');
  const [assignmentError, setAssignmentError] = useState<string | null>(null);
  const [assignmentSuccess, setAssignmentSuccess] = useState<string | null>(null);

  const openAssignShift = (w: any) => {
    setAssignWorker(w);
    setTargetMineId(w.mineId || 'm1');
    setTargetShift(w.shift || 'Morning Shift (A)');
    setAssignmentError(null);
    setAssignmentSuccess(null);
  };

  const handleConfirmAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignWorker) return;

    const targetMine = mines.find((m) => m.id === targetMineId);
    const check = ResourceAvailabilityService.validateWorkerAssignment(
      assignWorker,
      targetMineId,
      targetShift,
      targetMine?.name,
      { allWorkers: workers }
    );

    if (!check.available) {
      setAssignmentError(check.reason || 'Statutory deployment conflict detected.');
      return;
    }

    updateWorker(assignWorker.id, {
      mineId: targetMineId,
      shift: targetShift,
    });

    setAssignmentError(null);
    setAssignmentSuccess(
      `Statutory clearance confirmed: ${assignWorker.name} assigned to ${targetMine?.name || targetMineId} (${targetShift}).`
    );
    setTimeout(() => {
      setAssignWorker(null);
      setAssignmentSuccess(null);
    }, 1200);
  };

  // Grievance Form Modal
  const [showGrievanceModal, setShowGrievanceModal] = useState(false);
  const [grievanceCat, setGrievanceCat] = useState<WorkerGrievance['category']>('Safety Hazard');
  const [grievanceDesc, setGrievanceDesc] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);

  const filteredWorkers = workers.filter((w) => {
    const matchesSearch =
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.badgeNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (w.workerId && w.workerId.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesShift = selectedShift === 'All' || w.shift.includes(selectedShift);
    return matchesSearch && matchesShift;
  });

  const handleGrievanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!grievanceDesc.trim()) return;
    submitGrievance(grievanceCat, grievanceDesc, isAnonymous);
    setShowGrievanceModal(false);
    setGrievanceDesc('');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <HardHat className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              {t('nav_workforce', 'Workforce Deployment & Labour Welfare')}
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Personnel shift tracking, statutory vocational training completion, daily 8h limits, and confidential safety grievances.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={() => {
              setPreselectedWorkerIdForOT(undefined);
              setShowOvertimeModal(true);
            }}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-semibold shadow-sm transition"
          >
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Overtime Authorizations</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/20 text-amber-300 font-bold ml-1">
              {overtimeRecords.length}
            </span>
          </button>

          <button
            onClick={() => setShowAddWorkerModal(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl text-xs font-semibold shadow-md transition"
          >
            <UserPlus className="w-4 h-4" />
            <span>Enroll Mining Personnel</span>
          </button>

          <button
            onClick={() => setShowGrievanceModal(true)}
            className="flex items-center space-x-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold transition"
          >
            <MessageSquare className="w-4 h-4 text-slate-500" />
            <span>Worker Grievance</span>
          </button>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Roster</span>
          <span className="text-xl font-black text-slate-900 dark:text-white">{workers.length} registered</span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/40 p-3 rounded-xl border-l-4 border-l-emerald-500">
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">Present Today</span>
          <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
            {workers.filter((w) => w.attendanceStatus === 'Present').length} (
            {Math.round((workers.filter((w) => w.attendanceStatus === 'Present').length / workers.length) * 100)}%)
          </span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900/40 p-3 rounded-xl border-l-4 border-l-blue-500">
          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">Training Certified</span>
          <span className="text-xl font-black text-blue-600 dark:text-blue-400">
            {workers.filter((w) => w.trainingStatus === 'Completed').length}
          </span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/40 p-3 rounded-xl border-l-4 border-l-amber-500">
          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">Active Grievances</span>
          <span className="text-xl font-black text-amber-600 dark:text-amber-400">
            {grievances.filter((g) => g.status !== 'Resolved').length}
          </span>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('roster')}
          className={`pb-2.5 px-4 transition border-b-2 ${
            activeTab === 'roster'
              ? 'border-sky-600 text-sky-600 dark:text-sky-400 font-bold'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800'
          }`}
        >
          Personnel Roster ({workers.length})
        </button>
        <button
          onClick={() => setActiveTab('grievances')}
          className={`pb-2.5 px-4 transition border-b-2 ${
            activeTab === 'grievances'
              ? 'border-sky-600 text-sky-600 dark:text-sky-400 font-bold'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800'
          }`}
        >
          Safety Grievances ({grievances.length})
        </button>
      </div>

      {activeTab === 'roster' && (
        <div className="space-y-4">
          {/* Search & Shift Filter */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center text-xs">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search worker name, badge, role..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white outline-none focus:border-sky-500 text-xs"
              />
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Shift:</span>
              <select
                value={selectedShift}
                onChange={(e) => setSelectedShift(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border rounded-lg px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 outline-none"
              >
                <option value="All">All Shifts</option>
                <option value="Morning">Morning Shift (A)</option>
                <option value="Afternoon">Afternoon Shift (B)</option>
                <option value="Night">Night Shift (C)</option>
              </select>
            </div>
          </div>

          {/* Workers Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Badge / Worker</th>
                    <th className="py-3 px-4">Mine & Department</th>
                    <th className="py-3 px-4">Role & Skill</th>
                    <th className="py-3 px-4">Shift</th>
                    <th className="py-3 px-4">Daily Hours (8h Max)</th>
                    <th className="py-3 px-4">Attendance</th>
                    <th className="py-3 px-4">Vocational Training</th>
                    <th className="py-3 px-4 text-center">Statutory Clearance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredWorkers.map((w) => {
                    const mine = mines.find((m) => m.id === w.mineId);
                    const hoursWorked = w.dailyHoursWorked || 0;
                    const isOverLimit = hoursWorked >= 8;

                    return (
                      <tr key={w.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/50 transition">
                        <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100">
                          <div>{w.name}</div>
                          <div className="font-mono text-[10px] text-slate-400 flex items-center space-x-1">
                            <span>{w.workerId || w.badgeNumber}</span>
                            {w.status && (
                              <span className={`px-1 rounded text-[8px] font-bold ${
                                w.status === 'Active' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300'
                              }`}>
                                {w.status}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="text-slate-800 dark:text-slate-200 font-medium">{mine?.name || w.mineId}</div>
                          <div className="text-[10px] text-slate-400">{w.department}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="text-slate-700 dark:text-slate-300 font-medium">{w.role}</div>
                          {w.skill && (
                            <span className="text-[9px] font-semibold text-sky-600 dark:text-sky-400">
                              {w.skill}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 text-[11px]">{w.shift}</td>
                        <td className="py-3.5 px-4">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[10px]">
                              <span className={`font-bold ${isOverLimit ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'}`}>
                                {hoursWorked}h / 8.0h
                              </span>
                              {isOverLimit && (
                                <span className="text-[9px] font-bold text-rose-500 uppercase">Limit Reached</span>
                              )}
                            </div>
                            <div className="w-24 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  isOverLimit ? 'bg-rose-500' : hoursWorked > 6 ? 'bg-amber-500' : 'bg-emerald-500'
                                }`}
                                style={{ width: `${Math.min(100, (hoursWorked / 8) * 100)}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                              w.attendanceStatus === 'Present'
                                ? 'bg-emerald-500/10 text-emerald-600 border-emerald-300'
                                : 'bg-red-500/10 text-red-600 border-red-300'
                            }`}
                          >
                            {w.attendanceStatus}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                              w.trainingStatus === 'Completed'
                                ? 'bg-emerald-500/10 text-emerald-600 border-emerald-300'
                                : w.trainingStatus === 'Pending'
                                ? 'bg-amber-500/10 text-amber-600 border-amber-300'
                                : 'bg-red-500/10 text-red-600 border-red-300'
                            }`}
                          >
                            {w.trainingStatus}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => openAssignShift(w)}
                              className="px-2.5 py-1 bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 dark:text-sky-400 border border-sky-500/30 rounded-lg text-[10px] font-bold shadow-xs transition flex items-center gap-1"
                              title="Assign Shift / Mine Deployment"
                            >
                              <Calendar className="w-3 h-3" />
                              <span>Deploy / Shift</span>
                            </button>
                            {isOverLimit ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setPreselectedWorkerIdForOT(w.id);
                                  setShowOvertimeModal(true);
                                }}
                                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-[10px] font-bold shadow-sm transition"
                              >
                                Authorize OT
                              </button>
                            ) : w.trainingStatus === 'Expired' ? (
                              <span className="text-[10px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded border border-rose-300">
                                Locked
                              </span>
                            ) : (
                              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                                Cleared
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'grievances' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {grievances.map((g) => (
            <div
              key={g.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    {g.category}
                  </span>
                  <div className="text-[11px] text-slate-400">
                    {g.isAnonymous ? 'Anonymous Worker Report' : `Worker Ref: ${g.workerId}`} •{' '}
                    {formatDate(g.submittedAt)}
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    g.status === 'Resolved'
                      ? 'bg-emerald-500/10 text-emerald-600 border-emerald-300'
                      : 'bg-amber-500/10 text-amber-600 border-amber-300'
                  }`}
                >
                  {g.status}
                </span>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-850 p-3 rounded-lg">
                "{g.description}"
              </p>

              {g.resolutionNotes && (
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-lg">
                  <strong>Resolution:</strong> {g.resolutionNotes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Submit Grievance Modal */}
      {showGrievanceModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Submit Confidential Worker Grievance</h3>

            <form onSubmit={handleGrievanceSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Grievance Category</label>
                <select
                  value={grievanceCat}
                  onChange={(e) => setGrievanceCat(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white outline-none"
                >
                  {[
                    'Safety Hazard',
                    'Sanitation / Drinking Water',
                    'PPE Defect',
                    'Working Hours',
                    'Compensation',
                  ].map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Detailed Description</label>
                <textarea
                  required
                  rows={4}
                  value={grievanceDesc}
                  onChange={(e) => setGrievanceDesc(e.target.value)}
                  placeholder="Explain the unsafe condition, PPE defect, or issue encountered on-site..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="anon"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded text-sky-600"
                />
                <label htmlFor="anon" className="text-slate-700 dark:text-slate-300 text-xs">
                  Submit anonymously (protect worker identity under Whistleblower provisions)
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowGrievanceModal(false)}
                  className="w-1/3 py-2 border rounded-xl font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-semibold shadow-md transition"
                >
                  File Grievance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Worker Master Data Modal */}
      <AddWorkerModal
        isOpen={showAddWorkerModal}
        onClose={() => setShowAddWorkerModal(false)}
      />

      {/* Statutory Overtime Approval Modal */}
      <OvertimeApprovalModal
        isOpen={showOvertimeModal}
        onClose={() => setShowOvertimeModal(false)}
        preselectedWorkerId={preselectedWorkerIdForOT}
      />

      {/* Shift Deployment & Conflict Validation Modal */}
      {assignWorker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Statutory Shift Deployment & Mine Allocation
                </h3>
              </div>
              <button
                onClick={() => {
                  setAssignWorker(null);
                  setAssignmentError(null);
                  setAssignmentSuccess(null);
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Worker summary badge */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{assignWorker.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {assignWorker.role} • Badge: <span className="font-mono text-sky-600 dark:text-sky-400">{assignWorker.badgeNumber}</span>
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Current: <span className="font-medium text-slate-700 dark:text-slate-300">{assignWorker.shift}</span> at <span className="font-medium text-slate-700 dark:text-slate-300">{assignWorker.assignedMineName || assignWorker.mineId}</span>
                </p>
              </div>
              <div className="text-right">
                <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                  (assignWorker.dailyHoursWorked || 0) >= 8
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400'
                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                }`}>
                  Daily: {assignWorker.dailyHoursWorked || 0}h / 8h
                </span>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                  Training: <span className={assignWorker.trainingStatus === 'Valid' ? 'text-emerald-500 font-semibold' : 'text-rose-500 font-semibold'}>{assignWorker.trainingStatus}</span>
                </p>
              </div>
            </div>

            {/* Statutory Error/Success Notice */}
            {assignmentError && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 rounded-xl flex items-start space-x-2 text-xs text-rose-700 dark:text-rose-300 animate-fadeIn">
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Statutory Deployment Blocked</p>
                  <p className="mt-0.5">{assignmentError}</p>
                </div>
              </div>
            )}

            {assignmentSuccess && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/60 rounded-xl flex items-start space-x-2 text-xs text-emerald-700 dark:text-emerald-300 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Clearance Approved</p>
                  <p className="mt-0.5">{assignmentSuccess}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleConfirmAssignment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Mine Facility
                </label>
                <select
                  value={targetMineId}
                  onChange={(e) => {
                    setTargetMineId(e.target.value);
                    setAssignmentError(null);
                  }}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-xs outline-none focus:border-sky-500"
                >
                  {mines.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.type || 'Opencast'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Operating Shift
                </label>
                <select
                  value={targetShift}
                  onChange={(e) => {
                    setTargetShift(e.target.value);
                    setAssignmentError(null);
                  }}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-xs outline-none focus:border-sky-500"
                >
                  <option value="Morning Shift (A)">Morning Shift (A) — 08:00 to 16:00</option>
                  <option value="Afternoon Shift (B)">Afternoon Shift (B) — 16:00 to 00:00</option>
                  <option value="Night Shift (C)">Night Shift (C) — 00:00 to 08:00</option>
                  <option value="General Shift (G)">General Shift (G) — 09:00 to 17:00</option>
                </select>
              </div>

              <div className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-100/70 dark:bg-slate-800/40 p-2.5 rounded-lg">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Statutory Rules (DGMS / CMR 2017):</span> Maximum 8.0 hours per worker per day. Overlapping cross-mine deployments are strictly rejected unless certified by Safety Officer.
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setAssignWorker(null);
                    setAssignmentError(null);
                    setAssignmentSuccess(null);
                  }}
                  className="w-1/3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-semibold shadow-md transition text-xs flex items-center justify-center space-x-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verify & Deploy Worker</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
