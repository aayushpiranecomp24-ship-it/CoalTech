// MINEGOV AI - Environmental Telemetry & Ecology Ingestion Module
import React, { useState } from 'react';
import { useGovernance } from '../../context/GovernanceContext';
import { useI18n } from '../../context/I18nContext';
import type { EnvironmentalReading } from '../../types';
import {
  Activity,
  Wind,
  Droplets,
  Flame,
  Volume2,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const EnvironmentModule: React.FC = () => {
  const { readings, addEnvironmentalReading, mines } = useGovernance();
  const { t } = useI18n();

  const [selectedMine, setSelectedMine] = useState('m1');
  const [testParam, setTestParam] = useState<EnvironmentalReading['parameter']>('Methane Level (CH4)');
  const [testValue, setTestValue] = useState('1.45');

  const mineReadings = readings.filter((r) => r.mineId === selectedMine);

  // Group latest readings by parameter
  const latestByParam: Record<string, EnvironmentalReading> = {};
  mineReadings.forEach((r) => {
    if (!latestByParam[r.parameter]) {
      latestByParam[r.parameter] = r;
    }
  });

  // Prepare chart series data
  const chartData = [
    { time: '04:00', pm25: 68, ch4: 0.18, dust: 0.85, ph: 7.2 },
    { time: '08:00', pm25: 84, ch4: 0.32, dust: 1.15, ph: 7.4 },
    { time: '12:00', pm25: 110, ch4: 0.45, dust: 1.42, ph: 7.6 },
    { time: '16:00', pm25: selectedMine === 'm3' ? 165 : 95, ch4: selectedMine === 'm1' ? 1.38 : 0.28, dust: selectedMine === 'm3' ? 2.45 : 1.1, ph: selectedMine === 'm3' ? 9.4 : 7.3 },
    { time: '20:00', pm25: 78, ch4: 0.22, dust: 0.95, ph: 7.2 },
  ];

  const handleInjectTelemetry = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(testValue);
    if (isNaN(val)) return;
    addEnvironmentalReading(selectedMine, testParam, val);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Activity className="w-6 h-6 text-green-600 dark:text-green-400" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              {t('nav_environment', 'Environmental IoT Telemetry & Air/Water Quality')}
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Continuous Ambient Air Quality Monitoring (CAAQMS), sub-surface methane gas buildup, and effluent pH compliance.
          </p>
        </div>

        {/* Mine Selector */}
        <div className="flex items-center space-x-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl text-xs">
          <span className="text-slate-400 font-semibold">Sensor Array:</span>
          <select
            value={selectedMine}
            onChange={(e) => setSelectedMine(e.target.value)}
            className="bg-transparent font-bold text-slate-800 dark:text-white outline-none cursor-pointer"
          >
            {mines.map((m) => (
              <option key={m.id} value={m.id} className="bg-white dark:bg-slate-900">
                {m.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sensor Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* PM2.5 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-2">
          <div className="flex justify-between items-center text-slate-500 text-xs">
            <span className="font-bold">Air (PM2.5)</span>
            <Wind className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {latestByParam['Air Quality (PM2.5)']?.value || 72}{' '}
            <span className="text-xs font-normal text-slate-400">µg/m³</span>
          </div>
          <div className="text-[10px] text-slate-400">Statutory Limit: 150 µg/m³</div>
        </div>

        {/* Methane */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-2 border-l-4 border-l-amber-500">
          <div className="flex justify-between items-center text-slate-500 text-xs">
            <span className="font-bold">Methane (CH4)</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {latestByParam['Methane Level (CH4)']?.value || 0.28}{' '}
            <span className="text-xs font-normal text-slate-400">%</span>
          </div>
          <div className="text-[10px] text-slate-400">CMR 169 Limit: 1.25%</div>
        </div>

        {/* Coal Dust */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-2">
          <div className="flex justify-between items-center text-slate-500 text-xs">
            <span className="font-bold">Coal Dust</span>
            <Activity className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {latestByParam['Coal Dust Level']?.value || 1.1}{' '}
            <span className="text-xs font-normal text-slate-400">mg/m³</span>
          </div>
          <div className="text-[10px] text-slate-400">Safe Limit: 2.0 mg/m³</div>
        </div>

        {/* Water pH */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-2">
          <div className="flex justify-between items-center text-slate-500 text-xs">
            <span className="font-bold">Effluent pH</span>
            <Droplets className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {latestByParam['Water pH']?.value || 7.4}{' '}
            <span className="text-xs font-normal text-slate-400">pH</span>
          </div>
          <div className="text-[10px] text-slate-400">Safe Range: 6.5 - 8.5</div>
        </div>

        {/* Noise */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-2">
          <div className="flex justify-between items-center text-slate-500 text-xs">
            <span className="font-bold">Noise Level</span>
            <Volume2 className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {latestByParam['Noise Level']?.value || 68}{' '}
            <span className="text-xs font-normal text-slate-400">dB</span>
          </div>
          <div className="text-[10px] text-slate-400">OSHA/DGMS Limit: 85 dB</div>
        </div>
      </div>

      {/* Telemetry Trend Chart */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              Continuous Ambient Telemetry Fluctuations (Today)
            </h3>
            <p className="text-xs text-slate-400">Real-time IoT stream sampled at 4-hour intervals</p>
          </div>
          <div className="flex items-center space-x-3 text-xs">
            <span className="flex items-center text-sky-500 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 mr-1"></span> PM2.5
            </span>
            <span className="flex items-center text-amber-500 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 mr-1"></span> Methane (x100)
            </span>
            <span className="flex items-center text-emerald-500 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-1"></span> Dust (x50)
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
              <Line type="monotone" dataKey="pm25" stroke="#38bdf8" strokeWidth={2.5} dot={{ r: 4 }} name="PM2.5 (µg/m³)" />
              <Line type="monotone" dataKey="ch4" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4 }} name="Methane (%)" />
              <Line type="monotone" dataKey="dust" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} name="Coal Dust (mg/m³)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sensor Test Generator / Anomaly Simulator */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-white space-y-3">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-emerald-400" />
          <h3 className="font-bold text-sm">IoT Telemetry Injection Simulator</h3>
        </div>
        <p className="text-xs text-slate-400">
          Simulate a real-time sensor reading anomaly to test automated threshold alerts and Rule Engine dispatch.
        </p>

        <form onSubmit={handleInjectTelemetry} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs pt-1">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Target Sensor Parameter</label>
            <select
              value={testParam}
              onChange={(e) => setTestParam(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white outline-none"
            >
              <option value="Methane Level (CH4)">Methane Level (CH4)</option>
              <option value="Air Quality (PM2.5)">Air Quality (PM2.5)</option>
              <option value="Coal Dust Level">Coal Dust Level</option>
              <option value="Water pH">Water pH</option>
              <option value="Noise Level">Noise Level</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Simulated Ingested Value</label>
            <input
              type="text"
              required
              value={testValue}
              onChange={(e) => setTestValue(e.target.value)}
              placeholder="e.g. 1.45"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono outline-none"
            />
          </div>

          <div className="sm:col-span-2 flex items-end">
            <button
              type="submit"
              className="w-full py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg font-bold text-xs shadow-md transition"
            >
              Inject Telemetry Record & Trigger Anomaly Detector
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
