import React, { useState } from 'react';
import { useI18n } from '../../../context/I18nContext';
import { useGovernance } from '../../../context/GovernanceContext';
import type { RouteCorridor } from '../../../types';
import {
  MapPin,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Gauge,
  Search,
  CheckCircle2,
  Navigation,
  Plus,
} from 'lucide-react';
import { AddRouteModal } from '../../masterData/components/AddRouteModal';

const SEED_CORRIDORS: RouteCorridor[] = [
  {
    id: 'COR-01',
    name: 'Pithead Face 3 to Central Railway Siding A',
    origin: 'Dhanbad OpenCast Pit Face 3',
    destination: 'Central Railway Coal Siding #1',
    distanceKm: 8.4,
    avgDurationMins: 22,
    speedLimitKmh: 35,
    geofenceRadiusMeters: 50,
    status: 'ACTIVE',
    activeVehiclesCount: 6,
    pavementType: 'HEAVY_DUTY_BLACKTOP',
    cameraCount: 8,
    checkpoints: [
      { name: 'Pithead Weighbridge WB-01', type: 'WEIGHBRIDGE', status: 'ONLINE' },
      { name: 'Mid-Corridor RFID Sensor Gate', type: 'RFID_GATE', status: 'ONLINE' },
      { name: 'Siding Security In-Gate', type: 'SECURITY_POST', status: 'ONLINE' },
      { name: 'Siding Gross-Tare Weighbridge WB-02', type: 'WEIGHBRIDGE', status: 'ONLINE' },
    ],
  },
  {
    id: 'COR-02',
    name: 'Jharia Pit 4 to Washery Beneficiation Link',
    origin: 'Jharia Deep Underground Incline 2',
    destination: 'BCCL Coal Washery Complex',
    distanceKm: 14.2,
    avgDurationMins: 38,
    speedLimitKmh: 40,
    geofenceRadiusMeters: 60,
    status: 'ACTIVE',
    activeVehiclesCount: 4,
    pavementType: 'HEAVY_DUTY_BLACKTOP',
    cameraCount: 12,
    checkpoints: [
      { name: 'Pit 4 Static Scale', type: 'WEIGHBRIDGE', status: 'ONLINE' },
      { name: 'Highway Intersection Checkpoint', type: 'SECURITY_POST', status: 'ONLINE' },
      { name: 'Washery Receiving Hopper Scale', type: 'WEIGHBRIDGE', status: 'ONLINE' },
    ],
  },
  {
    id: 'COR-03',
    name: 'Bokaro OpenCast to Thermal Power Plant Link',
    origin: 'Bokaro OpenCast South Pit',
    destination: 'DVC Thermal Power Station Siding',
    distanceKm: 21.6,
    avgDurationMins: 50,
    speedLimitKmh: 45,
    geofenceRadiusMeters: 80,
    status: 'CONGESTED',
    activeVehiclesCount: 7,
    pavementType: 'HEAVY_DUTY_BLACKTOP',
    cameraCount: 16,
    checkpoints: [
      { name: 'Bokaro Out-Gate Scale', type: 'WEIGHBRIDGE', status: 'ONLINE' },
      { name: 'Forest Corridor Geofence Beacon 1', type: 'RFID_GATE', status: 'ONLINE' },
      { name: 'Forest Corridor Geofence Beacon 2', type: 'RFID_GATE', status: 'ONLINE' },
      { name: 'Power Plant In-Gate Scale', type: 'WEIGHBRIDGE', status: 'ONLINE' },
    ],
  },
  {
    id: 'COR-04',
    name: 'Raniganj North Pit to Siding Bypass Road',
    origin: 'Raniganj Underground Pit 1',
    destination: 'Raniganj Rail Yard Siding B',
    distanceKm: 6.8,
    avgDurationMins: 20,
    speedLimitKmh: 25,
    geofenceRadiusMeters: 40,
    status: 'MAINTENANCE_DIVERSION',
    activeVehiclesCount: 2,
    pavementType: 'UNPAVED_HAUL_ROAD',
    cameraCount: 6,
    checkpoints: [
      { name: 'Pithead Weighbridge WB-03', type: 'WEIGHBRIDGE', status: 'ONLINE' },
      { name: 'Diversion Security Post #4', type: 'SECURITY_POST', status: 'ONLINE' },
      { name: 'Rail Yard Gross Scale WB-04', type: 'WEIGHBRIDGE', status: 'ONLINE' },
    ],
  },
];

