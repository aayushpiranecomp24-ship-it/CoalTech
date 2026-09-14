import React from 'react';
import { useGovernance } from '../../../context/GovernanceContext';
import {
  Scale,
  ShieldCheck,
  BarChart3,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export const TransportationAnalyticsTab: React.FC = () => {
  const { coalMovements, fleetVehicles, mines } = useGovernance();

  const totalDispatched = coalMovements.reduce((acc, m) => acc + m.dispatchedNetTonnes, 0);
  const totalReceived = coalMovements
    .filter((m) => m.receivedNetTonnes !== undefined)
    .reduce((acc, m) => acc + (m.receivedNetTonnes || 0), 0);
  const totalLoss = Number((totalDispatched - totalReceived).toFixed(2));
  const lossRate = totalDispatched > 0 ? Number(((totalLoss / totalDispatched) * 100).toFixed(2)) : 0;
  const totalRoyalty = coalMovements.reduce((acc, m) => acc + m.assessedRoyalty, 0);

  // Mine Volume Breakdown Chart Data
  const mineVolumeData = mines.map((m) => {
    const vol = coalMovements
      .filter((cm) => cm.originMineId === m.id)
      .reduce((acc, cm) => acc + cm.dispatchedNetTonnes, 0);
    return {
      name: m.name.replace(' Mine', '').replace(' Deep', ''),
      tonnes: Number(vol.toFixed(1)),
    };
  });

  // Movement Dispatched vs Received Area Chart
  const movementTrendData = coalMovements.map((cm) => ({
    name: cm.id.replace('CM-2026-', '#'),
    dispatched: cm.dispatchedNetTonnes,
    received: cm.receivedNetTonnes || cm.dispatchedNetTonnes,
    variance: cm.weightDiscrepancyTonnes || 0,
  }));

  return (
    <div className="space-y-6">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Net Haulage Throughput
          </span>
          <span className="text-2xl font-black text-slate-900 dark:text-white font-sans">
            {totalDispatched.toFixed(1)} MT
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">Total dispatched coal tonnage</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-sky-200 dark:border-sky-900/40 p-4 rounded-xl border-l-4 border-l-sky-500 shadow-xs">
          <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider block">
            Transit Pilferage / Loss Rate
          </span>
          <span
            className={`text-2xl font-black font-sans ${
              lossRate > 0.5 ? 'text-rose-500' : 'text-emerald-500'
            }`}
          >
            {lossRate}%
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">
            Statutory threshold: 0.50% max
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/40 p-4 rounded-xl border-l-4 border-l-emerald-500 shadow-xs">
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
            Assessed Coal Royalty
          </span>
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-sans">
            ₹{(totalRoyalty / 100000).toFixed(2)} L
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">State mineral revenue share</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/40 p-4 rounded-xl border-l-4 border-l-amber-500 shadow-xs">
          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
            Fleet Active Utilization
          </span>
          <span className="text-2xl font-black text-amber-600 dark:text-amber-400 font-sans">
            {Math.round(
              (fleetVehicles.filter((v) => v.status === 'on_trip' || v.status === 'active').length /
                (fleetVehicles.length || 1)) *
                100
            )}
            %
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">
            {fleetVehicles.filter((v) => v.status === 'on_trip').length} tippers currently on haulage route
          </span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weighbridge Dispatched vs Received Comparison Area Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Scale className="w-4 h-4 text-sky-500" />
                <span>Dispatched vs. Destination Received Load (MT)</span>
              </h3>
              <p className="text-xs text-slate-400">Payload reconciliation across consecutive haulage movements</p>
            </div>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={movementTrendData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDisp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorRecv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(val) => `${val}T`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                />
                <Area type="monotone" dataKey="dispatched" stroke="#0284c7" fillOpacity={1} fill="url(#colorDisp)" name="Dispatched (MT)" />
                <Area type="monotone" dataKey="received" stroke="#10b981" fillOpacity={1} fill="url(#colorRecv)" name="Received (MT)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mine Dispatch Volume Bar Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-emerald-500" />
                <span>Coal Dispatch Volume by Mine Sector (MT)</span>
              </h3>
              <p className="text-xs text-slate-400">Total statutory road & siding movement output per pit</p>
            </div>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mineVolumeData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(val) => `${val}T`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                  formatter={(val: any) => [`${val} MT`, 'Dispatched Coal']}
                />
                <Bar dataKey="tonnes" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Siding Statutory Compliance Note */}
      <div className="p-4 bg-sky-50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-900/40 rounded-2xl flex items-start space-x-3 text-xs">
        <ShieldCheck className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
        <div className="space-y-1 text-slate-600 dark:text-slate-300">
          <span className="font-bold text-slate-900 dark:text-white block">
            Statutory DGMS Transit & Weighbridge Protocol Compliance
          </span>
          <p>
            All coal movements are cryptographically anchored to SHA-256 blocks upon dispatch and destination weighbridge receipt.
            In accordance with DGMS Circular 04 of 2023, any movement registering &gt;0.5% net weight variance or compromised RFID seals
            automatically escalates into an enforceable statutory violation with strict 24-hour corrective action SLAs.
          </p>
        </div>
      </div>
    </div>
  );
};
