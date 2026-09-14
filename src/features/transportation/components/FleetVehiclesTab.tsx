import React, { useState } from 'react';
import { useGovernance } from '../../../context/GovernanceContext';
import {
  Truck,
  Search,
  Filter,
  Plus,
  Wrench,
  Fuel,
  FileCheck,
  X,
} from 'lucide-react';
import type { FleetVehicle } from '../../../types';

export const FleetVehiclesTab: React.FC = () => {
  const { fleetVehicles, updateVehicleStatus, addFleetVehicle, mines } = useGovernance();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New vehicle form state
  const [newPlate, setNewPlate] = useState('JH-10-AT-');
  const [newName, setNewName] = useState('Tata Prima 2830.K Coal Tipper');
  const [newType, setNewType] = useState<FleetVehicle['type']>('Heavy Tipper (25T)');
  const [newCapacity, setNewCapacity] = useState(28);
  const [newTare, setNewTare] = useState(12.5);
  const [newTransporter, setNewTransporter] = useState('Bharat Coking Logistics Ltd.');

  const filteredVehicles = fleetVehicles.filter((v) => {
    const matchesSearch =
      v.plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.transporterName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || v.status === statusFilter;
    const matchesType = typeFilter === 'ALL' || v.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: FleetVehicle['status']) => {
    switch (status) {
      case 'active':
      case 'idle':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'on_trip':
        return 'bg-blue-500/10 text-blue-400 border-blue-400/20 animate-pulse';
      case 'maintenance':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'retired':
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400';
    }
  };

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    const expiry = new Date();
    expiry.setFullYear(expiry.getFullYear() + 1);

    addFleetVehicle({
      name: newName,
      plate: newPlate,
      type: newType,
      make: 'Tata Motors',
      model: 'Prima 2830.K',
      year: 2024,
      status: 'idle',
      fuelLevel: 100,
      mileageKm: 1200,
      mineId: mines[0]?.id || 'm1',
      transporterName: newTransporter,
      tareWeightTonnes: newTare,
      maxCapacityTonnes: newCapacity,
      depot: 'Central Mining Fleet Yard #1',
      documents: [
        {
          type: 'fitness',
          status: 'valid',
          expiryDate: expiry.toISOString().split('T')[0],
          docNumber: `FIT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        },
        {
          type: 'dgms_permit',
          status: 'valid',
          expiryDate: expiry.toISOString().split('T')[0],
          docNumber: `DGMS-HAUL-${Math.floor(10000 + Math.random() * 90000)}`,
        },
      ],
    });
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-3 w-full sm:w-auto flex-1">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by license plate, model, vendor..."
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
              <option value="ALL">All Operational Statuses</option>
              <option value="idle">Idle / Ready</option>
              <option value="on_trip">On Trip (In Transit)</option>
              <option value="active">Active</option>
              <option value="maintenance">In Maintenance</option>
              <option value="retired">Retired</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
            >
              <option value="ALL">All Vehicle Classes</option>
              <option value="Heavy Tipper (25T)">Heavy Tipper (25T)</option>
              <option value="Articulated Dumper (40T)">Articulated Dumper (40T)</option>
              <option value="Coal Hauler (50T)">Coal Hauler (50T)</option>
              <option value="Rail Rake">Rail Rake</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="w-full sm:w-auto px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-lg shadow-sky-600/20 transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Register Mining Vehicle</span>
        </button>
      </div>

      {/* Vehicles Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVehicles.map((vehicle) => {
          const fitnessDoc = vehicle.documents?.find((d) => d.type === 'fitness');

          return (
            <div
              key={vehicle.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3 hover:border-sky-400/40 transition"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                      {vehicle.plate}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${getStatusColor(
                        vehicle.status
                      )}`}
                    >
                      {vehicle.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-0.5">{vehicle.name}</p>
                  <p className="text-[10px] text-slate-400">{vehicle.type} • {vehicle.year}</p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                  <Truck className="w-4 h-4" />
                </div>
              </div>

              {/* Specs & Capacity */}
              <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 dark:bg-slate-850 rounded-xl text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[10px]">Payload Capacity:</span>
                  <span className="font-mono font-bold text-sky-500">{vehicle.maxCapacityTonnes} MT</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Tare (Unladen):</span>
                  <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                    {vehicle.tareWeightTonnes} MT
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Odometer:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">
                    {vehicle.mileageKm.toLocaleString()} km
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Transporter:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200 truncate block">
                    {vehicle.transporterName}
                  </span>
                </div>
              </div>

              {/* Fuel Level */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400 flex items-center space-x-1">
                    <Fuel className="w-3 h-3 text-amber-500" />
                    <span>Diesel Fuel Tank</span>
                  </span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{vehicle.fuelLevel}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      vehicle.fuelLevel < 25 ? 'bg-rose-500' : vehicle.fuelLevel < 50 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${vehicle.fuelLevel}%` }}
                  />
                </div>
              </div>

              {/* Statutory Permits */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px]">
                <div className="flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>DGMS Fitness Valid ({fitnessDoc?.expiryDate || '2026-12-31'})</span>
                </div>

                <div className="flex items-center space-x-1">
                  {vehicle.status === 'maintenance' ? (
                    <button
                      onClick={() => updateVehicleStatus(vehicle.id, 'idle')}
                      className="px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 rounded-lg text-[10px] font-bold"
                    >
                      Mark Ready
                    </button>
                  ) : (
                    <button
                      onClick={() => updateVehicleStatus(vehicle.id, 'maintenance')}
                      className="px-2 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 rounded-lg text-[10px] font-bold flex items-center space-x-1"
                    >
                      <Wrench className="w-2.5 h-2.5" />
                      <span>Service</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Vehicle Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Truck className="w-5 h-5 text-sky-400" />
                <h3 className="font-bold text-sm">Register Heavy Mining Vehicle</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddVehicle} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Registration Plate *
                  </label>
                  <input
                    type="text"
                    value={newPlate}
                    onChange={(e) => setNewPlate(e.target.value)}
                    required
                    placeholder="JH-10-AT-9988"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 font-mono text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Vehicle Type *
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white"
                  >
                    <option value="Heavy Tipper (25T)">Heavy Tipper (25T)</option>
                    <option value="Articulated Dumper (40T)">Articulated Dumper (40T)</option>
                    <option value="Coal Hauler (50T)">Coal Hauler (50T)</option>
                    <option value="Rail Rake">Rail Rake</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Model & Description *
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                  placeholder="e.g. Tata Prima 2830.K Coal Tipper"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Max Net Payload (Tonnes) *
                  </label>
                  <input
                    type="number"
                    value={newCapacity}
                    onChange={(e) => setNewCapacity(Number(e.target.value))}
                    required
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 font-mono text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tare Weight (Tonnes) *
                  </label>
                  <input
                    type="number"
                    value={newTare}
                    onChange={(e) => setNewTare(Number(e.target.value))}
                    required
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Contractor / Transporter Name *
                </label>
                <input
                  type="text"
                  value={newTransporter}
                  onChange={(e) => setNewTransporter(e.target.value)}
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
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
                  Register Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
