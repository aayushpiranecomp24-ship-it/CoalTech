import React, { useState } from 'react';
import { useGovernance } from '../context/GovernanceContext';
import { useI18n } from '../context/I18nContext';
import {
  Building2,
  AlertTriangle,
  CheckCircle2,
  Search,
  ExternalLink,
  Plus,
  Phone,
  Mail,
  Shield,
} from 'lucide-react';
import { AddMineModal } from '../features/masterData/components/AddMineModal';
import { Reveal } from '../components/animations/Reveal';
import { Magnetic } from '../components/animations/Magnetic';
import { StatusChip } from '../components/ui/Badge';

interface MineOverviewPageProps {
  onNavigateTab: (tab: string) => void;
}

export const MineOverviewPage: React.FC<MineOverviewPageProps> = ({ onNavigateTab }) => {
  const { mines, areas, violations, currentUser } = useGovernance();
  const { t } = useI18n();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Under Maintenance'>('All');
  const [showAddMineModal, setShowAddMineModal] = useState(false);

  const canRegisterMine = currentUser?.role === 'Coal Mine Manager' || currentUser?.role === 'Area Manager';

  const filteredMines = mines.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.mineCode && m.mineCode.toLowerCase().includes(searchQuery.toLowerCase())) ||
      m.manager.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesArea = selectedArea === 'All' || m.areaId === selectedArea;
    const matchesStatus = statusFilter === 'All' || m.status === statusFilter;
    return matchesSearch && matchesArea && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <Reveal direction="up" delay={0.02}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--color-surface)] border border-[var(--color-border)] p-5 rounded-2xl shadow-card">
          <div>
            <div className="flex items-center space-x-2">
              <Building2 className="w-6 h-6 text-blue-400" />
              <h1 className="text-xl font-bold text-[var(--color-text)] tracking-tight">
                {t('nav_mines', 'Coal Mines Directory & Sector Risk Profiling')}
              </h1>
            </div>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">
              Enterprise multi-mine operational footprint across Korba (SECL), Talcher (MCL), and Singrauli (NCL) coalfields.
            </p>
          </div>

          {canRegisterMine && (
            <div className="flex items-center space-x-3">
              <Magnetic>
                <button
                  onClick={() => setShowAddMineModal(true)}
                  className="flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Register Coal Mine Sector</span>
                </button>
              </Magnetic>
            </div>
          )}
        </div>
      </Reveal>

      {/* Read-Only Banner for Transportation Head */}
      {currentUser?.role === 'Transportation Head' && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3.5 flex items-center justify-between text-xs text-amber-300">
          <div className="flex items-center space-x-2.5">
            <Shield className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Read-Only Operational View:</strong> Siding, pithead, and coal loading points across all 5 sectors are displayed for haulage scheduling and corridor dispatch coordination. Sector registration is restricted to Coal Mine Managers.
            </span>
          </div>
          <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 font-mono text-[10px] rounded border border-amber-500/30 font-bold uppercase">
            Logistics Scope
          </span>
        </div>
      )}

      {/* Filter Bar */}
      <Reveal direction="up" delay={0.04}>
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-4 rounded-xl shadow-card flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[var(--color-text-subtle)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search mine name, code, manager..."
              className="w-full pl-9 pr-3 py-2 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)] outline-none focus:border-blue-500 text-xs transition-colors"
            />
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] text-[var(--color-text-muted)] uppercase font-semibold">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-lg px-2.5 py-1.5 text-xs text-[var(--color-text)] outline-none focus:border-blue-500 transition-colors"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Under Maintenance">Under Maintenance</option>
              </select>
            </div>

            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] text-[var(--color-text-muted)] uppercase font-semibold">Area Command:</span>
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-lg px-2.5 py-1.5 text-xs text-[var(--color-text)] outline-none focus:border-blue-500 transition-colors"
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
        </div>
      </Reveal>

      {/* Mines Grid */}
      <Reveal direction="up" delay={0.08}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMines.map((mine) => {
            const area = areas.find((a) => a.id === mine.areaId);
            const activeMineViolations = violations.filter((v) => v.mineId === mine.id && v.status !== 'CLOSED');
            const isCritical = mine.riskScore >= 80;

            return (
              <div
                key={mine.id}
                className={`bg-[var(--color-surface)] border rounded-2xl p-5 shadow-card hover:shadow-elevated hover:-translate-y-1 transition-all duration-300 space-y-4 flex flex-col justify-between ${
                  isCritical
                    ? 'border-rose-500/40 hover:border-rose-500/60'
                    : 'border-[var(--color-border)] hover:border-[var(--color-border-strong)]'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                        {area?.name}
                      </span>
                      {mine.mineCode && (
                        <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-[var(--color-surface-2)] text-[var(--color-text-muted)] border border-[var(--color-border)]">
                          {mine.mineCode}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-1.5">
                      {mine.status && (
                        <StatusChip
                          label={mine.status}
                          tone={mine.status === 'Active' ? 'success' : 'warning'}
                          size="sm"
                        />
                      )}
                      <StatusChip
                        label={`Risk: ${mine.riskScore}/100`}
                        tone={isCritical ? 'danger' : mine.riskScore >= 50 ? 'warning' : 'success'}
                        size="sm"
                      />
                    </div>
                  </div>

                  <h3 className="font-bold text-[var(--color-text)] text-base tracking-tight">{mine.name}</h3>
                  <span className="text-[11px] text-[var(--color-text-muted)] block">{mine.type} Coal Extraction Sector</span>
                </div>

                {/* Stats Tiles */}
                <div className="grid grid-cols-2 gap-2 bg-[var(--color-surface-2)] border border-[var(--color-border)] p-3 rounded-xl text-xs">
                  <div>
                    <span className="text-[10px] text-[var(--color-text-subtle)] block">Manager</span>
                    <span className="font-semibold text-[var(--color-text)]">{mine.manager}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--color-text-subtle)] block">Capacity</span>
                    <span className="font-semibold text-[var(--color-text)]">{mine.productionCapacityMTPA} MTPA</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--color-text-subtle)] block">Workforce</span>
                    <span className="font-semibold text-[var(--color-text)]">{mine.workforceCount} Personnel</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--color-text-subtle)] block">Compliance</span>
                    <span className="font-bold text-emerald-400">{mine.complianceScore}%</span>
                  </div>
                </div>

                {/* Assigned Officers */}
                {mine.assignedOfficers && mine.assignedOfficers.length > 0 && (
                  <div className="p-2.5 rounded-xl bg-blue-500/5 border border-blue-500/15 text-[10px]">
                    <div className="flex items-center space-x-1 text-blue-400 font-bold mb-1">
                      <Shield className="w-3 h-3" />
                      <span>Statutory Inspection Officers:</span>
                    </div>
                    <div className="text-[var(--color-text-muted)] leading-tight">
                      {mine.assignedOfficers.join(', ')}
                    </div>
                  </div>
                )}

                {/* Contact Info */}
                {(mine.contactEmail || mine.contactPhone) && (
                  <div className="flex items-center justify-between text-[10px] text-[var(--color-text-subtle)] pt-1">
                    {mine.contactEmail && (
                      <span className="flex items-center space-x-1 truncate max-w-[160px]">
                        <Mail className="w-3 h-3 text-[var(--color-text-subtle)] shrink-0" />
                        <span className="truncate">{mine.contactEmail}</span>
                      </span>
                    )}
                    {mine.contactPhone && (
                      <span className="flex items-center space-x-1">
                        <Phone className="w-3 h-3 text-[var(--color-text-subtle)] shrink-0" />
                        <span>{mine.contactPhone}</span>
                      </span>
                    )}
                  </div>
                )}

                {/* Zones list */}
                <div>
                  <span className="text-[10px] text-[var(--color-text-subtle)] uppercase font-semibold block mb-1">
                    Active Zones ({mine.zones.length}):
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {mine.zones.slice(0, 3).map((z, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md text-[9px] font-medium bg-[var(--color-surface-2)] text-[var(--color-text-muted)] border border-[var(--color-border)]"
                      >
                        {z}
                      </span>
                    ))}
                    {mine.zones.length > 3 && (
                      <span className="px-2 py-0.5 rounded-md text-[9px] bg-[var(--color-surface-2)] text-[var(--color-text-subtle)]">
                        +{mine.zones.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-[var(--color-border)] flex justify-between items-center text-xs">
                  <span className="text-[var(--color-text-subtle)]">
                    {activeMineViolations.length > 0 ? (
                      <span className="text-rose-400 font-bold flex items-center">
                        <AlertTriangle className="w-3.5 h-3.5 mr-1" /> {activeMineViolations.length} active violations
                      </span>
                    ) : (
                      <span className="text-emerald-400 font-semibold flex items-center">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> All clear
                      </span>
                    )}
                  </span>

                  <button
                    onClick={() => onNavigateTab('gis-map')}
                    className="text-blue-400 hover:text-blue-300 font-medium flex items-center text-[11px] transition-colors"
                  >
                    <span>GIS Hotzones</span>
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </Reveal>

      {/* Add Mine Master Modal */}
      <AddMineModal
        isOpen={showAddMineModal}
        onClose={() => setShowAddMineModal(false)}
      />
    </div>
  );
};
