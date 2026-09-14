import React, { useState } from 'react';
import { useGovernance } from '../../../context/GovernanceContext';
import { Building2, X, CheckCircle } from 'lucide-react';
import type { Mine } from '../../../types';

interface AddMineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (mine: Mine) => void;
}

export const AddMineModal: React.FC<AddMineModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { areas, addMine } = useGovernance();

  const [name, setName] = useState('');
  const [mineCode, setMineCode] = useState('');
  const [areaId, setAreaId] = useState(areas[0]?.id || 'a1');
  const [manager, setManager] = useState('');
  const [type, setType] = useState<Mine['type']>('Opencast');
  const [productionCapacityMTPA, setProductionCapacityMTPA] = useState(3.5);
  const [workforceCount, setWorkforceCount] = useState(450);
  const [status, setStatus] = useState<Mine['status']>('Active');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [zonesInput, setZonesInput] = useState('Zone 1 (Shaft Entrance), Zone 2 (Haul Road), Zone 3 (CHP)');
  const [latitude, setLatitude] = useState(23.75);
  const [longitude, setLongitude] = useState(86.42);
  const [assignedOfficers, setAssignedOfficers] = useState('Sunil Patil (Safety)');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !manager.trim()) return;

    setIsSubmitting(true);
    const zones = zonesInput
      .split(',')
      .map((z) => z.trim())
      .filter(Boolean);

    const newMineData: Omit<Mine, 'id'> = {
      name: name.trim(),
      mineCode: mineCode.trim() || `ECL-${name.slice(0, 3).toUpperCase()}-0${Math.floor(Math.random() * 90 + 10)}`,
      areaId,
      manager: manager.trim(),
      riskScore: 24, // initial baseline risk
      complianceScore: 92,
      latitude: Number(latitude) || 23.75,
      longitude: Number(longitude) || 86.42,
      type,
      zones: zones.length > 0 ? zones : ['Zone 1 (Main Face)', 'Zone 2 (CHP Yard)'],
      productionCapacityMTPA: Number(productionCapacityMTPA) || 1.0,
      workforceCount: Number(workforceCount) || 100,
      status: status || 'Active',
      contactEmail: contactEmail.trim() || `mine.${name.toLowerCase().replace(/\s+/g, '')}@coaltech.in`,
      contactPhone: contactPhone.trim() || '+91 326 220 5000',
      assignedOfficers: assignedOfficers.split(',').map((o) => o.trim()).filter(Boolean),
    };

    addMine(newMineData);
    setIsSubmitting(false);
    if (onSuccess) {
      onSuccess({ ...newMineData, id: 'temp' });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Register Coal Mine Sector</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Statutory Directorate General of Mines Safety (DGMS) Mine Authorization Form
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
                Mine Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dhanbad Horizon Pit 7"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Official Mine Code
              </label>
              <input
                type="text"
                value={mineCode}
                onChange={(e) => setMineCode(e.target.value)}
                placeholder="e.g. ECL-JHR-08"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 outline-none uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Area Command <span className="text-rose-500">*</span>
              </label>
              <select
                value={areaId}
                onChange={(e) => setAreaId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 outline-none"
              >
                {areas.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.state})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Mine Type <span className="text-rose-500">*</span>
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as Mine['type'])}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 outline-none"
              >
                <option value="Opencast">Opencast</option>
                <option value="Underground">Underground</option>
                <option value="Mixed">Mixed (Underground & Surface)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Operational Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Mine['status'])}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 outline-none"
              >
                <option value="Active">Active</option>
                <option value="Under Maintenance">Under Maintenance</option>
                <option value="Suspended">Suspended</option>
                <option value="Decommissioned">Decommissioned</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Statutory Mine Head / Manager <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={manager}
                onChange={(e) => setManager(e.target.value)}
                placeholder="e.g. Sanjay Sharma"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Capacity (MTPA)
              </label>
              <input
                type="number"
                step="0.1"
                value={productionCapacityMTPA}
                onChange={(e) => setProductionCapacityMTPA(parseFloat(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Registered Workforce Count
              </label>
              <input
                type="number"
                value={workforceCount}
                onChange={(e) => setWorkforceCount(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Official Contact Email
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="mine.head@coaltech.in"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Control Room Phone
              </label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+91 326 220 4400"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                GPS Latitude
              </label>
              <input
                type="number"
                step="0.0001"
                value={latitude}
                onChange={(e) => setLatitude(parseFloat(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                GPS Longitude
              </label>
              <input
                type="number"
                step="0.0001"
                value={longitude}
                onChange={(e) => setLongitude(parseFloat(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Operational Zones (Comma-separated)
            </label>
            <input
              type="text"
              value={zonesInput}
              onChange={(e) => setZonesInput(e.target.value)}
              placeholder="Zone 1 (Shaft), Zone 2 (Haulage Way), Zone 3 (Excavation Face)"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Assigned Statutory Officers
            </label>
            <input
              type="text"
              value={assignedOfficers}
              onChange={(e) => setAssignedOfficers(e.target.value)}
              placeholder="Sunil Patil (Safety), Devendra Joshi (Inspection)"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 outline-none"
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
              className="px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 rounded-xl shadow-lg transition flex items-center space-x-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{isSubmitting ? 'Registering...' : 'Register Mine Master Record'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
