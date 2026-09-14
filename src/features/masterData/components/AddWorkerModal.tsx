import React, { useState } from 'react';
import { useGovernance } from '../../../context/GovernanceContext';
import { HardHat, X, CheckCircle } from 'lucide-react';
import type { Worker } from '../../../types';

interface AddWorkerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (worker: Worker) => void;
}

export const AddWorkerModal: React.FC<AddWorkerModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { mines, addWorker } = useGovernance();

  const [name, setName] = useState('');
  const [workerId, setWorkerId] = useState('');
  const [mineId, setMineId] = useState(mines[0]?.id || 'm1');
  const [department, setDepartment] = useState('Excavation');
  const [role, setRole] = useState('Shovel Operator');
  const [skill, setSkill] = useState<Worker['skill']>('Skilled');
  const [shift, setShift] = useState('Morning Shift (A)');
  const [trainingStatus, setTrainingStatus] = useState<Worker['trainingStatus']>('Completed');
  const [certExpiryDate, setCertExpiryDate] = useState('2027-10-20');
  const [dailyHoursWorked, setDailyHoursWorked] = useState(0);
  const [overtimeEligible, setOvertimeEligible] = useState(true);
  const [phone, setPhone] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    const badgeNumber = workerId.trim() || `CLT-WK-${Math.floor(1000 + Math.random() * 9000)}`;

    const newWorkerData: Omit<Worker, 'id'> = {
      workerId: badgeNumber,
      badgeNumber,
      name: name.trim(),
      mineId,
      department,
      role,
      skill,
      designation: `${skill} Operational Crew`,
      shift,
      attendanceStatus: 'Present',
      trainingStatus,
      status: 'Active',
      supervisorId: 'u3',
      safetyScore: 88,
      emergencyContact: emergencyContact.trim() || '+91 94300 11999',
      phone: phone.trim() || '+91 94300 22888',
      joiningDate: new Date().toISOString().split('T')[0],
      dailyHoursWorked: Number(dailyHoursWorked) || 0,
      weeklyHoursWorked: (Number(dailyHoursWorked) || 0) * 5,
      overtimeEligible,
      certExpiryDate,
    };

    addWorker(newWorkerData);
    setIsSubmitting(false);
    if (onSuccess) {
      onSuccess({ ...newWorkerData, id: 'temp' });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md">
              <HardHat className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Register Mining Personnel</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Statutory Directorate General of Mines Safety (DGMS) Workforce Enrollment
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
                Full Legal Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rameshwar Soren"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Worker Badge / Employee ID
              </label>
              <input
                type="text"
                value={workerId}
                onChange={(e) => setWorkerId(e.target.value)}
                placeholder="e.g. CLT-WK-1045"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Assigned Mine Sector <span className="text-rose-500">*</span>
              </label>
              <select
                value={mineId}
                onChange={(e) => setMineId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
              >
                {mines.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.mineCode || m.type})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Assigned Shift Timing <span className="text-rose-500">*</span>
              </label>
              <select
                value={shift}
                onChange={(e) => setShift(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
              >
                <option value="Morning Shift (A)">Morning Shift (A) — 08:00 to 16:00</option>
                <option value="Afternoon Shift (B)">Afternoon Shift (B) — 16:00 to 00:00</option>
                <option value="Night Shift (C)">Night Shift (C) — 00:00 to 08:00</option>
                <option value="General Shift (G)">General Shift (G) — 09:00 to 17:00</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
              >
                <option value="Excavation">Excavation</option>
                <option value="Ventilation">Ventilation</option>
                <option value="Haulage">Haulage</option>
                <option value="Electrical">Electrical</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Explosives">Explosives</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Role / Function
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Shovel Operator"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Skill Classification
              </label>
              <select
                value={skill}
                onChange={(e) => setSkill(e.target.value as Worker['skill'])}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
              >
                <option value="Skilled">Skilled</option>
                <option value="Operator">Operator (HEMM)</option>
                <option value="Technician">Technician</option>
                <option value="Blaster">Blaster (Explosives)</option>
                <option value="Semi-Skilled">Semi-Skilled</option>
                <option value="Unskilled">Unskilled</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                DGMS Vocational Training Status
              </label>
              <select
                value={trainingStatus}
                onChange={(e) => setTrainingStatus(e.target.value as Worker['trainingStatus'])}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
              >
                <option value="Completed">Completed (Valid Certificate)</option>
                <option value="Pending">Pending Evaluation</option>
                <option value="Expired">Expired (Requires Recertification)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Certificate Expiry Date
              </label>
              <input
                type="date"
                value={certExpiryDate}
                onChange={(e) => setCertExpiryDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Today's Daily Hours Completed
              </label>
              <input
                type="number"
                min="0"
                max="12"
                step="0.5"
                value={dailyHoursWorked}
                onChange={(e) => setDailyHoursWorked(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Standard limit: 8.0 hours</span>
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={overtimeEligible}
                  onChange={(e) => setOvertimeEligible(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300"
                />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Pre-cleared for Overtime Deployment
                </span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Personal Contact Mobile
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 94300 22110"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Emergency Next-of-Kin Contact
              </label>
              <input
                type="tel"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                placeholder="+91 94300 99887"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
              />
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
              className="px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 rounded-xl shadow-lg transition flex items-center space-x-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{isSubmitting ? 'Registering...' : 'Enroll Mining Personnel'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
