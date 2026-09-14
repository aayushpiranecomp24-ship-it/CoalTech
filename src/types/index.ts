// MINEGOV AI - Comprehensive Type Definitions

export type RoleType =
  | 'Coal Mine Manager'
  | 'Area Manager'
  | 'Mine Head'
  | 'Transportation Head'
  | 'Safety Officer'
  | 'Inspection Officer'
  | 'Environment Officer'
  | 'Contractor Manager'
  | 'Finance Officer'
  | 'Workforce Head'
  | 'Worker'
  | 'Regulatory Authority'
  | 'Government Department'
  | 'Corporate Management'
  | 'System Administrator';


export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface User {
  id: string;
  name: string;
  email: string;
  role: RoleType;
  scope: string; // 'all' | 'area:<areaId>' | 'mine:<mineId>'
  areaId?: string;
  mineId?: string;
  department?: string;
  shift?: string;
  phone?: string;
  avatarUrl?: string;
}

export interface Area {
  id: string;
  name: string;
  manager: string;
  state: string;
  headquarters: string;
}

export interface Mine {
  id: string;
  name: string;
  mineCode?: string;
  areaId: string;
  manager: string;
  riskScore: number; // 0-100
  complianceScore: number; // 0-100
  latitude: number;
  longitude: number;
  type: 'Underground' | 'Opencast' | 'Mixed';
  zones: string[];
  productionCapacityMTPA: number;
  currentProductionMTPA?: number;
  workforceCount: number;
  status?: 'Active' | 'Under Maintenance' | 'Decommissioned' | 'Suspended' | 'ACTIVE' | 'UNDER INSPECTION' | 'MAINTENANCE' | 'TEMPORARILY RESTRICTED';
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  state?: string;
  gps?: string;
  mineHead?: string;
  safetyOfficer?: string;
  environmentOfficer?: string;
  inspectionOfficer?: string;
  financeOfficer?: string;
  transportationHead?: string;
  workforceHead?: string;
  assignedOfficers?: string[];
  contractorId?: string;
  contactEmail?: string;
  contactPhone?: string;
}

export interface Worker {
  id: string;
  workerId?: string;
  name: string;
  mineId: string;
  department: string;
  role: string;
  skill?: 'Skilled' | 'Semi-Skilled' | 'Unskilled' | 'Technician' | 'Blaster' | 'Operator';
  designation?: string;
  shift: string;
  contractorId?: string;
  workerHeadId?: string;
  attendanceStatus: 'Present' | 'Absent' | 'On Leave';
  trainingStatus: 'Completed' | 'Pending' | 'Expired';
  status?: 'Active' | 'On Leave' | 'Suspended' | 'Terminated';
  supervisorId: string;
  badgeNumber: string;
  safetyScore: number;
  emergencyContact: string;
  joiningDate?: string;
  dailyHoursWorked?: number;
  weeklyHoursWorked?: number;
  overtimeEligible?: boolean;
  certExpiryDate?: string;
  phone?: string;
}

export interface Officer {
  id: string;
  name: string;
  officerCode: string;
  email: string;
  phone: string;
  role: RoleType;
  mineId?: string;
  areaId?: string;
  department: string;
  status: 'Active' | 'On Field' | 'On Leave' | 'Inactive';
  assignedDate: string;
  badgeNumber: string;
  employeeId?: string;
  certification?: string;
  shift?: string;
}

export interface RouteCorridor {
  id: string;
  name: string;
  routeCode?: string;
  origin?: string;
  originMineId?: string;
  originMineName?: string;
  loadingPoint?: string;
  stockyard?: string;
  railwaySiding?: string;
  destination: string;
  distanceKm: number;
  avgDurationMins?: number;
  expectedTravelTimeMins?: number;
  speedLimitKmh?: number;
  speedLimitKmph?: number;
  geofenceRadiusMeters?: number;
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'ACTIVE' | 'CONGESTED' | 'MAINTENANCE_DIVERSION' | 'Active' | 'Restricted' | 'Under Maintenance';
  activeVehiclesCount?: number;
  activeVehicles?: number;
  dailyTonnes?: number;
  pavementType?: 'HEAVY_DUTY_BLACKTOP' | 'UNPAVED_HAUL_ROAD' | 'GRADED_GRAVEL';
  cameraCount?: number;
  checkpoints?: Array<string | { name: string; type: 'WEIGHBRIDGE' | 'RFID_GATE' | 'SECURITY_POST' | string; status: 'ONLINE' | 'STANDBY' | string }>;
  tollGates?: number;
  lastGeoFenceAudit?: string;
}

