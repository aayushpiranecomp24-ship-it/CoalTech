// MINEGOV AI - Workforce & Labour Welfare Module
import React, { useState } from 'react';
import { useGovernance } from '../../context/GovernanceContext';
import { useI18n } from '../../context/I18nContext';
import { formatDate } from '../../utils/formatters';
import type { WorkerGrievance } from '../../types';
import {
  HardHat,
  Search,
  MessageSquare,
} from 'lucide-react';

export const WorkforceModule: React.FC = () => {
  const { workers, grievances, submitGrievance, mines } = useGovernance();
  const { t } = useI18n();

  const [activeTab, setActiveTab] = useState<'roster' | 'grievances'>('roster');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedShift, setSelectedShift] = useState<string>('All');

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
      w.badgeNumber.toLowerCase().includes(searchQuery.toLowerCase());
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
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
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
            Personnel shift tracking, statutory vocational training completion, and confidential safety grievances.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowGrievanceModal(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold shadow-md transition"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Submit Worker Grievance</span>
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
                    <th className="py-3 px-4">Operational Role</th>
                    <th className="py-3 px-4">Assigned Shift</th>
                    <th className="py-3 px-4">Attendance</th>
                    <th className="py-3 px-4">Vocational Safety Training</th>
                    <th className="py-3 px-4 text-right">Safety Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredWorkers.map((w) => {
                    const mine = mines.find((m) => m.id === w.mineId);
                    return (
                      <tr key={w.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/50 transition">
                        <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100">
                          <div>{w.name}</div>
                          <div className="font-mono text-[10px] text-slate-400">{w.badgeNumber}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="text-slate-800 dark:text-slate-200">{mine?.name || w.mineId}</div>
                          <div className="text-[10px] text-slate-400">{w.department}</div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">{w.role}</td>
                        <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">{w.shift}</td>
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
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-800 dark:text-slate-200">
                          {w.safetyScore}/100
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
    </div>
  );
};
