import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Command,
  LayoutDashboard,
  Pickaxe,
  ShieldCheck,
  ClipboardList,
  AlertTriangle,
  CheckSquare,
  Sparkles,
  Users,
  Truck,
  FileText,
  History,
  Settings,
  Scale,
  Wrench,
  Fuel,
  Route,
  Clock,
  MapPin,
  Building2,
  FileCheck2,
} from "lucide-react";
import { useGovernance } from "../../context/GovernanceContext";

interface Props {
  open: boolean;
  onClose: () => void;
  onNavigate: (tabId: string) => void;
}

interface SearchItem {
  id: string;
  tabId: string;
  label: string;
  description: string;
  icon: React.ElementType;
  category: string;
  keywords?: string;
}

const coalTechSearchItems: SearchItem[] = [
  { id: "1", tabId: "dashboard", label: "Executive Dashboard", description: "Operational intelligence & KPIs", icon: LayoutDashboard, category: "Module" },
  { id: "2", tabId: "mines", label: "Mines Directory", description: "Operational sectors, pits & zones", icon: Pickaxe, category: "Module" },
  { id: "3", tabId: "mine-operations", label: "Mine Operations & Blast Planning", description: "Benches, blasts & stockpile surveys", icon: Pickaxe, category: "Module" },
  { id: "4", tabId: "compliance", label: "Statutory Compliance", description: "CMR 2017 & DGMS statutory audits", icon: ShieldCheck, category: "Module" },
  { id: "5", tabId: "inspections", label: "Field Inspections", description: "Statutory inspection schedules & observations", icon: ClipboardList, category: "Module" },
  { id: "6", tabId: "incidents", label: "Hazard & Incident Tracker", description: "Safety hazards & DGMS reporting", icon: AlertTriangle, category: "Module" },
  { id: "7", tabId: "corrective", label: "Corrective Actions (CAPA)", description: "Remediation workflows & sign-offs", icon: CheckSquare, category: "Module" },
  { id: "8", tabId: "risk-intelligence", label: "AI Risk Intelligence", description: "Predictive hazard scoring & analytics", icon: Sparkles, category: "Module" },
  { id: "9", tabId: "gis-map", label: "GIS Geofence Map", description: "Spatial tracking of sidings & corridors", icon: MapPin, category: "Module" },
  { id: "10", tabId: "workforce", label: "Workforce Administration", description: "Worker rosters & 8h daily limit tracking", icon: Users, category: "Module" },
  { id: "11", tabId: "contractors", label: "Contractor Compliance", description: "HEMM vendors & statutory contracts", icon: Building2, category: "Module" },
  { id: "12", tabId: "transportation", label: "Coal & Logistics Hub", description: "Unified haulage operations overview", icon: Truck, category: "Module" },
  { id: "13", tabId: "transportation-movements", label: "Coal Movements & Dispatches", description: "Challans, e-way bills & dispatches", icon: Truck, category: "Module" },
  { id: "14", tabId: "transportation-reconciliation", label: "Weighbridge Reconciliation", description: "Gross-tare variance & pilferage control", icon: Scale, category: "Module" },
  { id: "15", tabId: "transportation-vehicles", label: "Haulage Fleet Vehicles", description: "Tippers, dumpers & statutory fitness", icon: Truck, category: "Module" },
  { id: "16", tabId: "transportation-drivers", label: "Commercial Drivers", description: "DGMS hazardous permits & licenses", icon: Users, category: "Module" },
  { id: "17", tabId: "transportation-routes", label: "Haulage Corridors", description: "Designated routes, sidings & checkpoints", icon: Route, category: "Module" },
  { id: "18", tabId: "transportation-maintenance", label: "Fleet Maintenance", description: "Preventative schedules & repairs", icon: Wrench, category: "Module" },
  { id: "19", tabId: "transportation-fuel", label: "Fuel & Haulage Expenses", description: "Fuel logs & logistics cost accounting", icon: Fuel, category: "Module" },
  { id: "20", tabId: "reports", label: "Statutory Reports", description: "DGMS Annual returns & CSV exports", icon: FileText, category: "Module" },
  { id: "21", tabId: "audit-trail", label: "Audit Ledger", description: "Cryptographic SHA-256 activity trail", icon: History, category: "Module" },
  { id: "22", tabId: "settings", label: "System Settings", description: "Statutory rules, roles & preferences", icon: Settings, category: "Module" },
];

