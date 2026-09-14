import React, { useState } from 'react';
import { useGovernance } from '../../../context/GovernanceContext';
import {
  Search,
  Filter,
  Scale,
  AlertTriangle,
  CheckCircle2,
  Eye,
  Plus,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';
import type { CoalMovement } from '../../../types';

interface CoalMovementsTabProps {
  onOpenDispatchWizard: () => void;
  onOpenReceiptModal: (movement: CoalMovement) => void;
  onOpenDetailDrawer: (movement: CoalMovement) => void;
}

export const CoalMovementsTab: React.FC<CoalMovementsTabProps> = ({
  onOpenDispatchWizard,
  onOpenReceiptModal,
  onOpenDetailDrawer,
}) => {
  const { coalMovements, mines, reconcileCoalMovement } = useGovernance();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [mineFilter, setMineFilter] = useState<string>('ALL');

  // Metrics
  const totalDispatches = coalMovements.length;
  const inTransitCount = coalMovements.filter((m) => m.status === 'IN_TRANSIT' || m.status === 'DISPATCHED').length;
  const totalDispatchedTonnes = coalMovements.reduce((acc, m) => acc + m.dispatchedNetTonnes, 0);
  const discrepancyCount = coalMovements.filter((m) => m.status === 'DISCREPANCY_FLAGGED').length;
  const reconciledCount = coalMovements.filter((m) => m.status === 'RECONCILED').length;

  // Filtered List
  const filteredMovements = coalMovements.filter((m) => {
    const matchesSearch =
      m.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.vehiclePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.destinationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.eWayBillNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || m.status === statusFilter;
    const matchesMine = mineFilter === 'ALL' || m.originMineId === mineFilter;

    return matchesSearch && matchesStatus && matchesMine;
  });

  const getStatusBadge = (status: CoalMovement['status']) => {
    switch (status) {
      case 'DISPATCHED':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-sky-500/10 text-sky-500 border border-sky-400/20">
            DISPATCHED
          </span>
        );
      case 'IN_TRANSIT':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-500/10 text-blue-400 border border-blue-400/20 animate-pulse">
            IN TRANSIT
          </span>
        );
      case 'RECEIVED':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/10 text-amber-500 border border-amber-400/20">
            WEIGHED (ARRIVED)
          </span>
        );
      case 'RECONCILED':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-400/20">
            RECONCILED
          </span>
        );
      case 'DISCREPANCY_FLAGGED':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-500/10 text-rose-500 border border-rose-400/20 flex items-center space-x-1">
            <AlertTriangle className="w-3 h-3" />
            <span>DISCREPANCY</span>
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-500/10 text-slate-400 border border-slate-400/20">
            CANCELLED
          </span>
        );
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action & KPI Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Active Movements
          </span>
          <span className="text-2xl font-black text-slate-900 dark:text-white font-sans">{inTransitCount}</span>
          <span className="text-[10px] text-slate-400 block mt-1">{totalDispatches} total logged trips</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-sky-200 dark:border-sky-900/40 p-4 rounded-xl border-l-4 border-l-sky-500 shadow-xs">
          <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider block">
            Dispatched Net Coal
          </span>
          <span className="text-2xl font-black text-sky-600 dark:text-sky-400 font-sans">
            {totalDispatchedTonnes.toFixed(1)} MT
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">Total payload dispatched</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/40 p-4 rounded-xl border-l-4 border-l-emerald-500 shadow-xs">
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
            Reconciled Cleanly
          </span>
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-sans">
            {reconciledCount}
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">Zero statutory loss violations</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/40 p-4 rounded-xl border-l-4 border-l-rose-500 shadow-xs">
          <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block">
            Pilferage / Discrepancies
          </span>
          <span className="text-2xl font-black text-rose-600 dark:text-rose-400 font-sans">
            {discrepancyCount}
          </span>
          <span className="text-[10px] text-rose-500 font-semibold block mt-1">Linked to CAPA & Audit</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-3 w-full sm:w-auto flex-1">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Movement ID, vehicle, driver..."
              className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="DISPATCHED">Dispatched</option>
              <option value="IN_TRANSIT">In Transit</option>
              <option value="RECEIVED">Weighed (Received)</option>
              <option value="RECONCILED">Reconciled</option>
              <option value="DISCREPANCY_FLAGGED">Discrepancy Flagged</option>
            </select>

            <select
              value={mineFilter}
              onChange={(e) => setMineFilter(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
            >
              <option value="ALL">All Origin Mines</option>
              {mines.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={onOpenDispatchWizard}
          className="w-full sm:w-auto px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-lg shadow-sky-600/20 transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Coal Dispatch</span>
        </button>
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Movement ID</th>
                <th className="py-3 px-4">Origin Siding → Delivery Point</th>
                <th className="py-3 px-4">Vehicle & Driver</th>
                <th className="py-3 px-4">Coal Grade</th>
                <th className="py-3 px-4 text-right">Dispatched Net</th>
                <th className="py-3 px-4 text-right">Received Net</th>
                <th className="py-3 px-4 text-right">Variance</th>
                <th className="py-3 px-4 text-center">RFID Seal</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredMovements.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400">
                    No coal movements matching the current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredMovements.map((movement) => (
                  <tr
                    key={movement.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-850/60 transition group cursor-pointer"
                    onClick={() => onOpenDetailDrawer(movement)}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-sky-600 dark:text-sky-400 whitespace-nowrap">
                      {movement.id}
                    </td>

                    <td className="py-3 px-4 max-w-[200px]">
                      <div className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {movement.originMineName}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center space-x-1 truncate">
                        <ArrowRight className="w-2.5 h-2.5 shrink-0" />
                        <span className="truncate">{movement.destinationName}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-mono font-semibold text-slate-900 dark:text-slate-100">
                        {movement.vehiclePlate}
                      </div>
                      <div className="text-[10px] text-slate-400">{movement.driverName}</div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="text-[11px] text-slate-600 dark:text-slate-300 truncate max-w-[120px] block">
                        {movement.coalGrade}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                      {movement.dispatchedNetTonnes} T
                    </td>

                    <td className="py-3 px-4 text-right font-mono text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      {movement.receivedNetTonnes ? `${movement.receivedNetTonnes} T` : '—'}
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-semibold whitespace-nowrap">
                      {movement.weightDiscrepancyTonnes !== undefined ? (
                        <span
                          className={
                            movement.weightDiscrepancyTonnes > movement.transitLossAllowanceTonnes
                              ? 'text-rose-500 font-bold'
                              : 'text-emerald-500'
                          }
                        >
                          {movement.weightDiscrepancyTonnes > 0
                            ? `-${movement.weightDiscrepancyTonnes} T`
                            : `${movement.weightDiscrepancyTonnes} T`}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      {movement.sealIntact === false ? (
                        <span className="inline-flex items-center space-x-1 text-rose-500" title="Seal Tampered">
                          <ShieldAlert className="w-4 h-4" />
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 text-emerald-500" title="Seal Intact">
                          <ShieldCheck className="w-4 h-4" />
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      {getStatusBadge(movement.status)}
                    </td>

                    <td
                      className="py-3 px-4 text-right whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end space-x-1.5">
                        {movement.status === 'IN_TRANSIT' || movement.status === 'DISPATCHED' ? (
                          <button
                            onClick={() => onOpenReceiptModal(movement)}
                            className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 rounded-lg text-[11px] font-semibold flex items-center space-x-1 transition"
                            title="Record Destination Weighbridge Receipt"
                          >
                            <Scale className="w-3 h-3" />
                            <span>Weigh In</span>
                          </button>
                        ) : movement.status === 'RECEIVED' ? (
                          <button
                            onClick={() => reconcileCoalMovement(movement.id)}
                            className="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded-lg text-[11px] font-semibold flex items-center space-x-1 transition"
                            title="Complete Statutory Reconciliation"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Reconcile</span>
                          </button>
                        ) : null}

                        <button
                          onClick={() => onOpenDetailDrawer(movement)}
                          className="p-1.5 text-slate-400 hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-slate-800 rounded-lg transition"
                          title="View e-Manifest & Audit Hash"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