export interface OvertimeApprovalRecord {
  id: string;
  workerId: string;
  workerName: string;
  mineId?: string;
  mineName?: string;
  date: string;
  currentHours?: number;
  regularHours?: number;
  overtimeHours?: number;
  requestedHours?: number;
  approvingOfficer?: string;
  approverId?: string;
  approverName?: string;
  reason: string;
  overtimeRate?: number;
  estimatedExtraPayment?: number;
  timestamp?: string;
  status: 'APPROVED' | 'REJECTED' | 'PENDING';
  approvedAt?: string;
  comments?: string;
}

export interface Contractor {
  id: string;
  name: string;
  license: string;
  workersCount: number;
  equipmentCount: number;
  violationsCount: number;
  complianceStatus: 'Compliant' | 'Non-Compliant';
  riskScore: number; // 0-100
  contractValue: string;
  paymentStatus: 'Fully Paid' | 'Billing Pending' | 'Paid Part' | 'Hold (Violation)';
  validTill: string;
  category: string;
}

export interface ComplianceItem {
  id: string;
  requirement: string;
  category: 'Safety' | 'Environment' | 'Labour' | 'Production' | 'Contractor' | 'Equipment';
  responsibleDepartment: string;
  responsibleOfficer: string;
  dueDate: string;
  status: 'Compliant' | 'Due Soon' | 'Overdue' | 'Violation' | 'Under Review';
  severity: SeverityLevel;
  evidenceUrl?: string;
  lastInspectionDate: string;
  nextReviewDate: string;
  regulationCitation: string;
  mineId?: string;
}

export interface Inspection {
  id: string;
  inspectorName: string;
  mineId: string;
  zone: string;
  department: string;
  category: string;
  date: string;
  severity: SeverityLevel;
  observations: string;
  remarks?: string;
  gps: string;
  photoUrl?: string;
  status: 'Scheduled' | 'In Progress' | 'Submitted' | 'Under Review' | 'Closed';
}

export interface Violation {
  id: string;
  title: string;
  category: string;
  mineId: string;
  zone: string;
  severity: SeverityLevel;
  status:
    | 'OPEN'
    | 'ASSIGNED'
    | 'IN_PROGRESS'
    | 'ACTION_SUBMITTED'
    | 'UNDER_VERIFICATION'
    | 'CLOSED'
    | 'REWORK_REQUIRED';
  reporterName: string;
  assigneeName?: string;
  assigneeRole?: string;
  description: string;
  reportedAt: string;
  deadline: string;
  riskScore: number;
  duplicateOfId?: string;
  isEscalated: boolean;
  escalationLevel: number; // 0: None, 1: Mine Head, 2: Area Manager, 3: Coal Mine Manager
  beforePhotoUrl?: string;
  afterPhotoUrl?: string;
  contractorName?: string;
  verificationNotes?: string;
}

export interface CorrectiveAction {
  id: string;
  violationId: string;
  assigneeName: string;
  department: string;
  priority: SeverityLevel;
  deadline: string;
  status:
    | 'Assigned'
    | 'In Progress'
    | 'Evidence Submitted'
    | 'Verification Pending'
    | 'Approved'
    | 'Rejected'
    | 'Rework Required'
    | 'Closed'
    | 'Overdue';
  actionDescription: string;
  proofNotes?: string;
  proofPhotoUrl?: string;
  createdAt: string;
  completedAt?: string;
  verifiedAt?: string;
}

export interface IncidentReport {
  id: string;
  mineId: string;
  zone: string;
  reportedBy: string;
  incidentType: 'Unsafe Condition' | 'Near Miss' | 'Minor Injury' | 'Equipment Breakdown' | 'Gas Leak';
  severity: SeverityLevel;
  description: string;
  reportedAt: string;
  status: 'Reported' | 'Investigating' | 'Remediated' | 'Closed';
  gps?: string;
  photoUrl?: string;
}

