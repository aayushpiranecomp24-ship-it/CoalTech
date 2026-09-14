// COALTECH - Heavy Earth Moving Machinery (HEMM) & Assets Module
import React, { useState } from 'react';
import { useGovernance } from '../../context/GovernanceContext';
import { useI18n } from '../../context/I18nContext';
import { StatCard } from '../../components/common/StatCard';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge, type Tone } from '../../components/ui/Badge';
import { Reveal } from '../../components/animations/Reveal';
import {
  Wrench,
  Gauge,
  Cpu,
  AlertTriangle,
  Boxes,
  Fuel,
  CheckCircle2,
  Clock,
  Search,
  Activity,
  ShieldAlert,
} from 'lucide-react';

const mapAssetStatusTone = (st: string): Tone => {
  switch (st) {
    case 'WORKING':
    case 'AVAILABLE':
      return 'success';
    case 'IDLE':
    case 'SERVICE_DUE':
      return 'warning';
    case 'MAINTENANCE':
    case 'BREAKDOWN':
    case 'OUT_OF_SERVICE':
      return 'danger';
    default:
      return 'neutral';
  }
};

export const HemmAssetsModule: React.FC = () => {
  const {
    hemmAssets,
    breakdownTickets,
    spareParts,
    fuelLogs,
    resolveBreakdownRepair,
    reorderSparePart,
  } = useGovernance();
  const { t } = useI18n();

  const [activeSubTab, setActiveSubTab] = useState<
    'fleet' | 'telemetry' | 'predictive' | 'breakdowns' | 'spares' | 'fuel'
  >('fleet');

  const [selectedAssetId, setSelectedAssetId] = useState<string>(hemmAssets[0]?.id || 'HEMM-101');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('ALL');

  const selectedAsset = hemmAssets.find((a) => a.id === selectedAssetId) || hemmAssets[0];

  const totalFleetCount = hemmAssets.length;
  const workingUnits = hemmAssets.filter((a) => a.status === 'WORKING').length;
  const availableUnits = hemmAssets.filter((a) => a.status === 'AVAILABLE').length;
  const breakdownUnits = hemmAssets.filter((a) => a.status === 'BREAKDOWN' || a.status === 'MAINTENANCE').length;
  const serviceDueUnits = hemmAssets.filter((a) => a.status === 'SERVICE_DUE').length;
  const fleetAvailabilityRate = Math.round(((workingUnits + availableUnits) / totalFleetCount) * 100);

  const filteredAssets = hemmAssets.filter((a) => {
    const matchesSearch =
      a.assetCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.operatorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'ALL' || a.type.includes(filterType);
    return matchesSearch && matchesType;
  });

  const subNavItems = [
    { id: 'fleet', label: t('nav_hemm_fleet', 'HEMM Fleet Directory'), icon: Wrench },
    { id: 'telemetry', label: t('nav_hemm_telemetry', 'Live Simulated Telemetry'), icon: Gauge },
    { id: 'predictive', label: t('nav_hemm_predictive', 'Predictive Maintenance & AI'), icon: Cpu },
    { id: 'breakdowns', label: t('nav_hemm_breakdowns', 'Breakdowns & Work Orders'), icon: AlertTriangle, badge: breakdownUnits > 0 ? `${breakdownUnits} Down` : null },
    { id: 'spares', label: t('nav_hemm_spares', 'Spare Parts Inventory'), icon: Boxes },
    { id: 'fuel', label: t('nav_hemm_fuel', 'Fuel Telemetry & Anti-Theft'), icon: Fuel },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl md:text-2xl font-bold font-display tracking-tight text-[var(--color-text)]">
              {t('hemm_title', 'Heavy Earth Moving Machinery (HEMM) Fleet Command')}
            </h1>
            <Badge tone="primary" size="sm">Asset Health</Badge>
            <Badge tone="info" size="sm">CAN-Bus VIMS</Badge>
          </div>
          <p className="text-xs text-[var(--color-text-muted)]">
            {t('hemm_subtitle', 'Heavy mining shovel, 100T dump truck, crawler dozer, and drill telemetry with predictive maintenance and workshop downtime ledger.')}
          </p>
        </div>

        {/* Prototype Simulation Disclosure */}
        <div className="bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-xl px-3 py-1.5 text-right shrink-0">
          <span className="text-[10px] font-bold text-[#60a5fa] block uppercase tracking-wider">
            CAN-Bus Diagnostic Feed
          </span>
          <span className="text-[11px] text-[var(--color-text-subtle)]">
            SIMULATED TELEMETRY • VIMS 3.2
          </span>
        </div>
      </div>

      {/* Sub Navigation Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-[var(--color-border)]">
        {subNavItems.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-[var(--color-primary-soft)] text-[#60a5fa] border border-[var(--color-primary)]/30 shadow-sm'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-2)] border border-transparent'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#60a5fa]' : 'text-[var(--color-text-subtle)]'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="rounded-full bg-[#ef4444]/20 text-[#f87171] border border-[#ef4444]/30 px-1.5 py-0.2 text-[9px] font-bold">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* SUB-TAB 1: HEMM FLEET DIRECTORY */}
      {activeSubTab === 'fleet' && (
        <Reveal>
          <div className="space-y-6">
            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Fleet Availability"
                value={`${fleetAvailabilityRate}%`}
                subtitle={`${workingUnits + availableUnits} / ${totalFleetCount} Units Ready`}
                icon={Wrench}
                trend="+2.1% this week"
                trendType="up"
                riskLevel="LOW"
              />
              <StatCard
                title="Working in Pit / Haul"
                value={`${workingUnits} Units`}
                subtitle="High extraction deployment"
                icon={Activity}
                trend="88% Avg Utilization"
                riskLevel="LOW"
              />
              <StatCard
                title="Workshop Breakdowns"
                value={`${breakdownUnits} Units`}
                subtitle="Under active overhaul"
                icon={AlertTriangle}
                trend="Average repair: 4.2h"
                trendType={breakdownUnits > 0 ? 'alert' : 'neutral'}
                riskLevel={breakdownUnits > 0 ? 'CRITICAL' : 'LOW'}
              />
              <StatCard
                title="Service Due (Hours)"
                value={`${serviceDueUnits} Units`}
                subtitle="250h / 500h interval"
                icon={Clock}
                trend="Preventive PM scheduled"
                riskLevel={serviceDueUnits > 0 ? 'MEDIUM' : 'LOW'}
              />
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[var(--color-surface)] p-3 rounded-2xl border border-[var(--color-border)]">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-[var(--color-text-subtle)]" />
                <input
                  type="text"
                  placeholder="Search asset, operator or code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-xl text-xs text-[var(--color-text)] focus:ring-1 focus:ring-[var(--color-primary)]"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
                {['ALL', 'Shovel', 'Excavator', 'Dump', 'Dozer', 'Drill', 'Grader'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      filterType === type
                        ? 'bg-[var(--color-primary)] text-white'
                        : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)]'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Fleet Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAssets.map((asset) => (
                <Card
                  key={asset.id}
                  hover
                  className="hover:border-[var(--color-primary)] transition cursor-pointer"
                  onClick={() => {
                    setSelectedAssetId(asset.id);
                    setActiveSubTab('telemetry');
                  }}
                >
                  <div className="p-4 border-b border-[var(--color-border)] flex items-start justify-between">
                    <div>
                      <span className="text-xs font-bold text-[var(--color-text)] font-mono">{asset.assetCode}</span>
                      <h4 className="text-xs font-semibold text-[var(--color-text)] mt-0.5">{asset.name}</h4>
                      <span className="text-[10px] text-[var(--color-text-subtle)]">{asset.type}</span>
                    </div>
                    <Badge tone={mapAssetStatusTone(asset.status)} size="sm">
                      {asset.status.replace('_', ' ')}
                    </Badge>
                  </div>

                  <div className="p-4 space-y-3 text-xs">
                    <div className="text-[11px] text-[var(--color-text-muted)] space-y-1">
                      <div className="flex justify-between">
                        <span>Mine & Location:</span>
                        <strong className="text-[var(--color-text)] truncate max-w-[170px]">{asset.currentLocation}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Operator:</span>
                        <strong className="text-[var(--color-text)]">{asset.operatorName}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Engine Run Hours:</span>
                        <strong className="text-[var(--color-text)] font-mono">{asset.engineHours.toLocaleString()} hrs</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Utilization:</span>
                        <strong className="text-[#34d399] font-mono">{asset.utilizationPercent}%</strong>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[var(--color-border)] flex items-center justify-between text-[10px]">
                      <span className="text-[var(--color-text-subtle)]">
                        Fuel: <strong className="text-[var(--color-text)]">{asset.fuelLevelPercent}%</strong>
                      </span>
                      <span className="text-[var(--color-text-subtle)]">
                        Coolant: <strong className="text-[var(--color-text)]">{asset.coolantTempC}°C</strong>
                      </span>
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px]">
                        Telemetry &rarr;
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </Reveal>
      )}

      {/* SUB-TAB 2: LIVE SIMULATED TELEMETRY */}
      {activeSubTab === 'telemetry' && (
        <Reveal>
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-[var(--color-text)]">
                    Simulated CAN-Bus Telemetry & Diagnostic Gauges
                  </h3>
                  <Badge tone="primary" size="sm">SIMULATED TELEMETRY</Badge>
                </div>
                <p className="text-xs text-[var(--color-text-muted)]">
                  Simulating onboard VIMS/KOMTRAX engine parameters for <strong>{selectedAsset.name}</strong> ({selectedAsset.assetCode})
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-[var(--color-text-subtle)]">Switch Unit:</span>
                <select
                  value={selectedAssetId}
                  onChange={(e) => setSelectedAssetId(e.target.value)}
                  aria-label="Select machinery asset"
                  className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-3 py-1.5 text-xs text-[var(--color-text)] font-semibold cursor-pointer"
                >
                  {hemmAssets.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.assetCode} - {a.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Diagnostic Gauges Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] text-center space-y-1">
                <span className="text-[10px] text-[var(--color-text-subtle)] uppercase tracking-wider font-bold block">Engine Speed</span>
                <span className="text-xl font-bold text-[var(--color-text)] font-mono">{selectedAsset.simulatedTelemetry.rpm}</span>
                <span className="text-[10px] text-[#60a5fa] block">RPM</span>
              </div>

              <div className="p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] text-center space-y-1">
                <span className="text-[10px] text-[var(--color-text-subtle)] uppercase tracking-wider font-bold block">Travel Speed</span>
                <span className="text-xl font-bold text-[var(--color-text)] font-mono">{selectedAsset.simulatedTelemetry.speedKmh}</span>
                <span className="text-[10px] text-[#34d399] block">km/h</span>
              </div>

              <div className="p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] text-center space-y-1">
                <span className="text-[10px] text-[var(--color-text-subtle)] uppercase tracking-wider font-bold block">Coolant Temp</span>
                <span className={`text-xl font-bold font-mono ${selectedAsset.coolantTempC > 95 ? 'text-[#f87171]' : 'text-[var(--color-text)]'}`}>
                  {selectedAsset.coolantTempC}°C
                </span>
                <span className="text-[10px] text-[var(--color-text-subtle)] block">Threshold &lt; 98°C</span>
              </div>

              <div className="p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] text-center space-y-1">
                <span className="text-[10px] text-[var(--color-text-subtle)] uppercase tracking-wider font-bold block">Lube Oil Temp</span>
                <span className="text-xl font-bold text-[var(--color-text)] font-mono">{selectedAsset.simulatedTelemetry.oilTempC}°C</span>
                <span className="text-[10px] text-[var(--color-text-subtle)] block">Normal range</span>
              </div>

              <div className="p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] text-center space-y-1">
                <span className="text-[10px] text-[var(--color-text-subtle)] uppercase tracking-wider font-bold block">Hydraulic PSI</span>
                <span className="text-xl font-bold text-[var(--color-text)] font-mono">{selectedAsset.hydraulicPressurePsi}</span>
                <span className="text-[10px] text-[#a78bfa] block">Main Loop</span>
              </div>

              <div className="p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] text-center space-y-1">
                <span className="text-[10px] text-[var(--color-text-subtle)] uppercase tracking-wider font-bold block">Chassis Vibration</span>
                <span className={`text-xl font-bold font-mono ${selectedAsset.simulatedTelemetry.vibrationMmS > 3.0 ? 'text-[#fbbf24]' : 'text-[#34d399]'}`}>
                  {selectedAsset.simulatedTelemetry.vibrationMmS}
                </span>
                <span className="text-[10px] text-[var(--color-text-subtle)] block">mm/s RMS</span>
              </div>
            </div>

            {/* Simulated Live ECU Terminal Card */}
            <Card hover className="bg-slate-950 font-mono text-xs border-slate-800 text-slate-300">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="font-bold text-white">SAE J1939 CAN-Bus Bus-0 Live Stream</span>
                </div>
                <span className="text-[11px] text-slate-500">Source: {selectedAsset.simulatedTelemetry.telemetrySource}</span>
              </div>
              <div className="p-4 space-y-1.5 text-[11px] leading-relaxed">
                <div>[0x18FEEE00] Engine Coolant Temperature: {selectedAsset.coolantTempC}°C (Hex: 0x{(selectedAsset.coolantTempC + 40).toString(16).toUpperCase()})</div>
                <div>[0x0CF00400] Electronic Engine Controller #1: RPM={selectedAsset.simulatedTelemetry.rpm} | Engine Load={selectedAsset.utilizationPercent}%</div>
                <div>[0x18FEF200] Fuel Economy: Instantaneous Fuel Rate=42.4 L/h | Tank Level={selectedAsset.fuelLevelPercent}%</div>
                <div>[0x18FEE600] Time / Distance: Cumulative Operating Hours={selectedAsset.engineHours}h | Idle Hours Today={selectedAsset.idleHoursToday}h</div>
                <div className="text-emerald-400 font-semibold mt-2">
                  ✓ Heartbeat acknowledged by Central Gateway at {selectedAsset.simulatedTelemetry.lastHeartbeat}
                </div>
              </div>
            </Card>
          </div>
        </Reveal>
      )}

      {/* SUB-TAB 3: PREDICTIVE MAINTENANCE & AI */}
      {activeSubTab === 'predictive' && (
        <Reveal>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[var(--color-text)]">Condition-Based Predictive Maintenance Roster</h3>
                <p className="text-xs text-[var(--color-text-muted)]">Vibration analysis, lube oil analysis, and run-hour service interval forecasting</p>
              </div>
              <Badge tone="primary" size="sm">AI ADVISORY</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hemmAssets.map((asset) => (
                <Card key={asset.id} hover>
                  <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-[var(--color-text)] font-mono">{asset.assetCode}</span>
                      <h4 className="text-xs font-semibold text-[var(--color-text)]">{asset.name}</h4>
                    </div>
                    <Badge tone={mapAssetStatusTone(asset.status)} size="sm">
                      {asset.status.replace('_', ' ')}
                    </Badge>
                  </div>

                  <div className="p-4 space-y-3 text-xs">
                    <div className="space-y-1 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-[var(--color-text-muted)]">Current Hours:</span>
                        <strong className="font-mono">{asset.engineHours.toLocaleString()} hrs</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--color-text-muted)]">Next 500h Service Due:</span>
                        <strong className="font-mono">{asset.nextServiceDueHours.toLocaleString()} hrs</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--color-text-muted)]">Last Overhaul:</span>
                        <span>{asset.lastServiceDate}</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[11px]">
                      <span className="text-[10px] text-[#60a5fa] font-bold block uppercase tracking-wider mb-0.5">
                        AI Advisory Note
                      </span>
                      <p className="text-[var(--color-text)] leading-relaxed">{asset.aiRecommendation || 'No immediate component failure predicted.'}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </Reveal>
      )}

      {/* SUB-TAB 4: BREAKDOWN WORK ORDERS */}
      {activeSubTab === 'breakdowns' && (
        <Reveal>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[var(--color-text)]">Workshop Breakdown Work Orders & Downtime Ledger</h3>
                <p className="text-xs text-[var(--color-text-muted)]">Immediate repair dispatch, technician allocation, and component replacement tracking</p>
              </div>
              <Badge tone="danger" size="sm">{breakdownTickets.length} Active Tickets</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {breakdownTickets.map((ticket) => (
                <Card key={ticket.id} hover>
                  <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-[var(--color-text)] font-mono">{ticket.ticketCode}</span>
                      <h4 className="text-xs font-semibold text-[var(--color-text)] mt-0.5">{ticket.assetName}</h4>
                    </div>
                    <Badge tone={ticket.status === 'AVAILABLE' ? 'success' : ticket.status === 'REPAIRING' ? 'warning' : 'danger'} size="sm">
                      {ticket.status}
                    </Badge>
                  </div>

                  <div className="p-4 space-y-3 text-xs">
                    <p className="text-[var(--color-text-muted)] text-[11px] leading-relaxed">{ticket.description}</p>

                    <div className="p-2.5 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] space-y-1 text-[11px]">
                      <div className="flex justify-between">
                        <span>Failure Category:</span>
                        <strong className="text-[var(--color-text)]">{ticket.failureCategory.replace('_', ' ')}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Assigned Lead:</span>
                        <strong className="text-[var(--color-text)]">{ticket.assignedTechnician}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Accumulated Downtime:</span>
                        <strong className="text-[#f87171] font-mono">{ticket.downtimeHours} Hours</strong>
                      </div>
                      {ticket.requiredSparePartName && (
                        <div className="flex justify-between">
                          <span>Allocated Part:</span>
                          <span className="text-[#60a5fa]">{ticket.requiredSparePartName}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-[var(--color-text-subtle)]">Reported: {ticket.reportedAt}</span>
                      {ticket.status !== 'AVAILABLE' && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => resolveBreakdownRepair(ticket.id)}
                          leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                        >
                          Sign-off Repair
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

      {/* SUB-TAB 5: SPARE PARTS INVENTORY */}
      {activeSubTab === 'spares' && (
        <Reveal>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[var(--color-text)]">Central Mine Warehouse: Critical HEMM Spare Parts</h3>
                <p className="text-xs text-[var(--color-text-muted)]">Minimum stock replenishment levels, warehouse bin locations, and procurement lead times</p>
              </div>
              <Badge tone="primary" size="sm">ERP Inventory Sync</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {spareParts.map((part) => {
                const isCritical = part.reorderStatus === 'CRITICAL_LOW';
                return (
                  <Card key={part.id} hover>
                    <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-[var(--color-text)] font-mono">{part.partNumber}</span>
                        <h4 className="text-xs font-semibold text-[var(--color-text)] mt-0.5">{part.name}</h4>
                      </div>
                      <Badge tone={isCritical ? 'danger' : 'success'} size="sm">
                        {part.reorderStatus}
                      </Badge>
                    </div>

                    <div className="p-4 space-y-3 text-xs">
                      <div className="grid grid-cols-2 gap-2 bg-[var(--color-surface-2)] p-2.5 rounded-xl border border-[var(--color-border)] text-[11px]">
                        <div>
                          <span className="text-[10px] text-[var(--color-text-subtle)] block">Stock Level:</span>
                          <strong className={isCritical ? 'text-[#f87171] font-mono text-sm' : 'text-[var(--color-text)] font-mono text-sm'}>
                            {part.currentStock} Units (Min: {part.minStockLevel})
                          </strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-[var(--color-text-subtle)] block">Unit Cost:</span>
                          <strong className="text-[var(--color-text)] font-mono">₹{(part.unitCostInr / 1000).toFixed(0)}k</strong>
                        </div>
                        <div className="col-span-2">
                          <span className="text-[10px] text-[var(--color-text-subtle)] block">Warehouse Bin:</span>
                          <span className="text-[var(--color-text)]">{part.warehouseLocation}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-[var(--color-text-muted)]">Lead Time: {part.leadTimeDays} days</span>
                        {isCritical && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => reorderSparePart(part.id, 5)}
                          >
                            Reorder +5 Units
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </Reveal>
      )}

      {/* SUB-TAB 6: FUEL MONITORING & ANTI-THEFT */}
      {activeSubTab === 'fuel' && (
        <Reveal>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard
                title="Diesel Consumed (Today)"
                value="14,850 Liters"
                subtitle="All Pit Shovels & Dumpers"
                icon={Fuel}
                trend="Consumption: 42.4 L/hr"
                riskLevel="LOW"
              />
              <StatCard
                title="Active Mobile Dispenser"
                value="Bowser #03"
                subtitle="Gevra Incline Sump Bay"
                icon={Activity}
                trend="RFID calibrated"
                riskLevel="LOW"
              />
              <StatCard
                title="Fuel Anomaly Alerts"
                value="0 Flags"
                subtitle="Zero unexpected drops"
                icon={ShieldAlert}
                trend="Anti-theft telemetry active"
                riskLevel="LOW"
              />
            </div>

            <Card hover>
              <div className="p-4 border-b border-[var(--color-border)]">
                <h3 className="text-sm font-bold text-[var(--color-text)]">Recent Heavy Machinery Fuel Refueling Ledger</h3>
              </div>
              <div className="p-4 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[var(--color-border)] text-[var(--color-text-subtle)] uppercase tracking-wider text-[10px]">
                      <th className="pb-3">Timestamp</th>
                      <th className="pb-3">Machinery / Vehicle</th>
                      <th className="pb-3">Operator</th>
                      <th className="pb-3">Dispensed (Liters)</th>
                      <th className="pb-3">Cost (INR)</th>
                      <th className="pb-3">Dispenser Location</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]">
                    {fuelLogs.slice(0, 6).map((log) => (
                      <tr key={log.id} className="hover:bg-[var(--color-surface-2)] transition">
                        <td className="py-3 font-mono text-[var(--color-text-subtle)]">{new Date(log.timestamp).toLocaleTimeString()}</td>
                        <td className="py-3 font-semibold text-[var(--color-text)]">{log.vehicleName}</td>
                        <td className="py-3 text-[var(--color-text-muted)]">{log.driverName}</td>
                        <td className="py-3 font-mono font-bold text-[var(--color-text)]">{log.liters} L</td>
                        <td className="py-3 font-mono">₹{log.totalCost.toLocaleString()}</td>
                        <td className="py-3 text-[var(--color-text-muted)]">{log.location}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </Reveal>
      )}
    </div>
  );
};
