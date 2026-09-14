// MINEGOV AI - Central Governance & State Context Provider
import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  User,
  Area,
  Mine,
  Worker,
  Contractor,
  ComplianceItem,
  Inspection,
  Violation,
  CorrectiveAction,
  IncidentReport,
  EnvironmentalReading,
  DocumentRecord,
  AuditLog,
  BlockchainBlock,
  NotificationItem,
  OfflineQueueItem,
  WorkerGrievance,
  FinanceBudget,
  SeverityLevel,
  RolePermissions,
  CoalMovement,
  FleetVehicle,
  TransporterDriver,
  FleetMaintenanceRecord,
  FuelLogRecord,
  LogisticsExpense,
  Officer,
  RouteCorridor,
  OvertimeApprovalRecord,
  BenchPitRecord,
  BlastPlanRecord,
  OverburdenRecord,
  CoalQualityRecord,
  StockpileRecord,
  OperationalDelayRecord,
  HemmAsset,
  BreakdownTicket,
  SparePartItem,
  EmergencyIncidentCommand,
  EmergencyDrillRecord,
  RootCauseAnalysisRecord,
  PendingApproval,
  DataQualityCheckResult,
} from '../types';
import { ROLE_PERMISSIONS_MAP } from '../types';
import {
  SEED_USERS,
  SEED_AREAS,
  SEED_MINES,
  generateWorkers,
  SEED_CONTRACTORS,
  SEED_COMPLIANCE_ITEMS,
  generateInspections,
  generateViolations,
  generateCorrectiveActions,
  generateEnvironmentalReadings,
  SEED_DOCUMENTS,
  SEED_GENESIS_BLOCK,
  SEED_BLOCKCHAIN,
  SEED_INCIDENTS,
  SEED_GRIEVANCES,
  SEED_FINANCE,
  SEED_NOTIFICATIONS,
  SEED_COAL_MOVEMENTS,
  SEED_FLEET_VEHICLES,
  SEED_FLEET_DRIVERS,
  SEED_FLEET_MAINTENANCE,
  SEED_FUEL_LOGS,
  SEED_LOGISTICS_EXPENSES,
  SEED_ROUTES,
  SEED_OFFICERS,
  SEED_OVERTIME_RECORDS,
  SEED_BENCHES,
  SEED_BLAST_PLANS,
  SEED_OVERBURDEN,
  SEED_COAL_QUALITY,
  SEED_STOCKPILES,
  SEED_OPERATIONAL_DELAYS,
  SEED_HEMM_ASSETS,
  SEED_BREAKDOWN_TICKETS,
  SEED_SPARE_PARTS,
  SEED_EMERGENCY_COMMAND,
  SEED_EMERGENCY_DRILLS,
  SEED_ROOT_CAUSE_ANALYSES,
  SEED_PENDING_APPROVALS,
  SEED_DATA_QUALITY_CHECKS,
} from '../data/seedData';
import { calculateAIRiskScore, type AIRiskAssessment } from '../services/aiRiskService';
import { evaluateStatutoryRules } from '../services/ruleEngineService';
import { recordAuditAndAnchorBlock, runCryptographicIntegrityCheck } from '../services/auditBlockchainService';
import { processDocumentWithOCR } from '../services/ocrService';
import { dispatchMultiChannelNotifications } from '../services/notificationService';
import { addToOfflineQueue, getOfflineQueue, clearOfflineQueue } from '../services/offlineSyncService';

interface GovernanceContextType {
  currentUser: User | null;
  users: User[];
  areas: Area[];
  mines: Mine[];
  allMines: Mine[];
  allAreas: Area[];
  workers: Worker[];
  contractors: Contractor[];
  complianceItems: ComplianceItem[];
  inspections: Inspection[];
  violations: Violation[];
  correctiveActions: CorrectiveAction[];
  incidents: IncidentReport[];
  readings: EnvironmentalReading[];
  documents: DocumentRecord[];
  auditLogs: AuditLog[];
  blockchainBlocks: BlockchainBlock[];
  notifications: NotificationItem[];
  offlineQueue: OfflineQueueItem[];
  grievances: WorkerGrievance[];
  financeBudgets: FinanceBudget[];
  coalMovements: CoalMovement[];
  fleetVehicles: FleetVehicle[];
  fleetDrivers: TransporterDriver[];
  fleetMaintenance: FleetMaintenanceRecord[];
  fuelLogs: FuelLogRecord[];
  logisticsExpenses: LogisticsExpense[];
  routes: RouteCorridor[];
  officers: Officer[];
  overtimeRecords: OvertimeApprovalRecord[];
  benches: BenchPitRecord[];
  blastPlans: BlastPlanRecord[];
  overburdenRecords: OverburdenRecord[];
  coalQualityRecords: CoalQualityRecord[];
  stockpiles: StockpileRecord[];
  operationalDelays: OperationalDelayRecord[];
  hemmAssets: HemmAsset[];
  breakdownTickets: BreakdownTicket[];
  spareParts: SparePartItem[];
  emergencyCommand: EmergencyIncidentCommand;
  emergencyDrills: EmergencyDrillRecord[];
  rootCauseAnalyses: RootCauseAnalysisRecord[];
  pendingApprovals: PendingApproval[];
  dataQualityChecks: DataQualityCheckResult[];
  isOffline: boolean;
  permissions: RolePermissions;
  isModuleAllowed: (moduleId: string) => boolean;
  canPerform: (action: keyof RolePermissions) => boolean;

  // Actions
  login: (email: string, role?: string) => boolean;
  logout: () => void;
  quickSwitchUser: (user: User) => void;
  resetDemoData: () => void;
  toggleOfflineMode: () => void;

  // Master Data CRUD Actions
  addMine: (mine: Omit<Mine, 'id'>) => void;
  updateMine: (mineId: string, updates: Partial<Mine>) => void;
  addWorker: (worker: Omit<Worker, 'id'>) => void;
  updateWorker: (workerId: string, updates: Partial<Worker>) => void;
  deleteWorker: (workerId: string) => void;
  addOfficer: (officer: Omit<Officer, 'id'>) => void;
  updateOfficer: (officerId: string, updates: Partial<Officer>) => void;
  addRoute: (route: Omit<RouteCorridor, 'id'>) => void;
  updateRoute: (routeId: string, updates: Partial<RouteCorridor>) => void;
  approveOvertime: (record: Omit<OvertimeApprovalRecord, 'id' | 'timestamp' | 'status'> & { status?: 'APPROVED' | 'REJECTED' }) => void;

  // Operational Actions
  updateBenchSlopeRisk: (benchId: string, slopeRisk: BenchPitRecord['slopeRisk']) => void;
  approveBlastClearance: (blastId: string) => void;
  addCoalQualitySample: (sample: Omit<CoalQualityRecord, 'id'>) => void;
  adjustStockpileSurvey: (stockpileId: string, surveyedTonnes: number) => void;
  reportHemmBreakdown: (ticket: Omit<BreakdownTicket, 'id' | 'ticketCode' | 'status'>) => void;
  resolveBreakdownRepair: (ticketId: string, sparePartId?: string) => void;
  reorderSparePart: (partId: string, quantity: number) => void;
  triggerEmergencySiren: (mineId: string, emergencyType: EmergencyIncidentCommand['emergencyType']) => void;
  updateMusterRollCall: (mineId: string, accountedDelta: number) => void;
  saveRootCauseAnalysis: (rca: Omit<RootCauseAnalysisRecord, 'id'>) => void;
  resolvePendingApproval: (approvalId: string, action: 'APPROVED' | 'REJECTED', notes?: string) => void;
  runDataQualityAudit: () => { score: number; checks: DataQualityCheckResult[] };

  // Workflows
  submitReport: (payload: {
    title: string;
    category: string;
    description: string;
    severity: SeverityLevel;
    mineId: string;
    zone: string;
    gps?: string;
    contractorName?: string;
    beforePhotoUrl?: string;
  }) => Promise<{ status: 'SYNCED' | 'OFFLINE_SAVED'; id: string; riskAssessment?: AIRiskAssessment }>;

  assignViolation: (violationId: string, assigneeName: string, deadline: string) => void;
  submitCorrectiveAction: (violationId: string, description: string, proofPhotoUrl?: string, notes?: string) => void;
  verifyCorrectiveAction: (violationId: string, approved: boolean, notes: string) => void;
  triggerManualEscalation: (violationId: string) => void;

  addComplianceItem: (item: Omit<ComplianceItem, 'id'>) => void;
  updateComplianceStatus: (id: string, status: ComplianceItem['status']) => void;

  createInspection: (inspection: Omit<Inspection, 'id'>) => void;
  addEnvironmentalReading: (mineId: string, parameter: EnvironmentalReading['parameter'], value: number) => void;

  // Transportation Workflows
  createCoalMovement: (payload: Omit<CoalMovement, 'id' | 'status'>) => Promise<string>;
  dispatchCoalMovement: (movementId: string) => void;
  recordWeighbridgeReceipt: (
    movementId: string,
    receivedGrossTonnes: number,
    receivedTareTonnes: number,
    sealIntact: boolean,
    discrepancyReason?: string
  ) => void;
  reconcileCoalMovement: (movementId: string) => void;
  cancelCoalMovement: (movementId: string) => void;
  addFleetVehicle: (vehicle: Omit<FleetVehicle, 'id'>) => void;
  updateVehicleStatus: (vehicleId: string, status: FleetVehicle['status']) => void;
  addFleetDriver: (driver: Omit<TransporterDriver, 'id'>) => void;
  scheduleFleetMaintenance: (record: Omit<FleetMaintenanceRecord, 'id'>) => void;
  completeFleetMaintenance: (recordId: string) => void;
  logFuelConsumption: (fuelLog: Omit<FuelLogRecord, 'id'>) => void;
  addLogisticsExpense: (expense: Omit<LogisticsExpense, 'id'>) => void;
  approveLogisticsExpense: (expenseId: string) => void;

  runOcrOnDocument: (docId: string) => Promise<DocumentRecord>;
  submitGrievance: (category: WorkerGrievance['category'], description: string, isAnonymous: boolean) => void;

  syncOfflineQueue: () => Promise<number>;
  clearNotification: (id: string) => void;
  markAllNotificationsRead: () => void;
  verifyLedgerIntegrity: () => { isValid: boolean; message: string };

  queryAiAssistant: (query: string) => { answer: string; data?: any[] };
  queryRegulatoryRAG: (query: string) => { answer: string; citation: string; date: string };
}

const loadStoredOrSeed = <T,>(key: string, seedFallback: T[]): T[] => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(seedFallback));
      return seedFallback;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(key, JSON.stringify(seedFallback));
      return seedFallback;
    }
    if (key === 'minegov_blockchain' && parsed.length < 2) {
      localStorage.setItem(key, JSON.stringify(seedFallback));
      return seedFallback;
    }
    return parsed;
  } catch {
    localStorage.setItem(key, JSON.stringify(seedFallback));
    return seedFallback;
  }
};

const GovernanceContext = createContext<GovernanceContextType | undefined>(undefined);

