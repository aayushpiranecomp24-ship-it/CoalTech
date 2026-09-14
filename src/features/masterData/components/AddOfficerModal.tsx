import React, { useState } from 'react';
import { useGovernance } from '../../../context/GovernanceContext';
import { Shield, X, CheckCircle } from 'lucide-react';
import type { Officer, RoleType } from '../../../types';

interface AddOfficerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (officer: Officer) => void;
}

export const AddOfficerModal: React.FC<AddOfficerModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { mines, areas, addOfficer } = useGovernance();

  const [name, setName] = useState('');
  const [officerCode, setOfficerCode] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<RoleType>('Safety Officer');
  const [mineId, setMineId] = useState(mines[0]?.id || 'm1');
  const [department, setDepartment] = useState('Safety & Hazard Control');
  const [badgeNumber, setBadgeNumber] = useState('');
  const [status, setStatus] = useState<Officer['status']>('Active');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setIsSubmitting(true);
    const code = officerCode.trim() || `OFF-${role.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const badge = badgeNumber.trim() || `DGMS-${role.slice(0, 2).toUpperCase()}-2026`;

    const newOfficerData: Omit<Officer, 'id'> = {
      name: name.trim(),
      officerCode: code,
      email: email.trim(),
      phone: phone.trim() || '+91 98440 12345',
      role,
      mineId,
      areaId: mines.find((m) => m.id === mineId)?.areaId || areas[0]?.id,
      department,
      status,
      assignedDate: new Date().toISOString().split('T')[0],
      badgeNumber: badge,
    };

    addOfficer(newOfficerData);
    setIsSubmitting(false);
    if (onSuccess) {
      onSuccess({ ...newOfficerData, id: 'temp' });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Appoint Statutory Officer</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Coal Mines Regulations (CMR 2017) Statutory Inspection & Safety Assignment
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
                Officer Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sunil Patil"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Statutory Code
              </label>
              <input
                type="text"
                value={officerCode}
                onChange={(e) => setOfficerCode(e.target.value)}
                placeholder="e.g. OFF-SFT-104"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Statutory Designation / Role <span className="text-rose-500">*</span>
              </label>
              <select
                value={role}
                onChange={(e) => {
                  const r = e.target.value as RoleType;
                  setRole(r);
                  if (r === 'Safety Officer') setDepartment('Safety & Hazard Control');
                  else if (r === 'Inspection Officer') setDepartment('Statutory Inspection Board');
                  else if (r === 'Environment Officer') setDepartment('Environment & Ecology');
                  else if (r === 'Workforce Head') setDepartment('Workforce Operations & Safety Attendance');
                  else if (r === 'Transportation Head') setDepartment('Haulage & Dispatch Logistics');
                  else if (r === 'Finance Officer') setDepartment('Finance & Royalty Audit');
                }}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="Safety Officer">Safety Officer</option>
                <option value="Inspection Officer">Inspection Officer</option>
                <option value="Environment Officer">Environment Officer</option>
                <option value="Workforce Head">Workforce Head</option>
                <option value="Transportation Head">Transportation Head</option>
                <option value="Finance Officer">Finance Officer</option>
                <option value="Mine Head">Mine Head</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Assigned Mine Sector
              </label>
              <select
                value={mineId}
                onChange={(e) => setMineId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {mines.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Official Email <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="officer.name@coaltech.in"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Mobile Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98440 56789"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                DGMS Accreditation Badge
              </label>
              <input
                type="text"
                value={badgeNumber}
                onChange={(e) => setBadgeNumber(e.target.value)}
                placeholder="DGMS-SO-2024"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none uppercase"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Deployment Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Officer['status'])}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="Active">Active</option>
                <option value="On Field">On Field / Site Duty</option>
                <option value="On Leave">On Leave</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
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
              className="px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl shadow-lg transition flex items-center space-x-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{isSubmitting ? 'Appointing...' : 'Appoint Statutory Officer'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