export function SearchModal({ open, onClose, onNavigate }: Props) {
  const {
    mines,
    workers,
    fleetVehicles,
    fleetDrivers,
    contractors,
    violations,
    coalMovements,
    officers,
    inspections,
  } = useGovernance();

  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) onClose();
        else onNavigate("open_search");
      }
      if (e.key === "Escape" && open) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose, onNavigate]);

  // Dynamically index all entities across collections
  const dynamicEntityItems = useMemo<SearchItem[]>(() => {
    const items: SearchItem[] = [];

    // 1. Mines
    mines.forEach((m) => {
      items.push({
        id: `mine-${m.id}`,
        tabId: "mines",
        label: m.name,
        description: `${m.type} • Risk Score: ${m.riskScore} • Compliance: ${m.complianceScore}%`,
        icon: Pickaxe,
        category: "Mine Facility",
        keywords: `${m.name} ${m.type} ${m.id} ${m.mineCode || ''}`,
      });
    });

    // 2. Workers
    workers.forEach((w) => {
      items.push({
        id: `worker-${w.id}`,
        tabId: "workforce",
        label: `${w.name} (${w.badgeNumber})`,
        description: `${w.role} • ${w.department} • Shift: ${w.shift}`,
        icon: Users,
        category: "Workforce",
        keywords: `${w.name} ${w.badgeNumber} ${w.role} ${w.department} ${w.workerId || ''}`,
      });
    });

    // 3. Officers
    officers.forEach((o) => {
      items.push({
        id: `officer-${o.id}`,
        tabId: "workforce",
        label: `${o.name} (${o.role})`,
        description: `Statutory Officer • ${o.department} • Phone: ${o.phone}`,
        icon: Users,
        category: "Officer",
        keywords: `${o.name} ${o.role} ${o.department} ${o.officerCode || ''}`,
      });
    });

    // 4. Vehicles
    fleetVehicles.forEach((v) => {
      items.push({
        id: `veh-${v.id}`,
        tabId: "transportation-vehicles",
        label: `${v.plate} (${v.name})`,
        description: `${v.type} • Status: ${v.status} • Cap: ${v.maxCapacityTonnes}T`,
        icon: Truck,
        category: "Fleet Vehicle",
        keywords: `${v.plate} ${v.name} ${v.type} ${v.make} ${v.model}`,
      });
    });

    // 5. Drivers
    fleetDrivers.forEach((d) => {
      items.push({
        id: `drv-${d.id}`,
        tabId: "transportation-drivers",
        label: `${d.name} (${d.licenseNumber})`,
        description: `Commercial Driver • Transporter: ${d.transporterName} • Safety: ${d.safetyScore}%`,
        icon: Users,
        category: "Haulage Driver",
        keywords: `${d.name} ${d.licenseNumber} ${d.phone} ${d.transporterName}`,
      });
    });

    // 6. Contractors
    contractors.forEach((c) => {
      items.push({
        id: `ctr-${c.id}`,
        tabId: "contractors",
        label: c.name,
        description: `${c.category} • Risk Score: ${c.riskScore} • ${c.violationsCount} Violations`,
        icon: Building2,
        category: "Contractor",
        keywords: `${c.name} ${c.category} ${c.complianceStatus}`,
      });
    });

    // 7. Violations
    violations.forEach((v) => {
      items.push({
        id: `vio-${v.id}`,
        tabId: "incidents",
        label: `${v.title}: ${v.description.slice(0, 50)}...`,
        description: `Violation • Severity: ${v.severity} • Status: ${v.status}`,
        icon: AlertTriangle,
        category: "Violation",
        keywords: `${v.title} ${v.description} ${v.severity} ${v.status} ${v.id}`,
      });
    });

    // 8. Dispatches / Coal Movements
    coalMovements.forEach((m) => {
      const netT = m.dispatchedNetTonnes ?? 0;
      items.push({
        id: `mov-${m.id}`,
        tabId: "transportation-movements",
        label: `${m.id} (${m.originMineName} → ${m.destinationName})`,
        description: `Dispatch • ${m.coalGrade} • Net: ${netT}T • Status: ${m.status}`,
        icon: Scale,
        category: "Dispatch",
        keywords: `${m.id} ${m.originMineName} ${m.destinationName} ${m.coalGrade} ${m.challanNumber || ''}`,
      });
    });

    // 9. Inspections
    inspections.forEach((ins) => {
      items.push({
        id: `ins-${ins.id}`,
        tabId: "inspections",
        label: `Inspection #${ins.id}: ${ins.category} (${ins.status})`,
        description: `Inspector: ${ins.inspectorName} • Severity: ${ins.severity}`,
        icon: FileCheck2,
        category: "Inspection",
        keywords: `${ins.id} ${ins.inspectorName} ${ins.category}`,
      });
    });

    return items;
  }, [mines, workers, fleetVehicles, fleetDrivers, contractors, violations, coalMovements, officers, inspections]);

  // Combined search pool
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return coalTechSearchItems.slice(0, 7);
    }

    const moduleMatches = coalTechSearchItems.filter(
      (s) =>
        s.label.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
    );

    const entityMatches = dynamicEntityItems.filter(
      (e) =>
        e.label.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        (e.keywords && e.keywords.toLowerCase().includes(q))
    );

    // Prioritize exact or prefix matches, combine modules + entities up to 30 items
    return [...moduleMatches, ...entityMatches].slice(0, 30);
  }, [query, dynamicEntityItems]);

  function select(item: SearchItem) {
    onNavigate(item.tabId);
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm pt-[12vh] px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-surface)] shadow-elevated"
          >
            {/* Input Header */}
            <div className="flex items-center gap-3 border-b border-[var(--color-border)] px-4 py-3.5 bg-[var(--color-bg-elevated)]">
              <Search className="h-5 w-5 text-[var(--color-text-subtle)]" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search CoalTech modules, mines, dispatches, compliance..."
                className="flex-1 bg-transparent text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-faint)] focus:outline-none"
              />
              <kbd className="hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-0.5 text-[10px] font-mono text-[var(--color-text-subtle)] sm:inline">
                ESC
              </kbd>
            </div>

            {/* Results List */}
            <div className="max-h-80 overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <div className="px-4 py-8 text-center text-xs text-[var(--color-text-muted)]">
                  No matching module or records found for "{query}"
                </div>
              ) : (
                <div className="space-y-1">
                  {filtered.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => select(item)}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-[var(--color-surface-2)] cursor-pointer group"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--color-surface-2)] text-[var(--color-primary)] group-hover:bg-[var(--color-primary-soft)] transition-colors">
                        <item.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-[var(--color-text)] truncate">
                          {item.label}
                        </div>
                        <div className="text-xs text-[var(--color-text-muted)] truncate">
                          {item.description}
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-[var(--color-text-subtle)] bg-[var(--color-bg-elevated)] border border-[var(--color-border)] px-2 py-0.5 rounded-lg shrink-0">
                        {item.category}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center gap-4 border-t border-[var(--color-border)] px-4 py-2.5 text-[11px] text-[var(--color-text-subtle)] bg-[var(--color-bg-elevated)]">
              <span className="flex items-center gap-1.5">
                <Command className="h-3 w-3" /> + K
              </span>
              <span>↵ to navigate</span>
              <span className="ml-auto flex items-center gap-1">
                <Clock className="h-3 w-3" /> CoalTech Fast Switch
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
