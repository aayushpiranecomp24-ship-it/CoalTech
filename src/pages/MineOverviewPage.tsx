// MINEGOV AI - Mines Directory & Comprehensive Overview Page
import React, { useState } from 'react';
import { useGovernance } from '../context/GovernanceContext';
import { useI18n } from '../context/I18nContext';
import {
  Building2,
  AlertTriangle,
  CheckCircle2,
  Search,
  ExternalLink,
} from 'lucide-react';

interface MineOverviewPageProps {
  onNavigateTab: (tab: string) => void;
}

export const MineOverviewPage: React.FC<MineOverviewPageProps> = ({ onNavigateTab }) => {
  const { mines, areas, violations } = useGovernance();
  const { t } = useI18n();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('All');

  const filteredMines = mines.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.manager.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesArea = selectedArea === 'All' || m.areaId === selectedArea;
    return matchesSearch && matchesArea;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Building2 className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              {t('nav_mines', 'Coal Mines Directory & Sector Risk Profiling')}
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enterprise multi-mine operational footprint across Jharkhand, West Bengal, and Madhya Pradesh areas.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search mine name, manager..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white outline-none focus:border-sky-500 text-xs"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Area Command:</span>
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border rounded-lg px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 outline-none"
          >
            <option value="All">All Areas</option>
            {areas.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMines.map((mine) => {
          const area = areas.find((a) => a.id === mine.areaId);
          const activeMineViolations = violations.filter((v) => v.mineId === mine.id && v.status !== 'CLOSED');
          const isCritical = mine.riskScore >= 80;

          return (
            <div
              key={mine.id}
              className={`bg-white dark:bg-slate-900 border rounded-2xl p-5 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between ${
                isCritical
                  ? 'border-red-300 dark:border-red-900/50'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                    {area?.name}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      isCritical
                        ? 'bg-red-500/10 text-red-600 border-red-300'
                        : mine.riskScore >= 50
                        ? 'bg-orange-500/10 text-orange-600 border-orange-300'
                        : 'bg-emerald-500/10 text-emerald-600 border-emerald-300'
                    }`}
                  >
                    Risk: {mine.riskScore}/100
                  </span>
                </div>

                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">{mine.name}</h3>
                <span className="text-[11px] text-slate-400 block">{mine.type} Coal Extraction Sector</span>
              </div>

              {/* Stats Tiles */}
              <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Manager</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{mine.manager}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Capacity</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{mine.productionCapacityMTPA} MTPA</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Workforce</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{mine.workforceCount} Personnel</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Compliance</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{mine.complianceScore}%</span>
                </div>
              </div>

              {/* Zones list */}
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                  Active Zones ({mine.zones.length}):
                </span>
                <div className="flex flex-wrap gap-1">
                  {mine.zones.slice(0, 3).map((z, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                    >
                      {z}
                    </span>
                  ))}
                  {mine.zones.length > 3 && (
                    <span className="px-2 py-0.5 rounded text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-400">
                      +{mine.zones.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-400">
                  {activeMineViolations.length > 0 ? (
                    <span className="text-red-500 font-bold flex items-center">
                      <AlertTriangle className="w-3.5 h-3.5 mr-1" /> {activeMineViolations.length} active violations
                    </span>
                  ) : (
                    <span className="text-emerald-500 font-semibold flex items-center">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> All clear
                    </span>
                  )}
                </span>

                <button
                  onClick={() => onNavigateTab('gis-map')}
                  className="text-sky-600 dark:text-sky-400 hover:underline font-semibold flex items-center text-[11px]"
                >
                  <span>GIS Hotzones</span>
                  <ExternalLink className="w-3 h-3 ml-1" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
