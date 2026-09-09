// MINEGOV AI - Safety & Incidents Module
import React, { useState } from 'react';
import { useGovernance } from '../../context/GovernanceContext';
import { useI18n } from '../../context/I18nContext';
import { formatDate, getSeverityBadgeClass, getStatusBadgeClass } from '../../utils/formatters';
import type { SeverityLevel } from '../../types';
import {
  AlertTriangle,
  Plus,
  Search,
} from 'lucide-react';

export const IncidentsModule: React.FC = () => {
  const { violations, submitReport, mines, canPerform } = useGovernance();
  const { t } = useI18n();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('All');
  const [showReportModal, setShowReportModal] = useState(false);

  // Report Form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Electrical Safety');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<SeverityLevel>('HIGH');
  const [mineId, setMineId] = useState('m1');
  const [zone, setZone] = useState('Zone 4 (Electrical Substations)');
  const [contractorName, setContractorName] = useState('ABC Mining Services Ltd.');
  const [beforePhotoUrl] = useState(
    'https://images.unsplash.com/photo-1579226905180-636b76d96082?auto=format&fit=crop&w=400&q=80'
  );

  const filteredViolations = violations.filter((v) => {
    const matchesSearch =
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.zone.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = selectedSeverity === 'All' || v.severity === selectedSeverity;
    return matchesSearch && matchesSeverity;
  });

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    await submitReport({
      title,
      category,
      description,
      severity,
      mineId,
      zone,
      contractorName,
      beforePhotoUrl,
    });

    setShowReportModal(false);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-6 h-6 text-rose-600 dark:text-rose-400" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              {t('nav_incidents', 'Safety Hazards & Violations Log')}
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('dash_sub_so', 'Real-time hazard logging, statutory incident escalation, and multi-tier operational notification dispatch.')}
          </p>
        </div>

        {canPerform('canReportHazard') && (
          <button
            onClick={() => setShowReportModal(true)}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            <span>{t('btn_report_hazard', 'Report Unsafe Condition')}</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('filter_search', 'Search hazard title, category, zone...')}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white outline-none focus:border-sky-500 text-xs"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">{t('field_severity', 'Severity')}:</span>
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border rounded-lg px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 outline-none"
          >
            <option value="All">{t('filter_all_severities', 'All Severities')}</option>
            {['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((s) => (
              <option key={s} value={s}>
                {t(`sev_${s.toLowerCase()}`, s)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Incidents Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">{t('field_observation', 'Hazard Description')}</th>
                <th className="py-3 px-4">{t('field_department', 'Category')}</th>
                <th className="py-3 px-4">{t('field_mine', 'Mine')} & {t('field_zone', 'Zone')}</th>
                <th className="py-3 px-4">{t('field_inspector', 'Reported By')}</th>
                <th className="py-3 px-4">{t('field_date', 'Reported Date')}</th>
                <th className="py-3 px-4">{t('field_severity', 'Severity')}</th>
                <th className="py-3 px-4">{t('field_risk_score', 'AI Risk')}</th>
                <th className="py-3 px-4">{t('field_status', 'Workflow Status')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredViolations.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 dark:text-slate-400 text-xs">
                    {t('empty_no_violations', 'No active violations found for your operational scope.')}
                  </td>
                </tr>
              ) : (
                filteredViolations.map((v) => {
                  const mine = mines.find((m) => m.id === v.mineId);
                  const statusKey = `status_${v.status.toLowerCase()}`;
                  return (
                    <tr key={v.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/50 transition">
                      <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100 max-w-sm">
                        <div className="font-bold text-slate-900 dark:text-white line-clamp-1">{v.title}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 font-normal">
                          {v.description}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {v.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800 dark:text-slate-200">{mine?.name || v.mineId}</div>
                        <div className="text-[10px] text-slate-400">{v.zone}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-medium">
                        {v.reporterName}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">{formatDate(v.reportedAt)}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getSeverityBadgeClass(v.severity)}`}>
                          {t(`sev_${v.severity.toLowerCase()}`, v.severity)}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`font-mono font-black text-xs ${
                            v.riskScore >= 80
                              ? 'text-red-600 dark:text-red-400'
                              : v.riskScore >= 60
                              ? 'text-orange-500'
                              : 'text-amber-500'
                          }`}
                        >
                          {v.riskScore}/100
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadgeClass(v.status)}`}>
                          {t(statusKey, v.status.replace('_', ' '))}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Hazard Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                {t('mob_report_unsafe', 'Report Field Safety Hazard')}
              </h3>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleReportSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                  {t('field_observation', 'Hazard Title')}
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Water accumulation near electrical equipment"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    {t('field_department', 'Category')}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white outline-none"
                  >
                    {[
                      'Electrical Safety',
                      'Ventilation & Dust Control',
                      'Safety Barrier',
                      'Gas Concentration',
                      'Roof Bolting & Strata',
                      'Machinery & HEMM Guard',
                    ].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    {t('field_severity', 'Severity')}
                  </label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white outline-none"
                  >
                    {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map((s) => (
                      <option key={s} value={s}>
                        {t(`sev_${s.toLowerCase()}`, s)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    {t('field_mine', 'Mine')}
                  </label>
                  <select
                    value={mineId}
                    onChange={(e) => setMineId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white outline-none"
                  >
                    {mines.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    {t('field_zone', 'Zone')}
                  </label>
                  <select
                    value={zone}
                    onChange={(e) => setZone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white outline-none"
                  >
                    {mines
                      .find((m) => m.id === mineId)
                      ?.zones.map((z) => (
                        <option key={z} value={z}>
                          {z}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                  {t('field_observation', 'Detailed Observation')}
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe location, condition, exposed machinery, and worker proximity..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                  {t('field_contractor', 'Responsible Contractor (If any)')}
                </label>
                <input
                  type="text"
                  value={contractorName}
                  onChange={(e) => setContractorName(e.target.value)}
                  placeholder="e.g. ABC Mining Services Ltd."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="w-1/3 py-2 border rounded-xl font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {t('btn_cancel', 'Cancel')}
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl font-semibold shadow-md transition"
                >
                  {t('btn_submit', 'Dispatch to AI Engine')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
