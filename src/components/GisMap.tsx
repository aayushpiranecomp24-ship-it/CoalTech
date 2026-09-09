import React, { useState } from 'react';
import { useGovernance } from '../context/GovernanceContext';
import { Layers, ShieldAlert, Thermometer, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface GisMapProps {
  interactive?: boolean;
  selectedMineId?: string;
  onSelectMine?: (mineId: string) => void;
}

export const GisMap: React.FC<GisMapProps> = ({ interactive = true, selectedMineId, onSelectMine }) => {
  const { mines, violations, readings } = useGovernance();
  const [activeLayer, setActiveLayer] = useState<'all' | 'violations' | 'environmental' | 'boundaries'>('all');
  const [hoveredMine, setHoveredMine] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.75));
  const handleResetZoom = () => setZoomLevel(1);

  const vbW = 1000 / zoomLevel;
  const vbH = 500 / zoomLevel;
  const vbX = (1000 - vbW) / 2;
  const vbY = (500 - vbH) / 2;
  const dynamicViewBox = `${vbX} ${vbY} ${vbW} ${vbH}`;

  const getRiskColor = (score: number) => {
    if (score >= 81) return '#ef4444'; // Red (Critical)
    if (score >= 61) return '#f97316'; // Orange (High)
    if (score >= 31) return '#f59e0b'; // Amber (Medium)
    return '#22c55e'; // Green (Low/Compliant)
  };

  const getRiskText = (score: number) => {
    if (score >= 81) return 'CRITICAL';
    if (score >= 61) return 'HIGH';
    if (score >= 31) return 'MEDIUM';
    return 'LOW';
  };

  const handleMineClick = (id: string) => {
    if (interactive && onSelectMine) {
      onSelectMine(id);
    }
  };

  return (
    <div className="relative bg-[#0f172a] rounded-xl overflow-hidden shadow-xl border border-slate-800 h-[480px] w-full flex flex-col">
      {/* Map Header / Layer Toggles */}
      <div className="absolute top-3 left-3 z-10 bg-slate-900/95 backdrop-blur-sm border border-slate-700 rounded-lg p-1.5 flex flex-wrap items-center gap-1 text-xs text-white max-w-[calc(100%-24px)] sm:max-w-none">
        <span className="font-semibold px-1.5 border-r border-slate-700 flex items-center">
          <Layers className="w-3.5 h-3.5 mr-1 text-sky-400" /> Layers
        </span>
        <button 
          onClick={() => setActiveLayer('all')}
          className={`px-2 py-0.5 rounded transition ${activeLayer === 'all' ? 'bg-sky-500 text-white' : 'hover:bg-slate-800 text-slate-300'}`}
        >
          All
        </button>
        <button 
          onClick={() => setActiveLayer('violations')}
          className={`px-2 py-0.5 rounded transition ${activeLayer === 'violations' ? 'bg-orange-500 text-white' : 'hover:bg-slate-800 text-slate-300'}`}
        >
          Violations
        </button>
        <button 
          onClick={() => setActiveLayer('environmental')}
          className={`px-2 py-0.5 rounded transition ${activeLayer === 'environmental' ? 'bg-emerald-500 text-white' : 'hover:bg-slate-800 text-slate-300'}`}
        >
          Sensors
        </button>
        <button 
          onClick={() => setActiveLayer('boundaries')}
          className={`px-2 py-0.5 rounded transition ${activeLayer === 'boundaries' ? 'bg-indigo-500 text-white' : 'hover:bg-slate-800 text-slate-300'}`}
        >
          Boundaries
        </button>
      </div>

      {/* Risk Legend */}
      <div className="hidden sm:flex absolute top-3 right-3 z-10 bg-slate-900/90 border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] text-slate-400 items-center space-x-2.5">
        <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-emerald-500 mr-1"></span> Low</div>
        <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-amber-500 mr-1"></span> Med</div>
        <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-orange-500 mr-1"></span> High</div>
        <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span> Crit</div>
      </div>

      {/* Floating Zoom Controls */}
      <div className="absolute right-3 top-14 z-10 bg-slate-900/90 backdrop-blur-sm border border-slate-700 rounded-lg p-1 flex flex-col space-y-1 shadow-lg">
        <button
          onClick={handleZoomIn}
          title="Zoom In"
          aria-label="Zoom In"
          className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          aria-label="Zoom Out"
          className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleResetZoom}
          title="Reset Zoom"
          aria-label="Reset Zoom"
          className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* SVG Canvas Map */}
      <div className="flex-1 w-full relative flex items-center justify-center bg-[#070b13] overflow-hidden">
        {/* Terrain Grids and Contour Lines Mock */}
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#38bdf8" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          {/* Contour Lines */}
          <path d="M-100,200 C300,50 400,350 800,250 C1200,150 1300,450 1600,400" fill="none" stroke="#fff" strokeWidth="1" />
          <path d="M-50,300 C400,100 500,450 900,300 C1300,250 1400,550 1700,500" fill="none" stroke="#fff" strokeWidth="0.8" />
          <path d="M0,400 C450,200 550,550 1000,400 C1400,350 1500,650 1800,600" fill="none" stroke="#fff" strokeWidth="0.6" />
        </svg>

        <svg viewBox={dynamicViewBox} className="w-full h-full max-w-[1000px] select-none transition-all duration-300">
          {/* Mine Boundaries Overlay */}
          {(activeLayer === 'all' || activeLayer === 'boundaries') && (
            <>
              {/* Mine A Boundary */}
              <polygon points="120,80 280,60 300,220 150,240" fill="rgba(99, 102, 241, 0.05)" stroke="rgba(99, 102, 241, 0.3)" strokeWidth="1.5" strokeDasharray="4 4" />
              <text x="140" y="100" className="fill-indigo-400/50 text-[10px] uppercase font-bold tracking-wider">Jharia Sector A</text>

              {/* Mine B Boundary */}
              <polygon points="400,100 580,80 620,240 430,260" fill="rgba(99, 102, 241, 0.05)" stroke="rgba(99, 102, 241, 0.3)" strokeWidth="1.5" strokeDasharray="4 4" />
              <text x="420" y="120" className="fill-indigo-400/50 text-[10px] uppercase font-bold tracking-wider">Raniganj Sector B</text>

              {/* Mine C Boundary */}
              <polygon points="680,120 880,100 900,300 700,320" fill="rgba(99, 102, 241, 0.05)" stroke="rgba(99, 102, 241, 0.3)" strokeWidth="1.5" strokeDasharray="4 4" />
              <text x="700" y="140" className="fill-indigo-400/50 text-[10px] uppercase font-bold tracking-wider">Singrauli Sector C</text>

              {/* Mine D Boundary */}
              <polygon points="150,300 350,280 370,450 180,470" fill="rgba(99, 102, 241, 0.05)" stroke="rgba(99, 102, 241, 0.3)" strokeWidth="1.5" strokeDasharray="4 4" />
              <text x="170" y="320" className="fill-indigo-400/50 text-[10px] uppercase font-bold tracking-wider">Kargali Sector D</text>
            </>
          )}

          {/* Active Violations Pins */}
          {(activeLayer === 'all' || activeLayer === 'violations') && (
            violations.filter(v => v.status !== 'CLOSED').map((v) => {
              // Map some random but deterministic coordinate inside mine zones
              const hash = (v.id.charCodeAt(2) || 0) + (v.id.charCodeAt(3) || 0);
              let x = 200;
              let y = 150;
              if (v.mineId === 'm1') { x = 160 + (hash % 80); y = 100 + (hash % 80); }
              else if (v.mineId === 'm2') { x = 460 + (hash % 80); y = 120 + (hash % 80); }
              else if (v.mineId === 'm3') { x = 740 + (hash % 100); y = 140 + (hash % 100); }
              else if (v.mineId === 'm4') { x = 220 + (hash % 80); y = 320 + (hash % 80); }
              else { x = 500 + (hash % 80); y = 350 + (hash % 80); }

              const color = v.severity === 'CRITICAL' ? '#ef4444' : v.severity === 'HIGH' ? '#f97316' : v.severity === 'MEDIUM' ? '#f59e0b' : '#3b82f6';

              return (
                <g key={v.id} className="cursor-pointer group">
                  <circle cx={x} cy={y} r="16" fill={color} className="opacity-20 animate-ping" />
                  <circle cx={x} cy={y} r="5" fill={color} stroke="#000" strokeWidth="1" />
                  <path d={`M ${x} ${y} L ${x} ${y - 12}`} stroke={color} strokeWidth="1.5" />
                  <rect x={x - 40} y={y - 28} width="80" height="14" rx="3" fill="#0f172a" stroke={color} strokeWidth="0.5" className="opacity-0 group-hover:opacity-100 transition" />
                  <text x={x} y={y - 18} textAnchor="middle" className="fill-white text-[8px] font-semibold opacity-0 group-hover:opacity-100 pointer-events-none">{v.id}</text>
                </g>
              );
            })
          )}

          {/* Environmental Sensors Pins */}
          {(activeLayer === 'all' || activeLayer === 'environmental') && (
            readings.filter(r => r.anomaly).map((r, idx) => {
              const hash = (r.id.charCodeAt(4) || 0) + idx;
              let x = 200;
              let y = 150;
              if (r.mineId === 'm1') { x = 220 + (hash % 50); y = 160 + (hash % 50); }
              else if (r.mineId === 'm2') { x = 520 + (hash % 50); y = 180 + (hash % 50); }
              else if (r.mineId === 'm3') { x = 820 + (hash % 50); y = 200 + (hash % 50); }
              else if (r.mineId === 'm4') { x = 280 + (hash % 50); y = 380 + (hash % 50); }
              else { x = 550 + (hash % 50); y = 390 + (hash % 50); }

              return (
                <g key={r.id} className="cursor-pointer group">
                  <polygon points={`${x},${y-8} ${x+6},${y+4} ${x-6},${y+4}`} fill="#10b981" stroke="#fff" strokeWidth="0.5" />
                  <circle cx={x} cy={y} r="2" fill="#fff" />
                  <rect x={x - 45} y={y - 24} width="90" height="14" rx="2" fill="#0f172a" stroke="#10b981" strokeWidth="0.5" className="opacity-0 group-hover:opacity-100 transition" />
                  <text x={x} y={y - 14} textAnchor="middle" className="fill-white text-[8px] opacity-0 group-hover:opacity-100 pointer-events-none">{r.parameter}: {r.value}</text>
                </g>
              );
            })
          )}

          {/* Mine Anchor Pins (The Hubs) */}
          {mines.map((mine) => {
            let x = 200;
            let y = 150;
            if (mine.id === 'm1') { x = 200; y = 150; }
            else if (mine.id === 'm2') { x = 500; y = 170; }
            else if (mine.id === 'm3') { x = 800; y = 200; }
            else if (mine.id === 'm4') { x = 250; y = 370; }
            else if (mine.id === 'm5') { x = 550; y = 380; }

            const color = getRiskColor(mine.riskScore);
            const isSelected = selectedMineId === mine.id;

            return (
              <g key={mine.id} 
                 onClick={() => handleMineClick(mine.id)}
                 onMouseEnter={() => setHoveredMine(mine.id)}
                 onMouseLeave={() => setHoveredMine(null)}
                 className="cursor-pointer"
              >
                {/* Highlight ring for selection */}
                {isSelected && (
                  <circle cx={x} cy={y} r="32" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" className="animate-spin-slow" />
                )}
                {/* Risk Glow */}
                <circle cx={x} cy={y} r={isSelected ? "22" : "18"} fill={color} className="opacity-25" />
                {/* Center Core */}
                <circle cx={x} cy={y} r={isSelected ? "12" : "10"} fill="#0f172a" stroke={color} strokeWidth="3" />
                
                {/* Text Label */}
                <text x={x} y={y + (isSelected ? 32 : 28)} textAnchor="middle" className="fill-white text-xs font-bold pointer-events-none select-none drop-shadow-md">
                  {mine.name.replace('Jharia ', '').replace('Raniganj ', '').replace('Singrauli ', '').replace('Kargali ', '').replace('Bokaro ', '')}
                </text>
                
                {/* Risk Value Inside Node */}
                <text x={x} y={y + 4} textAnchor="middle" className="fill-slate-300 text-[9px] font-bold pointer-events-none">
                  {mine.riskScore}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Floating Info Drawer for Hover or Selection */}
      {hoveredMine && (
        <div className="absolute bottom-4 left-4 z-20 bg-slate-900/95 border border-slate-700 text-white rounded-lg p-3 text-xs w-[240px] shadow-2xl backdrop-blur-md">
          {(() => {
            const m = mines.find(mine => mine.id === hoveredMine);
            if (!m) return null;
            const openViolations = violations.filter(v => v.mineId === m.id && v.status !== 'CLOSED');
            const activeCrit = openViolations.filter(v => v.severity === 'CRITICAL').length;
            const activeHigh = openViolations.filter(v => v.severity === 'HIGH').length;

            return (
              <>
                <h4 className="font-bold text-sm text-sky-400 flex items-center justify-between">
                  <span>{m.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 border" style={{ borderColor: getRiskColor(m.riskScore), color: getRiskColor(m.riskScore) }}>
                    RISK {m.riskScore}
                  </span>
                </h4>
                <p className="text-slate-400 mt-0.5">Manager: {m.manager}</p>
                <div className="border-t border-slate-800 my-2 pt-2 grid grid-cols-2 gap-2 text-[10px]">
                  <div>
                    <span className="text-slate-400 block">Compliance</span>
                    <span className="font-semibold text-emerald-400">{m.complianceScore}%</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Open Issues</span>
                    <span className="font-semibold">{openViolations.length} total</span>
                  </div>
                  <div className="col-span-2 flex items-center justify-between text-slate-300 border-t border-slate-800/50 pt-1.5">
                    <span className="flex items-center text-red-400 font-semibold"><span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1"></span> {activeCrit} Critical</span>
                    <span className="flex items-center text-orange-400 font-semibold"><span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-1"></span> {activeHigh} High</span>
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      )}

      {/* Selected Mine Details (Left Overlay or Bottom Bar) */}
      {selectedMineId && (
        <div className="absolute bottom-4 right-4 z-10 bg-slate-900 border border-slate-700 rounded-lg p-3 text-white max-w-[340px] text-xs">
          {(() => {
            const m = mines.find(mine => mine.id === selectedMineId);
            if (!m) return null;
            const openV = violations.filter(v => v.mineId === m.id && v.status !== 'CLOSED');
            const activeCrit = openV.filter(v => v.severity === 'CRITICAL');
            const sensorAnomalies = readings.filter(r => r.mineId === m.id && r.anomaly && r.status === 'PENDING_REVIEW');

            return (
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                  <span className="font-bold text-sm text-sky-400">{m.name}</span>
                  <span className="font-semibold px-2 py-0.5 rounded text-[10px]" style={{ backgroundColor: getRiskColor(m.riskScore) + '22', color: getRiskColor(m.riskScore), border: `1px solid ${getRiskColor(m.riskScore)}` }}>
                    {getRiskText(m.riskScore)} ({m.riskScore})
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Active Issues:</span>
                    <span className="font-semibold">{openV.length}</span>
                  </div>
                  {activeCrit.length > 0 && (
                    <div className="flex justify-between text-red-400">
                      <span className="font-semibold flex items-center"><ShieldAlert className="w-3.5 h-3.5 mr-1" /> Critical:</span>
                      <span className="font-bold">{activeCrit.length}</span>
                    </div>
                  )}
                  {sensorAnomalies.length > 0 && (
                    <div className="flex justify-between text-amber-400">
                      <span className="font-semibold flex items-center"><Thermometer className="w-3.5 h-3.5 mr-1" /> Telemetry Anomalies:</span>
                      <span className="font-bold">{sensorAnomalies.length}</span>
                    </div>
                  )}
                </div>
                <div className="text-[10px] text-slate-500 italic pt-1 border-t border-slate-800 text-right">
                  Coordinates: {m.latitude}°N, {m.longitude}°E
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
