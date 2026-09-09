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
  SEED_INCIDENTS,
  SEED_GRIEVANCES,
  SEED_FINANCE,
  SEED_NOTIFICATIONS,
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

  runOcrOnDocument: (docId: string) => Promise<DocumentRecord>;
  submitGrievance: (category: WorkerGrievance['category'], description: string, isAnonymous: boolean) => void;

  syncOfflineQueue: () => Promise<number>;
  clearNotification: (id: string) => void;
  markAllNotificationsRead: () => void;
  verifyLedgerIntegrity: () => { isValid: boolean; message: string };

  queryAiAssistant: (query: string) => { answer: string; data?: any[] };
  queryRegulatoryRAG: (query: string) => { answer: string; citation: string; date: string };
}

const GovernanceContext = createContext<GovernanceContextType | undefined>(undefined);

export const GovernanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [mines, setMines] = useState<Mine[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>([]);
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [violations, setViolations] = useState<Violation[]>([]);
  const [correctiveActions, setCorrectiveActions] = useState<CorrectiveAction[]>([]);
  const [incidents, setIncidents] = useState<IncidentReport[]>([]);
  const [readings, setReadings] = useState<EnvironmentalReading[]>([]);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [blockchainBlocks, setBlockchainBlocks] = useState<BlockchainBlock[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [offlineQueue, setOfflineQueue] = useState<OfflineQueueItem[]>([]);
  const [grievances, setGrievances] = useState<WorkerGrievance[]>([]);
  const [financeBudgets, setFinanceBudgets] = useState<FinanceBudget[]>([]);
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
      localStorage.setItem('minegov_blockchain', JSON.stringify([SEED_GENESIS_BLOCK]));
      localStorage.setItem('minegov_audit_logs', JSON.stringify([]));
      localStorage.setItem('minegov_notifications', JSON.stringify(SEED_NOTIFICATIONS));
      localStorage.setItem('minegov_grievances', JSON.stringify(SEED_GRIEVANCES));
      localStorage.setItem('minegov_finance', JSON.stringify(SEED_FINANCE));
      localStorage.setItem('minegov_initialized_v2', 'true');
    }

    setUsers(JSON.parse(localStorage.getItem('minegov_users') || JSON.stringify(SEED_USERS)));
    setAreas(JSON.parse(localStorage.getItem('minegov_areas') || JSON.stringify(SEED_AREAS)));
    setMines(JSON.parse(localStorage.getItem('minegov_mines') || JSON.stringify(SEED_MINES)));
    setWorkers(JSON.parse(localStorage.getItem('minegov_workers') || JSON.stringify(generateWorkers())));
    setContractors(JSON.parse(localStorage.getItem('minegov_contractors') || JSON.stringify(SEED_CONTRACTORS)));
    setComplianceItems(JSON.parse(localStorage.getItem('minegov_compliance') || JSON.stringify(SEED_COMPLIANCE_ITEMS)));
    setInspections(JSON.parse(localStorage.getItem('minegov_inspections') || JSON.stringify(generateInspections())));
    setViolations(JSON.parse(localStorage.getItem('minegov_violations') || JSON.stringify(generateViolations())));
    setCorrectiveActions(JSON.parse(localStorage.getItem('minegov_corrective') || JSON.stringify(generateCorrectiveActions())));
    setIncidents(JSON.parse(localStorage.getItem('minegov_incidents') || JSON.stringify(SEED_INCIDENTS)));
    setReadings(JSON.parse(localStorage.getItem('minegov_readings') || JSON.stringify(generateEnvironmentalReadings())));
    setDocuments(JSON.parse(localStorage.getItem('minegov_documents') || JSON.stringify(SEED_DOCUMENTS)));
    setBlockchainBlocks(JSON.parse(localStorage.getItem('minegov_blockchain') || JSON.stringify([SEED_GENESIS_BLOCK])));
    setAuditLogs(JSON.parse(localStorage.getItem('minegov_audit_logs') || '[]'));
    
    // Seed notifications if currently empty in storage
    const savedNotifs = JSON.parse(localStorage.getItem('minegov_notifications') || '[]');
    if (savedNotifs && savedNotifs.length > 0) {
      setNotifications(savedNotifs);
    } else {
      setNotifications(SEED_NOTIFICATIONS);
      localStorage.setItem('minegov_notifications', JSON.stringify(SEED_NOTIFICATIONS));
    }
    setGrievances(JSON.parse(localStorage.getItem('minegov_grievances') || JSON.stringify(SEED_GRIEVANCES)));
    setFinanceBudgets(JSON.parse(localStorage.getItem('minegov_finance') || JSON.stringify(SEED_FINANCE)));
    setOfflineQueue(getOfflineQueue());

    // Restore active session
    const savedUser = sessionStorage.getItem('minegov_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    } else {
      // Default to Coal Mine Manager for rich immediate viewing
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
    const matched = users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        (!role || u.role.toLowerCase() === role.toLowerCase())
    );
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
    setComplianceItems((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, status } : c));
      saveEntity('minegov_compliance', updated);
      return updated;
    });
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
    if (!currentUser || currentUser.role === 'Coal Mine Manager' || currentUser.role === 'Regulatory Authority') {
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

  // Permissions and Helpers
  const permissions: RolePermissions =
    ROLE_PERMISSIONS_MAP[currentUser?.role || 'Coal Mine Manager'] ||
    ROLE_PERMISSIONS_MAP['Coal Mine Manager'];

  const isModuleAllowed = (moduleId: string): boolean => {
    return permissions.allowedModules.includes(moduleId);
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
        isOffline,
        permissions,
        isModuleAllowed,
        canPerform,
        login,
        logout,
        quickSwitchUser,
        resetDemoData,
        toggleOfflineMode,
        submitReport,
        assignViolation,
        submitCorrectiveAction,
        verifyCorrectiveAction,
        triggerManualEscalation,
        addComplianceItem,
        updateComplianceStatus,
        createInspection,
        addEnvironmentalReading,
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
