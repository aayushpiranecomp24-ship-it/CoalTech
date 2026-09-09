// MINEGOV AI - Comprehensive Type Definitions

export type RoleType =
  | 'Coal Mine Manager'
  | 'Area Manager'
  | 'Mine Head'
  | 'Safety Officer'
  | 'Inspection Officer'
  | 'Environment Officer'
  | 'Contractor Manager'
  | 'Finance Officer'
  | 'Workforce Head'
  | 'Worker'
  | 'Regulatory Authority';

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
  areaId: string;
  manager: string;
  riskScore: number; // 0-100
  complianceScore: number; // 0-100
  latitude: number;
  longitude: number;
  type: 'Underground' | 'Opencast' | 'Mixed';
  zones: string[];
  productionCapacityMTPA: number;
  workforceCount: number;
}

export interface Worker {
  id: string;
  name: string;
  mineId: string;
  department: string;
  role: string;
  shift: string;
  attendanceStatus: 'Present' | 'Absent' | 'On Leave';
  trainingStatus: 'Completed' | 'Pending' | 'Expired';
  supervisorId: string;
  badgeNumber: string;
  safetyScore: number;
  emergencyContact: string;
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

export interface FinanceBudget {
  mineId: string;
  totalSafetyBudget: number; // in INR Lakhs
  utilizedBudget: number;
  penaltiesLevied: number;
  contractorPayableWithheld: number;
  environmentalCess: number;
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
      'compliance',
      'inspections',
      'incidents',
      'corrective',
      'contractors',
      'workforce',
      'environment',
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
  'Area Manager': {
    allowedModules: [
      'dashboard',
      'mines',
      'compliance',
      'inspections',
      'incidents',
      'corrective',
      'contractors',
      'environment',
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
      'compliance',
      'inspections',
      'incidents',
      'corrective',
      'contractors',
      'workforce',
      'environment',
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
      'reports',
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
      'incidents',
      'compliance',
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
      'contractors',
      'reports',
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
      'reports',
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
      'compliance',
      'inspections',
      'incidents',
      'environment',
      'reports',
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
};