export const RoutesTab: React.FC = () => {
  const { t } = useI18n();
  const { routes } = useGovernance();
  const activeRoutes = routes && routes.length > 0 ? routes : SEED_CORRIDORS;

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'CONGESTED' | 'MAINTENANCE_DIVERSION'>('ALL');
  const [selectedCorridor, setSelectedCorridor] = useState<RouteCorridor>(activeRoutes[0] || SEED_CORRIDORS[0]);
  const [showAddRouteModal, setShowAddRouteModal] = useState(false);

  const filteredCorridors = activeRoutes.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.origin && c.origin.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.routeCode && c.routeCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
      c.destination.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Overview Metric Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Monitored Corridors</span>
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-500">
              <Navigation className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{activeRoutes.length} Routes</div>
          <div className="mt-1 text-[11px] text-emerald-500 font-semibold flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>100% Geofenced Active</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Active En-Route Tippers</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <Gauge className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">19 Tippers</div>
          <div className="mt-1 text-[11px] text-slate-400">Tracked via GPS telematics</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Haulage Network</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">51.0 Km</div>
          <div className="mt-1 text-[11px] text-slate-400">Pit-to-Siding corridors</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Corridor Security Posts</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">14 Gates</div>
          <div className="mt-1 text-[11px] text-emerald-500 font-semibold">All load cells calibrated</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('filter_search', 'Filter routes or checkpoints...')}
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
            All Corridors
          </button>
          <button
            onClick={() => setStatusFilter('ACTIVE')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              statusFilter === 'ACTIVE'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-750'
            }`}
          >
            Active Normal
          </button>
          <button
            onClick={() => setStatusFilter('CONGESTED')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              statusFilter === 'CONGESTED'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-750'
            }`}
          >
            Congested
          </button>
          <button
            onClick={() => setShowAddRouteModal(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-semibold shadow-sm transition ml-2"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Register Corridor</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Route Cards, Right Selected Route Interactive Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Route List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {filteredCorridors.map((corridor) => {
            const isSelected = selectedCorridor.id === corridor.id;
            return (
              <div
                key={corridor.id}
                onClick={() => setSelectedCorridor(corridor)}
                className={`p-4 rounded-2xl border transition cursor-pointer ${
                  isSelected
                    ? 'bg-sky-500/10 border-sky-400/50 shadow-md ring-1 ring-sky-400/30'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-sky-500 dark:text-sky-400">
                        {corridor.id}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          corridor.status === 'ACTIVE'
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : corridor.status === 'CONGESTED'
                            ? 'bg-amber-500/10 text-amber-500'
                            : 'bg-rose-500/10 text-rose-500'
                        }`}
                      >
                        {corridor.status.replace('_', ' ')}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">{corridor.name}</h3>
                  </div>

                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
                    {corridor.distanceKm} km
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                  <div className="flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Avg: {corridor.avgDurationMins} mins</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Gauge className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Limit: {corridor.speedLimitKmh} km/h</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">
                    <strong className="text-slate-900 dark:text-white">{corridor.activeVehiclesCount}</strong> Tippers Active
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    {corridor.checkpoints?.length || 0} Checkpoints
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Route Detailed View (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold text-sky-400">{selectedCorridor.id}</span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {(selectedCorridor.pavementType || 'HEAVY_DUTY_BLACKTOP').replace(/_/g, ' ')}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                {selectedCorridor.name}
              </h2>
            </div>

            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-xl text-xs font-bold flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Geofence ±{selectedCorridor.geofenceRadiusMeters || 50}m</span>
              </span>
            </div>
          </div>

          {/* Corridor Waypoint Sequence */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Statutory Waypoint & Weighbridge Sequence
            </h4>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-3 before:bottom-3 before:w-0.5 before:bg-sky-500/30">
              <div className="relative flex items-start space-x-3">
                <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-sky-500 ring-4 ring-sky-500/20" />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Origin: {selectedCorridor.origin}</div>
                  <p className="text-[11px] text-slate-400">Pithead Loading Face • Automatic tare weight registration</p>
                </div>
              </div>

              {(selectedCorridor.checkpoints || []).map((cp, idx) => {
                const cpName = typeof cp === 'string' ? cp : cp.name;
                const cpType = typeof cp === 'string' ? 'WAYPOINT' : cp.type;
                const cpStatus = typeof cp === 'string' ? 'ONLINE' : cp.status;
                return (
                  <div key={idx} className="relative flex items-start space-x-3">
                    <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-slate-700 border-2 border-sky-400" />
                    <div className="bg-slate-50 dark:bg-slate-850 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 flex-1 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-slate-900 dark:text-white">{cpName}</div>
                        <span className="text-[10px] text-sky-500 font-mono font-bold uppercase">{cpType}</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500">
                        {cpStatus}
                      </span>
                    </div>
                  </div>
                );
              })}

              <div className="relative flex items-start space-x-3">
                <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Destination: {selectedCorridor.destination}</div>
                  <p className="text-[11px] text-slate-400">Receiving Hopper / Railway Siding • Final tare deduction and seal inspection</p>
                </div>
              </div>
            </div>
          </div>

          {/* Safety & Enforcement Details */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 block">Haul Speed Limit</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 block">
                {selectedCorridor.speedLimitKmh} km/h (Strict)
              </span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 block">CCTV Surveillance</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 block">
                {selectedCorridor.cameraCount} AI Cameras
              </span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 block">Corridor Telemetry</span>
              <span className="text-sm font-bold text-emerald-500 mt-0.5 block">
                Zero Deviations Today
              </span>
            </div>
          </div>

          <div className="p-3.5 bg-sky-500/5 dark:bg-sky-500/10 border border-sky-500/20 rounded-xl flex items-start space-x-2.5 text-xs text-slate-600 dark:text-slate-300">
            <AlertTriangle className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-sky-600 dark:text-sky-400 block">Geo-Fenced Corridor Enforcement Notice</span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Any route deviation exceeding ±{selectedCorridor.geofenceRadiusMeters} meters automatically triggers an instant SMS alert to the Central Control Room and flags the dispatch record for mandatory weighbridge re-verification.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Route Master Modal */}
      <AddRouteModal
        isOpen={showAddRouteModal}
        onClose={() => setShowAddRouteModal(false)}
      />
    </div>
  );
};
