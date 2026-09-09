// MINEGOV AI - GIS Coordinates & Hotzone Map Module
import React, { useState } from 'react';
import { GisMap } from '../../components/GisMap';
import { useGovernance } from '../../context/GovernanceContext';
import { useI18n } from '../../context/I18nContext';
import { Globe2, MapPin } from 'lucide-react';

export const GisModule: React.FC = () => {
  const { mines, violations } = useGovernance();
  const { t } = useI18n();
  const [selectedMineId, setSelectedMineId] = useState<string>('m1');

  const selectedMine = mines.find((m) => m.id === selectedMineId) || mines[0];
  const mineViolations = violations.filter((v) => v.mineId === selectedMine.id && v.status !== 'CLOSED');

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Globe2 className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              {t('nav_gis', 'Vector GIS Operational Hotzone Map')}
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time geospatial hazard mapping, geological contour layers, and subterranean zone monitoring.
          </p>
        </div>

        {/* Selected Mine Pill */}
        <div className="flex items-center space-x-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3.5 py-1.5 rounded-xl text-xs">
          <MapPin className="w-4 h-4 text-sky-500" />
          <span className="text-slate-500">Selected Sector:</span>
          <span className="font-bold text-slate-900 dark:text-white">{selectedMine.name}</span>
        </div>
      </div>

      {/* Vector SVG GIS Map Container */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-2 shadow-2xl overflow-hidden">
        <GisMap
          selectedMineId={selectedMineId}
          onSelectMine={(id) => setSelectedMineId(id)}
        />
      </div>

      {/* Selected Mine Zone Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Mine Stats */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-3">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-sky-500" />
            <span>{selectedMine.name} Details</span>
          </h3>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400">Mining Type:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedMine.type}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400">Manager:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedMine.manager}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400">GPS Coordinates:</span>
              <span className="font-mono text-sky-500">{selectedMine.latitude}°N, {selectedMine.longitude}°E</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400">Workforce Deployed:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedMine.workforceCount} miners</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Risk Assessment:</span>
              <span
                className={`font-mono font-bold ${
                  selectedMine.riskScore >= 80 ? 'text-red-500' : selectedMine.riskScore >= 50 ? 'text-orange-500' : 'text-emerald-500'
                }`}
              >
                {selectedMine.riskScore}/100 ({selectedMine.riskScore >= 80 ? 'CRITICAL' : selectedMine.riskScore >= 50 ? 'HIGH' : 'LOW'})
              </span>
            </div>
          </div>
        </div>

        {/* Zones in this Mine */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-3 md:col-span-2">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">
            Subterranean & Surface Work Zones ({selectedMine.zones.length})
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {selectedMine.zones.map((zone, idx) => {
              const zoneViolations = mineViolations.filter((v) => v.zone === zone);
              const hasCritical = zoneViolations.some((v) => v.severity === 'CRITICAL');
              return (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border flex items-center justify-between ${
                    hasCritical
                      ? 'bg-red-500/10 border-red-300 dark:border-red-900/50'
                      : zoneViolations.length > 0
                      ? 'bg-amber-500/10 border-amber-300 dark:border-amber-900/50'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white block">{zone}</span>
                    <span className="text-[10px] text-slate-400">
                      {zoneViolations.length > 0 ? `${zoneViolations.length} active hazard logs` : 'Normal operation'}
                    </span>
                  </div>
                  {hasCritical ? (
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-red-600 text-white animate-pulse">
                      ALERT
                    </span>
                  ) : zoneViolations.length > 0 ? (
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500 text-slate-950">
                      WARNING
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-500">
                      CLEAR
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
