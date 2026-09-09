// MINEGOV AI - Statutory Rules, SLA & System Settings Module
import React, { useState } from 'react';
import { useI18n } from '../../context/I18nContext';
import { Settings, Sliders, Shield, Check } from 'lucide-react';

export const SettingsModule: React.FC = () => {
  const { t } = useI18n();
  const [saved, setSaved] = useState(false);

  // Form states
  const [critSla, setCritSla] = useState(24);
  const [highSla, setHighSla] = useState(72);
  const [medSla, setMedSla] = useState(120);

  const [weightSeverity, setWeightSeverity] = useState(30);
  const [weightRecurrence, setWeightRecurrence] = useState(20);
  const [weightSla, setWeightSla] = useState(15);
  const [weightLocation, setWeightLocation] = useState(15);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <Settings className="w-6 h-6 text-slate-600 dark:text-slate-400" />
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            {t('nav_settings', 'Statutory Rules, AI Weights & SLA Settings')}
          </h1>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Configure statutory escalation timelines, AI Risk scoring weights, and DGMS Section 22 compliance thresholds.
        </p>
      </div>

      {saved && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 p-3 rounded-xl text-emerald-800 dark:text-emerald-200 text-xs flex items-center space-x-2">
          <Check className="w-4 h-4 text-emerald-500" />
          <span>Statutory parameters successfully saved to local engine!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* SLA Timelines */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-sky-500" />
            <span>Statutory Remediation SLA Thresholds (Hours)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                Critical Severity SLA (Hours)
              </label>
              <input
                type="number"
                value={critSla}
                onChange={(e) => setCritSla(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Mandatory DGMS 24-hr max</span>
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                High Severity SLA (Hours)
              </label>
              <input
                type="number"
                value={highSla}
                onChange={(e) => setHighSla(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Standard 72-hr window</span>
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                Medium Severity SLA (Hours)
              </label>
              <input
                type="number"
                value={medSla}
                onChange={(e) => setMedSla(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Routine 5-day cycle</span>
            </div>
          </div>
        </div>

        {/* AI Scoring Weights */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center space-x-2">
            <Shield className="w-4 h-4 text-purple-500" />
            <span>AI Risk Scoring Weight Distribution (%)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <div className="flex justify-between mb-1 text-slate-600 dark:text-slate-400 font-semibold">
                <span>Severity Classification Weight</span>
                <span>{weightSeverity}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={50}
                value={weightSeverity}
                onChange={(e) => setWeightSeverity(Number(e.target.value))}
                className="w-full accent-sky-600"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1 text-slate-600 dark:text-slate-400 font-semibold">
                <span>Hazard Recurrence Weight</span>
                <span>{weightRecurrence}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={40}
                value={weightRecurrence}
                onChange={(e) => setWeightRecurrence(Number(e.target.value))}
                className="w-full accent-purple-600"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1 text-slate-600 dark:text-slate-400 font-semibold">
                <span>Overdue SLA Delay Factor</span>
                <span>{weightSla}%</span>
              </div>
              <input
                type="range"
                min={5}
                max={30}
                value={weightSla}
                onChange={(e) => setWeightSla(Number(e.target.value))}
                className="w-full accent-amber-600"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1 text-slate-600 dark:text-slate-400 font-semibold">
                <span>Critical Zone Sensitivity</span>
                <span>{weightLocation}%</span>
              </div>
              <input
                type="range"
                min={5}
                max={30}
                value={weightLocation}
                onChange={(e) => setWeightLocation(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold text-xs shadow-md transition"
        >
          Save Configuration
        </button>
      </form>
    </div>
  );
};
