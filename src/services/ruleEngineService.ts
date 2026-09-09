// MINEGOV AI - Deterministic Statutory Rule Engine Service
// AI provides predictions and risk scores; the Rule Engine enforces statutory laws & mandates.

import type { Violation } from '../types';
import type { AIRiskAssessment } from './aiRiskService';

export interface RuleEngineDecision {
  mandatedSlaHours: number;
  automaticEscalationLevel: number; // 0: None, 1: Mine Head, 2: Area Manager, 3: Coal Mine Manager
  stopWorkOrderRequired: boolean;
  notifiedRoleTargets: string[];
  statutoryRuleApplied: string;
  contractorPenaltyAction?: string;
  selfApprovalAllowed: boolean;
}

export function evaluateStatutoryRules(
  violation: Partial<Violation>,
  aiAssessment: AIRiskAssessment
): RuleEngineDecision {
  const isCritical = aiAssessment.score >= 81 || violation.severity === 'CRITICAL';
  const isHigh = aiAssessment.score >= 61 || violation.severity === 'HIGH';
  const isMedium = aiAssessment.score >= 31 || violation.severity === 'MEDIUM';

  // Rule 1: SLA Deadlines based on CMR 2017 risk tiers
  let mandatedSlaHours = 120; // 5 days default
  if (isCritical) {
    mandatedSlaHours = 24; // 24 hours strictly
  } else if (isHigh) {
    mandatedSlaHours = 72; // 3 days
  } else if (isMedium) {
    mandatedSlaHours = 96; // 4 days
  }

  // Rule 2: Automatic Hierarchy Escalations
  let automaticEscalationLevel = 0;
  if (isCritical) {
    automaticEscalationLevel = 1; // Immediate L1 escalation to Mine Head & notification to Area Manager
  }

  // Rule 3: Stop Work Order enforcement
  const isHazardousCategory =
    violation.category?.toLowerCase().includes('electrical') ||
    violation.category?.toLowerCase().includes('gas') ||
    violation.category?.toLowerCase().includes('strata');
  const stopWorkOrderRequired = Boolean(aiAssessment.score >= 85 && isHazardousCategory);

  // Rule 4: Multi-Role Notification Targets
  const notifiedRoleTargets: string[] = ['Safety Officer', 'Inspection Officer'];
  if (isHigh || isCritical) {
    notifiedRoleTargets.push('Mine Head');
  }
  if (isCritical) {
    notifiedRoleTargets.push('Area Manager', 'Coal Mine Manager', 'Regulatory Authority');
  }

  // Rule 5: Contractor Penalty & Payment Hold Rule
  let contractorPenaltyAction: string | undefined = undefined;
  if (violation.contractorName && isCritical) {
    contractorPenaltyAction = `Automatic 10% payment withholding applied to ${violation.contractorName} pending full verification.`;
  }

  // Rule 6: Self-approval prevention
  const selfApprovalAllowed = false; // By statutory policy, no officer can approve their own corrective work

  const statutoryRuleApplied = isCritical
    ? 'DGMS Section 22 / CMR 2017 Fast-Track Escalation Protocol'
    : isHigh
    ? 'CMR 2017 Standard Corrective Action SLA'
    : 'Routine Internal Mining Safety Audit Guidelines';

  return {
    mandatedSlaHours,
    automaticEscalationLevel,
    stopWorkOrderRequired,
    notifiedRoleTargets,
    statutoryRuleApplied,
    contractorPenaltyAction,
    selfApprovalAllowed,
  };
}
