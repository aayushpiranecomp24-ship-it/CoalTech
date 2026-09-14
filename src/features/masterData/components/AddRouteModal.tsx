import React, { useState } from 'react';
import { useGovernance } from '../../../context/GovernanceContext';
import { Navigation, X, CheckCircle } from 'lucide-react';
import type { RouteCorridor } from '../../../types';

interface AddRouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (route: RouteCorridor) => void;
}

export const AddRouteModal: React.FC<AddRouteModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { mines, addRoute } = useGovernance();

  const [name, setName] = useState('');
  const [routeCode, setRouteCode] = useState('');
  const [originMineId, setOriginMineId] = useState(mines[0]?.id || 'm1');
  const [loadingPoint, setLoadingPoint] = useState('Pithead Weighbridge WB-01');
  const [stockyard, setStockyard] = useState('Central Stockyard Alpha');
  const [railwaySiding, setRailwaySiding] = useState('Central Coal Siding #1');
  const [destination, setDestination] = useState('');
  const [distanceKm, setDistanceKm] = useState(12.5);
  const [avgDurationMins, setAvgDurationMins] = useState(30);
  const [speedLimitKmh, setSpeedLimitKmh] = useState(35);
  const [riskLevel, setRiskLevel] = useState<RouteCorridor['riskLevel']>('LOW');
  const [status, setStatus] = useState<RouteCorridor['status']>('ACTIVE');
  const [checkpointsInput, setCheckpointsInput] = useState('Pithead Weighbridge WB-01, Mid-Route RFID Gate, Delivery In-Gate Scale');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !destination.trim()) return;

    setIsSubmitting(true);
    const selectedMine = mines.find((m) => m.id === originMineId);
    const code = routeCode.trim() || `RC-${(selectedMine?.name || 'COR').slice(0, 3).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`;

    const checkpoints = checkpointsInput
      .split(',')
      .map((c, idx) => ({
        name: c.trim(),
        type: (idx === 0 ? 'WEIGHBRIDGE' : idx % 2 === 1 ? 'RFID_GATE' : 'SECURITY_POST') as 'WEIGHBRIDGE' | 'RFID_GATE' | 'SECURITY_POST',
        status: 'ONLINE' as const,
      }))
      .filter((c) => Boolean(c.name));

    const newRouteData: Omit<RouteCorridor, 'id'> = {
      name: name.trim(),
      routeCode: code,
      origin: `${selectedMine?.name || 'Mine'} — ${loadingPoint}`,
      originMineId,
      originMineName: selectedMine?.name || 'Jharia Deep Mine A',
      loadingPoint,
      stockyard,
      railwaySiding,
      destination: destination.trim(),
      distanceKm: Number(distanceKm) || 10,
      avgDurationMins: Number(avgDurationMins) || 25,
      expectedTravelTimeMins: Number(avgDurationMins) || 25,
      speedLimitKmh: Number(speedLimitKmh) || 35,
      speedLimitKmph: Number(speedLimitKmh) || 35,
      geofenceRadiusMeters: 50,
      riskLevel: riskLevel || 'LOW',
      status: status || 'ACTIVE',
      activeVehiclesCount: 0,
      activeVehicles: 0,
      dailyTonnes: 850,
      pavementType: 'HEAVY_DUTY_BLACKTOP',
      cameraCount: 8,
      tollGates: 1,
      checkpoints: checkpoints.length > 0 ? checkpoints : [
        { name: 'Origin Weighbridge Scale', type: 'WEIGHBRIDGE', status: 'ONLINE' },
        { name: 'Destination Weighbridge Scale', type: 'WEIGHBRIDGE', status: 'ONLINE' },
      ],
    };

    addRoute(newRouteData);
    setIsSubmitting(false);
    if (onSuccess) {
      onSuccess({ ...newRouteData, id: 'temp' });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Register Geofenced Route Corridor</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Statutory Haulage Corridor & Geofenced Transit Security Registration
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Route Corridor Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Jharia Face 3 to Central Siding Link"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Corridor Code
              </label>
              <input
                type="text"
                value={routeCode}
                onChange={(e) => setRouteCode(e.target.value)}
                placeholder="e.g. RC-JHR-05"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Origin Mine Sector <span className="text-rose-500">*</span>
              </label>
              <select
                value={originMineId}
                onChange={(e) => setOriginMineId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                {mines.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Origin Loading Point
              </label>
              <input
                type="text"
                value={loadingPoint}
                onChange={(e) => setLoadingPoint(e.target.value)}
                placeholder="e.g. Incline Pit #2 Feeder Chute"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Connecting Stockyard / Buffer
              </label>
              <input
                type="text"
                value={stockyard}
                onChange={(e) => setStockyard(e.target.value)}
                placeholder="e.g. Central Stockyard Alpha"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Railway Siding Connection
              </label>
              <input
                type="text"
                value={railwaySiding}
                onChange={(e) => setRailwaySiding(e.target.value)}
                placeholder="e.g. BCCL Washery Spur Track 2"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Destination Name & Terminal <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. DVC Bokaro Thermal Power Station Siding"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Distance (km)
              </label>
              <input
                type="number"
                step="0.1"
                value={distanceKm}
                onChange={(e) => setDistanceKm(parseFloat(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Travel Time (mins)
              </label>
              <input
                type="number"
                value={avgDurationMins}
                onChange={(e) => setAvgDurationMins(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Speed Limit (km/h)
              </label>
              <input
                type="number"
                value={speedLimitKmh}
                onChange={(e) => setSpeedLimitKmh(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Geofence Corridor Risk
              </label>
              <select
                value={riskLevel}
                onChange={(e) => setRiskLevel(e.target.value as RouteCorridor['riskLevel'])}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="LOW">LOW Risk (Monitored Highway)</option>
                <option value="MEDIUM">MEDIUM Risk (Mixed Forest Corridor)</option>
                <option value="HIGH">HIGH Risk (Sensitive / Congested Sector)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Corridor Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as RouteCorridor['status'])}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="ACTIVE">ACTIVE (Open for Dispatches)</option>
                <option value="CONGESTED">CONGESTED (Speed Advisory)</option>
                <option value="MAINTENANCE_DIVERSION">MAINTENANCE DIVERSION</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Checkpoints & Weighbridges (Comma-separated)
            </label>
            <input
              type="text"
              value={checkpointsInput}
              onChange={(e) => setCheckpointsInput(e.target.value)}
              placeholder="Pithead Scale, RFID Beacon 1, Security Post, Delivery Scale"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl shadow-lg transition flex items-center space-x-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{isSubmitting ? 'Registering...' : 'Register Route Corridor'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
