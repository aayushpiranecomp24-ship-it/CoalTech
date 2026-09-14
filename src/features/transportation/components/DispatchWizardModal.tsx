import React, { useState } from 'react';
import { useGovernance } from '../../../context/GovernanceContext';
import { X, Truck, ShieldCheck, Scale, ChevronRight, ChevronLeft, CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react';
import type { CoalMovement } from '../../../types';
import { ResourceAvailabilityService } from '../../../services/resourceAvailabilityService';

interface DispatchWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (movementId: string) => void;
}

export const DispatchWizardModal: React.FC<DispatchWizardModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { mines, fleetVehicles, fleetDrivers, contractors, createCoalMovement, dispatchCoalMovement, coalMovements } = useGovernance();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [originMineId, setOriginMineId] = useState(mines[0]?.id || 'm1');
  const [loadingPoint, setLoadingPoint] = useState('Weighbridge #2 (Incline Face)');
  const [movementType, setMovementType] = useState<CoalMovement['movementType']>('Road Haulage');
  const [destinationType, setDestinationType] = useState<CoalMovement['destinationType']>('Thermal Power Plant');
  const [destinationName, setDestinationName] = useState('NTPC Ramagundam Super Thermal Siding');
  const [coalGrade, setCoalGrade] = useState('G-7 Non-Coking Power Coal');
  const [distanceKm, setDistanceKm] = useState(48);

  const [vehicleId, setVehicleId] = useState(fleetVehicles[0]?.id || '');
  const [driverId, setDriverId] = useState(fleetDrivers[0]?.id || '');
  const [dispatchedTareTonnes, setDispatchedTareTonnes] = useState(12.4);
  const [dispatchedGrossTonnes, setDispatchedGrossTonnes] = useState(44.2);

  const [eWayBillNumber, setEWayBillNumber] = useState(`EWB-2026-${Math.floor(100000 + Math.random() * 900000)}`);
  const [challanNumber, setChallanNumber] = useState(`CH-JH-${Math.floor(10000 + Math.random() * 90000)}`);
  const [rfidTag, setRfidTag] = useState(`RFID-SEAL-${Math.floor(1000 + Math.random() * 9000)}`);
  const [freightCost, setFreightCost] = useState(14500);
  const [assessedRoyalty, setAssessedRoyalty] = useState(9850);
  const [autoDispatch, setAutoDispatch] = useState(true);

  if (!isOpen) return null;

  const dispatchedNetTonnes = Number((dispatchedGrossTonnes - dispatchedTareTonnes).toFixed(2));
  const transitLossAllowanceTonnes = Number(((dispatchedNetTonnes * 0.5) / 100).toFixed(2));

  const selectedVehicle = fleetVehicles.find((v) => v.id === vehicleId);
  const selectedDriver = fleetDrivers.find((d) => d.id === driverId);
  const originMine = mines.find((m) => m.id === originMineId);

  const handleNext = () => {
    setError(null);
    if (step === 1) {
      if (!destinationName.trim()) {
        setError('Please enter a destination facility name.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!selectedVehicle) {
        setError('Please assign an authorized fleet vehicle.');
        return;
      }
      const vehicleCheck = ResourceAvailabilityService.validateVehicleAssignment(selectedVehicle, {
        targetMineId: originMineId,
        activeMovements: coalMovements,
      });
      if (!vehicleCheck.available) {
        setError(`Vehicle Assignment Blocked: ${vehicleCheck.reason}`);
        return;
      }

      if (!selectedDriver) {
        setError('Please assign a licensed DGMS-certified driver.');
        return;
      }
      const driverCheck = ResourceAvailabilityService.validateDriverAssignment(selectedDriver, {
        activeMovements: coalMovements,
      });
      if (!driverCheck.available) {
        setError(`Driver Assignment Blocked: ${driverCheck.reason}`);
        return;
      }

      if (dispatchedGrossTonnes <= dispatchedTareTonnes) {
        setError('Gross weight must be strictly greater than Tare weight.');
        return;
      }
      if (selectedVehicle && dispatchedNetTonnes > selectedVehicle.maxCapacityTonnes + 2) {
        setError(`Payload (${dispatchedNetTonnes}T) exceeds vehicle statutory capacity (${selectedVehicle.maxCapacityTonnes}T).`);
        return;
      }
      setStep(3);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      const transporter = contractors.find((c) => c.name.toLowerCase().includes('transport') || c.category === 'Equipment') || contractors[0];

      const departure = new Date();
      const arrival = new Date(departure.getTime() + (distanceKm / 35) * 3600 * 1000);

      const movementPayload: Omit<CoalMovement, 'id' | 'status'> = {
        movementType,
        vehicleId,
        vehiclePlate: selectedVehicle?.plate || 'JH-10-AT-4482',
        driverId,
        driverName: selectedDriver?.name || 'Driver',
        transporterId: transporter?.id || 'c1',
        transporterName: selectedVehicle?.transporterName || transporter?.name || 'Bharat Coking Logistics Ltd.',
        originMineId,
        originMineName: originMine?.name || 'Jharia Deep Mine A',
        loadingPoint,
        destinationType,
        destinationName,
        coalGrade,
        eWayBillNumber,
        challanNumber,
        rfidTag,
        gpsImei: '864291048201948',
        departureTime: departure.toISOString().replace('T', ' ').substring(0, 16),
        estimatedArrival: arrival.toISOString().replace('T', ' ').substring(0, 16),
        distanceKm,
        dispatchedTareTonnes,
        dispatchedGrossTonnes,
        dispatchedNetTonnes,
        transitLossAllowanceTonnes,
        freightCost,
        assessedRoyalty,
      };

      const newId = await createCoalMovement(movementPayload);

      if (autoDispatch) {
        dispatchCoalMovement(newId);
      }

      setLoading(false);
      onSuccess?.(newId);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to create coal movement record.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">Statutory Coal Dispatch Wizard</h2>
              <p className="text-xs text-slate-400">DGMS Regulation 184 & Weighbridge Siding Clearance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="bg-slate-100 dark:bg-slate-950/60 px-6 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          <div className={`flex items-center space-x-2 ${step === 1 ? 'text-sky-500 font-bold' : step > 1 ? 'text-emerald-500 font-semibold' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 1 ? 'bg-sky-500 text-white' : step > 1 ? 'bg-emerald-500 text-white' : 'bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
              {step > 1 ? '✓' : '1'}
            </span>
            <span>Origin & Siding</span>
          </div>
          <div className="w-8 h-0.5 bg-slate-300 dark:bg-slate-700" />
          <div className={`flex items-center space-x-2 ${step === 2 ? 'text-sky-500 font-bold' : step > 2 ? 'text-emerald-500 font-semibold' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 2 ? 'bg-sky-500 text-white' : step > 2 ? 'bg-emerald-500 text-white' : 'bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
              {step > 2 ? '✓' : '2'}
            </span>
            <span>Fleet & Weighbridge</span>
          </div>
          <div className="w-8 h-0.5 bg-slate-300 dark:bg-slate-700" />
          <div className={`flex items-center space-x-2 ${step === 3 ? 'text-sky-500 font-bold' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 3 ? 'bg-sky-500 text-white' : 'bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
              3
            </span>
            <span>e-Challan & Seals</span>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-500 dark:text-rose-400 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Origin Mine Pit / Siding *
                  </label>
                  <select
                    value={originMineId}
                    onChange={(e) => setOriginMineId(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  >
                    {mines.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.areaId})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Loading Siding / Stockpile Zone *
                  </label>
                  <input
                    type="text"
                    value={loadingPoint}
                    onChange={(e) => setLoadingPoint(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    placeholder="e.g. Weighbridge #2 (Incline Face)"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Movement Mode *
                  </label>
                  <select
                    value={movementType}
                    onChange={(e) => setMovementType(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  >
                    <option value="Road Haulage">Road Haulage (Heavy Tipper)</option>
                    <option value="Rail Rake">Rail Rake (Siding Transfer)</option>
                    <option value="Conveyor Transfer">Conveyor Belt Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Destination Type *
                  </label>
                  <select
                    value={destinationType}
                    onChange={(e) => setDestinationType(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  >
                    <option value="Thermal Power Plant">Thermal Power Plant</option>
                    <option value="Coal Washery">Coal Washery</option>
                    <option value="Railway Siding">Railway Siding</option>
                    <option value="Steel Plant">Steel Plant</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Transit Distance (km) *
                  </label>
                  <input
                    type="number"
                    value={distanceKm}
                    onChange={(e) => setDistanceKm(Number(e.target.value))}
                    min={1}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Destination Consignee & Facility Name *
                </label>
                <input
                  type="text"
                  value={destinationName}
                  onChange={(e) => setDestinationName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  placeholder="e.g. NTPC Ramagundam Super Thermal Siding"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Coal Quality Grade / Seam Classification *
                </label>
                <select
                  value={coalGrade}
                  onChange={(e) => setCoalGrade(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  <option value="G-7 Non-Coking Power Coal">G-7 Non-Coking (Gross Calorific Value 5100-5400 kcal/kg)</option>
                  <option value="G-11 Power Utility Coal">G-11 Power Utility (GCV 4000-4300 kcal/kg)</option>
                  <option value="G-4 Washed Metallurgical Coal">G-4 Washed Metallurgical (Prime Coking Grade)</option>
                  <option value="Raw Run-of-Mine (ROM) Coal">Raw Run-of-Mine (ROM Coal Uncrushed)</option>
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Assign Fleet Tipper / Vehicle *
                  </label>
                  <select
                    value={vehicleId}
                    onChange={(e) => {
                      setVehicleId(e.target.value);
                      const veh = fleetVehicles.find((v) => v.id === e.target.value);
                      if (veh) {
                        setDispatchedTareTonnes(veh.tareWeightTonnes);
                        setDispatchedGrossTonnes(Number((veh.tareWeightTonnes + veh.maxCapacityTonnes).toFixed(2)));
                      }
                    }}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  >
                    {fleetVehicles.map((v) => {
                      const vCheck = ResourceAvailabilityService.validateVehicleAssignment(v, { targetMineId: originMineId, activeMovements: coalMovements });
                      return (
                        <option key={v.id} value={v.id}>
                          {v.plate} — {v.name} ({v.type}) [{vCheck.available ? 'AVAILABLE' : `CONFLICT: ${vCheck.conflictDetails?.currentAssignment || v.status.toUpperCase()}`}]
                        </option>
                      );
                    })}
                  </select>

                  {selectedVehicle && (() => {
                    const vCheck = ResourceAvailabilityService.validateVehicleAssignment(selectedVehicle, { targetMineId: originMineId, activeMovements: coalMovements });
                    return (
                      <div className="mt-2 space-y-2">
                        {!vCheck.available && (
                          <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-lg text-xs text-rose-700 dark:text-rose-300 flex items-start space-x-2">
                            <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold block">Vehicle Assignment Conflict</span>
                              <span className="text-[11px] leading-tight">{vCheck.reason}</span>
                            </div>
                          </div>
                        )}
                        <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
                          <div className="flex justify-between">
                            <span>Max Net Capacity:</span>
                            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{selectedVehicle.maxCapacityTonnes} Tonnes</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Vehicle Status:</span>
                            <span className={`font-semibold uppercase ${selectedVehicle.status === 'idle' ? 'text-emerald-500' : 'text-sky-400'}`}>
                              {selectedVehicle.status}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Rule Engine Clearance:</span>
                            <span className={vCheck.available ? 'text-emerald-500 font-semibold' : 'text-rose-500 font-bold'}>
                              {vCheck.available ? 'Cleared for Route Haulage' : 'Locked / Disallowed'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Assign DGMS-Certified HCV Driver *
                  </label>
                  <select
                    value={driverId}
                    onChange={(e) => setDriverId(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  >
                    {fleetDrivers.map((d) => {
                      const dCheck = ResourceAvailabilityService.validateDriverAssignment(d, { activeMovements: coalMovements });
                      return (
                        <option key={d.id} value={d.id}>
                          {d.name} ({d.licenseNumber}) — Safety: {d.safetyScore}% [{dCheck.available ? 'AVAILABLE' : `CONFLICT: ${dCheck.conflictDetails?.currentAssignment || d.status.toUpperCase()}`}]
                        </option>
                      );
                    })}
                  </select>

                  {selectedDriver && (() => {
                    const dCheck = ResourceAvailabilityService.validateDriverAssignment(selectedDriver, { activeMovements: coalMovements });
                    return (
                      <div className="mt-2 space-y-2">
                        {!dCheck.available && (
                          <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-lg text-xs text-rose-700 dark:text-rose-300 flex items-start space-x-2">
                            <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold block">Driver Deployment Conflict</span>
                              <span className="text-[11px] leading-tight">{dCheck.reason}</span>
                            </div>
                          </div>
                        )}
                        <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
                          <div className="flex justify-between">
                            <span>Driver Safety Score:</span>
                            <span className="font-mono font-bold text-emerald-500">{selectedDriver.safetyScore}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>DGMS Safety Vocational:</span>
                            <span className="text-emerald-500 font-semibold">{selectedDriver.dgmsSafetyCertified ? 'Certified' : 'Pending'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total Coal Trips Completed:</span>
                            <span className="font-mono text-slate-800 dark:text-slate-200">{selectedDriver.totalTrips} Trips</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Licensing Clearance:</span>
                            <span className={dCheck.available ? 'text-emerald-500 font-semibold' : 'text-rose-500 font-bold'}>
                              {dCheck.available ? 'Verified Active Commercial License' : 'Disallowed / Expired'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Weighbridge Tare / Gross / Net Calculation Card */}
              <div className="p-4 bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900/40 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sky-600 dark:text-sky-400 font-bold text-xs">
                    <Scale className="w-4 h-4" />
                    <span>Origin Weighbridge Sensor Telemetry</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 font-mono font-bold">
                    Calibrated ISO-9001
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Dispatched Tare (T)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={dispatchedTareTonnes}
                      onChange={(e) => setDispatchedTareTonnes(Number(e.target.value))}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-slate-900 dark:text-white"
                    />
                    <span className="text-[10px] text-slate-400">Empty vehicle weight</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Dispatched Gross (T)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={dispatchedGrossTonnes}
                      onChange={(e) => setDispatchedGrossTonnes(Number(e.target.value))}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-slate-900 dark:text-white"
                    />
                    <span className="text-[10px] text-slate-400">Vehicle + Coal load</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Calculated Net Coal (T)
                    </label>
                    <div className="p-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs font-mono font-black text-emerald-600 dark:text-emerald-400 text-center">
                      {dispatchedNetTonnes > 0 ? `${dispatchedNetTonnes} T` : 'ERR'}
                    </div>
                    <span className="text-[10px] text-emerald-500">Gross - Tare payload</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    GST e-Way Bill No. *
                  </label>
                  <input
                    type="text"
                    value={eWayBillNumber}
                    onChange={(e) => setEWayBillNumber(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Mining Challan No. *
                  </label>
                  <input
                    type="text"
                    value={challanNumber}
                    onChange={(e) => setChallanNumber(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tamper-Evident RFID Tag *
                  </label>
                  <input
                    type="text"
                    value={rfidTag}
                    onChange={(e) => setRfidTag(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Contractor Freight Rate (₹)
                  </label>
                  <input
                    type="number"
                    value={freightCost}
                    onChange={(e) => setFreightCost(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Assessed Mining Royalty (₹)
                  </label>
                  <input
                    type="number"
                    value={assessedRoyalty}
                    onChange={(e) => setAssessedRoyalty(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Summary Review Card */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl space-y-2 text-xs">
                <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                  <span>Dispatch Manifest Summary</span>
                  <span className="text-emerald-500 flex items-center">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                    Statutory Ready
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block">Origin Pit:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{originMine?.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Vehicle:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedVehicle?.plate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Driver:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedDriver?.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Net Coal:</span>
                    <span className="font-mono font-bold text-emerald-500">{dispatchedNetTonnes} Tonnes</span>
                  </div>
                </div>
                <div className="pt-2 text-[11px] text-slate-500 dark:text-slate-400 flex justify-between border-t border-slate-200 dark:border-slate-700">
                  <span>Moisture & Transit Allowance (0.5% max):</span>
                  <span className="font-mono font-semibold text-amber-500">±{transitLossAllowanceTonnes} T</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="autoDispatch"
                  checked={autoDispatch}
                  onChange={(e) => setAutoDispatch(e.target.checked)}
                  className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                <label htmlFor="autoDispatch" className="text-xs text-slate-700 dark:text-slate-300 font-medium cursor-pointer">
                  Mark immediately as <span className="font-bold text-sky-500">DISPATCHED</span> and lock gate pass
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep((prev) => (prev - 1) as any)}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white text-xs font-semibold transition"
            >
              Cancel
            </button>

            {step < 3 ? (
              <button
                onClick={handleNext}
                className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-lg shadow-sky-600/20 transition"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center space-x-2 shadow-lg shadow-emerald-600/20 transition disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{loading ? 'Authorizing...' : 'Authorize & Issue Siding e-Pass'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