export interface EnvironmentalReading {
  id: string;
  mineId: string;
  parameter:
    | 'Air Quality (PM2.5)'
    | 'Air Quality (PM10)'
    | 'Water pH'
    | 'Coal Dust Level'
    | 'Methane Level (CH4)'
    | 'Noise Level';
  value: number;
  unit: string;
  threshold: number;
  timestamp: string;
  anomaly: boolean;
  status: 'PENDING_REVIEW' | 'REVIEWED_OK' | 'NON_COMPLIANT';
}

export interface DocumentRecord {
  id: string;
  title: string;
  category: 'License' | 'Environmental Clearance' | 'Safety Audit' | 'Contract' | 'Operator Cert' | 'Inspection Report';
  mineId?: string;
  contractorId?: string;
  status: 'VALID' | 'EXPIRING' | 'EXPIRED' | 'UNDER_REVIEW';
  expiryDate: string;
  ownerName: string;
  fileUrl: string;
  ocrExtractedText?: string;
  extractedFields?: {
    licenseNumber?: string;
    issuingAuthority?: string;
    validity?: string;
    complianceTerms?: string;
  };
}

export interface AuditLog {
  id: string;
  actor: string;
  role: string;
  action: string;
  entity: string;
  entityId: string;
  prevState: string;
  newState: string;
  timestamp: string;
  txHash?: string;
}

export interface BlockchainBlock {
  id: string;
  blockNumber: number;
  timestamp: string;
  actor: string;
  action: string;
  entityId: string;
  payloadHash: string;
  previousHash: string;
  currentHash: string;
  verified: boolean;
}

export interface NotificationItem {
  id: string;
  userId: string;
  role: string;
  mineId?: string;
  title: string;
  message: string;
  severity: SeverityLevel;
  timestamp: string;
  read: boolean;
  channel?: 'in-app' | 'sms' | 'email' | 'voice' | 'whatsapp';
  deliveryStatus?: 'Delivered (Simulated)' | 'Queued' | 'Failed';
}

export interface OfflineQueueItem {
  id: string;
  action: 'CREATE_REPORT' | 'LOG_INSPECTION' | 'SUBMIT_ACTION';
  payload: any;
  timestamp: string;
}

export interface WorkerGrievance {
  id: string;
  workerId?: string;
  isAnonymous: boolean;
  category: 'Safety Hazard' | 'Sanitation / Drinking Water' | 'PPE Defect' | 'Working Hours' | 'Compensation';
  description: string;
  submittedAt: string;
  status: 'Submitted' | 'Under Review' | 'Resolved';
  resolutionNotes?: string;
}

// Transportation & Logistics Types
export type MovementStatus =
  | 'DRAFT'
  | 'LOADING'
  | 'DISPATCHED'
  | 'IN_TRANSIT'
  | 'RECEIVED'
  | 'RECONCILED'
  | 'DISCREPANCY_FLAGGED'
  | 'CANCELLED';

export interface CoalMovement {
  id: string; // e.g. 'CM-2026-1001'
  movementType: 'Road Haulage' | 'Rail Rake' | 'Conveyor Transfer';
  vehicleId: string;
  vehiclePlate: string;
  driverId: string;
  driverName: string;
  transporterId: string; // Links to Contractor
  transporterName: string;
  originMineId: string; // Links to Mine
  originMineName: string;
  loadingPoint: string; // e.g. 'Siding #4 - Incline Pit'
  destinationType: 'Thermal Power Plant' | 'Coal Washery' | 'Railway Siding' | 'Steel Plant';
  destinationName: string; // e.g. 'NTPC Ramagundam Super Thermal'
  coalGrade: string; // e.g. 'G-7 Non-Coking', 'G-11 Power Coal', 'Steel Grade Coking'
  eWayBillNumber: string;
  challanNumber: string;
  rfidTag: string;
  gpsImei?: string;
  departureTime: string;
  estimatedArrival: string;
  distanceKm: number;
  
  // Weighbridge measurements (Metric Tonnes)
  dispatchedTareTonnes: number;
  dispatchedGrossTonnes: number;
  dispatchedNetTonnes: number;
  
  // Receipt weighbridge
  receivedTime?: string;
  receivedTareTonnes?: number;
  receivedGrossTonnes?: number;
  receivedNetTonnes?: number;
  
  // Reconciliation & Discrepancy analysis
  weightDiscrepancyTonnes?: number;
  weightDiscrepancyPercent?: number;
  sealIntact?: boolean;
  transitLossAllowanceTonnes: number; // statutory moisture/dust allowance (e.g. 0.5%)
  discrepancyReason?: string;
  
