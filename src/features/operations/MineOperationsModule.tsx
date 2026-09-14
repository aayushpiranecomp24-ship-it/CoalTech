// COALTECH - Mine Operations & Production Command Center
import React, { useState } from 'react';
import { useGovernance } from '../../context/GovernanceContext';
import { useI18n } from '../../context/I18nContext';
import { StatCard } from '../../components/common/StatCard';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Reveal } from '../../components/animations/Reveal';
import {
  Activity,
  Layers,
  AlertTriangle,
  Flame,
  Mountain,
  FlaskConical,
  Boxes,
  Clock,
  CheckCircle2,
  ShieldAlert,
  Plus,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

export const MineOperationsModule: React.FC = () => {
  const {
    mines,
    benches,
    blastPlans,
    overburdenRecords,
    coalQualityRecords,
    stockpiles,
    operationalDelays,
    updateBenchSlopeRisk,
    approveBlastClearance,
    addCoalQualitySample,
    adjustStockpileSurvey,
  } = useGovernance();
  const { t } = useI18n();

  const [activeSubTab, setActiveSubTab] = useState<
    'production' | 'planning' | 'benches' | 'blasting' | 'overburden' | 'quality' | 'stockpile' | 'delays'
  >('production');

  const [selectedMineId, setSelectedMineId] = useState<string>('m2'); // Default to Gevra (Opencast)
  const [mineTypeFilter, setMineTypeFilter] = useState<'Opencast' | 'Underground'>('Opencast');
  const [showSampleModal, setShowSampleModal] = useState<boolean>(false);
  const [sampleIdSeed, setSampleIdSeed] = useState<string>('SAM-2026-1001');
  const [selectedBench, setSelectedBench] = useState<any | null>(null);

  const activeMine = mines.find((m) => m.id === selectedMineId) || mines[1] || mines[0];
  const isOpencast = activeMine.type === 'Opencast' || activeMine.type === 'Mixed';

  // Metrics calculation
  const filteredBenches = benches.filter((b) => b.mineId === selectedMineId || selectedMineId === 'all');
  const criticalSlopeBenches = filteredBenches.filter((b) => b.slopeRisk === 'CRITICAL' || b.slopeRisk === 'HIGH');
  const totalDailyProductionTonnes = filteredBenches.reduce((sum, b) => sum + b.dailyProductionTonnes, 0);
  const totalPlannedOB = overburdenRecords.reduce((sum, ob) => sum + ob.plannedBankCubicMeters, 0);
  const totalActualOB = overburdenRecords.reduce((sum, ob) => sum + ob.actualBankCubicMeters, 0);
  const obVariance = totalActualOB - totalPlannedOB;

  // Chart datasets
  const productionTrendData = [
    { hour: '06:00', target: 2400, actual: 2350, seam: 'Upper Kusmunda' },
    { hour: '08:00', target: 3100, actual: 3250, seam: 'Upper Kusmunda' },
    { hour: '10:00', target: 3500, actual: 3420, seam: 'Lower Kusmunda I' },
    { hour: '12:00', target: 2800, actual: 2600, seam: 'Lower Kusmunda I' },
    { hour: '14:00', target: 3200, actual: 3400, seam: 'Lower Kusmunda II' },
    { hour: '16:00', target: 3600, actual: 3580, seam: 'Lower Kusmunda II' },
    { hour: '18:00', target: 2900, actual: 2950, seam: 'Purewa Top' },
  ];

  const obStripData = overburdenRecords.map((r) => ({
    name: r.shift.replace(' Shift', ''),
    planned: r.plannedBankCubicMeters,
    actual: r.actualBankCubicMeters,
    variance: r.varianceBCM,
  }));

  const subNavItems = [
    { id: 'production', label: t('nav_ops_prod', 'Production Dashboard'), icon: Activity },
    { id: 'planning', label: t('nav_ops_planning', 'Mine Planning & Seams'), icon: Layers },
    { id: 'benches', label: t('nav_ops_benches', 'Bench & Pit Slope Monitoring'), icon: Mountain, badge: criticalSlopeBenches.length > 0 ? `${criticalSlopeBenches.length} Alert` : null },
    { id: 'blasting', label: t('nav_ops_blasting', 'Drilling & Blasting'), icon: Flame },
    { id: 'overburden', label: t('nav_ops_ob', 'Overburden (OB) Removal'), icon: Mountain },
    { id: 'quality', label: t('nav_ops_quality', 'Coal Quality Lab'), icon: FlaskConical },
    { id: 'stockpile', label: t('nav_ops_stockpile', 'Stockpiles & LiDAR Survey'), icon: Boxes },
    { id: 'delays', label: t('nav_ops_delays', 'Operational Delays'), icon: Clock },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner & Mine Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl md:text-2xl font-bold font-display tracking-tight text-[var(--color-text)]">
              {t('ops_title', 'Mine Operations & Extraction Command')}
            </h1>
            <Badge tone="primary" size="sm">DGMS & CMR 2017</Badge>
            <Badge tone={isOpencast ? 'info' : 'warning'} size="sm">
              {activeMine.type.toUpperCase()} MINE
            </Badge>
          </div>
          <p className="text-xs text-[var(--color-text-muted)]">
            {t('ops_subtitle', 'Bench geotechnical stability, precision blasting clearances, overburden strip telemetry, and laboratory coal grading.')}
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center flex-wrap gap-2.5">
          <div className="flex items-center gap-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-1 text-xs">
            <span className="text-[var(--color-text-subtle)] px-2 font-medium">Mine:</span>
            <select
              value={selectedMineId}
              onChange={(e) => setSelectedMineId(e.target.value)}
              aria-label="Filter operations by coal mine"
              className="bg-transparent border-none text-[var(--color-text)] font-semibold text-xs focus:ring-0 cursor-pointer pr-4"
            >
              {mines.map((m) => (
                <option key={m.id} value={m.id} className="bg-[var(--color-surface)] text-[var(--color-text)]">
                  {m.name} ({m.type})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center bg-[var(--color-surface-2)] p-1 rounded-xl border border-[var(--color-border)] text-xs">
            <button
              onClick={() => setMineTypeFilter('Opencast')}
              className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                mineTypeFilter === 'Opencast'
                  ? 'bg-[var(--color-primary)] text-white shadow-sm'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              Opencast Benches
            </button>
            <button
              onClick={() => setMineTypeFilter('Underground')}
              className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                mineTypeFilter === 'Underground'
                  ? 'bg-[var(--color-primary)] text-white shadow-sm'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              Underground Seams
            </button>
          </div>
        </div>
      </div>

      {/* Critical Slope Geotechnical Advisory Banner (if high/critical risk exists) */}
      {criticalSlopeBenches.length > 0 && isOpencast && (
        <Reveal>
          <div className="rounded-2xl border border-[#ef4444]/40 bg-[#ef4444]/10 p-4 flex items-start justify-between gap-4 text-xs">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-[#f87171] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#fca5a5] uppercase tracking-wider text-[11px] block">
                  GEOTECHNICAL HAZARD ALERT • DGMS CIRCULAR COMPLIANCE
                </span>
                <p className="text-[var(--color-text)] mt-0.5 leading-relaxed">
                  Slope instability flagged at <strong>{criticalSlopeBenches[0].benchId}</strong> (Elevation {criticalSlopeBenches[0].elevationMeters}m, Slope Angle: {criticalSlopeBenches[0].slopeAngleDeg}°). Water condition: <strong>{criticalSlopeBenches[0].waterCondition}</strong>. Restrict heavy haul dumper movements until geotechnical re-grading is verified.
                </p>
              </div>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                setActiveSubTab('benches');
                setSelectedBench(criticalSlopeBenches[0]);
              }}
            >
              Review Bench
            </Button>
          </div>
        </Reveal>
      )}

      {/* Sub Navigation Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-[var(--color-border)]">
        {subNavItems.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                isActive
                  ? 'bg-[var(--color-primary)] text-white shadow-sm'
                  : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)] border border-[var(--color-border)]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-[#ef4444] text-white">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* SUB-TAB 1: PRODUCTION DASHBOARD */}
      {activeSubTab === 'production' && (
        <Reveal>
          <div className="space-y-6">
            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Daily Extraction"
                value={`${(totalDailyProductionTonnes / 1000).toFixed(1)}k MT`}
                subtitle={`Target: 35.0k MT • ${activeMine.name}`}
                icon={Activity}
                trend="+4.2% vs baseline"
                trendType="up"
                riskLevel="LOW"
              />
              <StatCard
                title="Active Benches / Faces"
                value={`${filteredBenches.length} Benches`}
                subtitle="All working profiles"
                icon={Layers}
                trend="3 Shovels deployed"
                riskLevel="LOW"
              />
              <StatCard
                title="Overburden Stripping"
                value={`${(totalActualOB / 1000).toFixed(1)}k BCM`}
                subtitle={`Variance: ${obVariance > 0 ? '+' : ''}${obVariance} BCM`}
                icon={Mountain}
                trend={obVariance >= 0 ? '+On Target' : 'Behind schedule'}
                trendType={obVariance >= 0 ? 'up' : 'alert'}
                riskLevel={obVariance < -1000 ? 'HIGH' : 'LOW'}
              />
              <StatCard
                title="Geotechnical Stability"
                value={criticalSlopeBenches.length === 0 ? 'Optimal' : `${criticalSlopeBenches.length} at Risk`}
                subtitle="Factor of Safety > 1.3"
                icon={ShieldAlert}
                trend="DGMS CMR-106 standard"
                riskLevel={criticalSlopeBenches.length > 0 ? 'CRITICAL' : 'LOW'}
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card hover>
                <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-[var(--color-text)]">Hourly Extraction: Target vs Actual (MT)</h3>
                    <p className="text-[11px] text-[var(--color-text-muted)]">Active Shift A extraction across coal seam faces</p>
                  </div>
                  <Badge tone="primary" size="sm">Live Feed</Badge>
                </div>
                <div className="p-4 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={productionTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.6} />
                      <XAxis dataKey="hour" stroke="var(--color-text-subtle)" fontSize={11} />
                      <YAxis stroke="var(--color-text-subtle)" fontSize={11} />
                      <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', borderRadius: '12px', fontSize: '11px' }} />
                      <Bar dataKey="target" name="Target MT" fill="var(--color-border-strong)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="actual" name="Actual MT" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card hover>
                <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-[var(--color-text)]">Overburden (OB) Movement Variance (BCM)</h3>
                    <p className="text-[11px] text-[var(--color-text-muted)]">Planned vs actual Bank Cubic Meters by shift</p>
                  </div>
                  <Badge tone="neutral" size="sm">Shift Log</Badge>
                </div>
                <div className="p-4 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={obStripData}>
                      <defs>
                        <linearGradient id="obGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.6} />
                      <XAxis dataKey="name" stroke="var(--color-text-subtle)" fontSize={11} />
                      <YAxis stroke="var(--color-text-subtle)" fontSize={11} />
                      <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', borderRadius: '12px', fontSize: '11px' }} />
                      <Area type="monotone" dataKey="actual" name="Actual BCM" stroke="#10b981" fillOpacity={1} fill="url(#obGradient)" />
                      <Line type="monotone" dataKey="planned" name="Planned BCM" stroke="#60a5fa" strokeDasharray="4 4" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </div>
        </Reveal>
      )}

      {/* SUB-TAB 2: DIGITAL MINE PLANNING */}
      {activeSubTab === 'planning' && (
        <Reveal>
          <div className="space-y-6">
            <Card hover>
              <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[var(--color-text)]">Mine Geotechnical Block & Working Elevation Profile</h3>
                  <p className="text-[11px] text-[var(--color-text-muted)]">Target seams, RL elevations, bench width, and safety berm dimensions</p>
                </div>
                <Badge tone="primary" size="sm">Opencast / CMR 2017</Badge>
              </div>

              <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredBenches.map((b) => (
                  <div
                    key={b.id}
                    className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] space-y-2.5 hover:border-[var(--color-primary)] transition cursor-pointer"
                    onClick={() => {
                      setSelectedBench(b);
                      setActiveSubTab('benches');
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--color-text)] font-mono">{b.benchId}</span>
                      <Badge
                        tone={b.slopeRisk === 'CRITICAL' || b.slopeRisk === 'HIGH' ? 'danger' : b.slopeRisk === 'MEDIUM' ? 'warning' : 'success'}
                        size="sm"
                      >
                        {b.slopeRisk}
                      </Badge>
                    </div>
                    <div className="text-xs text-[var(--color-text-muted)] space-y-1">
                      <div className="flex justify-between">
                        <span>Elevation (RL):</span>
                        <strong className="text-[var(--color-text)]">+{b.elevationMeters}m</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Coal Seam:</span>
                        <strong className="text-[var(--color-text)]">{b.seamName}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Slope Angle:</span>
                        <strong className="text-[var(--color-text)]">{b.slopeAngleDeg}°</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Water Influx:</span>
                        <strong className={b.waterCondition === 'DRY' ? 'text-[#34d399]' : 'text-[#f87171]'}>
                          {b.waterCondition}
                        </strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </Reveal>
      )}

      {/* SUB-TAB 3: BENCH & PIT SLOPE MONITORING */}
      {activeSubTab === 'benches' && (
        <Reveal>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[var(--color-text)]">Geotechnical Bench Slope Radar & Sump Health</h3>
                <p className="text-xs text-[var(--color-text-muted)]">Real-time radar slope monitoring aligned with DGMS Safety Circulars</p>
              </div>
              <Badge tone="info" size="sm">Radar Survey Telemetry</Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Bench List */}
              <div className="lg:col-span-2 space-y-3">
                {filteredBenches.map((bench) => {
                  const isSelected = selectedBench?.id === bench.id;
                  const isHighRisk = bench.slopeRisk === 'CRITICAL' || bench.slopeRisk === 'HIGH';

                  return (
                    <div
                      key={bench.id}
                      onClick={() => setSelectedBench(bench)}
                      className={`p-4 rounded-2xl border transition cursor-pointer ${
                        isSelected
                          ? 'border-[var(--color-primary)] bg-[var(--color-primary-soft)]'
                          : isHighRisk
                          ? 'border-[#ef4444]/40 bg-[#ef4444]/5 hover:bg-[#ef4444]/10'
                          : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-2)]'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-[var(--color-text)] font-mono">{bench.benchId}</h4>
                            <span className="text-[10px] text-[var(--color-text-subtle)]">• {bench.seamName}</span>
                          </div>
                          <p className="text-[11px] text-[var(--color-text-muted)] mt-1">
                            Elevation: +{bench.elevationMeters}m RL | Slope Angle: {bench.slopeAngleDeg}° | Status: {bench.workingStatus}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            tone={bench.slopeRisk === 'CRITICAL' || bench.slopeRisk === 'HIGH' ? 'danger' : bench.slopeRisk === 'MEDIUM' ? 'warning' : 'success'}
                            size="sm"
                          >
                            {bench.slopeRisk}
                          </Badge>
                          <div className={`px-2 py-0.5 rounded text-[10px] font-bold ${bench.waterCondition === 'DRY' ? 'bg-[#10b981]/10 text-[#34d399]' : 'bg-[#ef4444]/10 text-[#f87171]'}`}>
                            {bench.waterCondition}
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-[var(--color-border)] flex items-center justify-between text-[11px] text-[var(--color-text-subtle)]">
                        <span>Inspected by: {bench.inspectedBy}</span>
                        <span>Survey: {bench.lastGeotechnicalSurvey}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bench Risk Modifier & Geotechnical Sign-off Card */}
              <div className="space-y-4">
                <Card hover>
                  <div className="p-4 border-b border-[var(--color-border)]">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text)]">
                      Bench Geotechnical Controls
                    </h4>
                    <p className="text-[11px] text-[var(--color-text-muted)]">
                      {selectedBench ? selectedBench.benchId : 'Select a bench to adjust risk'}
                    </p>
                  </div>

                  {selectedBench ? (
                    <div className="p-4 space-y-4 text-xs">
                      <div>
                        <span className="text-[11px] text-[var(--color-text-muted)] block mb-1.5">Adjust Geotechnical Slope Risk:</span>
                        <div className="grid grid-cols-2 gap-2">
                          {(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const).map((r) => (
                            <button
                              key={r}
                              onClick={() => {
                                updateBenchSlopeRisk(selectedBench.id, r);
                                setSelectedBench({ ...selectedBench, slopeRisk: r });
                              }}
                              className={`p-2 rounded-xl text-center text-xs font-bold border transition cursor-pointer ${
                                selectedBench.slopeRisk === r
                                  ? r === 'CRITICAL'
                                    ? 'bg-[#ef4444] text-white border-[#ef4444]'
                                    : r === 'HIGH'
                                    ? 'bg-[#f59e0b] text-white border-[#f59e0b]'
                                    : 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                                  : 'border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                              }`}
                            >
                              {r}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] space-y-1.5 text-[11px]">
                        <div className="flex justify-between">
                          <span className="text-[var(--color-text-muted)]">Active Machinery:</span>
                          <strong>{selectedBench.activeHemmCount} HEMM Units</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[var(--color-text-muted)]">Daily Output:</span>
                          <strong>{selectedBench.dailyProductionTonnes} MT</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[var(--color-text-muted)]">Max Bench Slope:</span>
                          <strong>45° Permissible (CMR-106)</strong>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 text-center text-xs text-[var(--color-text-muted)]">
                      Click any bench card from the left panel to inspect slope stability metrics and record geotechnical actions.
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </div>
        </Reveal>
      )}

      {/* SUB-TAB 4: DRILLING & BLASTING */}
      {activeSubTab === 'blasting' && (
        <Reveal>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[var(--color-text)]">Blast Clearance & Controlled Fragmentation Schedule</h3>
                <p className="text-xs text-[var(--color-text-muted)]">Pre-blast evacuation verification, Nonel initiation, and seismic PPV telemetry</p>
              </div>
              <Badge tone="primary" size="sm">CMR Chapter 17 Aligned</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {blastPlans.map((blast) => (
                <Card key={blast.id} hover>
                  <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-[var(--color-text)] font-mono">{blast.blastId}</span>
                      <p className="text-[11px] text-[var(--color-text-muted)]">{blast.mineName} • Bench {blast.benchId}</p>
                    </div>
                    <Badge tone={blast.status === 'POST_INSPECTION_OK' ? 'success' : blast.status === 'CLEARANCE_GRANTED' ? 'info' : 'warning'} size="sm">
                      {blast.status}
                    </Badge>
                  </div>

                  <div className="p-4 space-y-3 text-xs">
                    <div className="grid grid-cols-2 gap-2 text-[11px] bg-[var(--color-surface-2)] p-2.5 rounded-xl border border-[var(--color-border)]">
                      <div>
                        <span className="text-[var(--color-text-subtle)] block">Holes / Depth:</span>
                        <strong className="text-[var(--color-text)]">{blast.holeCount} Holes @ {blast.avgDepthMeters}m</strong>
                      </div>
                      <div>
                        <span className="text-[var(--color-text-subtle)] block">Explosive Charge:</span>
                        <strong className="text-[var(--color-text)]">{blast.totalExplosiveKg.toLocaleString()} kg ({blast.explosiveType.split(' ')[0]})</strong>
                      </div>
                      <div>
                        <span className="text-[var(--color-text-subtle)] block">Authorized Blaster:</span>
                        <strong className="text-[var(--color-text)]">{blast.responsibleBlaster}</strong>
                      </div>
                      <div>
                        <span className="text-[var(--color-text-subtle)] block">Peak Vibration (PPV):</span>
                        <strong className="text-[var(--color-text)]">{blast.postBlastVibrationMmS ? `${blast.postBlastVibrationMmS} mm/s (Safe < 5.0)` : 'Pending Blast'}</strong>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-[var(--color-text-muted)]">
                        Scheduled: {new Date(blast.dateTime).toLocaleDateString()} at {new Date(blast.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {blast.status === 'PLANNED' && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => approveBlastClearance(blast.id)}
                          leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                        >
                          Sign Blast Clearance
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </Reveal>
      )}

      {/* SUB-TAB 5: OVERBURDEN (OB) REMOVAL */}
      {activeSubTab === 'overburden' && (
        <Reveal>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard
                title="Planned Overburden (MTD)"
                value="91,500 BCM"
                subtitle="Bank Cubic Meters"
                icon={Mountain}
                trend="Strip ratio: 2.4:1"
                riskLevel="LOW"
              />
              <StatCard
                title="Actual Stripping (MTD)"
                value="91,550 BCM"
                subtitle="All Pit Dump Sites"
                icon={Mountain}
                trend="+50 BCM ahead"
                trendType="up"
                riskLevel="LOW"
              />
              <StatCard
                title="Active Dump Embankments"
                value="4 Dump Sites"
                subtitle="Factor of safety: 1.35"
                icon={ShieldAlert}
                trend="Terraced grading active"
                riskLevel="LOW"
              />
            </div>

            <Card hover>
              <div className="p-4 border-b border-[var(--color-border)]">
                <h3 className="text-sm font-bold text-[var(--color-text)]">Overburden Haulage & Dump Terracing Log</h3>
              </div>
              <div className="p-4 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[var(--color-border)] text-[var(--color-text-subtle)] uppercase tracking-wider text-[10px]">
                      <th className="pb-3">Shift & Date</th>
                      <th className="pb-3">Mine & Dump Site</th>
                      <th className="pb-3">Planned (BCM)</th>
                      <th className="pb-3">Actual (BCM)</th>
                      <th className="pb-3">Variance</th>
                      <th className="pb-3">Dumper Trips</th>
                      <th className="pb-3">Reclamation Buffer</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]">
                    {overburdenRecords.map((ob) => (
                      <tr key={ob.id} className="hover:bg-[var(--color-surface-2)] transition">
                        <td className="py-3 font-medium text-[var(--color-text)]">{ob.shift} • {ob.date}</td>
                        <td className="py-3 text-[var(--color-text-muted)]">{ob.mineName} - {ob.dumpLocation}</td>
                        <td className="py-3 font-mono">{ob.plannedBankCubicMeters.toLocaleString()}</td>
                        <td className="py-3 font-mono font-bold text-[var(--color-text)]">{ob.actualBankCubicMeters.toLocaleString()}</td>
                        <td className={`py-3 font-mono font-bold ${ob.varianceBCM >= 0 ? 'text-[#34d399]' : 'text-[#f87171]'}`}>
                          {ob.varianceBCM >= 0 ? `+${ob.varianceBCM}` : ob.varianceBCM}
                        </td>
                        <td className="py-3">{ob.dumperTripsCount} Trips</td>
                        <td className="py-3 text-[#60a5fa]">{ob.reclamationZone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </Reveal>
      )}

      {/* SUB-TAB 6: COAL QUALITY LABORATORY */}
      {activeSubTab === 'quality' && (
        <Reveal>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[var(--color-text)]">Laboratory Proximate Analysis & Coal Grading</h3>
                <p className="text-xs text-[var(--color-text-muted)]">Moisture, Ash content, GCV calorific values, and seam classification</p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setSampleIdSeed(`SAM-2026-${Math.floor(1000 + Math.random() * 9000)}`);
                  setShowSampleModal(true);
                }}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
              >
                Log Sample Test
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {coalQualityRecords.map((q) => (
                <Card key={q.id} hover>
                  <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-[var(--color-text)] font-mono">{q.sampleId}</span>
                      <p className="text-[11px] text-[var(--color-text-muted)]">{q.mineName}</p>
                    </div>
                    <Badge tone={q.anomalyFlagged ? 'danger' : 'success'} size="sm">
                      {q.coalGrade}
                    </Badge>
                  </div>

                  <div className="p-4 space-y-3 text-xs">
                    <div className="grid grid-cols-3 gap-2 bg-[var(--color-surface-2)] p-2.5 rounded-xl border border-[var(--color-border)] text-center">
                      <div>
                        <span className="text-[10px] text-[var(--color-text-subtle)] block">Ash %</span>
                        <strong className={`text-xs ${q.ashPercent > 40 ? 'text-[#f87171]' : 'text-[var(--color-text)]'}`}>
                          {q.ashPercent}%
                        </strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-[var(--color-text-subtle)] block">GCV (kcal/kg)</span>
                        <strong className="text-xs text-[var(--color-text)] font-mono">{q.calorificValueGcvKcalKg}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-[var(--color-text-subtle)] block">Moisture %</span>
                        <strong className="text-xs text-[var(--color-text)]">{q.moisturePercent}%</strong>
                      </div>
                    </div>

                    <div className="text-[11px] text-[var(--color-text-muted)] space-y-1">
                      <div className="flex justify-between">
                        <span>Laboratory:</span>
                        <strong className="text-[var(--color-text)] truncate max-w-[180px]">{q.laboratoryName}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Certified By:</span>
                        <strong className="text-[var(--color-text)]">{q.certifiedBy}</strong>
                      </div>
                    </div>

                    {q.anomalyFlagged && (
                      <div className="p-2 rounded-lg bg-[#ef4444]/10 border border-[#ef4444]/30 text-[10px] text-[#fca5a5] flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>High Ash Anomaly detected: Exceeds standard seam specification.</span>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </Reveal>
      )}

      {/* SUB-TAB 7: STOCKPILES & LIDAR CALIBRATION */}
      {activeSubTab === 'stockpile' && (
        <Reveal>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[var(--color-text)]">Stockpile LiDAR Volumetric Survey Calibration</h3>
                <p className="text-xs text-[var(--color-text-muted)]">Surveyed bulk density volume vs physical weighbridge dispatch ledger</p>
              </div>
              <Badge tone="info" size="sm">LiDAR Drone Survey</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stockpiles.map((stk) => {
                const isDiscrepant = Math.abs(stk.discrepancyTonnes) > 1000;
                return (
                  <Card key={stk.id} hover>
                    <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-[var(--color-text)] font-mono">{stk.stockpileCode}</span>
                        <h4 className="text-xs font-semibold text-[var(--color-text)]">{stk.name}</h4>
                      </div>
                      <Badge tone={isDiscrepant ? 'danger' : 'success'} size="sm">
                        {isDiscrepant ? 'Discrepancy' : 'Optimal'}
                      </Badge>
                    </div>

                    <div className="p-4 space-y-3 text-xs">
                      <div className="grid grid-cols-2 gap-2 bg-[var(--color-surface-2)] p-2.5 rounded-xl border border-[var(--color-border)] text-xs">
                        <div>
                          <span className="text-[10px] text-[var(--color-text-subtle)] block">Current Quantity:</span>
                          <strong className="text-[var(--color-text)] font-mono">{stk.currentQuantityTonnes.toLocaleString()} MT</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-[var(--color-text-subtle)] block">LiDAR Surveyed:</span>
                          <strong className="text-[var(--color-text)] font-mono">{stk.surveyedQuantityTonnes.toLocaleString()} MT</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-[var(--color-text-subtle)] block">Survey Variance:</span>
                          <strong className={isDiscrepant ? 'text-[#f87171] font-mono' : 'text-[#34d399] font-mono'}>
                            {stk.discrepancyTonnes > 0 ? `+${stk.discrepancyTonnes}` : stk.discrepancyTonnes} MT
                          </strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-[var(--color-text-subtle)] block">Moisture Index:</span>
                          <strong className="text-[var(--color-text)]">{stk.moistureContentPercent}%</strong>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-[var(--color-text-muted)]">
                          Last Drone LiDAR Survey: {stk.lastLidarSurveyDate}
                        </span>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            const newVol = stk.surveyedQuantityTonnes + 500;
                            adjustStockpileSurvey(stk.id, newVol);
                          }}
                        >
                          Recalibrate LiDAR
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </Reveal>
      )}

      {/* SUB-TAB 8: OPERATIONAL DELAYS */}
      {activeSubTab === 'delays' && (
        <Reveal>
          <div className="space-y-6">
            <Card hover>
              <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[var(--color-text)]">Operational Lost Time & Delay Log</h3>
                  <p className="text-[11px] text-[var(--color-text-muted)]">Monsoon weather hold, haul road berm remediation, and blasting cordons</p>
                </div>
                <Badge tone="warning" size="sm">Delay Register</Badge>
              </div>

              <div className="p-4 divide-y divide-[var(--color-border)]">
                {operationalDelays.map((del) => (
                  <div key={del.id} className="py-3 flex items-start justify-between gap-4 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge tone="neutral" size="sm">{del.category}</Badge>
                        <span className="font-bold text-[var(--color-text)]">{del.affectedSection}</span>
                      </div>
                      <p className="text-[var(--color-text-muted)]">{del.description}</p>
                      <span className="text-[10px] text-[var(--color-text-subtle)]">Reported by: {del.reportedBy}</span>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-sm font-bold text-[#f87171] block font-mono">{del.durationMinutes} Mins</span>
                      <span className="text-[11px] text-[var(--color-text-subtle)]">~{del.estimatedLostTonnage} MT lost</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </Reveal>
      )}

      {/* Log Sample Modal */}
      {showSampleModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4">Log Laboratory Coal Quality Test</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const sampleId = (form.elements.namedItem('sampleId') as HTMLInputElement).value;
                const coalGrade = (form.elements.namedItem('coalGrade') as HTMLInputElement).value;
                const ash = Number((form.elements.namedItem('ash') as HTMLInputElement).value);
                const gcv = Number((form.elements.namedItem('gcv') as HTMLInputElement).value);
                const moisture = Number((form.elements.namedItem('moisture') as HTMLInputElement).value);
                addCoalQualitySample({
                  sampleId,
                  mineId: selectedMineId,
                  mineName: activeMine.name,
                  stockpileId: 'STK-01',
                  date: new Date().toISOString().split('T')[0],
                  coalGrade,
                  moisturePercent: moisture,
                  ashPercent: ash,
                  calorificValueGcvKcalKg: gcv,
                  volatileMatterPercent: 24.5,
                  testStatus: 'CERTIFIED',
                  laboratoryName: 'Central Mine Planning & Design Inst. (CMPDI)',
                  certifiedBy: 'Chief Chemist',
                  anomalyFlagged: ash > 40,
                });
                setShowSampleModal(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-slate-400 mb-1">Sample ID</label>
                <input name="sampleId" defaultValue={sampleIdSeed} key={sampleIdSeed} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white font-mono" required />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Coal Grade</label>
                <input name="coalGrade" defaultValue="G-7 Non-Coking" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white" required />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Ash %</label>
                  <input name="ash" type="number" step="0.1" defaultValue="32.5" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white font-mono" required />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">GCV (kcal/kg)</label>
                  <input name="gcv" type="number" defaultValue="4850" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white font-mono" required />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Moisture %</label>
                  <input name="moisture" type="number" step="0.1" defaultValue="8.4" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white font-mono" required />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setShowSampleModal(false)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium">Save Sample</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
