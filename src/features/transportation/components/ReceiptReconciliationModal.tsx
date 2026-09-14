import React, { useState, useEffect } from 'react';
import { useGovernance } from '../../../context/GovernanceContext';
import { X, Scale, AlertTriangle, ShieldCheck, ShieldAlert, CheckCircle2, Lock } from 'lucide-react';
import type { CoalMovement } from '../../../types';

interface ReceiptReconciliationModalProps {
  isOpen: boolean;
  onClose: () => void;
  movement: CoalMovement | null;
  onSuccess?: () => void;
}

export const ReceiptReconciliationModal: React.FC<ReceiptReconciliationModalProps> = ({
  isOpen,
  onClose,
  movement,
  onSuccess,
}) => {
  const { recordWeighbridgeReceipt } = useGovernance();

  const [receivedGross, setReceivedGross] = useState<number>(0);
  const [receivedTare, setReceivedTare] = useState<number>(0);
  const [sealIntact, setSealIntact] = useState<boolean>(true);
  const [discrepancyReason, setDiscrepancyReason] = useState<string>('Pilferage Suspected / En-route Unloading');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (movement) {
      // Default to matching or slightly different weights
      setReceivedGross(movement.dispatchedGrossTonnes);
      setReceivedTare(movement.dispatchedTareTonnes);
      setSealIntact(true);
      setDiscrepancyReason('Pilferage Suspected / En-route Unloading');
    }
  }, [movement]);

  if (!isOpen || !movement) return null;

  const receivedNet = Number((receivedGross - receivedTare).toFixed(2));
  const varianceTonnes = Number((movement.dispatchedNetTonnes - receivedNet).toFixed(2));
  const variancePercent = movement.dispatchedNetTonnes > 0
    ? Number(((varianceTonnes / movement.dispatchedNetTonnes) * 100).toFixed(2))
    : 0;

  const isLossExcessive = varianceTonnes > movement.transitLossAllowanceTonnes;
  const isFlagged = isLossExcessive || !sealIntact;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (receivedGross <= receivedTare) {
      alert('Gross weight must be greater than Tare weight.');
      return;
    }

    setIsSubmitting(true);
    recordWeighbridgeReceipt(
      movement.id,
      receivedGross,
      receivedTare,
      sealIntact,
      isFlagged ? discrepancyReason : undefined
    );
    setIsSubmitting(false);
    onSuccess?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">Destination Weighbridge Receipt</h2>
              <p className="text-xs text-slate-400 font-mono">
                {movement.id} • Vehicle: {movement.vehiclePlate}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Movement Summary Pill */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Origin Pit:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                {movement.originMineName}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Destination:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                {movement.destinationName}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Dispatched Net:</span>
              <span className="font-mono font-bold text-sky-500">{movement.dispatchedNetTonnes} Tonnes</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Loss Allowance:</span>
              <span className="font-mono font-semibold text-slate-500">±{movement.transitLossAllowanceTonnes} T (0.5%)</span>
            </div>
          </div>

          {/* Weighbridge Inputs */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Scale className="w-4 h-4 text-sky-500" />
              <span>Gross & Tare Weighbridge Scale Sensors</span>
            </h3>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Received Gross (T) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={receivedGross}
                  onChange={(e) => setReceivedGross(Number(e.target.value))}
                  required
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Received Tare (T) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={receivedTare}
                  onChange={(e) => setReceivedTare(Number(e.target.value))}
                  required
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Calculated Net (T)
                </label>
                <div
                  className={`p-1.5 rounded-lg text-xs font-mono font-black text-center border ${
                    receivedNet > 0
                      ? 'bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700'
                      : 'bg-rose-500/10 text-rose-500 border-rose-500/30'
                  }`}
                >
                  {receivedNet > 0 ? `${receivedNet} T` : 'ERR'}
                </div>
              </div>
            </div>
          </div>

          {/* Variance & Discrepancy Card */}
          <div
            className={`p-4 rounded-xl border transition ${
              isFlagged
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center space-x-1.5">
                {isFlagged ? <AlertTriangle className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                <span>
                  {isFlagged ? 'Transit Weight Variance Breach Detected' : 'Weight Reconciled Within Statutory Tolerance'}
                </span>
              </span>
              <span className="font-mono text-sm">
                Variance: {varianceTonnes > 0 ? `-${varianceTonnes} T` : `+${Math.abs(varianceTonnes)} T`} ({variancePercent}%)
              </span>
            </div>
            <p className="text-[11px] mt-1 opacity-90">
              {isLossExcessive
                ? `Net loss of ${varianceTonnes} Tonnes exceeds the permissible statutory moisture/dust allowance of ${movement.transitLossAllowanceTonnes} Tonnes (0.5%).`
                : `Measured payload difference is within acceptable DGMS CMR Regulation tolerances.`}
            </p>
          </div>

          {/* Seal Verification */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
            <label className="block text-xs font-bold text-slate-900 dark:text-white">
              Tamper-Evident RFID Seal Status
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSealIntact(true)}
                className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-2 transition ${
                  sealIntact
                    ? 'bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                    : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>RFID Seal Intact & Valid</span>
              </button>

              <button
                type="button"
                onClick={() => setSealIntact(false)}
                className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-2 transition ${
                  !sealIntact
                    ? 'bg-rose-500/15 border-rose-500 text-rose-600 dark:text-rose-400'
                    : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Seal Broken / Tampered</span>
              </button>
            </div>
          </div>

          {/* Discrepancy Reason Input (if flagged) */}
          {isFlagged && (
            <div className="p-4 bg-rose-500/5 border border-rose-500/20 rounded-xl space-y-2 animate-in fade-in duration-200">
              <label className="block text-xs font-bold text-rose-600 dark:text-rose-400">
                Primary Discrepancy Cause for Statutory Violation Record *
              </label>
              <select
                value={discrepancyReason}
                onChange={(e) => setDiscrepancyReason(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-rose-500/30 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
              >
                <option value="Pilferage Suspected / En-route Unloading">Pilferage Suspected / Unscheduled Route Stoppage</option>
                <option value="Severe Spillage during Transit">Severe Tipper Coal Spillage during Transit</option>
                <option value="Weighbridge Sensor Calibration Drift">Weighbridge Load Cell Calibration Anomaly</option>
                <option value="Seal Broken or Tampered">Physical RFID Tamper or Tag Detached</option>
                <option value="Severe Excessive Moisture Evaporation">Severe Weather Induced Moisture Loss</option>
              </select>

              <div className="flex items-start space-x-2 text-[11px] text-rose-500 dark:text-rose-400 pt-1">
                <Lock className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <span>
                  <strong>Automated Governance Trigger:</strong> This receipt will immediately create a{' '}
                  <span className="underline">Critical Statutory Violation</span>, assign a 24-hour CAPA ticket to the
                  Transportation Head, dispatch alert notifications, and anchor a verified block onto the SHA-256 Ledger.
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2 rounded-xl text-xs font-bold text-white shadow-lg flex items-center space-x-2 transition ${
                isFlagged
                  ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/20'
                  : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isFlagged ? 'Record & Trigger Statutory Flag' : 'Confirm Weighbridge Receipt'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