  status: MovementStatus;
  freightCost: number;
  assessedRoyalty: number;
  
  // Governance cross-links
  linkedViolationId?: string;
  riskScore?: number;
}

export interface FleetVehicle {
  id: string;
  name: string;
  plate: string;
  vin?: string;
  type: 'Heavy Tipper (25T)' | 'Articulated Dumper (40T)' | 'Coal Hauler (50T)' | 'Rail Rake';
  make: string;
  model: string;
  year: number;
  status: 'active' | 'idle' | 'on_trip' | 'maintenance' | 'retired' | 'breakdown' | 'out_of_service';
  fuelLevel: number;
  mileageKm: number;
  mineId: string;
  transporterName: string;
  tareWeightTonnes: number;
  maxCapacityTonnes: number;
  depot?: string;
  documents: {
    type: 'fitness' | 'pollution' | 'insurance' | 'dgms_permit';
    status: 'valid' | 'expiring' | 'expired';
    expiryDate: string;
    docNumber: string;
  }[];
}

export interface TransporterDriver {
  id: string;
  name: string;
  phone: string;
  email?: string;
  licenseNumber: string;
  licenseExpiry: string;
  hazardousEndorsement: boolean;
  dgmsSafetyCertified: boolean;
  status: 'on_duty' | 'off_duty' | 'on_trip' | 'on_leave' | 'suspended';
  assignedVehicleId?: string;
  safetyScore: number;
  totalTrips: number;
  transporterName: string;
  region?: string;
}

export interface FleetMaintenanceRecord {
  id: string;
  targetType: 'Vehicle' | 'Weighbridge' | 'Conveyor Belt';
  targetId: string;
  targetName: string;
  issue: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'scheduled' | 'in_progress' | 'completed' | 'overdue';
  scheduledDate: string;
  completedDate?: string;
  certifiedTechnician: string;
  cost: number;
  calibrationCertificateUrl?: string;
}

export interface FuelLogRecord {
  id: string;
  vehicleId: string;
  vehicleName: string;
  driverName: string;
  liters: number;
  costPerLiter: number;
  totalCost: number;
  location: string;
  timestamp: string;
  odometerKm: number;
}

