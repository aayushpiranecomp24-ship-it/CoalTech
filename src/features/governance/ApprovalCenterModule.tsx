import React, { useState } from 'react';
import {
  CheckCircle,
  XCircle,
  Clock,
  Search,
  User,
  Building2,
  FileCheck2,
  Check,
  X,
  Calendar
} from 'lucide-react';
import { useGovernance } from '../../context/GovernanceContext';
import type { ApprovalCategory, PendingApproval, SeverityLevel } from '../../types';

export const ApprovalCenterModule: React.FC = () => {
  const {
    pendingApprovals,
    resolvePendingApproval,
    currentUser
  } = useGovernance();

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('PENDING');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Decision Modal
  const [activeApproval, setActiveApproval] = useState<PendingApproval | null>(null);
  const [decisionType, setDecisionType] = useState<'APPROVED' | 'REJECTED'>('APPROVED');
  const [decisionNotes, setDecisionNotes] = useState('');

  const filteredApprovals = pendingApprovals.filter(item => {
    if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;
    if (selectedStatus !== 'ALL' && item.status !== selectedStatus) return false;
    if (selectedUrgency !== 'ALL' && item.urgency !== selectedUrgency) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchRequester = item.requestedBy.toLowerCase().includes(q);
      const matchRef = item.referenceId.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchRequester && !matchRef) return false;
    }
    return true;
  });

  const pendingCount = pendingApprovals.filter(a => a.status === 'PENDING').length;
  const criticalCount = pendingApprovals.filter(a => a.status === 'PENDING' && (a.urgency === 'CRITICAL' || a.urgency === 'HIGH')).length;
  const approvedCount = pendingApprovals.filter(a => a.status === 'APPROVED').length;
  const rejectedCount = pendingApprovals.filter(a => a.status === 'REJECTED').length;

  const handleOpenDecision = (item: PendingApproval, type: 'APPROVED' | 'REJECTED') => {
    setActiveApproval(item);
    setDecisionType(type);
    setDecisionNotes(type === 'APPROVED' ? 'Verified with statutory guidelines and approved.' : 'Rejected due to insufficient documentation.');
  };

  const handleConfirmDecision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeApproval) return;
    resolvePendingApproval(activeApproval.id, decisionType, decisionNotes);
    setActiveApproval(null);
  };

  const getUrgencyBadge = (urgency: SeverityLevel) => {
    switch (urgency) {
      case 'CRITICAL':
        return 'bg-red-950 text-red-300 border-red-800';
      case 'HIGH':
        return 'bg-amber-950 text-amber-300 border-amber-800';
      case 'MEDIUM':
        return 'bg-blue-950 text-blue-300 border-blue-800';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getCategoryLabel = (category: ApprovalCategory) => {
    switch (category) {
      case 'OVERTIME_AUTHORIZATION':
        return 'Overtime & Wages';
      case 'CAPA_CLOSURE':
        return 'CAPA Hazard Sign-off';
      case 'CRITICAL_RISK_ACTION':
        return 'High Risk Clearance';
      case 'CONTRACTOR_ONBOARDING':
        return 'Contractor Gate Pass';
      case 'MAINTENANCE_RELEASE':
        return 'HEMM Fitness Release';
      case 'ROUTE_RESTRICTION_CLEARANCE':
        return 'Route Restriction Waiver';
      default:
        return category;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">
                  Centralized Statutory & Operational Approval Center
                </h1>
                <p className="text-sm text-slate-400 mt-0.5">
                  Single-pane authorization workflow for high-risk clearances, CAPA verification, contractor permits, and overtime mandates.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Current Signatory:</span>
            <span className="text-xs font-semibold text-slate-200 px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-md">
              {currentUser?.name || 'Authorized Signatory'} ({currentUser?.role || 'Approver'})
            </span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl">
            <div className="text-xs font-medium text-slate-400">Pending Review</div>
            <div className="text-2xl font-bold text-amber-400 mt-1">{pendingCount}</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Awaiting authorized signature</p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl">
            <div className="text-xs font-medium text-slate-400">High / Critical Urgency</div>
            <div className="text-2xl font-bold text-red-400 mt-1">{criticalCount}</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Priority safety & operational SLA</p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl">
            <div className="text-xs font-medium text-slate-400">Approved This Month</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">{approvedCount}</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Fully verified and logged</p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl">
            <div className="text-xs font-medium text-slate-400">Rejected / Escalated</div>
            <div className="text-2xl font-bold text-slate-400 mt-1">{rejectedCount}</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Returned with audit remarks</p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
            {(['PENDING', 'APPROVED', 'REJECTED', 'ALL'] as const).map(st => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                  selectedStatus === st
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {st === 'ALL' ? 'All Status' : st.charAt(0) + st.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg px-3 py-2"
          >
            <option value="ALL">All Categories</option>
            <option value="OVERTIME_AUTHORIZATION">Overtime Authorization</option>
            <option value="CAPA_CLOSURE">CAPA Closure</option>
            <option value="CRITICAL_RISK_ACTION">Critical Risk Action</option>
            <option value="CONTRACTOR_ONBOARDING">Contractor Onboarding</option>
            <option value="MAINTENANCE_RELEASE">Maintenance Release</option>
            <option value="ROUTE_RESTRICTION_CLEARANCE">Route Restriction Clearance</option>
          </select>

          {/* Urgency Filter */}
          <select
            value={selectedUrgency}
            onChange={e => setSelectedUrgency(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg px-3 py-2"
          >
            <option value="ALL">All Urgencies</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search approvals..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Approvals List */}
      <div className="space-y-3">
        {filteredApprovals.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-400">
            <CheckCircle className="w-10 h-10 mx-auto mb-3 text-emerald-400 opacity-60" />
            <p className="text-sm font-medium text-slate-200">No matching approval requests found</p>
            <p className="text-xs text-slate-500 mt-1">All action items in this category are fully up to date.</p>
          </div>
        ) : (
          filteredApprovals.map(item => (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition shadow-sm"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/60">
                      {item.id}
                    </span>
                    <span className="text-xs font-medium text-slate-300 px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                      {getCategoryLabel(item.category)}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${getUrgencyBadge(item.urgency)}`}>
                      {item.urgency}
                    </span>
                    {item.status === 'PENDING' ? (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Pending Review
                      </span>
                    ) : item.status === 'APPROVED' ? (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Approved
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800 flex items-center gap-1">
                        <X className="w-3 h-3" /> Rejected
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-semibold text-white mt-1">{item.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      Requester: <strong className="text-slate-300">{item.requestedBy}</strong> ({item.requesterRole})
                    </span>
                    {item.mineName && (
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-500" />
                        Mine: <strong className="text-slate-300">{item.mineName}</strong>
                      </span>
                    )}
                    <span className="flex items-center gap-1 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {item.requestedAt}
                    </span>
                    <span className="font-mono text-slate-500">
                      Ref: {item.referenceId}
                    </span>
                  </div>

                  {item.decisionNotes && (
                    <div className="mt-3 p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300">
                      <strong className="text-slate-400">Review Notes:</strong> {item.decisionNotes}
                      <span className="ml-2 text-slate-500 font-mono">
                        (by {item.reviewedBy} at {item.reviewedAt})
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {item.status === 'PENDING' && (
                  <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0">
                    <button
                      onClick={() => handleOpenDecision(item, 'REJECTED')}
                      className="px-3 py-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/80 rounded-lg text-xs font-medium transition flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" /> Reject
                    </button>
                    <button
                      onClick={() => handleOpenDecision(item, 'APPROVED')}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium shadow-sm transition flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" /> Approve Clearance
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Decision Modal */}
      {activeApproval && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-lg w-full shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              {decisionType === 'APPROVED' ? (
                <>
                  <CheckCircle className="w-5 h-5 text-emerald-400" /> Confirm Approval
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-red-400" /> Confirm Rejection
                </>
              )}
            </h3>
            <p className="text-xs text-slate-300 mb-4">{activeApproval.title}</p>

            <form onSubmit={handleConfirmDecision} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Authorizer Remarks / Justification
                </label>
                <textarea
                  rows={3}
                  value={decisionNotes}
                  onChange={e => setDecisionNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200"
                  required
                />
              </div>

              <div className="text-[11px] text-slate-500">
                This action will be digitally signed with your credential (<strong>{currentUser?.name || 'Authorized Signatory'}</strong>) and committed to the immutable audit trail.
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveApproval(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 text-xs font-medium rounded-lg shadow ${
                    decisionType === 'APPROVED'
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  {decisionType === 'APPROVED' ? 'Confirm Approval' : 'Confirm Rejection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
