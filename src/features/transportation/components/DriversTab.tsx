import React, { useState } from 'react';
import { useGovernance } from '../../../context/GovernanceContext';
import {
  Users,
  Search,
  Filter,
  Plus,
  ShieldCheck,
  Phone,
  AlertTriangle,
  X,
} from 'lucide-react';
import type { TransporterDriver } from '../../../types';

export const DriversTab: React.FC = () => {
  const { fleetDrivers, addFleetDriver } = useGovernance();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Driver Form State
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('+91 98');
  const [newLicense, setNewLicense] = useState('JH-10-DL-202');
  const [newTransporter, setNewTransporter] = useState('Bharat Coking Logistics Ltd.');
  const [newHazardous, setNewHazardous] = useState(true);
  const [newDgmsCertified, setNewDgmsCertified] = useState(true);

  const filteredDrivers = fleetDrivers.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.transporterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.phone.includes(searchQuery);
    const matchesStatus = statusFilter === 'ALL' || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const avgSafetyScore = fleetDrivers.length > 0
    ? Math.round(fleetDrivers.reduce((acc, d) => acc + d.safetyScore, 0) / fleetDrivers.length)
    : 100;
  const onDutyCount = fleetDrivers.filter((d) => d.status === 'on_duty' || d.status === 'on_trip').length;

  const handleAddDriver = (e: React.FormEvent) => {
    e.preventDefault();
    const expiry = new Date();
    expiry.setFullYear(expiry.getFullYear() + 5);

    addFleetDriver({
      name: newName,
      phone: newPhone,
      licenseNumber: newLicense,
      licenseExpiry: expiry.toISOString().split('T')[0],
      hazardousEndorsement: newHazardous,
      dgmsSafetyCertified: newDgmsCertified,
      status: 'on_duty',
      safetyScore: 98,
      totalTrips: 0,
      transporterName: newTransporter,
      region: 'Jharia Coalfield',
    });

    setIsAddModalOpen(false);
    setNewName('');
  };

  const getStatusBadge = (status: TransporterDriver['status']) => {
    switch (status) {
      case 'on_duty':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">ON DUTY</span>;
      case 'on_trip':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-400/20 animate-pulse">ON TRIP</span>;
      case 'off_duty':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-500/10 text-slate-400 border border-slate-500/20">OFF DUTY</span>;
      case 'suspended':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20">SUSPENDED</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action & KPI Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Total HCV Drivers
          </span>
          <span className="text-2xl font-black text-slate-900 dark:text-white font-sans">{fleetDrivers.length}</span>
          <span className="text-[10px] text-slate-400 block mt-1">Authorized heavy vehicle operators</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/40 p-4 rounded-xl border-l-4 border-l-emerald-500 shadow-xs">
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
            Active / On-Duty
          </span>
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-sans">{onDutyCount}</span>
          <span className="text-[10px] text-slate-400 block mt-1">Available for dispatch haulage</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-sky-200 dark:border-sky-900/40 p-4 rounded-xl border-l-4 border-l-sky-500 shadow-xs">
          <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider block">
            DGMS Safety Certified
          </span>
          <span className="text-2xl font-black text-sky-600 dark:text-sky-400 font-sans">
            {fleetDrivers.filter((d) => d.dgmsSafetyCertified).length}/{fleetDrivers.length}
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">100% statutory training compliance</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/40 p-4 rounded-xl border-l-4 border-l-amber-500 shadow-xs">
          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
            Avg Fleet Safety Score
          </span>
          <span className="text-2xl font-black text-amber-600 dark:text-amber-400 font-sans">
            {avgSafetyScore}%
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">Speed, seal integrity & safety SLA</span>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-3 w-full sm:w-auto flex-1">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search driver name, license, transporter..."
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
              <option value="ALL">All Duty Statuses</option>
              <option value="on_duty">On Duty</option>
              <option value="on_trip">On Trip</option>
              <option value="off_duty">Off Duty</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="w-full sm:w-auto px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-lg shadow-sky-600/20 transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Onboard HCV Driver</span>
        </button>
      </div>

      {/* Drivers Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Driver Name</th>
                <th className="py-3 px-4">Driving License No.</th>
                <th className="py-3 px-4">Transporter Entity</th>
                <th className="py-3 px-4 text-center">DGMS Certified</th>
                <th className="py-3 px-4 text-center">Safety Score</th>
                <th className="py-3 px-4 text-center">Completed Trips</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredDrivers.map((driver) => (
                <tr key={driver.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-850/60 transition">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{driver.name}</div>
                    <div className="text-[10px] text-slate-400 flex items-center space-x-1">
                      <Phone className="w-2.5 h-2.5" />
                      <span>{driver.phone}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-700 dark:text-slate-300">
                    <div>{driver.licenseNumber}</div>
                    <div className="text-[10px] text-slate-400">Exp: {driver.licenseExpiry}</div>
                  </td>

                  <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200 max-w-[180px] truncate">
                    {driver.transporterName}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    {driver.dgmsSafetyCertified ? (
                      <span className="inline-flex items-center space-x-1 text-emerald-500 text-[11px] font-semibold">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Valid</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 text-amber-500 text-[11px] font-semibold">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Pending</span>
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`font-mono font-bold text-xs ${
                        driver.safetyScore >= 95
                          ? 'text-emerald-500'
                          : driver.safetyScore >= 85
                          ? 'text-amber-500'
                          : 'text-rose-500'
                      }`}
                    >
                      {driver.safetyScore}%
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center font-mono font-semibold text-slate-700 dark:text-slate-300">
                    {driver.totalTrips} Trips
                  </td>

                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    {getStatusBadge(driver.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Onboard Driver Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-sky-400" />
                <h3 className="font-bold text-sm">Onboard Licensed HCV Driver</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddDriver} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Driver Full Name *
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                  placeholder="e.g. Surendra Mohan Soren"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Contact Mobile *
                  </label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    required
                    placeholder="+91 98765 43210"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    HCV Driving License No. *
                  </label>
                  <input
                    type="text"
                    value={newLicense}
                    onChange={(e) => setNewLicense(e.target.value)}
                    required
                    placeholder="JH-10-DL-2024-9988"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Transporter Contractor *
                </label>
                <input
                  type="text"
                  value={newTransporter}
                  onChange={(e) => setNewTransporter(e.target.value)}
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="dgmsCert"
                    checked={newDgmsCertified}
                    onChange={(e) => setNewDgmsCertified(e.target.checked)}
                    className="rounded border-slate-300 text-sky-600"
                  />
                  <label htmlFor="dgmsCert" className="text-slate-700 dark:text-slate-300 font-medium cursor-pointer">
                    DGMS Vocational Safety Training Certificate Verified
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="hazEndorse"
                    checked={newHazardous}
                    onChange={(e) => setNewHazardous(e.target.checked)}
                    className="rounded border-slate-300 text-sky-600"
                  />
                  <label htmlFor="hazEndorse" className="text-slate-700 dark:text-slate-300 font-medium cursor-pointer">
                    Heavy Commercial Vehicle (HCV) & Hazardous Endorsement Valid
                  </label>
                </div>
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl shadow-lg shadow-sky-600/20"
                >
                  Authorize Driver
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