export interface LogisticsExpense {
  id: string;
  category: 'fuel' | 'maintenance' | 'insurance' | 'tolls' | 'permits' | 'green_cess' | 'other';
  amount: number;
  description: string;
  vehicleId?: string;
  transporterName?: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface FinanceBudget {
  mineId: string;
  totalSafetyBudget: number; // in INR Lakhs
  utilizedBudget: number;
  penaltiesLevied: number;
  contractorPayableWithheld: number;
  environmentalCess: number;
}

// ==========================================
// MINE OPERATIONS & PRODUCTION MODELS
// ==========================================

export interface BenchPitRecord {
  id: string;
  benchId: string;
  mineId: string;
  mineName?: string;
  elevationMeters: number;
  seamName: string;
  workingStatus: 'ACTIVE_EXTRACTION' | 'DEVELOPMENT' | 'BLAST_PREP' | 'STABILIZING' | 'IDLE';
  slopeRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  slopeAngleDeg: number;
  waterCondition: 'DRY' | 'DAMP' | 'ACCUMULATING' | 'CRITICAL_POOLING';
  activeHemmCount: number;
  dailyProductionTonnes: number;
  lastGeotechnicalSurvey: string;
  inspectedBy: string;
}

export interface BlastPlanRecord {
  id: string;
  blastId: string;
  mineId: string;
  mineName?: string;
  benchId: string;
  dateTime: string;
  holeCount: number;
  avgDepthMeters: number;
  holeDiameterMm: number;
  explosiveType: string;
  totalExplosiveKg: number;
  status: 'PLANNED' | 'CLEARANCE_GRANTED' | 'EVACUATION_CONFIRMED' | 'EXECUTED' | 'POST_INSPECTION_OK';
  responsibleBlaster: string;
  clearanceOfficer: string;
  preBlastClearanceGiven: boolean;
  postBlastVibrationMmS?: number; // Ground vibration peak particle velocity
  flyrockObserved?: boolean;
  fragmentationScore?: number; // 0-100
}

export interface OverburdenRecord {
  id: string;
  mineId: string;
  mineName?: string;
  shift: string;
  date: string;
  plannedBankCubicMeters: number; // BCM
  actualBankCubicMeters: number;
  varianceBCM: number;
  dumpLocation: string;
  primaryExcavatorId: string;
  dumperTripsCount: number;
  reclamationZone: string;
}

export interface CoalQualityRecord {
  id: string;
  sampleId: string;
  mineId: string;
  mineName?: string;
  stockpileId: string;
  date: string;
  coalGrade: string; // e.g. 'G-7', 'G-11', 'Steel Grade I'
  moisturePercent: number;
  ashPercent: number;
  calorificValueGcvKcalKg: number;
  volatileMatterPercent: number;
  testStatus: 'SAMPLE_COLLECTED' | 'LAB_TESTING' | 'CERTIFIED' | 'DISCREPANCY_FLAGGED';
  laboratoryName: string;
  certifiedBy: string;
  anomalyFlagged: boolean;
}

export interface StockpileRecord {
  id: string;
  stockpileCode: string;
  name: string;
  mineId: string;
  mineName?: string;
  capacityTonnes: number;
  currentQuantityTonnes: number;
  surveyedQuantityTonnes: number;
  coalGrade: string;
  status: 'OPTIMAL' | 'NEAR_CAPACITY' | 'DEPLETED' | 'SURVEY_DISCREPANCY';
  lastLidarSurveyDate: string;
  moistureContentPercent: number;
  discrepancyTonnes: number;
}

export interface OperationalDelayRecord {
  id: string;
  mineId: string;
  shift: string;
  category: 'HEMM_BREAKDOWN' | 'WEATHER_MONSOON' | 'HAUL_ROAD_BLOCK' | 'BLAST_CLEARANCE' | 'POWER_OUTAGE';
  description: string;
  durationMinutes: number;
  affectedSection: string;
  estimatedLostTonnage: number;
  reportedBy: string;
  timestamp: string;
}

// ==========================================
// HEMM FLEET & ASSET MODELS
// ==========================================

export type HemmType =
  | 'Hydraulic Shovel (12m³)'
  | 'Heavy Excavator (6.5m³)'
  | 'Rear Dump Truck (100T)'
  | 'Crawler Dozer (410HP)'
  | 'Blast Hole Drill (250mm)'
  | 'Motor Grader (280HP)'
  | 'Water Mist Tanker (70KL)';

export interface HemmAsset {
  id: string;
  assetCode: string;
  name: string;
  type: HemmType;
  mineId: string;
  mineName?: string;
  currentLocation: string;
  status: 'AVAILABLE' | 'WORKING' | 'IDLE' | 'SERVICE_DUE' | 'MAINTENANCE' | 'BREAKDOWN' | 'OUT_OF_SERVICE';
  operatorName: string;
  engineHours: number;
  fuelLevelPercent: number;
  coolantTempC: number;
  hydraulicPressurePsi: number;
  idleHoursToday: number;
  utilizationPercent: number;
  simulatedTelemetry: {
    rpm: number;
    speedKmh: number;
    oilTempC: number;
    vibrationMmS: number;
    telemetrySource: string;
    lastHeartbeat: string;
  };
  lastServiceDate: string;
  nextServiceDueHours: number;
  aiRecommendation?: string;
}

export interface BreakdownTicket {
  id: string;
  ticketCode: string;
  assetId: string;
  assetName: string;
  assetType: string;
  mineId: string;
  reportedAt: string;
  location: string;
  operatorName: string;
  failureCategory: 'HYDRAULIC_LEAK' | 'ENGINE_OVERHEAT' | 'TRANSMISSION' | 'UNDERCARRIAGE' | 'ELECTRICAL' | 'STRUCTURAL';
  description: string;
  severity: SeverityLevel;
  downtimeHours: number;
  assignedTechnician: string;
  requiredSparePartId?: string;
  requiredSparePartName?: string;
  status: 'REPORTED' | 'ASSIGNED' | 'REPAIRING' | 'TESTING' | 'AVAILABLE';
  resolvedAt?: string;
}

export interface SparePartItem {
  id: string;
  partNumber: string;
  name: string;
  category: 'HYDRAULICS' | 'FILTERS' | 'BRAKES' | 'ENGINE_COMPONENTS' | 'UNDERCARRIAGE' | 'ELECTRICAL';
  currentStock: number;
  minStockLevel: number;
  unitCostInr: number;
  warehouseLocation: string;
  compatibleHemmTypes: string[];
  reorderStatus: 'ADEQUATE' | 'REORDER_RECOMMENDED' | 'CRITICAL_LOW';
  leadTimeDays: number;
}

// ==========================================
// EMERGENCY COMMAND & INVESTIGATION MODELS
// ==========================================

export interface EmergencyIncidentCommand {
  id: string;
  mineId: string;
  mineName?: string;
  emergencyType: 'SLOPE_FAILURE' | 'UNDERGROUND_INUNDATION' | 'HEMM_COLLISION' | 'CONVEYOR_FIRE' | 'METHANE_GAS_ACCUMULATION';
  severity: SeverityLevel;
  status: 'STANDBY' | 'SIREN_ACTIVE' | 'EVACUATING' | 'MUSTER_ROLL_CALL' | 'RESCUE_IN_PROGRESS' | 'CONTAINED' | 'STAND_DOWN';
  incidentCommander: string;
  incidentLocation: string;
  totalWorkersOnSite: number;
  accountedWorkers: number;
  unconfirmedMissingWorkers: number;
  musterZoneSafe: string;
  sirenActivated: boolean;
  rescueTeamDeployed: boolean;
  medicalTeamNotified: boolean;
  dgmsNotified: boolean;
  reportedAt: string;
}

export interface EmergencyDrillRecord {
  id: string;
  mineId: string;
  mineName?: string;
  scenario: string;
  drillDate: string;
  participantsCount: number;
  targetResponseTimeSec: number;
  actualResponseTimeSec: number;
  ratingScore: number; // 0-100
  evacuationComplianceRate: number;
  identifiedGaps: string[];
  correctiveActionAssigned: string;
}

export interface RootCauseAnalysisRecord {
  id: string;
  issueId: string;
  issueTitle: string;
  mineId: string;
  methodology: '5_WHY' | 'FISHBONE';
  whys: [string, string, string, string, string];
  fishboneCategories: {
    machinery: string;
    methods: string;
    workforce: string;
    environment: string;
    management: string;
  };
  immediateCause: string;
  underlyingCause: string;
  rootCauseSummary: string;
  preventiveActionPlan: string;
  investigatorName: string;
  date: string;
  recurringPatternDetected: boolean;
  recurringMinesInvolved?: string[];
}

// ==========================================
// CENTRALIZED APPROVAL & DATA QUALITY MODELS
// ==========================================

export type ApprovalCategory =
  | 'OVERTIME_AUTHORIZATION'
  | 'CAPA_CLOSURE'
  | 'CRITICAL_RISK_ACTION'
  | 'CONTRACTOR_ONBOARDING'
  | 'MAINTENANCE_RELEASE'
  | 'ROUTE_RESTRICTION_CLEARANCE';

export interface PendingApproval {
  id: string;
  category: ApprovalCategory;
  title: string;
  description: string;
  requestedBy: string;
  requesterRole: string;
  mineId?: string;
  mineName?: string;
  referenceId: string;
  requestedAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reviewedBy?: string;
  reviewedAt?: string;
  decisionNotes?: string;
  urgency: SeverityLevel;
}

export interface DataQualityCheckResult {
  id: string;
  category: 'REFERENCE_INTEGRITY' | 'GEO_SPATIAL' | 'LICENSING_EXPIRY' | 'QUANTITY_MATH' | 'OVERLAP_CONFLICT';
  checkName: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  issueCount: number;
  sampleIssues: string[];
  suggestedRemediation: string;
}

export interface RolePermissions {
  allowedModules: string[];
  dataScope: 'all' | 'area' | 'mine' | 'personal';
  canAssignAction: boolean;
  canVerifyAction: boolean;
  canCreateInspection: boolean;
  canReportHazard: boolean;
  canManageFinance: boolean;
  canManageContractors: boolean;
  canManageWorkforce: boolean;
  canManageCompliance: boolean;
  canEditSettings: boolean;
  isReadOnly: boolean;
}

export const ROLE_PERMISSIONS_MAP: Record<RoleType, RolePermissions> = {
  'Coal Mine Manager': {
    allowedModules: [
      'dashboard',
      'mines',
      'mine-operations',
      'hemm-assets',
      'transportation',
      'compliance',
      'inspections',
      'incidents',
      'corrective',
      'contractors',
      'workforce',
      'environment',
      'emergency',
      'approval-center',
      'data-quality',
      'daily-report',
      'gis-map',
      'risk-intelligence',
      'finance',
      'reports',
      'audit-trail',
      'notifications',
      'settings',
    ],
    dataScope: 'all',
    canAssignAction: true,
    canVerifyAction: true,
    canCreateInspection: true,
    canReportHazard: true,
    canManageFinance: true,
    canManageContractors: true,
    canManageWorkforce: true,
    canManageCompliance: true,
    canEditSettings: true,
    isReadOnly: false,
  },
  'Transportation Head': {
    allowedModules: [
      'dashboard',
      'transportation',
      'mines',
      'compliance',
      'incidents',
      'corrective',
      'risk-intelligence',
      'reports',
      'audit-trail',
      'notifications',
    ],
    dataScope: 'all',
    canAssignAction: false,
    canVerifyAction: false,
    canCreateInspection: false,
    canReportHazard: true,
    canManageFinance: false,
    canManageContractors: false,
    canManageWorkforce: false,
    canManageCompliance: false,
    canEditSettings: false,
    isReadOnly: false,
  },
  'Area Manager': {
    allowedModules: [
      'dashboard',
      'mines',
      'mine-operations',
      'transportation',
      'compliance',
      'inspections',
      'incidents',
      'corrective',
      'contractors',
      'environment',
      'emergency',
      'approval-center',
      'daily-report',
      'gis-map',
      'reports',
      'notifications',
    ],
    dataScope: 'area',
    canAssignAction: true,
    canVerifyAction: true,
    canCreateInspection: true,
    canReportHazard: true,
    canManageFinance: false,
    canManageContractors: true,
    canManageWorkforce: false,
    canManageCompliance: true,
    canEditSettings: false,
    isReadOnly: false,
  },
  'Mine Head': {
    allowedModules: [
      'dashboard',
      'mines',
      'mine-operations',
      'hemm-assets',
      'transportation',
      'compliance',
      'inspections',
      'incidents',
      'corrective',
      'contractors',
      'workforce',
      'environment',
      'emergency',
      'approval-center',
      'daily-report',
      'gis-map',
      'risk-intelligence',
      'finance',
      'reports',
      'notifications',
    ],
    dataScope: 'mine',
    canAssignAction: true,
    canVerifyAction: true,
    canCreateInspection: true,
    canReportHazard: true,
    canManageFinance: true,
    canManageContractors: true,
    canManageWorkforce: true,
    canManageCompliance: true,
    canEditSettings: false,
    isReadOnly: false,
  },
  'Safety Officer': {
    allowedModules: [
      'dashboard',
      'incidents',
      'inspections',
      'corrective',
      'emergency',
      'reports',
      'daily-report',
      'notifications',
    ],
    dataScope: 'mine',
    canAssignAction: false,
    canVerifyAction: true,
    canCreateInspection: true,
    canReportHazard: true,
    canManageFinance: false,
    canManageContractors: false,
    canManageWorkforce: false,
    canManageCompliance: true,
    canEditSettings: false,
    isReadOnly: false,
  },
  'Inspection Officer': {
    allowedModules: [
      'dashboard',
      'inspections',
      'incidents',
      'corrective',
      'reports',
      'daily-report',
      'notifications',
    ],
    dataScope: 'mine',
    canAssignAction: false,
    canVerifyAction: true,
    canCreateInspection: true,
    canReportHazard: true,
    canManageFinance: false,
    canManageContractors: false,
    canManageWorkforce: false,
    canManageCompliance: false,
    canEditSettings: false,
    isReadOnly: false,
  },
  'Environment Officer': {
    allowedModules: [
      'dashboard',
      'environment',
      'compliance',
      'inspections',
      'gis-map',
      'reports',
      'daily-report',
      'notifications',
    ],
    dataScope: 'mine',
    canAssignAction: false,
    canVerifyAction: false,
    canCreateInspection: true,
    canReportHazard: true,
    canManageFinance: false,
    canManageContractors: false,
    canManageWorkforce: false,
    canManageCompliance: true,
    canEditSettings: false,
    isReadOnly: false,
  },
  'Contractor Manager': {
    allowedModules: [
      'dashboard',
      'contractors',
      'transportation',
      'incidents',
      'compliance',
      'approval-center',
      'reports',
      'notifications',
    ],
    dataScope: 'mine',
    canAssignAction: false,
    canVerifyAction: false,
    canCreateInspection: false,
    canReportHazard: true,
    canManageFinance: false,
    canManageContractors: true,
    canManageWorkforce: false,
    canManageCompliance: false,
    canEditSettings: false,
    isReadOnly: false,
  },
  'Finance Officer': {
    allowedModules: [
      'dashboard',
      'finance',
      'transportation',
      'contractors',
      'approval-center',
      'reports',
      'daily-report',
      'notifications',
    ],
    dataScope: 'mine',
    canAssignAction: false,
    canVerifyAction: false,
    canCreateInspection: false,
    canReportHazard: false,
    canManageFinance: true,
    canManageContractors: true,
    canManageWorkforce: false,
    canManageCompliance: false,
    canEditSettings: false,
    isReadOnly: false,
  },
  'Workforce Head': {
    allowedModules: [
      'dashboard',
      'workforce',
      'incidents',
      'emergency',
      'approval-center',
      'reports',
      'daily-report',
      'notifications',
    ],
    dataScope: 'mine',
    canAssignAction: false,
    canVerifyAction: false,
    canCreateInspection: false,
    canReportHazard: true,
    canManageFinance: false,
    canManageContractors: false,
    canManageWorkforce: true,
    canManageCompliance: false,
    canEditSettings: false,
    isReadOnly: false,
  },
  'Worker': {
    allowedModules: [
      'dashboard',
      'incidents',
      'workforce',
      'emergency',
      'notifications',
    ],
    dataScope: 'personal',
    canAssignAction: false,
    canVerifyAction: false,
    canCreateInspection: false,
    canReportHazard: true,
    canManageFinance: false,
    canManageContractors: false,
    canManageWorkforce: false,
    canManageCompliance: false,
    canEditSettings: false,
    isReadOnly: false,
  },
  'Regulatory Authority': {
    allowedModules: [
      'dashboard',
      'mines',
      'mine-operations',
      'transportation',
      'compliance',
      'inspections',
      'incidents',
      'environment',
      'emergency',
      'reports',
      'daily-report',
      'audit-trail',
      'notifications',
    ],
    dataScope: 'all',
    canAssignAction: false,
    canVerifyAction: false,
    canCreateInspection: false,
    canReportHazard: false,
    canManageFinance: false,
    canManageContractors: false,
    canManageWorkforce: false,
    canManageCompliance: false,
    canEditSettings: false,
    isReadOnly: true,
  },
  'Government Department': {
    allowedModules: [
      'dashboard',
      'mines',
      'compliance',
      'inspections',
      'incidents',
      'environment',
      'reports',
      'daily-report',
      'audit-trail',
      'notifications',
    ],
    dataScope: 'all',
    canAssignAction: false,
    canVerifyAction: false,
    canCreateInspection: false,
    canReportHazard: false,
    canManageFinance: false,
    canManageContractors: false,
    canManageWorkforce: false,
    canManageCompliance: false,
    canEditSettings: false,
    isReadOnly: true,
  },
  'Corporate Management': {
    allowedModules: [
      'dashboard',
      'mines',
      'mine-operations',
      'transportation',
      'compliance',
      'finance',
      'reports',
      'daily-report',
      'gis-map',
      'risk-intelligence',
      'notifications',
    ],
    dataScope: 'all',
    canAssignAction: false,
    canVerifyAction: false,
    canCreateInspection: false,
    canReportHazard: false,
    canManageFinance: true,
    canManageContractors: false,
    canManageWorkforce: false,
    canManageCompliance: false,
    canEditSettings: false,
    isReadOnly: true,
  },
  'System Administrator': {
    allowedModules: [
      'dashboard',
      'mines',
      'approval-center',
      'data-quality',
      'audit-trail',
      'notifications',
      'settings',
    ],
    dataScope: 'all',
    canAssignAction: true,
    canVerifyAction: true,
    canCreateInspection: true,
    canReportHazard: true,
    canManageFinance: true,
    canManageContractors: true,
    canManageWorkforce: true,
    canManageCompliance: true,
    canEditSettings: true,
    isReadOnly: false,
  },
};
