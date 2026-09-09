// MINEGOV AI - AI Risk Intelligence & Recommendation Service
import type { SeverityLevel } from '../types';

export interface AIRiskAssessment {
  score: number; // 0-100
  level: SeverityLevel;
  contributingFactors: string[];
  detectedAnomaly?: string;
  recurringViolationPattern?: string;
  recommendedAction: string;
  statutoryRuleCitation: string;
}

export function calculateAIRiskScore(
  severity: SeverityLevel,
  recurrenceCount: number,
  overdueHours: number,
  historicalRisk: number,
  locationHazardScore: number,
  category: string
): AIRiskAssessment {
  // Severity weight (Max 30)
  const sevWeight = severity === 'CRITICAL' ? 30 : severity === 'HIGH' ? 22 : severity === 'MEDIUM' ? 12 : 5;

  // Recurrence weight (Max 20)
  const recWeight = Math.min(recurrenceCount * 6, 20);

  // Overdue delay weight (Max 15)
  const delayWeight = Math.min((overdueHours / 24) * 5, 15);

  // Location sensitivity (Max 15)
  const locWeight = Math.min((locationHazardScore / 100) * 15, 15);

  // Historical mine zone risk (Max 10)
  const histWeight = Math.min((historicalRisk / 100) * 10, 10);

  // Category specific risk multiplier (Max 10)
  let catWeight = 5;
  if (category.toLowerCase().includes('electrical') || category.toLowerCase().includes('gas') || category.toLowerCase().includes('strata')) {
    catWeight = 10;
  }

  let totalScore = Math.round(sevWeight + recWeight + delayWeight + locWeight + histWeight + catWeight);
  totalScore = Math.min(Math.max(totalScore, 5), 100);

  let level: SeverityLevel = 'LOW';
  if (totalScore >= 81) level = 'CRITICAL';
  else if (totalScore >= 61) level = 'HIGH';
  else if (totalScore >= 31) level = 'MEDIUM';

  const contributingFactors: string[] = [];
  if (severity === 'CRITICAL') contributingFactors.push('Statutory Critical Severity classification');
  if (severity === 'HIGH') contributingFactors.push('High-risk operational hazard category');
  if (recurrenceCount > 0) {
    contributingFactors.push(`${recurrenceCount} recurrent non-compliances detected in this zone within 14 days`);
  }
  if (overdueHours > 0) {
    contributingFactors.push(`Corrective action overdue by ${Math.round(overdueHours)} hours past statutory SLA`);
  }
  if (locationHazardScore >= 70) {
    contributingFactors.push('Critical workspace zone (High Voltage Substation / Underground Shaft Entrance)');
  }
  if (histWeight >= 6) {
    contributingFactors.push('Elevated historical incident records in this mine section');
  }
  if (contributingFactors.length === 0) {
    contributingFactors.push('Baseline statutory compliance threshold');
  }

  let detectedAnomaly: string | undefined = undefined;
  if (totalScore >= 80) {
    detectedAnomaly = 'Abnormal cluster of multi-factor safety hazards threatening production shift.';
  }

  let recurringViolationPattern: string | undefined = undefined;
  if (recurrenceCount >= 2) {
    recurringViolationPattern = `Persistent recurring violation pattern detected: ${category} repeated across multiple shifts. Immediate root-cause engineering review required.`;
  }

  // Recommended action
  let recommendedAction = 'Maintain standard shift supervisory inspection and log routine progress.';
  let statutoryRuleCitation = 'Mines Act 1952 General Provisions';

  if (category.toLowerCase().includes('electrical')) {
    recommendedAction =
      'Immediate de-energization of electrical zone, initiate dewatering protocols, and verify flameproof seals before re-energizing.';
    statutoryRuleCitation = 'Regulation 100, CEA (Measures Relating to Safety & Electric Supply)';
  } else if (category.toLowerCase().includes('gas') || category.toLowerCase().includes('methane')) {
    recommendedAction =
      'Evacuate return air way immediately. Re-direct auxiliary blower fans to achieve methane concentration below 0.5%.';
    statutoryRuleCitation = 'Regulation 169, CMR 2017 (Ventilation & Inflammable Gas)';
  } else if (category.toLowerCase().includes('barrier')) {
    recommendedAction =
      'Erect temporary steel barricades immediately; replace permanent chain-link edge protection with anchor concrete within 24 hours.';
    statutoryRuleCitation = 'DGMS Circular No. 12 of 2021 (Fencing Standards)';
  } else if (totalScore >= 81) {
    recommendedAction =
      'Immediate escalation to Mine Head and Area Manager. Halt active operations in the zone until certified by a Statutory Safety Officer.';
    statutoryRuleCitation = 'CMR 2017 Emergency Protocol & Section 22 Mines Act 1952';
  }

  return {
    score: totalScore,
    level,
    contributingFactors,
    detectedAnomaly,
    recurringViolationPattern,
    recommendedAction,
    statutoryRuleCitation,
  };
}
