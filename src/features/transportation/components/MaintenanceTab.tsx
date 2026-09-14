import React, { useState } from 'react';
import { useGovernance } from '../../../context/GovernanceContext';
import {
  Wrench,
  Scale,
  CheckCircle2,
  Clock,
  Plus,
  Filter,
  X,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import type { FleetMaintenanceRecord } from '../../../types';

export const MaintenanceTab: React.FC = () => {
  const {
    fleetMaintenance,
    fleetVehicles,
    scheduleFleetMaintenance,
    completeFleetMaintenance,
  } = useGovernance();

  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  // New Maintenance Form State
  const [targetType, setTargetType] = useState<FleetMaintenanceRecord['targetType']>('Weighbridge');
  const [targetId, setTargetId] = useState('WB-JH-01');
  const [targetName, setTargetName] = useState('Main Incline Weighbridge #1');
  const [issue, setIssue] = useState('Quarterly Load Cell Precision Calibration');
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().split('T')[0]);
  const [technician, setTechnician] = useState('Central Metrology Bureau');
  const [cost, setCost] = useState(35000);

  const filteredRecords = fleetMaintenance.filter((m) => {
    const matchesStatus = statusFilter === 'ALL' || m.status === statusFilter;
    const matchesType = typeFilter === 'ALL' || m.targetType === typeFilter;
    return matchesStatus && matchesType;
  });

  const totalCost = fleetMaintenance.reduce((acc, m) => acc + m.cost, 0);
  const weighbridgeCalibrations = fleetMaintenance.filter((m) => m.targetType === 'Weighbridge').length;
  const inProgressCount = fleetMaintenance.filter((m) => m.status === 'in_progress' || m.status === 'scheduled').length;

  // Chart data: cost by target type
  const chartData = [
    {
      name: 'Weighbridges',
      cost: fleetMaintenance.filter((m) => m.targetType === 'Weighbridge').reduce((acc, m) => acc + m.cost, 0),
    },
    {
      name: 'Coal Tippers',
      cost: fleetMaintenance.filter((m) => m.targetType === 'Vehicle').reduce((acc, m) => acc + m.cost, 0),
    },
    {
      name: 'Conveyor Belts',
      cost: fleetMaintenance.filter((m) => m.targetType === 'Conveyor Belt').reduce((acc, m) => acc + m.cost, 0),
    },
  ];

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    scheduleFleetMaintenance({
      targetType,
      targetId,
      targetName,
      issue,
      severity: 'medium',
      status: 'scheduled',
      scheduledDate,
      certifiedTechnician: technician,
      cost,
    });
    setIsScheduleModalOpen(false);
  };

  const getStatusBadge = (status: FleetMaintenanceRecord['status']) => {
    switch (status) {
      case 'completed':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>COMPLETED</span>
          </span>
        );
      case 'in_progress':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-400/20 flex items-center space-x-1 animate-pulse">
            <Clock className="w-3 h-3" />
            <span>IN PROGRESS</span>
          </span>
        );
      case 'scheduled':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
            SCHEDULED
          </span>
        );
      case 'overdue':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20">
            OVERDUE
          </span>
        );
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Active Work Orders
          </span>
          <span className="text-2xl font-black text-slate-900 dark:text-white font-sans">{inProgressCount}</span>
          <span className="text-[10px] text-slate-400 block mt-1">Undergoing calibration or overhaul</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/40 p-4 rounded-xl border-l-4 border-l-emerald-500 shadow-xs">
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
            Weighbridge Calibrations
          </span>
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-sans">
            {weighbridgeCalibrations}
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">Legal Metrology statutory accuracy</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-sky-200 dark:border-sky-900/40 p-4 rounded-xl border-l-4 border-l-sky-500 shadow-xs">
          <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider block">
            Total Maintenance Cost
          </span>
          <span className="text-2xl font-black text-sky-600 dark:text-sky-400 font-sans">
            ₹{(totalCost / 100000).toFixed(2)} L
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">Spare parts & certified metrology</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/40 p-4 rounded-xl border-l-4 border-l-amber-500 shadow-xs">
          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
            Completed Records
          </span>
          <span className="text-2xl font-black text-amber-600 dark:text-amber-400 font-sans">
            {fleetMaintenance.filter((m) => m.status === 'completed').length}
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">Verified with fitness signoff</span>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Logistics & Weighbridge Maintenance Expenditure (₹)
            </h3>
            <p className="text-xs text-slate-400">Statutory load cell calibration vs. tipper fleet repair costs</p>
          </div>
        </div>
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(val) => `₹${val / 1000}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                itemStyle={{ color: '#38bdf8' }}
                formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, 'Expenditure']}
              />
              <Bar dataKey="cost" fill="#0284c7" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filter & Action Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-3 w-full sm:w-auto flex-1">
          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
            >
              <option value="ALL">All Asset Types</option>
              <option value="Weighbridge">Weighbridges</option>
              <option value="Vehicle">Coal Tippers</option>
              <option value="Conveyor Belt">Conveyor Belts</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => setIsScheduleModalOpen(true)}
          className="w-full sm:w-auto px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-lg shadow-sky-600/20 transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Maintenance</span>
        </button>
      </div>

      {/* Maintenance Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Target Asset</th>
                <th className="py-3 px-4">Service Description</th>
                <th className="py-3 px-4">Certified Technician</th>
                <th className="py-3 px-4">Scheduled Date</th>
                <th className="py-3 px-4 text-right">Cost (₹)</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-850/60 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-sky-600 dark:text-sky-400 whitespace-nowrap">
                    {rec.id}
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center space-x-1.5">
                      {rec.targetType === 'Weighbridge' ? (
                        <Scale className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Wrench className="w-3.5 h-3.5 text-sky-500" />
                      )}
                      <span>{rec.targetName}</span>
                    </div>
                    <div className="text-[10px] text-slate-400">{rec.targetType} ({rec.targetId})</div>
                  </td>

                  <td className="py-3.5 px-4 max-w-[240px]">
                    <div className="text-slate-800 dark:text-slate-200 font-medium truncate">{rec.issue}</div>
                    <div className="text-[10px] text-slate-400 capitalize">Severity: {rec.severity}</div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap">
                    {rec.certifiedTechnician}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {rec.scheduledDate}
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap">
                    ₹{rec.cost.toLocaleString()}
                  </td>

                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    {getStatusBadge(rec.status)}
                  </td>

                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    {rec.status !== 'completed' && (
                      <button
                        onClick={() => completeFleetMaintenance(rec.id)}
                        className="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded-lg text-[10px] font-bold transition"
                      >
                        Sign Off & Complete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Schedule Maintenance Modal */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Wrench className="w-5 h-5 text-sky-400" />
                <h3 className="font-bold text-sm">Schedule Metrology & Fleet Service</h3>
              </div>
              <button
                onClick={() => setIsScheduleModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Asset Category *
                  </label>
                  <select
                    value={targetType}
                    onChange={(e) => {
                      const val = e.target.value as any;
                      setTargetType(val);
                      if (val === 'Weighbridge') {
                        setTargetName('Main Incline Weighbridge #1');
                        setTargetId('WB-JH-01');
                      } else if (val === 'Vehicle') {
                        setTargetName(fleetVehicles[0]?.name || 'Tata Tipper');
                        setTargetId(fleetVehicles[0]?.id || 'v1');
                      } else {
                        setTargetName('Longwall Conveyor Siding #2');
                        setTargetId('CB-02');
                      }
                    }}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white"
                  >
                    <option value="Weighbridge">Weighbridge</option>
                    <option value="Vehicle">Fleet Coal Tipper</option>
                    <option value="Conveyor Belt">Conveyor Belt</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Asset Identifier *
                  </label>
                  <input
                    type="text"
                    value={targetName}
                    onChange={(e) => setTargetName(e.target.value)}
                    required
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Service / Calibration Scope *
                </label>
                <input
                  type="text"
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                  required
                  placeholder="e.g. Legal Metrology Load Cell Recalibration & Stamping"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Scheduled Date *
                  </label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    required
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Estimated Cost (₹) *
                  </label>
                  <input
                    type="number"
                    value={cost}
                    onChange={(e) => setCost(Number(e.target.value))}
                    required
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Certified Metrologist / Technician Agency *
                </label>
                <input
                  type="text"
                  value={technician}
                  onChange={(e) => setTechnician(e.target.value)}
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="px-4 py-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl shadow-lg shadow-sky-600/20"
                >
                  Confirm Work Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
