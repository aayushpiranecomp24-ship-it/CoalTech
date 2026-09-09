// MINEGOV AI - Statutory Compliance Module
import React, { useState } from 'react';
import { useGovernance } from '../../context/GovernanceContext';
import { useI18n } from '../../context/I18nContext';
import { formatDate, getSeverityBadgeClass, getStatusBadgeClass } from '../../utils/formatters';
import type { ComplianceItem } from '../../types';
import {
  FileCheck2,
  Plus,
  Search,
  Eye,
  Check,
} from 'lucide-react';

export const ComplianceModule: React.FC = () => {
  const { complianceItems, addComplianceItem, updateComplianceStatus, canPerform } = useGovernance();
  const { t } = useI18n();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeItem, setActiveItem] = useState<ComplianceItem | null>(null);

  // New Compliance Item Form State
  const [newRequirement, setNewRequirement] = useState('');
  const [newCategory, setNewCategory] = useState<ComplianceItem['category']>('Safety');
  const [newDept, setNewDept] = useState('Safety & Hazard Control');
  const [newOfficer, setNewOfficer] = useState('Sunil Patil');
  const [newDueDate, setNewDueDate] = useState(() =>
    new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [newSeverity, setNewSeverity] = useState<ComplianceItem['severity']>('HIGH');
  const [newCitation, setNewCitation] = useState('Regulation 123, CMR 2017');

  const categories = ['All', 'Safety', 'Environment', 'Labour', 'Production', 'Contractor', 'Equipment'];
  const statuses = ['All', 'Compliant', 'Due Soon', 'Overdue', 'Violation', 'Under Review'];

  const filteredItems = complianceItems.filter((item) => {
    const matchesSearch =
      item.requirement.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.regulationCitation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.responsibleOfficer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleCreateCompliance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRequirement.trim()) return;

    addComplianceItem({
      requirement: newRequirement,
      category: newCategory,
      responsibleDepartment: newDept,
      responsibleOfficer: newOfficer,
      dueDate: new Date(newDueDate).toISOString(),
      status: 'Due Soon',
      severity: newSeverity,
      lastInspectionDate: new Date().toISOString(),
      nextReviewDate: new Date(newDueDate).toISOString(),
      regulationCitation: newCitation,
    });

    setShowAddModal(false);
    setNewRequirement('');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Module Title & Top Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <FileCheck2 className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              {t('nav_compliance', 'Statutory Compliance Tracking')}
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Monitoring adherence to Coal Mines Regulations (CMR) 2017 and Directorate General of Mines Safety mandates.
          </p>
        </div>

        {canPerform('canManageCompliance') && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            <span>{t('btn_add_compliance', 'Add Statutory Mandate')}</span>
          </button>
        )}
      </div>

      {/* KPI Counters Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            {t('kpi_total_mandates', 'Total Statutory Mandates')}
          </span>
          <span className="text-xl font-black text-slate-900 dark:text-white">{complianceItems.length}</span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/40 p-3 rounded-xl border-l-4 border-l-emerald-500">
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
            {t('status_compliant', 'Compliant')}
          </span>
          <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
            {complianceItems.filter((c) => c.status === 'Compliant').length}
          </span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/40 p-3 rounded-xl border-l-4 border-l-amber-500">
          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
            {t('status_due_soon', 'Due Soon')}
          </span>
          <span className="text-xl font-black text-amber-600 dark:text-amber-400">
            {complianceItems.filter((c) => c.status === 'Due Soon').length}
          </span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/40 p-3 rounded-xl border-l-4 border-l-rose-500">
          <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block">
            {t('status_overdue', 'Overdue')}
          </span>
          <span className="text-xl font-black text-rose-600 dark:text-rose-400">
            {complianceItems.filter((c) => c.status === 'Overdue').length}
          </span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/40 p-3 rounded-xl border-l-4 border-l-red-500">
          <span className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider block">
            {t('kpi_active_violations', 'Active Violations')}
          </span>
          <span className="text-xl font-black text-red-600 dark:text-red-400">
            {complianceItems.filter((c) => c.status === 'Violation').length}
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center text-xs">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search requirement, citation, officer..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none focus:border-sky-500 text-xs"
          />
        </div>

        {/* Category & Status Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          <div className="flex items-center space-x-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 outline-none"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 outline-none"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Compliance Data Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Statutory Requirement</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Citation</th>
                <th className="py-3 px-4">Officer / Dept</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/50 transition">
                  <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100 max-w-xs">
                    {item.requirement}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-sky-600 dark:text-sky-400">
                    {item.regulationCitation}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-slate-800 dark:text-slate-200 font-medium">{item.responsibleOfficer}</div>
                    <div className="text-[10px] text-slate-400">{item.responsibleDepartment}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">{formatDate(item.dueDate)}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getSeverityBadgeClass(item.severity)}`}>
                      {item.severity}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadgeClass(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1">
                    <button
                      onClick={() => setActiveItem(item)}
                      className="p-1.5 text-slate-500 hover:text-sky-600 dark:hover:text-sky-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {item.status !== 'Compliant' && (
                      <button
                        onClick={() => updateComplianceStatus(item.id, 'Compliant')}
                        className="p-1.5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-lg transition"
                        title="Mark Compliant"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Item Detail Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                  {activeItem.category} Statutory Mandate
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base mt-0.5">
                  {activeItem.requirement}
                </h3>
              </div>
              <button
                onClick={() => setActiveItem(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Citation:</span>
                <span className="font-mono text-sky-600 dark:text-sky-400 font-bold">{activeItem.regulationCitation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Responsible Officer:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{activeItem.responsibleOfficer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Responsible Department:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{activeItem.responsibleDepartment}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Due Date:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{formatDate(activeItem.dueDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadgeClass(activeItem.status)}`}>
                  {activeItem.status}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  updateComplianceStatus(activeItem.id, 'Compliant');
                  setActiveItem(null);
                }}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold text-xs transition"
              >
                Certify Compliant
              </button>
              <button
                onClick={() => {
                  updateComplianceStatus(activeItem.id, 'Violation');
                  setActiveItem(null);
                }}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-semibold text-xs transition"
              >
                Flag Statutory Violation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Compliance Mandate Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Add Statutory Compliance Mandate
            </h3>

            <form onSubmit={handleCreateCompliance} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Requirement Statement</label>
                <input
                  type="text"
                  required
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  placeholder="e.g. Quarterly Roof Bolting Pull-Test"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white outline-none"
                  >
                    {['Safety', 'Environment', 'Labour', 'Production', 'Contractor', 'Equipment'].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Severity</label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white outline-none"
                  >
                    {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Statutory Citation</label>
                <input
                  type="text"
                  required
                  value={newCitation}
                  onChange={(e) => setNewCitation(e.target.value)}
                  placeholder="e.g. Regulation 123, CMR 2017"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Department</label>
                <input
                  type="text"
                  required
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Responsible Officer</label>
                  <input
                    type="text"
                    required
                    value={newOfficer}
                    onChange={(e) => setNewOfficer(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/3 py-2 border rounded-xl font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-semibold shadow-md transition"
                >
                  Save Mandate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
