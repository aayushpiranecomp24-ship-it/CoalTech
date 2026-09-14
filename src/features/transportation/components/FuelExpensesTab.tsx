import React, { useState } from 'react';
import { useGovernance } from '../../../context/GovernanceContext';
import {
  Fuel,
  Coins,
  Plus,
  X,
} from 'lucide-react';
import type { LogisticsExpense } from '../../../types';

export const FuelExpensesTab: React.FC = () => {
  const {
    fuelLogs,
    logisticsExpenses,
    fleetVehicles,
    fleetDrivers,
    logFuelConsumption,
    addLogisticsExpense,
    approveLogisticsExpense,
  } = useGovernance();

  const [activeSubTab, setActiveSubTab] = useState<'fuel' | 'expenses'>('fuel');
  const [isFuelModalOpen, setIsFuelModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  // New Fuel Form State
  const [vehicleId, setVehicleId] = useState(fleetVehicles[0]?.id || 'v1');
  const [driverName, setDriverName] = useState(fleetDrivers[0]?.name || 'Driver');
  const [liters, setLiters] = useState(180);
  const [costPerLiter, setCostPerLiter] = useState(92.4);
  const [location, setLocation] = useState('Central Coalfield Diesel Depot #1');
  const [odometer, setOdometer] = useState(14500);

  // New Expense Form State
  const [expenseCategory, setExpenseCategory] = useState<LogisticsExpense['category']>('green_cess');
  const [expenseAmount, setExpenseAmount] = useState(12500);
  const [expenseDescription, setExpenseDescription] = useState('Environmental Green Transit Cess - District Toll');
  const [transporterName, setTransporterName] = useState('Bharat Coking Logistics Ltd.');

  const totalFuelLiters = fuelLogs.reduce((acc, f) => acc + f.liters, 0);
  const totalFuelSpend = fuelLogs.reduce((acc, f) => acc + f.totalCost, 0);
  const totalExpenses = logisticsExpenses.reduce((acc, e) => acc + e.amount, 0);
  const pendingExpensesCount = logisticsExpenses.filter((e) => e.status === 'pending').length;

  const handleFuelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const veh = fleetVehicles.find((v) => v.id === vehicleId);
    logFuelConsumption({
      vehicleId,
      vehicleName: veh ? `${veh.plate} (${veh.name})` : 'Tipper',
      driverName,
      liters,
      costPerLiter,
      totalCost: Math.round(liters * costPerLiter),
      location,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      odometerKm: odometer,
    });
    setIsFuelModalOpen(false);
  };

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addLogisticsExpense({
      category: expenseCategory,
      amount: expenseAmount,
      description: expenseDescription,
      transporterName,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
    });
    setIsExpenseModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Total Diesel Dispensed
          </span>
          <span className="text-2xl font-black text-slate-900 dark:text-white font-sans">
            {totalFuelLiters.toLocaleString()} L
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">Direct mining bowser telemetry</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/40 p-4 rounded-xl border-l-4 border-l-amber-500 shadow-xs">
          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
            Total Fuel Expenditure
          </span>
          <span className="text-2xl font-black text-amber-600 dark:text-amber-400 font-sans">
            ₹{(totalFuelSpend / 100000).toFixed(2)} L
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">Avg ₹92.40 per liter</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/40 p-4 rounded-xl border-l-4 border-l-emerald-500 shadow-xs">
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
            Freight & Green Cess
          </span>
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-sans">
            ₹{(totalExpenses / 100000).toFixed(2)} L
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">Statutory transit permits & tolls</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-sky-200 dark:border-sky-900/40 p-4 rounded-xl border-l-4 border-l-sky-500 shadow-xs">
          <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider block">
            Pending Claims
          </span>
          <span className="text-2xl font-black text-sky-600 dark:text-sky-400 font-sans">
            {pendingExpensesCount}
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">Awaiting Transportation Head signoff</span>
        </div>
      </div>

      {/* Sub Tab Switcher & Actions */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xs flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveSubTab('fuel')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
              activeSubTab === 'fuel'
                ? 'bg-sky-500/15 text-sky-500 border border-sky-500/30'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Fuel className="w-4 h-4" />
            <span>Diesel Fuel Logs ({fuelLogs.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('expenses')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
              activeSubTab === 'expenses'
                ? 'bg-sky-500/15 text-sky-500 border border-sky-500/30'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Coins className="w-4 h-4" />
            <span>Transit & Freight Expenses ({logisticsExpenses.length})</span>
          </button>
        </div>

        <div>
          {activeSubTab === 'fuel' ? (
            <button
              onClick={() => setIsFuelModalOpen(true)}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-lg shadow-sky-600/20 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Log Diesel Dispensing</span>
            </button>
          ) : (
            <button
              onClick={() => setIsExpenseModalOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-lg shadow-emerald-600/20 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Submit Logistics Claim</span>
            </button>
          )}
        </div>
      </div>

      {/* Fuel Logs View */}
      {activeSubTab === 'fuel' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Log ID</th>
                  <th className="py-3 px-4">Fleet Vehicle</th>
                  <th className="py-3 px-4">Driver</th>
                  <th className="py-3 px-4 text-right">Liters Dispensed</th>
                  <th className="py-3 px-4 text-right">Cost / Liter (₹)</th>
                  <th className="py-3 px-4 text-right font-bold text-slate-900 dark:text-white">Total Cost (₹)</th>
                  <th className="py-3 px-4">Dispensing Location</th>
                  <th className="py-3 px-4">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {fuelLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-850/60 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-sky-600 dark:text-sky-400 whitespace-nowrap">
                      {log.id}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap font-medium text-slate-900 dark:text-slate-100">
                      {log.vehicleName}
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 whitespace-nowrap font-medium">
                      {log.driverName}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-800 dark:text-slate-200">
                      {log.liters} L
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono text-slate-600 dark:text-slate-400">
                      ₹{log.costPerLiter}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-amber-500">
                      ₹{log.totalCost.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 truncate max-w-[200px]">
                      {log.location}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Logistics Expenses View */}
      {activeSubTab === 'expenses' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Claim ID</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Expense Description</th>
                  <th className="py-3 px-4">Transporter Entity</th>
                  <th className="py-3 px-4 text-right font-bold text-slate-900 dark:text-white">Amount (₹)</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Approval</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {logisticsExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-850/60 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-sky-600 dark:text-sky-400 whitespace-nowrap">
                      {exp.id}
                    </td>

                    <td className="py-3.5 px-4 capitalize font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                      {exp.category.replace('_', ' ')}
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 max-w-[240px] truncate font-medium">
                      {exp.description}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {exp.transporterName || 'Central Mining Services'}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-500 whitespace-nowrap">
                      ₹{exp.amount.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {exp.date}
                    </td>

                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {exp.status === 'approved' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                          APPROVED
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                          PENDING
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      {exp.status === 'pending' && (
                        <button
                          onClick={() => approveLogisticsExpense(exp.id)}
                          className="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded-lg text-[10px] font-bold transition"
                        >
                          Approve Payout
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Fuel Log Modal */}
      {isFuelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Fuel className="w-5 h-5 text-sky-400" />
                <h3 className="font-bold text-sm">Log Bowser Diesel Dispensing</h3>
              </div>
              <button
                onClick={() => setIsFuelModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFuelSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Fleet Vehicle *
                  </label>
                  <select
                    value={vehicleId}
                    onChange={(e) => setVehicleId(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white"
                  >
                    {fleetVehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.plate} ({v.name})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Driver *
                  </label>
                  <input
                    type="text"
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    required
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Liters *
                  </label>
                  <input
                    type="number"
                    value={liters}
                    onChange={(e) => setLiters(Number(e.target.value))}
                    required
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 font-mono text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Rate / L (₹) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={costPerLiter}
                    onChange={(e) => setCostPerLiter(Number(e.target.value))}
                    required
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 font-mono text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Odometer (km)
                  </label>
                  <input
                    type="number"
                    value={odometer}
                    onChange={(e) => setOdometer(Number(e.target.value))}
                    required
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Dispensing Location / Bowser ID *
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsFuelModalOpen(false)}
                  className="px-4 py-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl shadow-lg shadow-sky-600/20"
                >
                  Log Dispensing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Expense Modal */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Coins className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm">Submit Freight & Transit Expense</h3>
              </div>
              <button
                onClick={() => setIsExpenseModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleExpenseSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Expense Category *
                  </label>
                  <select
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white"
                  >
                    <option value="green_cess">Environmental Green Cess</option>
                    <option value="tolls">District Siding Highway Tolls</option>
                    <option value="permits">DGMS Movement Transit Permits</option>
                    <option value="fuel">Emergency En-route Fuel</option>
                    <option value="maintenance">Breakdown Haulage Recovery</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Claim Amount (₹) *
                  </label>
                  <input
                    type="number"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(Number(e.target.value))}
                    required
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description & Justification *
                </label>
                <input
                  type="text"
                  value={expenseDescription}
                  onChange={(e) => setExpenseDescription(e.target.value)}
                  required
                  placeholder="e.g. Weighbridge toll pass & environmental green tax"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Transporter Contractor *
                </label>
                <input
                  type="text"
                  value={transporterName}
                  onChange={(e) => setTransporterName(e.target.value)}
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="px-4 py-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20"
                >
                  Submit Expense Claim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
