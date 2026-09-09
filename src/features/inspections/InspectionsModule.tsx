// MINEGOV AI - Inspections Module
import React, { useState } from 'react';
import { useGovernance } from '../../context/GovernanceContext';
import { useI18n } from '../../context/I18nContext';
import { formatDate, getSeverityBadgeClass, getStatusBadgeClass } from '../../utils/formatters';
import type { Inspection, SeverityLevel } from '../../types';
import {
  Eye,
  Plus,
  Search,
  MapPin,
} from 'lucide-react';

export const InspectionsModule: React.FC = () => {
  const { inspections, createInspection, mines, currentUser, canPerform } = useGovernance();
  const { t } = useI18n();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMine, setSelectedMine] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeInspection, setActiveInspection] = useState<Inspection | null>(null);

  // New Inspection Form State
  const [mineId, setMineId] = useState('m1');
  const [zone, setZone] = useState('Zone 1 (Shaft Entrance)');
  const [dept, setDept] = useState('Safety & Strata Control');
  const [category, setCategory] = useState('Safety Barrier Inspection');
  const [severity, setSeverity] = useState<SeverityLevel>('MEDIUM');
  const [observations, setObservations] = useState('');
  const [remarks, setRemarks] = useState('');
  const [gps, setGps] = useState('23.754N, 86.421E');
  const [photoUrl, setPhotoUrl] = useState('');

  const filteredInspections = inspections.filter((ins) => {
    const matchesSearch =
      ins.observations.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ins.inspectorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ins.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ins.zone.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMine = selectedMine === 'All' || ins.mineId === selectedMine;
    const matchesStatus = selectedStatus === 'All' || ins.status === selectedStatus;
    return matchesSearch && matchesMine && matchesStatus;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!observations.trim()) return;

    createInspection({
      mineId,
      zone,
      department: dept,
      inspectorName: currentUser?.name || 'Inspection Officer',
      category,
      date: new Date().toISOString().split('T')[0],
      severity,
      observations,
      remarks,
      gps,
      photoUrl: photoUrl || undefined,
      status: 'Submitted',
    });

    setShowCreateModal(false);
    setObservations('');
    setRemarks('');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Eye className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              {t('nav_inspections', 'Field Inspections Registry')}
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('dash_sub_io', 'Statutory field sweep audits, hazardous condition records, and geo-stamped inspector logs.')}
          </p>
        </div>

        {canPerform('canCreateInspection') && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            <span>{t('btn_new_inspection', 'Log Field Inspection')}</span>
          </button>
        )}
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            {t('kpi_inspections_completed', 'Total Inspections')}
          </span>
          <span className="text-xl font-black text-slate-900 dark:text-white">{inspections.length}</span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/40 p-3 rounded-xl border-l-4 border-l-emerald-500">
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
            {t('status_closed', 'Closed & Certified')}
          </span>
          <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
            {inspections.filter((i) => i.status === 'Closed').length}
          </span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900/40 p-3 rounded-xl border-l-4 border-l-blue-500">
          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
            {t('status_under_review', 'Submitted / Review')}
          </span>
          <span className="text-xl font-black text-blue-600 dark:text-blue-400">
            {inspections.filter((i) => i.status === 'Submitted' || i.status === 'Under Review').length}
          </span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/40 p-3 rounded-xl border-l-4 border-l-red-500">
          <span className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider block">
            {t('kpi_critical_violations', 'Critical Findings')}
          </span>
          <span className="text-xl font-black text-red-600 dark:text-red-400">
            {inspections.filter((i) => i.severity === 'CRITICAL').length}
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('filter_search', 'Search observations, inspector, zone...')}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white outline-none focus:border-sky-500 text-xs"
          />
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
          <div className="flex items-center space-x-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">{t('field_mine', 'Mine')}:</span>
            <select
              value={selectedMine}
              onChange={(e) => setSelectedMine(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border rounded-lg px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 outline-none"
            >
              <option value="All">{t('filter_all_mines', 'All Mines')}</option>
              {mines.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">{t('field_status', 'Status')}:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border rounded-lg px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 outline-none"
            >
              <option value="All">{t('filter_all_statuses', 'All Statuses')}</option>
              {['Scheduled', 'In Progress', 'Submitted', 'Under Review', 'Closed'].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Inspections Grid */}
      {filteredInspections.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center text-slate-500 dark:text-slate-400 text-xs">
          {t('empty_no_inspections', 'No inspections matching your selected filters.')}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredInspections.map((ins) => {
            const mine = mines.find((m) => m.id === ins.mineId);
            return (
              <div
                key={ins.id}
                onClick={() => setActiveInspection(ins)}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-400/40 rounded-xl p-4 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono text-slate-400">{ins.id}</span>
                    <div className="flex space-x-1">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getSeverityBadgeClass(ins.severity)}`}>
                        {t(`sev_${ins.severity.toLowerCase()}`, ins.severity)}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadgeClass(ins.status)}`}>
                        {ins.status}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">{ins.category}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mt-1 leading-relaxed">
                    {ins.observations}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-800 dark:text-slate-200">{mine?.name || ins.mineId}</span>
                    <span>{formatDate(ins.date)}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1 text-slate-400" /> {ins.zone}
                    </span>
                    <span>{t('field_inspector', 'Inspector')}: {ins.inspectorName}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Inspection Detail Modal */}
      {activeInspection && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono text-sky-600 dark:text-sky-400 uppercase font-bold tracking-wider">
                  {activeInspection.id} • {activeInspection.department}
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base mt-0.5">
                  {activeInspection.category}
                </h3>
              </div>
              <button
                onClick={() => setActiveInspection(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl text-xs">
              <div>
                <span className="text-slate-400 block font-semibold mb-0.5">
                  {t('field_observation', 'Observation')}:
                </span>
                <p className="text-slate-800 dark:text-slate-200 leading-relaxed">{activeInspection.observations}</p>
              </div>

              {activeInspection.remarks && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 block font-semibold mb-0.5">
                    {t('field_action_taken', 'Remarks')}:
                  </span>
                  <p className="text-slate-700 dark:text-slate-300">{activeInspection.remarks}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                <div>
                  <span className="text-slate-400 block">{t('field_gps_coords', 'GPS Coordinates')}:</span>
                  <span className="font-mono text-sky-600 dark:text-sky-400 font-medium">{activeInspection.gps}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">{t('field_inspector', 'Inspector')}:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{activeInspection.inspectorName}</span>
                </div>
              </div>
            </div>

            {activeInspection.photoUrl && (
              <div>
                <span className="text-slate-400 text-xs font-semibold block mb-1">
                  {t('field_evidence', 'Photographic Evidence')}:
                </span>
                <img
                  src={activeInspection.photoUrl}
                  alt="Inspection Evidence"
                  className="w-full h-40 object-cover rounded-xl border border-slate-200 dark:border-slate-700"
                />
              </div>
            )}

            <button
              onClick={() => setActiveInspection(null)}
              className="w-full py-2 bg-slate-900 dark:bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
            >
              {t('btn_close', 'Close Window')}
            </button>
          </div>
        </div>
      )}

      {/* Log Inspection Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              {t('btn_new_inspection', 'Log Statutory Field Inspection')}
            </h3>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
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
                  {t('field_department', 'Department')}
                </label>
                <input
                  type="text"
                  required
                  value={dept}
                  onChange={(e) => setDept(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white outline-none"
                  />
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

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                  {t('field_observation', 'Observation Remarks')}
                </label>
                <textarea
                  required
                  rows={3}
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  placeholder="Record observations, safety deviations, and machine statuses..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    {t('field_gps_coords', 'GPS Location')}
                  </label>
                  <input
                    type="text"
                    value={gps}
                    onChange={(e) => setGps(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    {t('field_evidence', 'Evidence Photo URL')}
                  </label>
                  <input
                    type="text"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="w-1/3 py-2 border rounded-xl font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {t('btn_cancel', 'Cancel')}
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-semibold shadow-md transition"
                >
                  {t('btn_submit', 'Submit Inspection')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