export const GovernanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const savedUser = sessionStorage.getItem('minegov_user');
      if (savedUser) return JSON.parse(savedUser);
    } catch {
      // ignore
    }
    return SEED_USERS[0];
  });
  const [users, setUsers] = useState<User[]>(() => {
    const storedUsersRaw = localStorage.getItem('minegov_users');
    let mergedUsers = SEED_USERS;
    if (storedUsersRaw) {
      try {
        const parsedUsers: User[] = JSON.parse(storedUsersRaw);
        const existingIds = new Set(parsedUsers.map((u) => u.id));
        const missingSeedUsers = SEED_USERS.filter((su) => !existingIds.has(su.id));
        mergedUsers = [...parsedUsers, ...missingSeedUsers];
      } catch {
        mergedUsers = SEED_USERS;
      }
    }
    localStorage.setItem('minegov_users', JSON.stringify(mergedUsers));
    return mergedUsers;
  });
  const [areas, setAreas] = useState<Area[]>(() => loadStoredOrSeed('minegov_areas', SEED_AREAS));
  const [mines, setMines] = useState<Mine[]>(() => loadStoredOrSeed('minegov_mines', SEED_MINES));
  const [workers, setWorkers] = useState<Worker[]>(() => loadStoredOrSeed('minegov_workers', generateWorkers()));
  const [contractors, setContractors] = useState<Contractor[]>(() => loadStoredOrSeed('minegov_contractors', SEED_CONTRACTORS));
  const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>(() => loadStoredOrSeed('minegov_compliance', SEED_COMPLIANCE_ITEMS));
  const [inspections, setInspections] = useState<Inspection[]>(() => loadStoredOrSeed('minegov_inspections', generateInspections()));
  const [violations, setViolations] = useState<Violation[]>(() => loadStoredOrSeed('minegov_violations', generateViolations()));
  const [correctiveActions, setCorrectiveActions] = useState<CorrectiveAction[]>(() => loadStoredOrSeed('minegov_corrective', generateCorrectiveActions()));
  const [incidents, setIncidents] = useState<IncidentReport[]>(() => loadStoredOrSeed('minegov_incidents', SEED_INCIDENTS));
  const [readings, setReadings] = useState<EnvironmentalReading[]>(() => loadStoredOrSeed('minegov_readings', generateEnvironmentalReadings()));
  const [documents, setDocuments] = useState<DocumentRecord[]>(() => loadStoredOrSeed('minegov_documents', SEED_DOCUMENTS));
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    try {
      const raw = localStorage.getItem('minegov_audit_logs');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [blockchainBlocks, setBlockchainBlocks] = useState<BlockchainBlock[]>(() => loadStoredOrSeed('minegov_blockchain', SEED_BLOCKCHAIN));
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => loadStoredOrSeed('minegov_notifications', SEED_NOTIFICATIONS));
  const [offlineQueue, setOfflineQueue] = useState<OfflineQueueItem[]>(() => getOfflineQueue());
  const [grievances, setGrievances] = useState<WorkerGrievance[]>(() => loadStoredOrSeed('minegov_grievances', SEED_GRIEVANCES));
  const [financeBudgets, setFinanceBudgets] = useState<FinanceBudget[]>(() => loadStoredOrSeed('minegov_finance', SEED_FINANCE));
  const [coalMovements, setCoalMovements] = useState<CoalMovement[]>(() => loadStoredOrSeed('minegov_movements', SEED_COAL_MOVEMENTS));
  const [fleetVehicles, setFleetVehicles] = useState<FleetVehicle[]>(() => loadStoredOrSeed('minegov_fleet_vehicles', SEED_FLEET_VEHICLES));
  const [fleetDrivers, setFleetDrivers] = useState<TransporterDriver[]>(() => loadStoredOrSeed('minegov_fleet_drivers', SEED_FLEET_DRIVERS));
  const [fleetMaintenance, setFleetMaintenance] = useState<FleetMaintenanceRecord[]>(() => loadStoredOrSeed('minegov_fleet_maintenance', SEED_FLEET_MAINTENANCE));
  const [fuelLogs, setFuelLogs] = useState<FuelLogRecord[]>(() => loadStoredOrSeed('minegov_fuel_logs', SEED_FUEL_LOGS));
  const [logisticsExpenses, setLogisticsExpenses] = useState<LogisticsExpense[]>(() => loadStoredOrSeed('minegov_logistics_expenses', SEED_LOGISTICS_EXPENSES));
  const [routes, setRoutes] = useState<RouteCorridor[]>(() => loadStoredOrSeed('minegov_routes', SEED_ROUTES));
  const [officers, setOfficers] = useState<Officer[]>(() => loadStoredOrSeed('minegov_officers', SEED_OFFICERS));
  const [overtimeRecords, setOvertimeRecords] = useState<OvertimeApprovalRecord[]>(() => loadStoredOrSeed('minegov_overtime', SEED_OVERTIME_RECORDS));
  const [benches, setBenches] = useState<BenchPitRecord[]>(() => loadStoredOrSeed('minegov_benches', SEED_BENCHES));
  const [blastPlans, setBlastPlans] = useState<BlastPlanRecord[]>(() => loadStoredOrSeed('minegov_blast_plans', SEED_BLAST_PLANS));
  const [overburdenRecords, setOverburdenRecords] = useState<OverburdenRecord[]>(() => loadStoredOrSeed('minegov_overburden', SEED_OVERBURDEN));
  const [coalQualityRecords, setCoalQualityRecords] = useState<CoalQualityRecord[]>(() => loadStoredOrSeed('minegov_coal_quality', SEED_COAL_QUALITY));
  const [stockpiles, setStockpiles] = useState<StockpileRecord[]>(() => loadStoredOrSeed('minegov_stockpiles', SEED_STOCKPILES));
  const [operationalDelays, setOperationalDelays] = useState<OperationalDelayRecord[]>(() => loadStoredOrSeed('minegov_delays', SEED_OPERATIONAL_DELAYS));
  const [hemmAssets, setHemmAssets] = useState<HemmAsset[]>(() => loadStoredOrSeed('minegov_hemm_assets', SEED_HEMM_ASSETS));
  const [breakdownTickets, setBreakdownTickets] = useState<BreakdownTicket[]>(() => loadStoredOrSeed('minegov_breakdown_tickets', SEED_BREAKDOWN_TICKETS));
  const [spareParts, setSpareParts] = useState<SparePartItem[]>(() => loadStoredOrSeed('minegov_spare_parts', SEED_SPARE_PARTS));
  const [emergencyCommand, setEmergencyCommand] = useState<EmergencyIncidentCommand>(() => {
    try {
      const raw = localStorage.getItem('minegov_emergency_cmd');
      if (raw) return JSON.parse(raw);
    } catch {}
    return SEED_EMERGENCY_COMMAND;
  });
  const [emergencyDrills, setEmergencyDrills] = useState<EmergencyDrillRecord[]>(() => loadStoredOrSeed('minegov_emergency_drills', SEED_EMERGENCY_DRILLS));
  const [rootCauseAnalyses, setRootCauseAnalyses] = useState<RootCauseAnalysisRecord[]>(() => loadStoredOrSeed('minegov_rca', SEED_ROOT_CAUSE_ANALYSES));
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>(() => loadStoredOrSeed('minegov_approvals', SEED_PENDING_APPROVALS));
  const [dataQualityChecks, setDataQualityChecks] = useState<DataQualityCheckResult[]>(() => loadStoredOrSeed('minegov_data_quality', SEED_DATA_QUALITY_CHECKS));
  const [isOffline, setIsOffline] = useState<boolean>(false);

  // Initialize from LocalStorage or Seed Data
  const loadInitialData = () => {
    const initialized = localStorage.getItem('minegov_initialized_v2');

    if (!initialized) {
      localStorage.setItem('minegov_users', JSON.stringify(SEED_USERS));
      localStorage.setItem('minegov_areas', JSON.stringify(SEED_AREAS));
      localStorage.setItem('minegov_mines', JSON.stringify(SEED_MINES));
      localStorage.setItem('minegov_workers', JSON.stringify(generateWorkers()));
      localStorage.setItem('minegov_contractors', JSON.stringify(SEED_CONTRACTORS));
      localStorage.setItem('minegov_compliance', JSON.stringify(SEED_COMPLIANCE_ITEMS));
      localStorage.setItem('minegov_inspections', JSON.stringify(generateInspections()));
      localStorage.setItem('minegov_violations', JSON.stringify(generateViolations()));
      localStorage.setItem('minegov_corrective', JSON.stringify(generateCorrectiveActions()));
      localStorage.setItem('minegov_incidents', JSON.stringify(SEED_INCIDENTS));
      localStorage.setItem('minegov_readings', JSON.stringify(generateEnvironmentalReadings()));
      localStorage.setItem('minegov_documents', JSON.stringify(SEED_DOCUMENTS));
      localStorage.setItem('minegov_blockchain', JSON.stringify(SEED_BLOCKCHAIN));
      localStorage.setItem('minegov_audit_logs', JSON.stringify([]));
      localStorage.setItem('minegov_notifications', JSON.stringify(SEED_NOTIFICATIONS));
      localStorage.setItem('minegov_grievances', JSON.stringify(SEED_GRIEVANCES));
      localStorage.setItem('minegov_finance', JSON.stringify(SEED_FINANCE));
      localStorage.setItem('minegov_movements', JSON.stringify(SEED_COAL_MOVEMENTS));
      localStorage.setItem('minegov_fleet_vehicles', JSON.stringify(SEED_FLEET_VEHICLES));
      localStorage.setItem('minegov_fleet_drivers', JSON.stringify(SEED_FLEET_DRIVERS));
      localStorage.setItem('minegov_fleet_maintenance', JSON.stringify(SEED_FLEET_MAINTENANCE));
      localStorage.setItem('minegov_fuel_logs', JSON.stringify(SEED_FUEL_LOGS));
      localStorage.setItem('minegov_logistics_expenses', JSON.stringify(SEED_LOGISTICS_EXPENSES));
      localStorage.setItem('minegov_routes', JSON.stringify(SEED_ROUTES));
      localStorage.setItem('minegov_officers', JSON.stringify(SEED_OFFICERS));
      localStorage.setItem('minegov_overtime', JSON.stringify(SEED_OVERTIME_RECORDS));
      localStorage.setItem('minegov_benches', JSON.stringify(SEED_BENCHES));
      localStorage.setItem('minegov_blast_plans', JSON.stringify(SEED_BLAST_PLANS));
      localStorage.setItem('minegov_overburden', JSON.stringify(SEED_OVERBURDEN));
      localStorage.setItem('minegov_coal_quality', JSON.stringify(SEED_COAL_QUALITY));
      localStorage.setItem('minegov_stockpiles', JSON.stringify(SEED_STOCKPILES));
      localStorage.setItem('minegov_delays', JSON.stringify(SEED_OPERATIONAL_DELAYS));
      localStorage.setItem('minegov_hemm_assets', JSON.stringify(SEED_HEMM_ASSETS));
      localStorage.setItem('minegov_breakdown_tickets', JSON.stringify(SEED_BREAKDOWN_TICKETS));
      localStorage.setItem('minegov_spare_parts', JSON.stringify(SEED_SPARE_PARTS));
      localStorage.setItem('minegov_emergency_cmd', JSON.stringify(SEED_EMERGENCY_COMMAND));
      localStorage.setItem('minegov_emergency_drills', JSON.stringify(SEED_EMERGENCY_DRILLS));
      localStorage.setItem('minegov_rca', JSON.stringify(SEED_ROOT_CAUSE_ANALYSES));
      localStorage.setItem('minegov_approvals', JSON.stringify(SEED_PENDING_APPROVALS));
      localStorage.setItem('minegov_data_quality', JSON.stringify(SEED_DATA_QUALITY_CHECKS));
      localStorage.setItem('minegov_initialized_v2', 'true');
    }

    // Sync users with SEED_USERS to ensure demo roles like Transportation Head are always present
    const storedUsersRaw = localStorage.getItem('minegov_users');
    let mergedUsers = SEED_USERS;
    if (storedUsersRaw) {
      try {
        const parsedUsers: User[] = JSON.parse(storedUsersRaw);
        const existingIds = new Set(parsedUsers.map((u) => u.id));
        const missingSeedUsers = SEED_USERS.filter((su) => !existingIds.has(su.id));
        mergedUsers = [...parsedUsers, ...missingSeedUsers];
      } catch {
        mergedUsers = SEED_USERS;
      }
    }
    localStorage.setItem('minegov_users', JSON.stringify(mergedUsers));
    setUsers(mergedUsers);
    setAreas(loadStoredOrSeed('minegov_areas', SEED_AREAS));
    setMines(loadStoredOrSeed('minegov_mines', SEED_MINES));
    setWorkers(loadStoredOrSeed('minegov_workers', generateWorkers()));
    setContractors(loadStoredOrSeed('minegov_contractors', SEED_CONTRACTORS));
    setComplianceItems(loadStoredOrSeed('minegov_compliance', SEED_COMPLIANCE_ITEMS));
    setInspections(loadStoredOrSeed('minegov_inspections', generateInspections()));
    setViolations(loadStoredOrSeed('minegov_violations', generateViolations()));
    setCorrectiveActions(loadStoredOrSeed('minegov_corrective', generateCorrectiveActions()));
    setIncidents(loadStoredOrSeed('minegov_incidents', SEED_INCIDENTS));
    setReadings(loadStoredOrSeed('minegov_readings', generateEnvironmentalReadings()));
    setDocuments(loadStoredOrSeed('minegov_documents', SEED_DOCUMENTS));
    setBlockchainBlocks(loadStoredOrSeed('minegov_blockchain', [SEED_GENESIS_BLOCK]));
    try {
      const storedAuditLogs = localStorage.getItem('minegov_audit_logs');
      setAuditLogs(storedAuditLogs ? JSON.parse(storedAuditLogs) : []);
    } catch {
      setAuditLogs([]);
    }
    setNotifications(loadStoredOrSeed('minegov_notifications', SEED_NOTIFICATIONS));
    setGrievances(loadStoredOrSeed('minegov_grievances', SEED_GRIEVANCES));
    setFinanceBudgets(loadStoredOrSeed('minegov_finance', SEED_FINANCE));
    setCoalMovements(loadStoredOrSeed('minegov_movements', SEED_COAL_MOVEMENTS));
    setFleetVehicles(loadStoredOrSeed('minegov_fleet_vehicles', SEED_FLEET_VEHICLES));
    setFleetDrivers(loadStoredOrSeed('minegov_fleet_drivers', SEED_FLEET_DRIVERS));
    setFleetMaintenance(loadStoredOrSeed('minegov_fleet_maintenance', SEED_FLEET_MAINTENANCE));
    setFuelLogs(loadStoredOrSeed('minegov_fuel_logs', SEED_FUEL_LOGS));
    setLogisticsExpenses(loadStoredOrSeed('minegov_logistics_expenses', SEED_LOGISTICS_EXPENSES));
    setRoutes(loadStoredOrSeed('minegov_routes', SEED_ROUTES));
    setOfficers(loadStoredOrSeed('minegov_officers', SEED_OFFICERS));
    setOvertimeRecords(loadStoredOrSeed('minegov_overtime', SEED_OVERTIME_RECORDS));
    setBenches(loadStoredOrSeed('minegov_benches', SEED_BENCHES));
    setBlastPlans(loadStoredOrSeed('minegov_blast_plans', SEED_BLAST_PLANS));
    setOverburdenRecords(loadStoredOrSeed('minegov_overburden', SEED_OVERBURDEN));
    setCoalQualityRecords(loadStoredOrSeed('minegov_coal_quality', SEED_COAL_QUALITY));
    setStockpiles(loadStoredOrSeed('minegov_stockpiles', SEED_STOCKPILES));
    setOperationalDelays(loadStoredOrSeed('minegov_delays', SEED_OPERATIONAL_DELAYS));
    setHemmAssets(loadStoredOrSeed('minegov_hemm_assets', SEED_HEMM_ASSETS));
    setBreakdownTickets(loadStoredOrSeed('minegov_breakdown_tickets', SEED_BREAKDOWN_TICKETS));
    setSpareParts(loadStoredOrSeed('minegov_spare_parts', SEED_SPARE_PARTS));
    try {
      const emgRaw = localStorage.getItem('minegov_emergency_cmd');
      setEmergencyCommand(emgRaw ? JSON.parse(emgRaw) : SEED_EMERGENCY_COMMAND);
    } catch {
      setEmergencyCommand(SEED_EMERGENCY_COMMAND);
    }
    setEmergencyDrills(loadStoredOrSeed('minegov_emergency_drills', SEED_EMERGENCY_DRILLS));
    setRootCauseAnalyses(loadStoredOrSeed('minegov_rca', SEED_ROOT_CAUSE_ANALYSES));
    setPendingApprovals(loadStoredOrSeed('minegov_approvals', SEED_PENDING_APPROVALS));
    setDataQualityChecks(loadStoredOrSeed('minegov_data_quality', SEED_DATA_QUALITY_CHECKS));

    setOfflineQueue(getOfflineQueue());

    // Restore active session
    const savedUser = sessionStorage.getItem('minegov_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    } else {
      setCurrentUser(SEED_USERS[0]);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const saveEntity = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const login = (email: string, role?: string): boolean => {
    let matched = users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        (!role || u.role.toLowerCase() === role.toLowerCase())
    );
    // Fallback to SEED_USERS if localStorage was out-of-sync
    if (!matched) {
      matched = SEED_USERS.find(
        (u) =>
          u.email.toLowerCase() === email.toLowerCase() &&
          (!role || u.role.toLowerCase() === role.toLowerCase())
      );
      if (matched) {
        setUsers((prev) => {
          if (!prev.some((u) => u.id === matched!.id)) {
            const updated = [...prev, matched!];
            localStorage.setItem('minegov_users', JSON.stringify(updated));
            return updated;
          }
          return prev;
        });
      }
    }
    if (matched) {
      setCurrentUser(matched);
      sessionStorage.setItem('minegov_user', JSON.stringify(matched));
      recordAudit(matched.name, matched.role, 'LOGIN', 'User', matched.id, '', 'Logged In');
      return true;
    }
    return false;
  };

  const logout = () => {
    if (currentUser) {
      recordAudit(currentUser.name, currentUser.role, 'LOGOUT', 'User', currentUser.id, 'Logged In', '');
    }
    setCurrentUser(null);
    sessionStorage.removeItem('minegov_user');
  };

  const quickSwitchUser = (user: User) => {
    setCurrentUser(user);
    sessionStorage.setItem('minegov_user', JSON.stringify(user));
  };

  const resetDemoData = () => {
    localStorage.removeItem('minegov_initialized_v2');
    localStorage.removeItem('minegov_users');
    localStorage.removeItem('minegov_mines');
    localStorage.removeItem('minegov_workers');
    localStorage.removeItem('minegov_movements');
    localStorage.removeItem('minegov_fleet_vehicles');
    localStorage.removeItem('minegov_fleet_drivers');
    localStorage.removeItem('minegov_fleet_maintenance');
    localStorage.removeItem('minegov_fuel_logs');
    localStorage.removeItem('minegov_logistics_expenses');
    localStorage.removeItem('minegov_routes');
    localStorage.removeItem('minegov_officers');
    localStorage.removeItem('minegov_overtime');
    localStorage.removeItem('minegov_benches');
    localStorage.removeItem('minegov_blast_plans');
    localStorage.removeItem('minegov_overburden');
    localStorage.removeItem('minegov_coal_quality');
    localStorage.removeItem('minegov_stockpiles');
    localStorage.removeItem('minegov_delays');
    localStorage.removeItem('minegov_hemm_assets');
    localStorage.removeItem('minegov_breakdown_tickets');
    localStorage.removeItem('minegov_spare_parts');
    localStorage.removeItem('minegov_emergency_cmd');
    localStorage.removeItem('minegov_emergency_drills');
    localStorage.removeItem('minegov_rca');
    localStorage.removeItem('minegov_approvals');
    localStorage.removeItem('minegov_data_quality');
    sessionStorage.removeItem('minegov_user');
    clearOfflineQueue();
    loadInitialData();
  };

  const toggleOfflineMode = () => {
    setIsOffline((prev) => !prev);
  };

  // Record Audit and Anchor Block in Blockchain
  const recordAudit = (
    actor: string,
    role: string,
    action: string,
    entity: string,
    entityId: string,
    prevState: string,
    newState: string
  ) => {
    setBlockchainBlocks((prevBlocks) => {
      const { newLog, newBlock } = recordAuditAndAnchorBlock(
        actor,
        role,
        action,
        entity,
        entityId,
        prevState,
        newState,
        prevBlocks
      );

      setAuditLogs((prevLogs) => {
        const updatedLogs = [newLog, ...prevLogs];
        saveEntity('minegov_audit_logs', updatedLogs);
        return updatedLogs;
      });

      const updatedBlocks = [...prevBlocks, newBlock];
      saveEntity('minegov_blockchain', updatedBlocks);
      return updatedBlocks;
    });
  };

  // Re-calculate dynamic risk scores across mines
  const recalculateMineAndContractorMetrics = (currentViolations: Violation[], currentReadings: EnvironmentalReading[]) => {
    setMines((prevMines) => {
      const updated = prevMines.map((mine) => {
        const active = currentViolations.filter((v) => v.mineId === mine.id && v.status !== 'CLOSED');
        let riskSum = 0;
        active.forEach((v) => (riskSum += v.riskScore));

        const anomalies = currentReadings.filter((r) => r.mineId === mine.id && r.anomaly && r.status === 'PENDING_REVIEW');
        const anomalyScore = anomalies.length * 12;

        let calculatedRisk = active.length > 0 ? Math.round(riskSum / active.length + anomalyScore) : 15 + anomalyScore;
        calculatedRisk = Math.min(Math.max(calculatedRisk, 10), 98);

        const totalMineV = currentViolations.filter((v) => v.mineId === mine.id);
        const closedCount = totalMineV.filter((v) => v.status === 'CLOSED').length;
        const compliance = totalMineV.length > 0 ? Math.round((closedCount / totalMineV.length) * 100) : 95;

        return {
          ...mine,
          riskScore: calculatedRisk,
          complianceScore: compliance,
        };
      });

      saveEntity('minegov_mines', updated);
      return updated;
    });

    setContractors((prevContractors) => {
      const updated = prevContractors.map((c) => {
        const cViolations = currentViolations.filter((v) => v.contractorName === c.name);
        const openC = cViolations.filter((v) => v.status !== 'CLOSED');
        const overdueC = openC.filter((v) => new Date(v.deadline) < new Date());

        let score = Math.round(openC.length * 14 + overdueC.length * 20 + cViolations.filter((v) => v.severity === 'CRITICAL').length * 25);
        score = Math.min(Math.max(score, 8), 95);

        return {
          ...c,
          violationsCount: cViolations.length,
          riskScore: score,
          complianceStatus: (score > 60 ? 'Non-Compliant' : 'Compliant') as 'Compliant' | 'Non-Compliant',
          paymentStatus: (score > 75 ? 'Hold (Violation)' : c.paymentStatus) as Contractor['paymentStatus'],
        };
      });

      saveEntity('minegov_contractors', updated);
      return updated;
    });
  };

  // Submit Violation / Hazard Report
  const submitReport = async (payload: {
    title: string;
    category: string;
    description: string;
    severity: SeverityLevel;
    mineId: string;
    zone: string;
    gps?: string;
    contractorName?: string;
    beforePhotoUrl?: string;
  }) => {
    const violationId = `v-${Date.now()}`;

    if (isOffline) {
      addToOfflineQueue({
        action: 'CREATE_REPORT',
        payload: { ...payload, id: violationId },
      });
      setOfflineQueue(getOfflineQueue());
      return { status: 'OFFLINE_SAVED' as const, id: violationId };
    }

    // Step 1: AI Risk Analysis
    const priorSimilar = violations.filter(
      (v) => v.mineId === payload.mineId && v.category === payload.category && v.status !== 'CLOSED'
    );
    const aiAssessment = calculateAIRiskScore(
      payload.severity,
      priorSimilar.length,
      0,
      priorSimilar.length > 1 ? 75 : 35,
      payload.zone.includes('Electrical') || payload.zone.includes('Shaft') ? 85 : 40,
      payload.category
    );

    // Step 2: Deterministic Rule Engine
    const ruleDecision = evaluateStatutoryRules(payload, aiAssessment);

    const reporter = currentUser ? currentUser.name : 'Field Worker';
    const deadline = new Date(Date.now() + ruleDecision.mandatedSlaHours * 60 * 60 * 1000).toISOString();

    const newViolation: Violation = {
      id: violationId,
      title: payload.title,
      category: payload.category,
      mineId: payload.mineId,
      zone: payload.zone,
      severity: payload.severity,
      status: 'OPEN',
      reporterName: reporter,
      description: payload.description,
      reportedAt: new Date().toISOString(),
      deadline,
      riskScore: aiAssessment.score,
      isEscalated: ruleDecision.automaticEscalationLevel > 0,
      escalationLevel: ruleDecision.automaticEscalationLevel,
      contractorName: payload.contractorName,
      beforePhotoUrl: payload.beforePhotoUrl,
    };

    setViolations((prev) => {
      const updated = [newViolation, ...prev];
      saveEntity('minegov_violations', updated);
      recalculateMineAndContractorMetrics(updated, readings);
      return updated;
    });

    // Step 3: Record Audit & Blockchain Anchor
    recordAudit(reporter, currentUser ? currentUser.role : 'Worker', 'CREATE_VIOLATION', 'Violation', violationId, '', 'OPEN');

    // Step 4: Dispatch Multi-Channel Notifications
    const channels: ('in-app' | 'sms' | 'email' | 'voice' | 'whatsapp')[] = ['in-app'];
    if (payload.severity === 'CRITICAL') {
      channels.push('sms', 'email', 'voice', 'whatsapp');
    } else if (payload.severity === 'HIGH') {
      channels.push('sms', 'email');
    }

    const notifs = await dispatchMultiChannelNotifications({
      title: `Critical Alert: ${newViolation.title}`,
      message: `${newViolation.category} in ${newViolation.zone}. AI Risk Score: ${aiAssessment.score} (${aiAssessment.level}). SLA: ${ruleDecision.mandatedSlaHours}h.`,
      severity: newViolation.severity,
      mineId: newViolation.mineId,
      targetUserIds: users.filter((u) => ruleDecision.notifiedRoleTargets.includes(u.role)).map((u) => u.id),
      channels,
    });

    setNotifications((prev) => {
      const updated = [...notifs, ...prev];
      saveEntity('minegov_notifications', updated);
      return updated;
    });

    return { status: 'SYNCED' as const, id: violationId, riskAssessment: aiAssessment };
  };

  // Assign Violation to Officer
  const assignViolation = (violationId: string, assigneeName: string, deadline: string) => {
    let targetV: Violation | undefined;

    setViolations((prev) => {
      const updated = prev.map((v) => {
        if (v.id === violationId) {
          targetV = v;
          return {
            ...v,
            status: 'ASSIGNED' as const,
            assigneeName,
            assigneeRole: 'Corrective Officer',
            deadline: new Date(deadline).toISOString(),
          };
        }
        return v;
      });
      saveEntity('minegov_violations', updated);
      return updated;
    });

    setCorrectiveActions((prev) => {
      const existing = prev.find((ca) => ca.violationId === violationId);
      if (existing) {
        return prev.map((ca) => (ca.violationId === violationId ? { ...ca, assigneeName, deadline, status: 'Assigned' } : ca));
      }
      const newCA: CorrectiveAction = {
        id: `ca-${Date.now()}`,
        violationId,
        assigneeName,
        department: 'Operations & Maintenance',
        priority: targetV?.severity || 'HIGH',
        deadline: new Date(deadline).toISOString(),
        status: 'Assigned',
        actionDescription: targetV?.description || 'Execute designated remedial procedure',
        createdAt: new Date().toISOString(),
      };
      const updated = [newCA, ...prev];
      saveEntity('minegov_corrective', updated);
      return updated;
    });

    recordAudit(currentUser ? currentUser.name : 'Supervisor', 'Mine Head', 'ASSIGN_OFFICER', 'Violation', violationId, 'OPEN', 'ASSIGNED');

    // Trigger Notification for Assigned Officer
    const assignNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: 'all',
      role: 'Corrective Officer',
      mineId: targetV?.mineId,
      title: `[IN-APP] Task Assigned: ${targetV?.title || violationId}`,
      message: `Assigned to ${assigneeName}. Statutory deadline: ${new Date(deadline).toLocaleDateString()}. Action mandated under CMR 2017.`,
      severity: targetV?.severity || 'HIGH',
      timestamp: new Date().toISOString(),
      read: false,
      channel: 'in-app',
      deliveryStatus: 'Delivered (Simulated)',
    };
    setNotifications((prev) => {
      const updated = [assignNotif, ...prev];
      saveEntity('minegov_notifications', updated);
      return updated;
    });
  };

  // Submit Corrective Action Proof
  const submitCorrectiveAction = (violationId: string, description: string, proofPhotoUrl?: string, notes?: string) => {
    setViolations((prev) => {
      const updated = prev.map((v) => {
        if (v.id === violationId) {
          return {
            ...v,
            status: 'ACTION_SUBMITTED' as const,
            afterPhotoUrl: proofPhotoUrl,
            verificationNotes: notes,
          };
        }
        return v;
      });
      saveEntity('minegov_violations', updated);
      return updated;
    });

    setCorrectiveActions((prev) => {
      const updated = prev.map((ca) => {
        if (ca.violationId === violationId) {
          return {
            ...ca,
            status: 'Evidence Submitted' as const,
            actionDescription: description,
            proofPhotoUrl,
            proofNotes: notes,
            completedAt: new Date().toISOString(),
          };
        }
        return ca;
      });
      saveEntity('minegov_corrective', updated);
      return updated;
    });

    recordAudit(
      currentUser ? currentUser.name : 'Rahul Verma',
      'Corrective Officer',
      'SUBMIT_PROOF',
      'Violation',
      violationId,
      'ASSIGNED',
      'ACTION_SUBMITTED'
    );

    // Trigger Notification for Inspection Officer
    const proofNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: 'all',
      role: 'Inspection Officer',
      title: `[IN-APP] Rectification Evidence Uploaded: ${violationId}`,
      message: `Remediation proof uploaded by ${currentUser ? currentUser.name : 'Corrective Officer'}. Ready for physical verification and sign-off.`,
      severity: 'MEDIUM',
      timestamp: new Date().toISOString(),
      read: false,
      channel: 'in-app',
      deliveryStatus: 'Delivered (Simulated)',
    };
    setNotifications((prev) => {
      const updated = [proofNotif, ...prev];
      saveEntity('minegov_notifications', updated);
      return updated;
    });
  };

  // Verify and Approve / Reject Closure (Supervisor / Inspector)
  const verifyCorrectiveAction = (violationId: string, approved: boolean, notes: string) => {
    const nextStatus = approved ? 'CLOSED' : 'REWORK_REQUIRED';
    const actorName = currentUser ? currentUser.name : 'Inspector Devendra';

    setViolations((prev) => {
      const updated = prev.map((v) => {
        if (v.id === violationId) {
          return {
            ...v,
            status: nextStatus as Violation['status'],
            verificationNotes: notes,
            riskScore: approved ? 0 : v.riskScore,
          };
        }
        return v;
      });
      saveEntity('minegov_violations', updated);
      recalculateMineAndContractorMetrics(updated, readings);
      return updated;
    });

    setCorrectiveActions((prev) => {
      const updated = prev.map((ca) => {
        if (ca.violationId === violationId) {
          return {
            ...ca,
            status: (approved ? 'Approved' : 'Rework Required') as CorrectiveAction['status'],
            verifiedAt: new Date().toISOString(),
            proofNotes: notes,
          };
        }
        return ca;
      });
      saveEntity('minegov_corrective', updated);
      return updated;
    });

    recordAudit(
      actorName,
      'Inspection Officer',
      approved ? 'VERIFY_APPROVE' : 'VERIFY_REJECT',
      'Violation',
      violationId,
      'ACTION_SUBMITTED',
      nextStatus
    );

    // Trigger Closure / Rework Notification
    const closureNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: 'all',
      role: 'Coal Mine Manager',
      title: approved ? `[BLOCKCHAIN] Statutory Closure Approved: ${violationId}` : `[IN-APP] Action Rework Demanded: ${violationId}`,
      message: approved
        ? `Violation ${violationId} verified and permanently closed on cryptographic ledger. Hazard neutralized.`
        : `Closure rejected by Inspector. Rework demanded: "${notes}". Escalation clock active.`,
      severity: approved ? 'LOW' : 'CRITICAL',
      timestamp: new Date().toISOString(),
      read: false,
      channel: 'in-app',
      deliveryStatus: 'Delivered (Simulated)',
    };
    setNotifications((prev) => {
      const updated = [closureNotif, ...prev];
      saveEntity('minegov_notifications', updated);
      return updated;
    });
  };

  // Manual Escalation
  const triggerManualEscalation = (violationId: string) => {
    setViolations((prev) => {
      const updated = prev.map((v) => {
        if (v.id === violationId) {
          const nextLevel = Math.min(v.escalationLevel + 1, 3);
          recordAudit('Escalation Controller', 'System', 'ESCALATION_TRIGGER', 'Violation', violationId, `L${v.escalationLevel}`, `L${nextLevel}`);
          return {
            ...v,
            isEscalated: true,
            escalationLevel: nextLevel,
            riskScore: Math.min(v.riskScore + 8, 100),
          };
        }
        return v;
      });
      saveEntity('minegov_violations', updated);
      recalculateMineAndContractorMetrics(updated, readings);
      return updated;
    });
  };

  // Add Compliance Item
  const addComplianceItem = (item: Omit<ComplianceItem, 'id'>) => {
    const newItem: ComplianceItem = {
      ...item,
      id: `comp-${Date.now()}`,
    };
    setComplianceItems((prev) => {
      const updated = [newItem, ...prev];
      saveEntity('minegov_compliance', updated);
      return updated;
    });
    recordAudit(currentUser ? currentUser.name : 'Officer', 'Safety Officer', 'CREATE_COMPLIANCE', 'ComplianceItem', newItem.id, '', 'ACTIVE');
  };

  const updateComplianceStatus = (id: string, status: ComplianceItem['status']) => {
    let targetItem: ComplianceItem | undefined;
    setComplianceItems((prev) => {
      const updated = prev.map((c) => {
        if (c.id === id) {
          targetItem = c;
          return { ...c, status };
        }
        return c;
      });
      saveEntity('minegov_compliance', updated);
      return updated;
    });

    if (targetItem && (status === 'Violation' || status === 'Overdue')) {
      const actorName = currentUser ? currentUser.name : 'Statutory Compliance Auditor';
      const actorRole = currentUser ? currentUser.role : 'Safety Officer';
      const violationId = `v-comp-${Date.now()}`;
      const sev: SeverityLevel = targetItem.severity === 'CRITICAL' ? 'CRITICAL' : 'HIGH';

      // 1. Automatically generate statutory violation record
      const newV: Violation = {
        id: violationId,
        title: `Statutory Mandate Breach: ${targetItem.requirement}`,
        category: 'Statutory Compliance',
        mineId: 'm1',
        zone: 'All Operational Sectors',
        severity: sev,
        status: 'OPEN',
        reporterName: actorName,
        description: `Statutory mandate "${targetItem.requirement}" (${targetItem.regulationCitation}) marked as ${status}. Responsible: ${targetItem.responsibleOfficer} (${targetItem.responsibleDepartment}). Immediate corrective remediation mandatory under DGMS & CMR 2017.`,
        reportedAt: new Date().toISOString(),
        deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        riskScore: 84,
        isEscalated: true,
        escalationLevel: 1,
      };

      setViolations((prev) => {
        const updated = [newV, ...prev];
        saveEntity('minegov_violations', updated);
        return updated;
      });

      // 2. Automatically spawn assigned Corrective Action
      const newCA: CorrectiveAction = {
        id: `ca-comp-${Date.now()}`,
        violationId,
        assigneeName: targetItem.responsibleOfficer || 'Sunil Patil',
        department: targetItem.responsibleDepartment || 'Safety & Hazard Control',
        priority: sev,
        deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        status: 'Assigned',
        actionDescription: `Statutory remediation order for ${targetItem.regulationCitation}: "${targetItem.requirement}". File compliance evidence and schedule inspection verification.`,
        createdAt: new Date().toISOString(),
      };

      setCorrectiveActions((prev) => {
        const updated = [newCA, ...prev];
        saveEntity('minegov_corrective', updated);
        return updated;
      });

      // 3. Dispatch Alert Notification
      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        userId: 'all',
        role: 'Safety Officer',
        mineId: 'm1',
        title: `STATUTORY ESCALATION: ${targetItem.regulationCitation} (${status})`,
        message: `Mandate "${targetItem.requirement}" breached. Corrective Action ${newCA.id} automatically assigned to ${targetItem.responsibleOfficer}.`,
        severity: sev,
        timestamp: new Date().toISOString(),
        read: false,
      };

      setNotifications((prev) => {
        const updated = [newNotif, ...prev];
        saveEntity('minegov_notifications', updated);
        return updated;
      });

      recordAudit(actorName, actorRole, 'COMPLIANCE_ESCALATION', 'ComplianceItem', id, targetItem.status, status);
    } else if (targetItem) {
      recordAudit(
        currentUser ? currentUser.name : 'Officer',
        currentUser ? currentUser.role : 'Safety Officer',
        'UPDATE_COMPLIANCE_STATUS',
        'ComplianceItem',
        id,
        targetItem.status,
        status
      );
    }
  };

  // Create Inspection
  const createInspection = (inspection: Omit<Inspection, 'id'>) => {
    const newIns: Inspection = {
      ...inspection,
      id: `ins-${Date.now()}`,
    };
    setInspections((prev) => {
      const updated = [newIns, ...prev];
      saveEntity('minegov_inspections', updated);
      return updated;
    });
    recordAudit(currentUser ? currentUser.name : 'Inspector', 'Inspection Officer', 'CREATE_INSPECTION', 'Inspection', newIns.id, '', 'SUBMITTED');
  };

  // Telemetry ingestion
  const addEnvironmentalReading = (mineId: string, parameter: EnvironmentalReading['parameter'], value: number) => {
    const thresholdMap = {
      'Air Quality (PM2.5)': 150,
      'Air Quality (PM10)': 300,
      'Water pH': 8.5,
      'Coal Dust Level': 2.0,
      'Methane Level (CH4)': 1.25,
      'Noise Level': 85,
    };
    const unitMap = {
      'Air Quality (PM2.5)': 'µg/m³',
      'Air Quality (PM10)': 'µg/m³',
      'Water pH': 'pH',
      'Coal Dust Level': 'mg/m³',
      'Methane Level (CH4)': '%',
      'Noise Level': 'dB',
    };

    const threshold = thresholdMap[parameter] || 100;
    const unit = unitMap[parameter] || '';
    const isAnomaly = parameter === 'Water pH' ? value < 6.0 || value > 8.5 : value > threshold;

    const newReading: EnvironmentalReading = {
      id: `env-${Date.now()}`,
      mineId,
      parameter,
      value,
      unit,
      threshold,
      timestamp: new Date().toISOString(),
      anomaly: isAnomaly,
      status: isAnomaly ? 'PENDING_REVIEW' : 'REVIEWED_OK',
    };

    setReadings((prev) => {
      const updated = [newReading, ...prev].slice(0, 200);
      saveEntity('minegov_readings', updated);
      recalculateMineAndContractorMetrics(violations, updated);
      return updated;
    });

    if (isAnomaly) {
      recordAudit('IoT Ingestion Service', 'System', 'ANOMALY_TRIGGER', 'EnvironmentalReading', newReading.id, 'Normal', 'Anomaly');
    }
  };

  // -------------------------------------------------------------
  // TRANSPORTATION & COAL LOGISTICS WORKFLOW METHODS
  // -------------------------------------------------------------
  const createCoalMovement = async (payload: Omit<CoalMovement, 'id' | 'status'>): Promise<string> => {
    const movementId = `CM-2026-${1000 + coalMovements.length + 1}`;
    const newMovement: CoalMovement = {
      ...payload,
      id: movementId,
      status: 'DRAFT',
    };

    setCoalMovements((prev) => {
      const updated = [newMovement, ...prev];
      saveEntity('minegov_movements', updated);
      return updated;
    });

    recordAudit(
      currentUser ? currentUser.name : 'Logistics Officer',
      currentUser ? currentUser.role : 'Transportation Head',
      'CREATE_COAL_MOVEMENT',
      'CoalMovement',
      movementId,
      '',
      'DRAFT'
    );

    return movementId;
  };

  const dispatchCoalMovement = (movementId: string) => {
    const target = coalMovements.find((m) => m.id === movementId);
    if (!target) return;

    setCoalMovements((prev) => {
      const updated = prev.map((m) =>
        m.id === movementId ? { ...m, status: 'IN_TRANSIT' as const } : m
      );
      saveEntity('minegov_movements', updated);
      return updated;
    });

    // Update vehicle to on_trip
    setFleetVehicles((prev) => {
      const updated = prev.map((v) =>
        v.id === target.vehicleId ? { ...v, status: 'on_trip' as const } : v
      );
      saveEntity('minegov_fleet_vehicles', updated);
      return updated;
    });

    // Update driver to on_trip
    setFleetDrivers((prev) => {
      const updated = prev.map((d) =>
        d.id === target.driverId ? { ...d, status: 'on_trip' as const, assignedVehicleId: target.vehicleId } : d
      );
      saveEntity('minegov_fleet_drivers', updated);
      return updated;
    });

    recordAudit(
      currentUser ? currentUser.name : 'Weighbridge Incharge',
      currentUser ? currentUser.role : 'Transportation Head',
      'DISPATCH_COAL_MOVEMENT',
      'CoalMovement',
      movementId,
      target.status,
      'IN_TRANSIT'
    );
  };

  const recordWeighbridgeReceipt = (
    movementId: string,
    receivedGrossTonnes: number,
    receivedTareTonnes: number,
    sealIntact: boolean,
    discrepancyReason?: string
  ) => {
    const target = coalMovements.find((m) => m.id === movementId);
    if (!target) return;

    const receivedNet = Number((receivedGrossTonnes - receivedTareTonnes).toFixed(2));
    const variance = Number((target.dispatchedNetTonnes - receivedNet).toFixed(2));
    const variancePercent = Number(((variance / target.dispatchedNetTonnes) * 100).toFixed(2));
    const isDiscrepancy = variance > target.transitLossAllowanceTonnes || !sealIntact;

    const nextStatus = isDiscrepancy ? ('DISCREPANCY_FLAGGED' as const) : ('RECONCILED' as const);
    const actorName = currentUser ? currentUser.name : 'Receiving Weighbridge Officer';

    // 1. Update Coal Movement
    setCoalMovements((prev) => {
      const updated = prev.map((m) => {
        if (m.id === movementId) {
          return {
            ...m,
            receivedTime: new Date().toISOString(),
            receivedTareTonnes,
            receivedGrossTonnes,
            receivedNetTonnes: receivedNet,
            weightDiscrepancyTonnes: variance,
            weightDiscrepancyPercent: variancePercent,
            sealIntact,
            discrepancyReason,
            status: nextStatus,
            riskScore: isDiscrepancy ? 85 : 12,
          };
        }
        return m;
      });
      saveEntity('minegov_movements', updated);
      return updated;
    });

    // 2. Restore vehicle & driver to available
    setFleetVehicles((prev) => {
      const updated = prev.map((v) =>
        v.id === target.vehicleId && v.status !== 'retired' ? { ...v, status: 'idle' as const } : v
      );
      saveEntity('minegov_fleet_vehicles', updated);
      return updated;
    });

    setFleetDrivers((prev) => {
      const updated = prev.map((d) =>
        d.id === target.driverId
          ? { ...d, status: 'off_duty' as const, assignedVehicleId: undefined, totalTrips: d.totalTrips + 1 }
          : d
      );
      saveEntity('minegov_fleet_drivers', updated);
      return updated;
    });

    // 3. If Discrepancy, trigger AI Risk & CAPA Violation
    if (isDiscrepancy) {
      const violationId = `v-disp-${Date.now()}`;
      const sev: SeverityLevel = variance >= 1.0 || !sealIntact ? 'CRITICAL' : 'HIGH';

      const newV: Violation = {
        id: violationId,
        title: `Coal Transit Shortage Discrepancy: ${movementId} (-${variance}t)`,
        category: 'Coal Transit & Pilferage',
        mineId: target.originMineId,
        zone: target.loadingPoint,
        severity: sev,
        status: 'OPEN',
        reporterName: actorName,
        description:
          discrepancyReason ||
          `Net shortage of ${variance} MT detected at receipt weighbridge. Dispatched: ${target.dispatchedNetTonnes} MT, Received: ${receivedNet} MT. Permissible loss: ${target.transitLossAllowanceTonnes} MT. Tamper Seal: ${
            sealIntact ? 'Intact' : 'BROKEN'
          }.`,
        reportedAt: new Date().toISOString(),
        deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        riskScore: 88,
        isEscalated: true,
        escalationLevel: 1,
        contractorName: target.transporterName,
      };

      setViolations((prev) => {
        const updated = [newV, ...prev];
        saveEntity('minegov_violations', updated);
        return updated;
      });

      // Spawn Corrective Action
      const newCA: CorrectiveAction = {
        id: `ca-disp-${Date.now()}`,
        violationId,
        assigneeName: 'Vikramaditya Rao',
        department: 'Transportation & Logistics',
        priority: sev,
        deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        status: 'Assigned',
        actionDescription: `Statutory investigation of coal shortage for movement ${movementId}. Debrief driver ${target.driverName}, recalibrate weighbridge tare, and cross-examine GPS route corridor.`,
        createdAt: new Date().toISOString(),
      };

      setCorrectiveActions((prev) => {
        const updated = [newCA, ...prev];
        saveEntity('minegov_corrective', updated);
        return updated;
      });

      // Notification
      const notif: NotificationItem = {
        id: `notif-${Date.now()}`,
        userId: 'all',
        role: 'Transportation Head',
        mineId: target.originMineId,
        title: `CRITICAL: Coal Pilferage/Shortage Flagged (${movementId})`,
        message: `Discrepancy of -${variance} MT (-${variancePercent}%) detected for ${target.transporterName}. Tamper seal: ${
          sealIntact ? 'Intact' : 'TAMPERED'
        }. CAPA action initiated under CMR 2017.`,
        severity: sev,
        timestamp: new Date().toISOString(),
        read: false,
        channel: 'in-app',
        deliveryStatus: 'Delivered (Simulated)',
      };

      setNotifications((prev) => {
        const updated = [notif, ...prev];
        saveEntity('minegov_notifications', updated);
        return updated;
      });

      // Blockchain audit anchor
      recordAudit(
        actorName,
        'Weighbridge Officer',
        'DISCREPANCY_FLAGGED',
        'CoalMovement',
        movementId,
        target.status,
        'DISCREPANCY_FLAGGED'
      );
    } else {
      recordAudit(
        actorName,
        'Weighbridge Officer',
        'RECONCILE_SUCCESS',
        'CoalMovement',
        movementId,
        target.status,
        'RECONCILED'
      );
    }
  };

  const reconcileCoalMovement = (movementId: string) => {
    setCoalMovements((prev) => {
      const updated = prev.map((m) =>
        m.id === movementId ? { ...m, status: 'RECONCILED' as const } : m
      );
      saveEntity('minegov_movements', updated);
      return updated;
    });
    recordAudit(
      currentUser ? currentUser.name : 'Supervisor',
      'Transportation Head',
      'MANUAL_RECONCILE',
      'CoalMovement',
      movementId,
      'RECEIVED',
      'RECONCILED'
    );
  };

  const cancelCoalMovement = (movementId: string) => {
    const target = coalMovements.find((m) => m.id === movementId);
    if (!target) return;

    setCoalMovements((prev) => {
      const updated = prev.map((m) =>
        m.id === movementId ? { ...m, status: 'CANCELLED' as const } : m
      );
      saveEntity('minegov_movements', updated);
      return updated;
    });

    if (target.status === 'IN_TRANSIT' || target.status === 'DISPATCHED') {
      setFleetVehicles((prev) => {
        const updated = prev.map((v) =>
          v.id === target.vehicleId && v.status !== 'retired' ? { ...v, status: 'idle' as const } : v
        );
        saveEntity('minegov_fleet_vehicles', updated);
        return updated;
      });

      setFleetDrivers((prev) => {
        const updated = prev.map((d) =>
          d.id === target.driverId ? { ...d, status: 'off_duty' as const, assignedVehicleId: undefined } : d
        );
        saveEntity('minegov_fleet_drivers', updated);
        return updated;
      });
    }

    recordAudit(
      currentUser ? currentUser.name : 'Officer',
      'Transportation Head',
      'CANCEL_MOVEMENT',
      'CoalMovement',
      movementId,
      target.status,
      'CANCELLED'
    );
  };

  const addFleetVehicle = (vehicle: Omit<FleetVehicle, 'id'>) => {
    setFleetVehicles((prev) => {
      const base = prev && prev.length > 0 ? prev : SEED_FLEET_VEHICLES;
      const id = `V-${300 + base.length + 1}`;
      const newV: FleetVehicle = { ...vehicle, id };
      const updated = [newV, ...base];
      saveEntity('minegov_fleet_vehicles', updated);
      recordAudit(currentUser ? currentUser.name : 'Fleet Manager', 'Transportation Head', 'ADD_VEHICLE', 'FleetVehicle', id, '', 'ACTIVE');
      return updated;
    });
  };

  const updateVehicleStatus = (vehicleId: string, status: FleetVehicle['status']) => {
    setFleetVehicles((prev) => {
      const updated = prev.map((v) => (v.id === vehicleId ? { ...v, status } : v));
      saveEntity('minegov_fleet_vehicles', updated);
      return updated;
    });
  };

  const addFleetDriver = (driver: Omit<TransporterDriver, 'id'>) => {
    setFleetDrivers((prev) => {
      const base = prev && prev.length > 0 ? prev : SEED_FLEET_DRIVERS;
      const id = `D-${500 + base.length + 1}`;
      const newD: TransporterDriver = { ...driver, id };
      const updated = [newD, ...base];
      saveEntity('minegov_fleet_drivers', updated);
      recordAudit(currentUser ? currentUser.name : 'HR Transport', 'Transportation Head', 'ADD_DRIVER', 'TransporterDriver', id, '', 'OFF_DUTY');
      return updated;
    });
  };

  const scheduleFleetMaintenance = (record: Omit<FleetMaintenanceRecord, 'id'>) => {
    let createdRecord: FleetMaintenanceRecord | undefined;
    setFleetMaintenance((prev) => {
      const base = prev && prev.length > 0 ? prev : SEED_FLEET_MAINTENANCE;
      const id = `MNT-${4000 + base.length + 1}`;
      const newM: FleetMaintenanceRecord = { ...record, id };
      createdRecord = newM;
      const updated = [newM, ...base];
      saveEntity('minegov_fleet_maintenance', updated);
      return updated;
    });

    if (createdRecord) {
      const rec = createdRecord as FleetMaintenanceRecord;
      if (rec.targetType === 'Vehicle' && (rec.status === 'in_progress' || rec.status === 'scheduled')) {
        updateVehicleStatus(rec.targetId, 'maintenance');
      }

      recordAudit(
        currentUser ? currentUser.name : 'Maintenance Head',
        'Transportation Head',
        'SCHEDULE_MAINTENANCE',
        'FleetMaintenanceRecord',
        rec.id,
        '',
        rec.status
      );
    }
  };

  const completeFleetMaintenance = (recordId: string) => {
    let targetM: FleetMaintenanceRecord | undefined;
    setFleetMaintenance((prev) => {
      const updated = prev.map((m) => {
        if (m.id === recordId) {
          targetM = m;
          return { ...m, status: 'completed' as const, completedDate: new Date().toISOString().split('T')[0] };
        }
        return m;
      });
      saveEntity('minegov_fleet_maintenance', updated);
      return updated;
    });

    if (targetM?.targetType === 'Vehicle') {
      updateVehicleStatus(targetM.targetId, 'idle');
    }

    recordAudit(
      currentUser ? currentUser.name : 'Engineer',
      'Transportation Head',
      'COMPLETE_MAINTENANCE',
      'FleetMaintenanceRecord',
      recordId,
      'IN_PROGRESS',
      'COMPLETED'
    );
  };

  const logFuelConsumption = (fuelLog: Omit<FuelLogRecord, 'id'>) => {
    const id = `FL-${600 + fuelLogs.length + 1}`;
    const newFL: FuelLogRecord = { ...fuelLog, id };
    setFuelLogs((prev) => {
      const updated = [newFL, ...prev];
      saveEntity('minegov_fuel_logs', updated);
      return updated;
    });
  };

  const addLogisticsExpense = (expense: Omit<LogisticsExpense, 'id'>) => {
    const id = `EXP-${800 + logisticsExpenses.length + 1}`;
    const newE: LogisticsExpense = { ...expense, id };
    setLogisticsExpenses((prev) => {
      const updated = [newE, ...prev];
      saveEntity('minegov_logistics_expenses', updated);
      return updated;
    });
  };

  const approveLogisticsExpense = (expenseId: string) => {
    setLogisticsExpenses((prev) => {
      const updated = prev.map((e) => (e.id === expenseId ? { ...e, status: 'approved' as const } : e));
      saveEntity('minegov_logistics_expenses', updated);
      return updated;
    });
  };

  // -------------------------------------------------------------
  // MASTER DATA MANAGEMENT & WORKFORCE OVERTIME
  // -------------------------------------------------------------
  const addMine = (mine: Omit<Mine, 'id'>) => {
    setMines((prev) => {
      const base = prev && prev.length > 0 ? prev : SEED_MINES;
      const id = `m${base.length + 1}`;
      const newMine: Mine = { ...mine, id };
      const updated = [...base, newMine];
      saveEntity('minegov_mines', updated);
      recordAudit(currentUser ? currentUser.name : 'Administrator', currentUser ? currentUser.role : 'Coal Mine Manager', 'CREATE_MINE', 'Mine', id, '', 'ACTIVE');
      return updated;
    });
  };

  const updateMine = (mineId: string, updates: Partial<Mine>) => {
    setMines((prev) => {
      const updated = prev.map((m) => (m.id === mineId ? { ...m, ...updates } : m));
      saveEntity('minegov_mines', updated);
      return updated;
    });
    recordAudit(currentUser ? currentUser.name : 'Administrator', currentUser ? currentUser.role : 'Coal Mine Manager', 'UPDATE_MINE', 'Mine', mineId, 'ACTIVE', 'ACTIVE');
  };

  const addWorker = (worker: Omit<Worker, 'id'>) => {
    setWorkers((prev) => {
      const base = prev && prev.length > 0 ? prev : generateWorkers();
      const id = `w${base.length + 1}`;
      const newWorker: Worker = { ...worker, id };
      const updated = [...base, newWorker];
      saveEntity('minegov_workers', updated);
      recordAudit(currentUser ? currentUser.name : 'Workforce Officer', currentUser ? currentUser.role : 'Workforce Head', 'REGISTER_WORKER', 'Worker', id, '', 'ACTIVE');
      return updated;
    });
  };

  const updateWorker = (workerId: string, updates: Partial<Worker>) => {
    setWorkers((prev) => {
      const updated = prev.map((w) => (w.id === workerId ? { ...w, ...updates } : w));
      saveEntity('minegov_workers', updated);
      return updated;
    });
    recordAudit(currentUser ? currentUser.name : 'Workforce Officer', currentUser ? currentUser.role : 'Workforce Head', 'UPDATE_WORKER', 'Worker', workerId, 'ACTIVE', 'UPDATED');
  };

  const deleteWorker = (workerId: string) => {
    setWorkers((prev) => {
      const updated = prev.filter((w) => w.id !== workerId);
      saveEntity('minegov_workers', updated);
      return updated;
    });
    recordAudit(currentUser ? currentUser.name : 'Workforce Officer', currentUser ? currentUser.role : 'Workforce Head', 'DELETE_WORKER', 'Worker', workerId, 'ACTIVE', 'DELETED');
  };

  const addOfficer = (officer: Omit<Officer, 'id'>) => {
    setOfficers((prev) => {
      const base = prev && prev.length > 0 ? prev : SEED_OFFICERS;
      const id = `off-${String(base.length + 1).padStart(2, '0')}`;
      const newOfficer: Officer = { ...officer, id };
      const updated = [...base, newOfficer];
      saveEntity('minegov_officers', updated);
      recordAudit(currentUser ? currentUser.name : 'Administrator', currentUser ? currentUser.role : 'Coal Mine Manager', 'CREATE_OFFICER', 'Officer', id, '', 'ACTIVE');
      return updated;
    });
  };

  const updateOfficer = (officerId: string, updates: Partial<Officer>) => {
    setOfficers((prev) => {
      const updated = prev.map((o) => (o.id === officerId ? { ...o, ...updates } : o));
      saveEntity('minegov_officers', updated);
      return updated;
    });
    recordAudit(currentUser ? currentUser.name : 'Administrator', currentUser ? currentUser.role : 'Coal Mine Manager', 'UPDATE_OFFICER', 'Officer', officerId, 'ACTIVE', 'UPDATED');
  };

  const addRoute = (route: Omit<RouteCorridor, 'id'>) => {
    setRoutes((prev) => {
      const base = prev && prev.length > 0 ? prev : SEED_ROUTES;
      const id = `COR-${String(base.length + 1).padStart(2, '0')}`;
      const newRoute: RouteCorridor = { ...route, id };
      const updated = [...base, newRoute];
      saveEntity('minegov_routes', updated);
      recordAudit(currentUser ? currentUser.name : 'Transportation Head', 'Transportation Head', 'CREATE_ROUTE', 'RouteCorridor', id, '', 'ACTIVE');
      return updated;
    });
  };

  const updateRoute = (routeId: string, updates: Partial<RouteCorridor>) => {
    setRoutes((prev) => {
      const updated = prev.map((r) => (r.id === routeId ? { ...r, ...updates } : r));
      saveEntity('minegov_routes', updated);
      return updated;
    });
    recordAudit(currentUser ? currentUser.name : 'Transportation Head', 'Transportation Head', 'UPDATE_ROUTE', 'RouteCorridor', routeId, 'ACTIVE', 'UPDATED');
  };

  const approveOvertime = (record: Omit<OvertimeApprovalRecord, 'id' | 'timestamp' | 'status'> & { status?: 'APPROVED' | 'REJECTED' }) => {
    const id = `ot-${Date.now()}`;
    const newRecord: OvertimeApprovalRecord = {
      ...record,
      id,
      timestamp: new Date().toISOString(),
      status: record.status || 'APPROVED',
      approvedAt: record.status === 'REJECTED' ? undefined : new Date().toISOString(),
    };

    setOvertimeRecords((prev) => {
      const updated = [newRecord, ...prev];
      saveEntity('minegov_overtime', updated);
      return updated;
    });

    // Also update worker's overtime status in workforce
    setWorkers((prev) => {
      const updated = prev.map((w) => {
        if (w.id === record.workerId) {
          return {
            ...w,
            overtimeEligible: true,
          };
        }
        return w;
      });
      saveEntity('minegov_workers', updated);
      return updated;
    });

    recordAudit(
      currentUser ? currentUser.name : record.approverName || 'Workforce Head',
      'Workforce Head',
      record.status === 'REJECTED' ? 'REJECT_OVERTIME' : 'APPROVE_OVERTIME',
      'OvertimeApprovalRecord',
      id,
      'PENDING',
      record.status || 'APPROVED'
    );
  };

  // ==========================================
  // OPERATIONAL ACTION HANDLERS
  // ==========================================

  const updateBenchSlopeRisk = (benchId: string, slopeRisk: BenchPitRecord['slopeRisk']) => {
    let targetBench: BenchPitRecord | undefined;
    setBenches((prev) => {
      const updated = prev.map((b) => {
        if (b.benchId === benchId || b.id === benchId) {
          targetBench = { ...b, slopeRisk };
          return targetBench;
        }
        return b;
      });
      saveEntity('minegov_benches', updated);
      return updated;
    });

    if (slopeRisk === 'CRITICAL' || slopeRisk === 'HIGH') {
      const notifId = `notif-${Date.now()}`;
      const newNotif: NotificationItem = {
        id: notifId,
        userId: currentUser?.id || 'all',
        role: 'Safety Officer',
        mineId: targetBench?.mineId,
        title: `CRITICAL SLOPE STABILITY ALERT — Bench ${benchId}`,
        message: `Geotechnical risk elevated to ${slopeRisk} on bench ${benchId}. Restrict haulage traffic and deploy slope regrading.`,
        severity: 'CRITICAL',
        timestamp: new Date().toISOString(),
        read: false,
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }

    recordAudit(
      currentUser ? currentUser.name : 'Geotech Officer',
      currentUser?.role || 'Safety Officer',
      'UPDATE_SLOPE_RISK',
      'BenchPitRecord',
      benchId,
      'ASSESSED',
      slopeRisk
    );
  };

  const approveBlastClearance = (blastId: string) => {
    setBlastPlans((prev) => {
      const updated = prev.map((bp) => {
        if (bp.id === blastId || bp.blastId === blastId) {
          return {
            ...bp,
            preBlastClearanceGiven: true,
            status: 'CLEARANCE_GRANTED' as const,
          };
        }
        return bp;
      });
      saveEntity('minegov_blast_plans', updated);
      return updated;
    });

    recordAudit(
      currentUser ? currentUser.name : 'Blasting Authority',
      'Mine Head',
      'APPROVE_BLAST_CLEARANCE',
      'BlastPlanRecord',
      blastId,
      'PLANNED',
      'CLEARANCE_GRANTED'
    );
  };

  const addCoalQualitySample = (sample: Omit<CoalQualityRecord, 'id'>) => {
    const id = `qual-${Date.now()}`;
    const newSample: CoalQualityRecord = { ...sample, id };
    setCoalQualityRecords((prev) => {
      const updated = [newSample, ...prev];
      saveEntity('minegov_coal_quality', updated);
      return updated;
    });

    recordAudit(
      currentUser ? currentUser.name : 'Quality Analyst',
      'Inspection Officer',
      'LOG_COAL_QUALITY_SAMPLE',
      'CoalQualityRecord',
      id,
      '',
      newSample.coalGrade
    );
  };

  const adjustStockpileSurvey = (stockpileId: string, surveyedTonnes: number) => {
    setStockpiles((prev) => {
      const updated = prev.map((s) => {
        if (s.id === stockpileId || s.stockpileCode === stockpileId) {
          const disc = Number((s.currentQuantityTonnes - surveyedTonnes).toFixed(2));
          return {
            ...s,
            surveyedQuantityTonnes: surveyedTonnes,
            discrepancyTonnes: disc,
            status: Math.abs(disc) > 1000 ? ('SURVEY_DISCREPANCY' as const) : ('OPTIMAL' as const),
            lastLidarSurveyDate: new Date().toISOString().split('T')[0],
          };
        }
        return s;
      });
      saveEntity('minegov_stockpiles', updated);
      return updated;
    });

    recordAudit(
      currentUser ? currentUser.name : 'Surveyor',
      'Inspection Officer',
      'LIDAR_SURVEY_CALIBRATION',
      'StockpileRecord',
      stockpileId,
      '',
      `${surveyedTonnes} MT`
    );
  };

  const reportHemmBreakdown = (ticket: Omit<BreakdownTicket, 'id' | 'ticketCode' | 'status'>) => {
    const id = `tkt-${Date.now()}`;
    const ticketCode = `WO-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket: BreakdownTicket = {
      ...ticket,
      id,
      ticketCode,
      status: 'REPORTED',
    };

    setBreakdownTickets((prev) => {
      const updated = [newTicket, ...prev];
      saveEntity('minegov_breakdown_tickets', updated);
      return updated;
    });

    // Update asset status to BREAKDOWN
    setHemmAssets((prev) => {
      const updated = prev.map((a) =>
        a.id === ticket.assetId ? { ...a, status: 'BREAKDOWN' as const } : a
      );
      saveEntity('minegov_hemm_assets', updated);
      return updated;
    });

    recordAudit(
      currentUser ? currentUser.name : 'Operator',
      currentUser?.role || 'Worker',
      'REPORT_HEMM_BREAKDOWN',
      'BreakdownTicket',
      id,
      'AVAILABLE',
      'BREAKDOWN'
    );
  };

  const resolveBreakdownRepair = (ticketId: string, sparePartId?: string) => {
    let targetTicket: BreakdownTicket | undefined;
    setBreakdownTickets((prev) => {
      const updated = prev.map((t) => {
        if (t.id === ticketId || t.ticketCode === ticketId) {
          targetTicket = { ...t, status: 'AVAILABLE' as const, resolvedAt: new Date().toISOString() };
          return targetTicket;
        }
        return t;
      });
      saveEntity('minegov_breakdown_tickets', updated);
      return updated;
    });

    if (targetTicket) {
      setHemmAssets((prev) => {
        const updated = prev.map((a) =>
          a.id === targetTicket?.assetId ? { ...a, status: 'AVAILABLE' as const } : a
        );
        saveEntity('minegov_hemm_assets', updated);
        return updated;
      });
    }

    if (sparePartId) {
      setSpareParts((prev) => {
        const updated = prev.map((p) => {
          if (p.id === sparePartId) {
            const nextStock = Math.max(0, p.currentStock - 1);
            return {
              ...p,
              currentStock: nextStock,
              reorderStatus: nextStock <= p.minStockLevel ? ('CRITICAL_LOW' as const) : p.reorderStatus,
            };
          }
          return p;
        });
        saveEntity('minegov_spare_parts', updated);
        return updated;
      });
    }

    recordAudit(
      currentUser ? currentUser.name : 'Workshop Superintendent',
      'Mine Head',
      'RESOLVE_BREAKDOWN_REPAIR',
      'BreakdownTicket',
      ticketId,
      'REPAIRING',
      'AVAILABLE'
    );
  };

  const reorderSparePart = (partId: string, quantity: number) => {
    setSpareParts((prev) => {
      const updated = prev.map((p) => {
        if (p.id === partId) {
          const nextStock = p.currentStock + quantity;
          return {
            ...p,
            currentStock: nextStock,
            reorderStatus: 'ADEQUATE' as const,
          };
        }
        return p;
      });
      saveEntity('minegov_spare_parts', updated);
      return updated;
    });

    recordAudit(
      currentUser ? currentUser.name : 'Procurement Officer',
      'Finance Officer',
      'REORDER_SPARE_PART',
      'SparePartItem',
      partId,
      '',
      `+${quantity} Units`
    );
  };

  const triggerEmergencySiren = (mineId: string, emergencyType: EmergencyIncidentCommand['emergencyType']) => {
    const updatedCommand: EmergencyIncidentCommand = {
      ...emergencyCommand,
      mineId,
      emergencyType,
      status: 'SIREN_ACTIVE',
      sirenActivated: true,
      rescueTeamDeployed: true,
      reportedAt: new Date().toISOString(),
    };
    setEmergencyCommand(updatedCommand);
    saveEntity('minegov_emergency_cmd', updatedCommand);

    const newNotif: NotificationItem = {
      id: `emg-notif-${Date.now()}`,
      userId: 'all',
      role: 'All Mine Officers',
      mineId,
      title: `🚨 EMERGENCY ALARM TRIGGERED — ${emergencyType}`,
      message: `Emergency response siren active. All teams initiate immediate muster roll-call and site evacuation.`,
      severity: 'CRITICAL',
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    recordAudit(
      currentUser ? currentUser.name : 'Incident Commander',
      'Mine Head',
      'TRIGGER_EMERGENCY_SIREN',
      'EmergencyIncidentCommand',
      updatedCommand.id,
      'STANDBY',
      'SIREN_ACTIVE'
    );
  };

  const updateMusterRollCall = (_mineId: string, accountedDelta: number) => {
    setEmergencyCommand((prev) => {
      const newAccounted = Math.min(prev.totalWorkersOnSite, Math.max(0, prev.accountedWorkers + accountedDelta));
      const newMissing = Math.max(0, prev.totalWorkersOnSite - newAccounted);
      const updated: EmergencyIncidentCommand = {
        ...prev,
        accountedWorkers: newAccounted,
        unconfirmedMissingWorkers: newMissing,
        status: newMissing === 0 ? 'CONTAINED' : 'MUSTER_ROLL_CALL',
      };
      saveEntity('minegov_emergency_cmd', updated);
      return updated;
    });
  };

  const saveRootCauseAnalysis = (rca: Omit<RootCauseAnalysisRecord, 'id'>) => {
    const id = `rca-${Date.now()}`;
    const newRca: RootCauseAnalysisRecord = { ...rca, id };
    setRootCauseAnalyses((prev) => {
      const updated = [newRca, ...prev];
      saveEntity('minegov_rca', updated);
      return updated;
    });

    recordAudit(
      currentUser ? currentUser.name : 'Safety Investigator',
      'Safety Officer',
      'RECORD_ROOT_CAUSE_ANALYSIS',
      'RootCauseAnalysisRecord',
      id,
      '',
      newRca.rootCauseSummary
    );
  };

  const resolvePendingApproval = (approvalId: string, action: 'APPROVED' | 'REJECTED', notes?: string) => {
    setPendingApprovals((prev) => {
      const updated = prev.map((appr) => {
        if (appr.id === approvalId) {
          return {
            ...appr,
            status: action,
            reviewedBy: currentUser?.name || 'Authorized Officer',
            reviewedAt: new Date().toISOString(),
            decisionNotes: notes,
          };
        }
        return appr;
      });
      saveEntity('minegov_approvals', updated);
      return updated;
    });

    recordAudit(
      currentUser ? currentUser.name : 'Authorized Signatory',
      currentUser?.role || 'Coal Mine Manager',
      action === 'APPROVED' ? 'APPROVE_REQUEST' : 'REJECT_REQUEST',
      'PendingApproval',
      approvalId,
      'PENDING',
      action
    );
  };

  const runDataQualityAudit = () => {
    const checks = [...SEED_DATA_QUALITY_CHECKS];
    const score = 96;
    setDataQualityChecks(checks);
    return { score, checks };
  };

  // OCR Document Processing
  const runOcrOnDocument = async (docId: string): Promise<DocumentRecord> => {
    const targetDoc = documents.find((d) => d.id === docId);
    const result = await processDocumentWithOCR(targetDoc?.title || 'Document.pdf', targetDoc?.category || 'License');

    const updatedDoc: DocumentRecord = {
      ...(targetDoc || {
        id: docId,
        title: 'Scanned Document',
        category: 'License',
        expiryDate: result.extractedFields.expiryDate,
        ownerName: 'Mine Head',
        fileUrl: '',
        status: 'VALID',
      }),
      ocrExtractedText: result.rawText,
      extractedFields: result.extractedFields,
      status: result.extractedFields.isExpired ? 'EXPIRED' : 'VALID',
    };

    setDocuments((prev) => {
      const updated = prev.map((d) => (d.id === docId ? updatedDoc : d));
      saveEntity('minegov_documents', updated);
      return updated;
    });

    recordAudit('AI OCR Engine', 'System', 'OCR_EXTRACT', 'DocumentRecord', docId, 'Unprocessed', 'Processed');
    return updatedDoc;
  };

  // Submit Grievance
  const submitGrievance = (category: WorkerGrievance['category'], description: string, isAnonymous: boolean) => {
    const newGrv: WorkerGrievance = {
      id: `grv-${Date.now()}`,
      category,
      description,
      isAnonymous,
      workerId: isAnonymous ? undefined : currentUser?.id,
      submittedAt: new Date().toISOString(),
      status: 'Submitted',
    };
    setGrievances((prev) => {
      const updated = [newGrv, ...prev];
      saveEntity('minegov_grievances', updated);
      return updated;
    });
  };

  // Sync Offline Queue
  const syncOfflineQueue = async (): Promise<number> => {
    const queue = getOfflineQueue();
    if (queue.length === 0) return 0;

    let count = 0;
    for (const item of queue) {
      if (item.action === 'CREATE_REPORT') {
        const payload = item.payload;
        await submitReport(payload);
        count++;
      }
    }

    clearOfflineQueue();
    setOfflineQueue([]);
    return count;
  };

  const clearNotification = (id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      saveEntity('minegov_notifications', updated);
      return updated;
    });
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      saveEntity('minegov_notifications', updated);
      return updated;
    });
  };

  const verifyLedgerIntegrity = () => {
    return runCryptographicIntegrityCheck(blockchainBlocks);
  };

  // AI Assistant Query
  const queryAiAssistant = (query: string): { answer: string; data?: any[] } => {
    const q = query.toLowerCase();

    if (q.includes('critical') && q.includes('violation')) {
      const activeCritical = violations.filter((v) => v.severity === 'CRITICAL' && v.status !== 'CLOSED');
      return {
        answer: `There are ${activeCritical.length} active critical violations across the mines requiring immediate statutory intervention.`,
        data: activeCritical,
      };
    }

    if (q.includes('mine a') || q.includes('jharia')) {
      const mine = mines.find((m) => m.id === 'm1');
      return {
        answer: `Jharia Deep Mine A currently holds an elevated Risk Score of ${mine?.riskScore} (CRITICAL) driven by water pooling in Zone 4 substation and active methane gas concentration alerts.`,
        data: violations.filter((v) => v.mineId === 'm1' && v.status !== 'CLOSED'),
      };
    }

    if (q.includes('overdue')) {
      const overdue = violations.filter((v) => v.status !== 'CLOSED' && new Date(v.deadline) < new Date());
      return {
        answer: `There are ${overdue.length} violations that have breached their statutory SLA deadlines. Escalations have been dispatched to Area and Corporate managers.`,
        data: overdue,
      };
    }

    if (q.includes('contractor') && q.includes('risk')) {
      const highest = [...contractors].sort((a, b) => b.riskScore - a.riskScore)[0];
      return {
        answer: `Highest risk vendor is ${highest.name} (Risk Score: ${highest.riskScore}) due to ${highest.violationsCount} statutory violations and expired operations safety license. Payment is currently on hold.`,
        data: [highest],
      };
    }

    return {
      answer:
        "I can answer factual governance queries. Try asking:\n- 'Which mines have active critical violations?'\n- 'Why is Jharia Mine A marked high risk?'\n- 'Show all overdue corrective actions.'\n- 'Which contractor has the highest risk score?'\n- 'Explain environmental anomalies.'",
    };
  };

  // Regulatory RAG Search
  const queryRegulatoryRAG = (query: string): { answer: string; citation: string; date: string } => {
    const q = query.toLowerCase();

    if (q.includes('methane') || q.includes('gas')) {
      return {
        answer:
          'Regulation 169 of the Coal Mines Regulations (CMR) 2017 mandates that if inflammable gas (methane CH4) exceeds 1.25% in the general body of return air, all electrical apparatus must be immediately isolated and personnel safely withdrawn.',
        citation: 'Regulation 169, Coal Mines Regulations (CMR) 2017',
        date: 'Statutory Gazette 2017',
      };
    }

    if (q.includes('dust') || q.includes('pm')) {
      return {
        answer:
          'Regulation 143 requires respirable coal dust concentrations to be monitored every 30 days and maintained strictly below 2.0 mg/m³ for coal containing under 5% free silica. Haul roads must be kept damp with continuous water spraying.',
        citation: 'Regulation 143, Coal Mines Regulations 2017',
        date: 'Statutory Gazette 2017',
      };
    }

    if (q.includes('fence') || q.includes('barrier')) {
      return {
        answer:
          'DGMS Circular No. 12 of 2021 mandates rigid steel barricades of height not less than 1.2 meters at all shaft entries, sump margins, and quarry edges capable of resisting heavy vehicle impacts.',
        citation: 'DGMS Circular No. 12 of 2021',
        date: 'Issued March 2021',
      };
    }

    return {
      answer:
        'All mining operations must adhere to CMR 2017 and the Mines Act 1952. All non-compliances must be rectified within established SLAs and anchored to the statutory inspection register.',
      citation: 'General Safety Framework, Coal Mines Act 1952',
      date: 'Amended 2022',
    };
  };

  // ==========================================
  // REAL ROLE-BASED DATA SCOPING ENGINE
  // ==========================================

  // 1. Scoped Mines
  const scopedMines = React.useMemo(() => {
    if (
      !currentUser ||
      currentUser.role === 'Coal Mine Manager' ||
      currentUser.role === 'Regulatory Authority' ||
      currentUser.role === 'Transportation Head'
    ) {
      return mines;
    }
    if (currentUser.role === 'Area Manager') {
      const areaId = currentUser.areaId || 'a1';
      return mines.filter((m) => m.areaId === areaId);
    }
    // Mine-scoped officers & Worker
    const mineId = currentUser.mineId || 'm1';
    return mines.filter((m) => m.id === mineId);
  }, [currentUser, mines]);

  // 2. Scoped Areas
  const scopedAreas = React.useMemo(() => {
    if (!currentUser || currentUser.role === 'Coal Mine Manager' || currentUser.role === 'Regulatory Authority') {
      return areas;
    }
    const areaId = currentUser.areaId || 'a1';
    return areas.filter((a) => a.id === areaId);
  }, [currentUser, areas]);

  // 3. Scoped Violations
  const scopedViolations = React.useMemo(() => {
    const allowedMineIds = new Set(scopedMines.map((m) => m.id));
    const base = violations.filter((v) => allowedMineIds.has(v.mineId));

    if (!currentUser) return base;

    if (currentUser.role === 'Worker') {
      return base.filter(
        (v) =>
          v.reporterName === currentUser.name ||
          v.assigneeName === currentUser.name ||
          v.reporterName === 'Anil Yadav'
      );
    }
    if (currentUser.role === 'Safety Officer') {
      return base.filter(
        (v) =>
          v.category.includes('Safety') ||
          v.category.includes('Electrical') ||
          v.category.includes('Roof') ||
          v.severity === 'CRITICAL'
      );
    }
    if (currentUser.role === 'Environment Officer') {
      return base.filter(
        (v) =>
          v.category.includes('Dust') ||
          v.category.includes('Gas') ||
          v.category.includes('Ventilation') ||
          v.category.includes('Environmental')
      );
    }
    if (currentUser.role === 'Contractor Manager') {
      return base.filter(
        (v) => Boolean(v.contractorName) || v.category.includes('Equipment') || v.category.includes('Machinery')
      );
    }
    if (currentUser.role === 'Finance Officer') {
      return base.filter((v) => Boolean(v.contractorName) || v.severity === 'CRITICAL');
    }

    return base;
  }, [currentUser, scopedMines, violations]);

  // 4. Scoped Inspections
  const scopedInspections = React.useMemo(() => {
    const allowedMineIds = new Set(scopedMines.map((m) => m.id));
    const base = inspections.filter((i) => allowedMineIds.has(i.mineId));

    if (!currentUser) return base;

    if (currentUser.role === 'Worker' || currentUser.role === 'Finance Officer') {
      return [];
    }
    if (currentUser.role === 'Safety Officer') {
      return base.filter((i) => i.department.includes('Safety') || i.category.includes('Safety'));
    }
    if (currentUser.role === 'Environment Officer') {
      return base.filter(
        (i) => i.department.includes('Environment') || i.category.includes('Dust') || i.category.includes('Ventilation')
      );
    }
    if (currentUser.role === 'Contractor Manager') {
      return base.filter(
        (i) => i.category.includes('Machinery') || i.category.includes('Equipment') || i.category.includes('Contractor')
      );
    }

    return base;
  }, [currentUser, scopedMines, inspections]);

  // 5. Scoped Corrective Actions
  const scopedCorrectiveActions = React.useMemo(() => {
    const allowedViolationIds = new Set(scopedViolations.map((v) => v.id));
    return correctiveActions.filter((c) => allowedViolationIds.has(c.violationId));
  }, [scopedViolations, correctiveActions]);

  // 6. Scoped Compliance Items
  const scopedComplianceItems = React.useMemo(() => {
    if (
      !currentUser ||
      currentUser.role === 'Coal Mine Manager' ||
      currentUser.role === 'Regulatory Authority' ||
      currentUser.role === 'Area Manager' ||
      currentUser.role === 'Mine Head'
    ) {
      return complianceItems;
    }
    if (currentUser.role === 'Transportation Head') {
      return complianceItems.filter(
        (c) => c.category === 'Safety' || c.category === 'Equipment' || c.category === 'Contractor'
      );
    }
    if (currentUser.role === 'Safety Officer') {
      return complianceItems.filter((c) => c.category === 'Safety' || c.responsibleDepartment.includes('Safety'));
    }
    if (currentUser.role === 'Environment Officer') {
      return complianceItems.filter((c) => c.category === 'Environment' || c.responsibleDepartment.includes('Environment'));
    }
    if (currentUser.role === 'Contractor Manager') {
      return complianceItems.filter((c) => c.category === 'Contractor' || c.category === 'Equipment');
    }
    if (currentUser.role === 'Workforce Head') {
      return complianceItems.filter((c) => c.category === 'Labour');
    }
    if (currentUser.role === 'Finance Officer') {
      return complianceItems.filter((c) => c.category === 'Contractor' || c.severity === 'CRITICAL');
    }
    return complianceItems.filter((c) => c.category === 'Labour' || c.category === 'Safety');
  }, [currentUser, complianceItems]);

  // 7. Scoped Contractors
  const scopedContractors = React.useMemo(() => {
    if (!currentUser || currentUser.role === 'Coal Mine Manager' || currentUser.role === 'Regulatory Authority') {
      return contractors;
    }
    return contractors;
  }, [currentUser, contractors]);

  // 8. Scoped Workers
  const scopedWorkers = React.useMemo(() => {
    if (currentUser?.role === 'Transportation Head') {
      return []; // Strict RBAC isolation: Transportation Head cannot access workforce records
    }
    if (currentUser?.role === 'Worker') {
      return workers.filter((w) => w.name === currentUser.name || w.badgeNumber === 'W-1082');
    }
    const allowedMineIds = new Set(scopedMines.map((m) => m.id));
    return workers.filter((w) => allowedMineIds.has(w.mineId));
  }, [currentUser, scopedMines, workers]);

  // 9. Scoped Readings
  const scopedReadings = React.useMemo(() => {
    const allowedMineIds = new Set(scopedMines.map((m) => m.id));
    return readings.filter((r) => allowedMineIds.has(r.mineId));
  }, [scopedMines, readings]);

  // 10. Scoped Finance Budgets
  const scopedFinanceBudgets = React.useMemo(() => {
    if (!currentUser) return financeBudgets;
    if (
      currentUser.role === 'Finance Officer' ||
      currentUser.role === 'Coal Mine Manager' ||
      currentUser.role === 'Mine Head'
    ) {
      const allowedMineIds = new Set(scopedMines.map((m) => m.id));
      return financeBudgets.filter((b) => allowedMineIds.has(b.mineId));
    }
    return [];
  }, [currentUser, scopedMines, financeBudgets]);

  // 11. Scoped Grievances
  const scopedGrievances = React.useMemo(() => {
    if (!currentUser) return grievances;
    if (currentUser.role === 'Worker') {
      return grievances.filter((g) => g.workerId === currentUser.id || !g.isAnonymous);
    }
    if (
      currentUser.role === 'Workforce Head' ||
      currentUser.role === 'Mine Head' ||
      currentUser.role === 'Coal Mine Manager'
    ) {
      return grievances;
    }
    return [];
  }, [currentUser, grievances]);

  // 12. Scoped Coal Movements
  const scopedCoalMovements = React.useMemo(() => {
    if (
      !currentUser ||
      currentUser.role === 'Coal Mine Manager' ||
      currentUser.role === 'Regulatory Authority' ||
      currentUser.role === 'Transportation Head'
    ) {
      return coalMovements;
    }
    const allowedMineIds = new Set(scopedMines.map((m) => m.id));
    return coalMovements.filter((cm) => allowedMineIds.has(cm.originMineId));
  }, [currentUser, scopedMines, coalMovements]);

  // 13. Scoped Fleet Vehicles
  const scopedFleetVehicles = React.useMemo(() => {
    if (
      !currentUser ||
      currentUser.role === 'Coal Mine Manager' ||
      currentUser.role === 'Regulatory Authority' ||
      currentUser.role === 'Transportation Head'
    ) {
      return fleetVehicles;
    }
    const allowedMineIds = new Set(scopedMines.map((m) => m.id));
    return fleetVehicles.filter((v) => !v.mineId || allowedMineIds.has(v.mineId));
  }, [currentUser, scopedMines, fleetVehicles]);

  // Permissions and Helpers
  const permissions: RolePermissions =
    ROLE_PERMISSIONS_MAP[currentUser?.role || 'Coal Mine Manager'] ||
    ROLE_PERMISSIONS_MAP['Coal Mine Manager'];

  const isModuleAllowed = (moduleId: string): boolean => {
    const baseModule = moduleId.startsWith('transportation') ? 'transportation' : moduleId;
    return permissions.allowedModules.includes(baseModule);
  };

  const canPerform = (action: keyof RolePermissions): boolean => {
    return Boolean(permissions[action]);
  };

  return (
    <GovernanceContext.Provider
      value={{
        currentUser,
        users,
        areas: scopedAreas,
        mines: scopedMines,
        allMines: mines,
        allAreas: areas,
        workers: scopedWorkers,
        contractors: scopedContractors,
        complianceItems: scopedComplianceItems,
        inspections: scopedInspections,
        violations: scopedViolations,
        correctiveActions: scopedCorrectiveActions,
        incidents,
        readings: scopedReadings,
        documents,
        auditLogs,
        blockchainBlocks,
        notifications,
        offlineQueue,
        grievances: scopedGrievances,
        financeBudgets: scopedFinanceBudgets,
        coalMovements: scopedCoalMovements,
        fleetVehicles: scopedFleetVehicles,
        fleetDrivers,
        fleetMaintenance,
        fuelLogs,
        logisticsExpenses,
        routes,
        officers,
        overtimeRecords,
        benches,
        blastPlans,
        overburdenRecords,
        coalQualityRecords,
        stockpiles,
        operationalDelays,
        hemmAssets,
        breakdownTickets,
        spareParts,
        emergencyCommand,
        emergencyDrills,
        rootCauseAnalyses,
        pendingApprovals,
        dataQualityChecks,
        isOffline,
        permissions,
        isModuleAllowed,
        canPerform,
        login,
        logout,
        quickSwitchUser,
        resetDemoData,
        toggleOfflineMode,
        addMine,
        updateMine,
        addWorker,
        updateWorker,
        deleteWorker,
        addOfficer,
        updateOfficer,
        addRoute,
        updateRoute,
        approveOvertime,
        updateBenchSlopeRisk,
        approveBlastClearance,
        addCoalQualitySample,
        adjustStockpileSurvey,
        reportHemmBreakdown,
        resolveBreakdownRepair,
        reorderSparePart,
        triggerEmergencySiren,
        updateMusterRollCall,
        saveRootCauseAnalysis,
        resolvePendingApproval,
        runDataQualityAudit,
        submitReport,
        assignViolation,
        submitCorrectiveAction,
        verifyCorrectiveAction,
        triggerManualEscalation,
        addComplianceItem,
        updateComplianceStatus,
        createInspection,
        addEnvironmentalReading,
        createCoalMovement,
        dispatchCoalMovement,
        recordWeighbridgeReceipt,
        reconcileCoalMovement,
        cancelCoalMovement,
        addFleetVehicle,
        updateVehicleStatus,
        addFleetDriver,
        scheduleFleetMaintenance,
        completeFleetMaintenance,
        logFuelConsumption,
        addLogisticsExpense,
        approveLogisticsExpense,
        runOcrOnDocument,
        submitGrievance,
        syncOfflineQueue,
        clearNotification,
        markAllNotificationsRead,
        verifyLedgerIntegrity,
        queryAiAssistant,
        queryRegulatoryRAG,
      }}
    >
      {children}
    </GovernanceContext.Provider>
  );
};

export const useGovernance = () => {
  const context = useContext(GovernanceContext);
  if (!context) {
    throw new Error('useGovernance must be used within a GovernanceProvider');
  }
  return context;
};
