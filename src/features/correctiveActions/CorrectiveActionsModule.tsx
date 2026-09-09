// MINEGOV AI - Corrective Action Module (Closed-Loop Workflow)
import React, { useState } from 'react';
import { useGovernance } from '../../context/GovernanceContext';
import { useI18n } from '../../context/I18nContext';
import { formatDate, getSeverityBadgeClass, getStatusBadgeClass } from '../../utils/formatters';
import type { Violation } from '../../types';
import {
  CheckCircle2,
  Check,
  X,
  Search,
} from 'lucide-react';

export const CorrectiveActionsModule: React.FC = () => {
  const {
    violations,
    assignViolation,
    submitCorrectiveAction,
    verifyCorrectiveAction,
    currentUser,
    canPerform,
  } = useGovernance();
  const { t } = useI18n();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTabStatus, setActiveTabStatus] = useState<string>('All');

  // Modals state
  const [assignModalViolation, setAssignModalViolation] = useState<Violation | null>(null);
  const [proofModalViolation, setProofModalViolation] = useState<Violation | null>(null);
  const [verifyModalViolation, setVerifyModalViolation] = useState<Violation | null>(null);

  // Form inputs
  const [assigneeName, setAssigneeName] = useState('Rahul Verma');
  const [assignDeadline, setAssignDeadline] = useState(() =>
    new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [proofNotes, setProofNotes] = useState('');
  const [proofPhoto, setProofPhoto] = useState(
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80'
  );
  const [verificationNotes, setVerificationNotes] = useState('');

  const filteredViolations = violations.filter((v) => {
    const matchesSearch =
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.assigneeName && v.assigneeName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus =
      activeTabStatus === 'All'
        ? true
        : activeTabStatus === 'Open/Pending'
        ? v.status === 'OPEN' || v.status === 'ASSIGNED' || v.status === 'IN_PROGRESS' || v.status === 'REWORK_REQUIRED'
        : activeTabStatus === 'Verification'
        ? v.status === 'ACTION_SUBMITTED' || v.status === 'UNDER_VERIFICATION'
        : v.status === 'CLOSED';
    return matchesSearch && matchesStatus;
  });

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignModalViolation) return;
    assignViolation(assignModalViolation.id, assigneeName, assignDeadline);
    setAssignModalViolation(null);
  };

  const handleProofSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofModalViolation) return;
    submitCorrectiveAction(proofModalViolation.id, proofNotes, proofPhoto, proofNotes);
    setProofModalViolation(null);
    setProofNotes('');
  };

  const handleVerifySubmit = (approved: boolean) => {
    if (!verifyModalViolation) return;

    // Self-approval rule check
    if (
      verifyModalViolation.assigneeName === currentUser?.name &&
      verifyModalViolation.severity === 'CRITICAL'
    ) {
      alert('Statutory Rule Block: You cannot verify or approve your own corrective action work!');
      return;
    }

    verifyCorrectiveAction(
      verifyModalViolation.id,
      approved,
      verificationNotes || (approved ? 'Verified compliant with statutory norms.' : 'Rework mandated.')
    );
    setVerifyModalViolation(null);
    setVerificationNotes('');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              {t('nav_corrective', 'Closed-Loop Corrective Action Lifecycle')}
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Statutory remediation workflow: Assignment → Execution & Proof Submission → Inspector Verification → Tamper-Evident Closure.
          </p>
        </div>

        {/* Workflow steps visual pill */}
        <div className="hidden lg:flex items-center space-x-1 bg-slate-900 border border-slate-800 p-1.5 rounded-xl text-[10px] text-slate-300">
          <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-bold">1. Hazard</span>
          <span>→</span>
          <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold">2. Assign</span>
          <span>→</span>
          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold">3. Proof</span>
          <span>→</span>
          <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 font-bold">4. Verify</span>
          <span>→</span>
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">5. Close</span>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Actions</span>
          <span className="text-xl font-black text-slate-900 dark:text-white">{violations.length}</span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900/40 p-3 rounded-xl border-l-4 border-l-blue-500">
          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">In Remediation</span>
          <span className="text-xl font-black text-blue-600 dark:text-blue-400">
            {violations.filter((v) => v.status === 'ASSIGNED' || v.status === 'IN_PROGRESS' || v.status === 'REWORK_REQUIRED').length}
          </span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/40 p-3 rounded-xl border-l-4 border-l-amber-500">
          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">Pending Verification</span>
          <span className="text-xl font-black text-amber-600 dark:text-amber-400">
            {violations.filter((v) => v.status === 'ACTION_SUBMITTED' || v.status === 'UNDER_VERIFICATION').length}
          </span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/40 p-3 rounded-xl border-l-4 border-l-emerald-500">
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">Verified & Closed</span>
          <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
            {violations.filter((v) => v.status === 'CLOSED').length}
          </span>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search hazard title, assignee, category..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white outline-none focus:border-sky-500 text-xs"
          />
        </div>

        <div className="flex items-center space-x-1 w-full md:w-auto justify-end">
          {['All', 'Open/Pending', 'Verification', 'Closed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTabStatus(tab)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                activeTabStatus === tab
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Corrective Actions Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Violation / Hazard</th>
                <th className="py-3 px-4">Responsible Officer</th>
                <th className="py-3 px-4">Statutory SLA Deadline</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Workflow Status</th>
                <th className="py-3 px-4 text-right">Workflow Transition</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredViolations.map((v) => {
                const isOverdue = v.status !== 'CLOSED' && new Date(v.deadline) < new Date();
                return (
                  <tr key={v.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/50 transition">
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100 max-w-sm">
                      <div className="font-bold text-slate-900 dark:text-white line-clamp-1">{v.title}</div>
                      <div className="text-[10px] text-slate-400">
                        {v.category} • {v.zone}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {v.assigneeName ? (
                        <div>
                          <div className="font-medium text-slate-800 dark:text-slate-200">{v.assigneeName}</div>
                          <div className="text-[10px] text-slate-400">{v.assigneeRole || 'Officer'}</div>
                        </div>
                      ) : (
                        <span className="text-amber-500 font-semibold italic text-[11px]">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className={`font-medium ${isOverdue ? 'text-red-600 dark:text-red-400 font-bold' : 'text-slate-600 dark:text-slate-400'}`}>
                        {formatDate(v.deadline)}
                      </div>
                      {isOverdue && <span className="text-[9px] text-red-500 font-bold uppercase">SLA Breached</span>}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getSeverityBadgeClass(v.severity)}`}>
                        {v.severity}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadgeClass(v.status)}`}>
                        {v.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {/* Step 1: Open → Assign */}
                      {v.status === 'OPEN' && (
                        canPerform('canAssignAction') ? (
                          <button
                            onClick={() => setAssignModalViolation(v)}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold text-xs shadow-sm transition"
                          >
                            {t('btn_assign_action', 'Assign Officer')}
                          </button>
                        ) : (
                          <span className="text-slate-400 text-xs italic">Awaiting Assignment</span>
                        )
                      )}

                      {/* Step 2: Assigned / In Progress / Rework → Submit Proof */}
                      {(v.status === 'ASSIGNED' || v.status === 'IN_PROGRESS' || v.status === 'REWORK_REQUIRED') && (
                        <button
                          onClick={() => setProofModalViolation(v)}
                          className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-semibold text-xs shadow-sm transition"
                        >
                          {t('btn_submit_proof', 'Submit Proof')}
                        </button>
                      )}

                      {/* Step 3: Submitted → Verify & Approve/Reject */}
                      {(v.status === 'ACTION_SUBMITTED' || v.status === 'UNDER_VERIFICATION') && (
                        canPerform('canVerifyAction') ? (
                          <button
                            onClick={() => setVerifyModalViolation(v)}
                            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-semibold text-xs shadow-sm transition"
                          >
                            {t('btn_verify_approve', 'Verify & Sign')}
                          </button>
                        ) : (
                          <span className="text-slate-400 text-xs italic">Awaiting Sign-off</span>
                        )
                      )}

                      {/* Step 4: Closed */}
                      {v.status === 'CLOSED' && (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[11px] flex items-center justify-end">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> {t('status_closed', 'Verified & Closed')}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal 1: Assign Officer */}
      {assignModalViolation && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Assign Remediation Task</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Assign responsible officer and statutory SLA deadline for: <strong>{assignModalViolation.title}</strong>
            </p>

            <form onSubmit={handleAssignSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Assignee Officer</label>
                <select
                  value={assigneeName}
                  onChange={(e) => setAssigneeName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white outline-none"
                >
                  <option value="Rahul Verma">Rahul Verma (Corrective Officer - Mining)</option>
                  <option value="Sunil Patil">Sunil Patil (Safety Officer)</option>
                  <option value="Ajay Kher">Ajay Kher (Mechanical Operations)</option>
                  <option value="Vikram Singh">Vikram Singh (Environment Officer)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Statutory Deadline</label>
                <input
                  type="date"
                  required
                  value={assignDeadline}
                  onChange={(e) => setAssignDeadline(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAssignModalViolation(null)}
                  className="w-1/3 py-2 border rounded-xl font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold shadow-md transition"
                >
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Submit Action Proof */}
      {proofModalViolation && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Submit Corrective Action Proof</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Upload photographic evidence and technical notes for: <strong>{proofModalViolation.title}</strong>
            </p>

            <form onSubmit={handleProofSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Remedial Action Description</label>
                <textarea
                  required
                  rows={3}
                  value={proofNotes}
                  onChange={(e) => setProofNotes(e.target.value)}
                  placeholder="Detail repairs completed, drainage pumps installed, barrier rebuilt, etc..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Photo Evidence URL</label>
                <input
                  type="text"
                  value={proofPhoto}
                  onChange={(e) => setProofPhoto(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white outline-none"
                />
                <img
                  src={proofPhoto}
                  alt="Proof Preview"
                  className="w-full h-32 object-cover rounded-lg mt-2 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setProofModalViolation(null)}
                  className="w-1/3 py-2 border rounded-xl font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-semibold shadow-md transition"
                >
                  Submit for Verification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Verify & Approve / Reject (Supervisor / Inspector) */}
      {verifyModalViolation && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  Supervisor Verification Gate
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base mt-0.5">
                  {verifyModalViolation.title}
                </h3>
              </div>
              <button
                onClick={() => setVerifyModalViolation(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl text-xs">
              <div className="text-slate-700 dark:text-slate-300">
                <strong>Assignee:</strong> {verifyModalViolation.assigneeName} ({verifyModalViolation.assigneeRole})
              </div>
              <div className="text-slate-700 dark:text-slate-300">
                <strong>Submitted Remediation:</strong> {verifyModalViolation.verificationNotes || 'Repairs performed as per protocol.'}
              </div>
              {verifyModalViolation.afterPhotoUrl && (
                <div>
                  <span className="text-slate-400 block mb-1">Attached Completion Proof:</span>
                  <img
                    src={verifyModalViolation.afterPhotoUrl}
                    alt="Proof"
                    className="w-full h-36 object-cover rounded-lg border border-slate-200 dark:border-slate-700"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 text-xs font-semibold mb-1">Inspector Verification Remarks</label>
              <textarea
                rows={2}
                value={verificationNotes}
                onChange={(e) => setVerificationNotes(e.target.value)}
                placeholder="Enter physical examination notes, testing readings, or reason for rework..."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white text-xs outline-none focus:border-sky-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => handleVerifySubmit(false)}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center space-x-1"
              >
                <X className="w-4 h-4" />
                <span>Reject (Demand Rework)</span>
              </button>
              <button
                onClick={() => handleVerifySubmit(true)}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center space-x-1"
              >
                <Check className="w-4 h-4" />
                <span>Approve & Close</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
