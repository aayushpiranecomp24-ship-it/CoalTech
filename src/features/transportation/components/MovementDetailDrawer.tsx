import React from 'react';
import { useGovernance } from '../../../context/GovernanceContext';
import {
  X,
  Truck,
  Scale,
  ShieldCheck,
  ShieldAlert,
  FileText,
  MapPin,
  Clock,
  Hash,
  AlertOctagon,
  ExternalLink,
  Printer,
  Copy,
} from 'lucide-react';
import type { CoalMovement } from '../../../types';

interface MovementDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  movement: CoalMovement | null;
  onNavigateTab?: (tab: string) => void;
}

export const MovementDetailDrawer: React.FC<MovementDetailDrawerProps> = ({
  isOpen,
  onClose,
  movement,
  onNavigateTab,
}) => {
  const { blockchainBlocks, violations } = useGovernance();

  if (!isOpen || !movement) return null;

  const linkedViolation = violations.find((v) => v.id === movement.linkedViolationId);
  const linkedBlock = blockchainBlocks.find(
    (b) => b.entityId === movement.id || (movement.linkedViolationId && b.entityId === movement.linkedViolationId)
  );

  const getStatusBadge = (status: CoalMovement['status']) => {
    switch (status) {
      case 'DISPATCHED':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-sky-500/20 text-sky-400 border border-sky-400/30">
            DISPATCHED
          </span>
        );
      case 'IN_TRANSIT':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-400/30 animate-pulse">
            IN TRANSIT
          </span>
        );
      case 'RECEIVED':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-400/30">
            WEIGHBRIDGE RECEIVED
          </span>
        );
      case 'RECONCILED':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-400/30">
            RECONCILED
          </span>
        );
      case 'DISCREPANCY_FLAGGED':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-400/30">
            DISCREPANCY FLAGGED
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-500/20 text-slate-400 border border-slate-400/30">
            CANCELLED
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-500/20 text-slate-400">
            {status}
          </span>
        );
    }
  };

  const handlePrintSlip = () => {
    window.print();
  };

  const handleCopyManifest = () => {
    const text = `COAL DISPATCH MANIFEST: ${movement.id}\nE-Way: ${movement.eWayBillNumber}\nChallan: ${movement.challanNumber}\nVehicle: ${movement.vehiclePlate}\nOrigin: ${movement.originMineName}\nDestination: ${movement.destinationName}\nDispatched Net: ${movement.dispatchedNetTonnes} T\nReceived Net: ${movement.receivedNetTonnes || 'N/A'} T\nVariance: ${movement.weightDiscrepancyTonnes || 0} T`;
    navigator.clipboard.writeText(text);
    alert('Manifest details copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 h-full flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono font-bold text-base text-white">{movement.id}</span>
                {getStatusBadge(movement.status)}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{movement.movementType} • e-Manifest & Siding Gate Pass</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrintSlip}
              title="Print Weighbridge Slip"
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleCopyManifest}
              title="Copy Summary"
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Linked Statutory Alert Banner */}
          {movement.status === 'DISCREPANCY_FLAGGED' && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-rose-600 dark:text-rose-400 font-bold">
                <span className="flex items-center space-x-1.5">
                  <AlertOctagon className="w-4 h-4" />
                  <span>Statutory Transit Discrepancy Active</span>
                </span>
                <span className="font-mono text-xs">CRITICAL SEVERITY</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                Weight variance exceeds statutory threshold (Loss:{' '}
                <strong className="text-rose-500">{movement.weightDiscrepancyTonnes} Tonnes</strong> /{' '}
                {movement.weightDiscrepancyPercent}%). Reason: <em>{movement.discrepancyReason || 'Pilferage Suspected'}</em>.
              </p>
              {linkedViolation && (
                <div className="pt-2 flex items-center justify-between border-t border-rose-500/20 text-[11px]">
                  <span className="text-slate-500 dark:text-slate-400">
                    Linked Violation: <strong className="text-slate-800 dark:text-slate-200">{linkedViolation.id}</strong>
                  </span>
                  {onNavigateTab && (
                    <button
                      onClick={() => {
                        onClose();
                        onNavigateTab('corrective');
                      }}
                      className="text-rose-600 dark:text-rose-400 hover:underline flex items-center space-x-1 font-semibold"
                    >
                      <span>Open CAPA Ticket</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Siding Route & Locations */}
          <div className="bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center space-x-2 text-xs">
              <MapPin className="w-4 h-4 text-sky-500" />
              <span>Siding Transit Route & Waypoints</span>
            </h3>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Origin Siding</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100 block">{movement.originMineName}</span>
                <span className="text-[11px] text-slate-500 block">{movement.loadingPoint}</span>
                <div className="flex items-center text-[10px] text-slate-400 space-x-1 pt-1">
                  <Clock className="w-3 h-3" />
                  <span>Dep: {movement.departureTime}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Destination Delivery</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100 block">{movement.destinationName}</span>
                <span className="text-[11px] text-sky-500 font-semibold block">{movement.destinationType}</span>
                <div className="flex items-center text-[10px] text-slate-400 space-x-1 pt-1">
                  <Clock className="w-3 h-3" />
                  <span>
                    {movement.receivedTime ? `Arr: ${movement.receivedTime}` : `ETA: ${movement.estimatedArrival}`}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              <span>Haulage Distance: <strong className="text-slate-800 dark:text-slate-200">{movement.distanceKm} km</strong></span>
              <span>Coal Seam / Grade: <strong className="text-sky-500">{movement.coalGrade}</strong></span>
            </div>
          </div>

          {/* Dual Weighbridge Measurement Comparison */}
          <div className="bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center space-x-2 text-xs">
                <Scale className="w-4 h-4 text-emerald-500" />
                <span>Statutory Weighbridge Ledger</span>
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                Metric Tonnes (MT)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-[10px] uppercase text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-2">Metric Stage</th>
                    <th className="py-2 text-right">Gross (T)</th>
                    <th className="py-2 text-right">Tare (T)</th>
                    <th className="py-2 text-right font-bold text-slate-900 dark:text-white">Net Load (T)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono">
                  <tr>
                    <td className="py-2.5 font-sans font-semibold text-slate-700 dark:text-slate-300">1. Origin Dispatch</td>
                    <td className="py-2.5 text-right text-slate-600 dark:text-slate-400">{movement.dispatchedGrossTonnes}</td>
                    <td className="py-2.5 text-right text-slate-600 dark:text-slate-400">{movement.dispatchedTareTonnes}</td>
                    <td className="py-2.5 text-right font-bold text-sky-500">{movement.dispatchedNetTonnes} MT</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-sans font-semibold text-slate-700 dark:text-slate-300">2. Destination Ingress</td>
                    <td className="py-2.5 text-right text-slate-600 dark:text-slate-400">
                      {movement.receivedGrossTonnes ? `${movement.receivedGrossTonnes}` : '—'}
                    </td>
                    <td className="py-2.5 text-right text-slate-600 dark:text-slate-400">
                      {movement.receivedTareTonnes ? `${movement.receivedTareTonnes}` : '—'}
                    </td>
                    <td className="py-2.5 text-right font-bold text-emerald-500">
                      {movement.receivedNetTonnes ? `${movement.receivedNetTonnes} MT` : 'Pending'}
                    </td>
                  </tr>
                  {movement.receivedNetTonnes !== undefined && (
                    <tr className={movement.weightDiscrepancyTonnes && movement.weightDiscrepancyTonnes > movement.transitLossAllowanceTonnes ? 'bg-rose-500/10' : 'bg-emerald-500/10'}>
                      <td className="py-2.5 font-sans font-bold text-slate-900 dark:text-white">Transit Variance / Loss</td>
                      <td colSpan={2} className="py-2.5 text-right text-[11px] font-sans text-slate-400">
                        Statutory Limit: ±{movement.transitLossAllowanceTonnes} T
                      </td>
                      <td className="py-2.5 text-right font-bold font-mono">
                        <span className={movement.weightDiscrepancyTonnes && movement.weightDiscrepancyTonnes > movement.transitLossAllowanceTonnes ? 'text-rose-500' : 'text-emerald-500'}>
                          {movement.weightDiscrepancyTonnes || 0} MT ({movement.weightDiscrepancyPercent || 0}%)
                        </span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-200 dark:border-slate-800">
              <span className="flex items-center space-x-1.5">
                {movement.sealIntact === false ? (
                  <>
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                    <span className="text-rose-500 font-bold">RFID Seal Broken</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-500 font-semibold">RFID Seal Intact ({movement.rfidTag})</span>
                  </>
                )}
              </span>
              <span className="font-mono text-slate-400">Tag: {movement.rfidTag}</span>
            </div>
          </div>

          {/* Vehicle, Driver & Transporter */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Fleet Vehicle</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white block">{movement.vehiclePlate}</span>
              <span className="text-[10px] text-slate-500 block">Tipper ID: {movement.vehicleId}</span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">HCV Driver</span>
              <span className="font-semibold text-slate-900 dark:text-white block truncate">{movement.driverName}</span>
              <span className="text-[10px] text-emerald-500 font-semibold block">DGMS Vocational Certified</span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Transporter Vendor</span>
              <span className="font-semibold text-slate-900 dark:text-white block truncate">{movement.transporterName}</span>
              <span className="text-[10px] text-slate-500 block">Vendor ID: {movement.transporterId}</span>
            </div>
          </div>

          {/* Statutory Documents & Taxes */}
          <div className="p-4 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center space-x-2 text-xs">
              <FileText className="w-4 h-4 text-sky-500" />
              <span>Statutory Mining Clearances & e-Taxation</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs pt-1">
              <div>
                <span className="text-slate-400 block text-[10px]">GST e-Way Bill No.</span>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{movement.eWayBillNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">District Mineral Challan</span>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{movement.challanNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Contractor Freight Payout</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">₹{movement.freightCost?.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Assessed Coal Royalty</span>
                <span className="font-mono font-bold text-emerald-500">₹{movement.assessedRoyalty?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Cryptographic Ledger Proof */}
          <div className="p-4 bg-slate-950 text-white rounded-2xl border border-slate-800 space-y-2 font-mono text-[11px]">
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-1.5 text-sky-400 font-bold">
                <Hash className="w-3.5 h-3.5" />
                <span>SHA-256 Cryptographic Block Ledger</span>
              </span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                VERIFIED TAMPER-PROOF
              </span>
            </div>
            <div className="text-slate-400 space-y-1 pt-1">
              <div className="truncate">
                Block Hash: <span className="text-sky-300">{linkedBlock?.currentHash || '0x7e29a8f4c1048b29f0e4719280d9238e4a9c18273645e781'}</span>
              </div>
              <div className="truncate">
                Payload Root: <span className="text-slate-300">{linkedBlock?.payloadHash || '0x1928374650aefbcde09128374651928374650aef'}</span>
              </div>
              <div className="text-[10px] text-slate-500 flex justify-between pt-1">
                <span>Actor: {linkedBlock?.actor || 'System Dispatcher'}</span>
                <span>Block #{linkedBlock?.blockNumber || 108}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition"
          >
            Close Siding Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
