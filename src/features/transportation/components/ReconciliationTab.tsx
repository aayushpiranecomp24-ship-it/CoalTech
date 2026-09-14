// COALTECH - Weighbridge Gross/Tare Reconciliation Board Tab
import React, { useState } from 'react';
import { useGovernance } from '../../../context/GovernanceContext';
import { useI18n } from '../../../context/I18nContext';
import type { CoalMovement } from '../../../types';
import {
  Scale,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Search,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface ReconciliationTabProps {
  onOpenReceiptModal: (m: CoalMovement) => void;
  onOpenDetailDrawer: (m: CoalMovement) => void;
}

export const ReconciliationTab: React.FC<ReconciliationTabProps> = ({
  onOpenReceiptModal,
  onOpenDetailDrawer,
}) => {
  const { coalMovements } = useGovernance();
  const { t } = useI18n();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'RECONCILED' | 'DISCREPANCY_FLAGGED' | 'IN_TRANSIT'>('ALL');

  const filteredMovements = coalMovements.filter((m) => {
    const matchesSearch =
      m.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.originMineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.destinationName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL'
        ? true
        : statusFilter === 'RECONCILED'
        ? m.status === 'RECONCILED'
        : statusFilter === 'DISCREPANCY_FLAGGED'
        ? m.status === 'DISCREPANCY_FLAGGED'
        : m.status === 'IN_TRANSIT' || m.status === 'DISPATCHED';

    return matchesSearch && matchesStatus;
  });

  // Calculate reconciliation KPIs
  const totalDispatched = coalMovements.reduce((acc, m) => acc + (m.dispatchedNetTonnes || 0), 0);
  const totalReceived = coalMovements.reduce((acc, m) => acc + (m.receivedNetTonnes || m.dispatchedNetTonnes || 0), 0);
  const reconciledCount = coalMovements.filter((m) => m.status === 'RECONCILED').length;
  const discrepancyCount = coalMovements.filter((m) => m.status === 'DISCREPANCY_FLAGGED').length;
  const pendingReceiptCount = coalMovements.filter((m) => m.status === 'IN_TRANSIT' || m.status === 'DISPATCHED').length;

  return (
    <div className="space-y-6">
      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Net Coal Dispatched</span>
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-500">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {totalDispatched.toFixed(1)} MT
          </div>
          <div className="mt-1 text-[11px] text-slate-400">Pithead weighbridge certified</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Reconciled at Siding</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {reconciledCount} Dispatches
          </div>
          <div className="mt-1 text-[11px] text-emerald-500 font-semibold">
            {totalReceived.toFixed(1)} MT accepted (&lt;0.5% variance)
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Statutory Discrepancies</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-rose-600 dark:text-rose-400">
            {discrepancyCount} Flagged
          </div>
          <div className="mt-1 text-[11px] text-rose-500 font-medium">
            Triggered 24h CAPA tickets
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Pending Weigh-In</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {pendingReceiptCount} Tippers
          </div>
          <div className="mt-1 text-[11px] text-slate-400">En route to railway siding</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('filter_search', 'Filter movements, vehicle, siding...')}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-750 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              statusFilter === 'ALL'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-750'
            }`}
          >
            All Records
          </button>
          <button
            onClick={() => setStatusFilter('DISCREPANCY_FLAGGED')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              statusFilter === 'DISCREPANCY_FLAGGED'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-750'
            }`}
          >
            Flagged ({discrepancyCount})
          </button>
          <button
            onClick={() => setStatusFilter('RECONCILED')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              statusFilter === 'RECONCILED'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-750'
            }`}
          >
            Reconciled
          </button>
          <button
            onClick={() => setStatusFilter('IN_TRANSIT')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              statusFilter === 'IN_TRANSIT'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-750'
            }`}
          >
            In Transit ({pendingReceiptCount})
          </button>
        </div>
      </div>

      {/* Reconciliation Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-850/70 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Movement / Reg No</th>
                <th className="py-3 px-4">Origin & Destination</th>
                <th className="py-3 px-4">Dispatch Weight (Gross / Net)</th>
                <th className="py-3 px-4">Received Weight (Gross / Net)</th>
                <th className="py-3 px-4">Variance</th>
                <th className="py-3 px-4">RFID Seal</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredMovements.map((m) => {
                const varianceTons = m.weightDiscrepancyTonnes ?? (m.receivedNetTonnes ? m.dispatchedNetTonnes - m.receivedNetTonnes : null);
                const variancePct = m.weightDiscrepancyPercent ?? (varianceTons && m.dispatchedNetTonnes ? (varianceTons / m.dispatchedNetTonnes) * 100 : null);
                const isCriticalDiscrepancy = (variancePct !== null && Math.abs(variancePct) > 0.5) || m.sealIntact === false;

                return (
                  <tr
                    key={m.id}
                    className={`hover:bg-slate-50/70 dark:hover:bg-slate-850/50 transition ${
                      isCriticalDiscrepancy ? 'bg-rose-500/5' : ''
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-sky-600 dark:text-sky-400">
                        {m.id}
                      </div>
                      <div className="font-semibold text-slate-800 dark:text-white mt-0.5">
                        {m.vehiclePlate}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-900 dark:text-slate-200">
                        {m.originMineName}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center space-x-1 mt-0.5">
                        <ArrowRight className="w-3 h-3" />
                        <span>{m.destinationName}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 dark:text-slate-200">
                        Gross: {m.dispatchedGrossTonnes.toFixed(2)} MT
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Net: {m.dispatchedNetTonnes.toFixed(2)} MT (Tare: {m.dispatchedTareTonnes.toFixed(2)})
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      {m.receivedNetTonnes !== undefined ? (
                        <>
                          <div className="font-semibold text-slate-900 dark:text-slate-200">
                            Gross: {m.receivedGrossTonnes?.toFixed(2) || '—'} MT
                          </div>
                          <div className="text-[11px] text-slate-400">
                            Net: {m.receivedNetTonnes.toFixed(2)} MT
                          </div>
                        </>
                      ) : (
                        <span className="text-amber-500 text-[11px] font-medium flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Awaiting Weighbridge In-Gate</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      {variancePct !== null ? (
                        <div>
                          <span
                            className={`font-bold font-mono px-2 py-0.5 rounded ${
                              Math.abs(variancePct) > 0.5
                                ? 'bg-rose-500/10 text-rose-500 border border-rose-500/30'
                                : 'bg-emerald-500/10 text-emerald-500'
                            }`}
                          >
                            {variancePct > 0 ? `-${variancePct.toFixed(2)}%` : `+${Math.abs(variancePct).toFixed(2)}%`}
                          </span>
                          <div className="text-[10px] text-slate-400 mt-1">
                            {varianceTons ? `${Math.abs(varianceTons).toFixed(2)} MT diff` : ''}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          m.sealIntact !== false
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : 'bg-rose-500/10 text-rose-500 animate-pulse'
                        }`}
                      >
                        {m.sealIntact !== false ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <AlertTriangle className="w-3 h-3" />
                        )}
                        <span>{m.sealIntact !== false ? 'INTACT' : 'TAMPERED / BROKEN'}</span>
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          m.status === 'RECONCILED'
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : m.status === 'DISCREPANCY_FLAGGED'
                            ? 'bg-rose-500/10 text-rose-500 font-black ring-1 ring-rose-500/30'
                            : 'bg-amber-500/10 text-amber-500'
                        }`}
                      >
                        {m.status.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {m.status === 'IN_TRANSIT' || m.status === 'DISPATCHED' ? (
                          <button
                            onClick={() => onOpenReceiptModal(m)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold shadow-sm transition"
                          >
                            Reconcile
                          </button>
                        ) : (
                          <button
                            onClick={() => onOpenDetailDrawer(m)}
                            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                            title="View Full Siding Audit Trace"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
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
  );
};
