// MINEGOV AI - Dynamic Role-Aware Executive & Operational Command Center
import React from 'react';
import { useGovernance } from '../context/GovernanceContext';
import { useI18n } from '../context/I18nContext';
import { StatCard } from '../components/common/StatCard';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Building2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Users2,
  Activity,
  ShieldAlert,
  FileCheck2,
  ArrowRight,
  Coins,
  HardHat,
  Eye,
  FileText,
  ShieldCheck,
  Plus,
  Send,
  Download,
} from 'lucide-react';

interface DashboardPageProps {
  onNavigateTab: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigateTab }) => {
  const {
    currentUser,
    mines,
    violations,
    correctiveActions,
    contractors,
    readings,
    workers,
    grievances,
    inspections,
  } = useGovernance();
  const { t } = useI18n();

  const role = currentUser?.role || 'Coal Mine Manager';

  // Common aggregates based on scoped data
  const activeViolations = violations.filter((v) => v.status !== 'CLOSED');
  const criticalRisks = activeViolations.filter((v) => v.severity === 'CRITICAL');
  const pendingActions = correctiveActions.filter((c) => c.status !== 'Closed' && c.status !== 'Approved');
  const overdueActions = violations.filter((v) => v.status !== 'CLOSED' && new Date(v.deadline) < new Date());
  const compliantContractors = contractors.filter((c) => c.complianceStatus === 'Compliant');
  const environmentalAlerts = readings.filter((r) => r.anomaly);
  const avgComplianceScore = Math.round(
    mines.reduce((acc, m) => acc + m.complianceScore, 0) / (mines.length || 1)
  );

  // Recharts Datasets
  const riskTrendData = [
    { month: 'Apr', enterpriseRisk: 42, complianceIndex: 88 },
    { month: 'May', enterpriseRisk: 48, complianceIndex: 85 },
    { month: 'Jun', enterpriseRisk: 62, complianceIndex: 79 },
    { month: 'Jul', enterpriseRisk: 58, complianceIndex: 81 },
    { month: 'Aug', enterpriseRisk: 74, complianceIndex: 74 },
    { month: 'Sep', enterpriseRisk: 68, complianceIndex: 78 },
  ];

  const mineComparisonData = mines.map((m) => ({
    name: m.name.replace('OpenCast', 'OC').replace('Underground', 'UG'),
    riskScore: m.riskScore,
    complianceScore: m.complianceScore,
  }));

  const openVsClosedData = [
    { name: t('status_closed', 'Closed / Approved'), value: violations.filter((v) => v.status === 'CLOSED').length, color: '#10b981' },
    { name: t('status_open', 'Open / In Remediation'), value: activeViolations.length, color: '#ef4444' },
    { name: t('status_under_verification', 'Pending Verification'), value: violations.filter((v) => v.status === 'ACTION_SUBMITTED').length, color: '#f59e0b' },
  ];

  // Dynamic Dashboard Banners per Role
  const getRoleHeaderInfo = () => {
    switch (role) {
      case 'Coal Mine Manager':
        return {
          title: t('dash_banner_cmm', 'Enterprise Operational Governance & Multi-Mine Command Center'),
          subtitle: t('dash_sub_cmm', 'Real-time multi-mine telemetry aligned with Coal Mines Regulations 2017 & DGMS directives.'),
          scopeChip: t('scope_enterprise', 'Enterprise Scope • All 5 Mines'),
        };
      case 'Area Manager':
        return {
          title: t('dash_banner_am', 'Regional Command Center • Mine Comparison & Area Compliance'),
          subtitle: t('dash_sub_am', 'Area command oversight across assigned coal sectors, active violations, and SLA remediation timelines.'),
          scopeChip: t('scope_area', 'Area Command Scope • Assigned Sector'),
        };
      case 'Mine Head':
        return {
          title: t('dash_banner_mh', 'Mine Operations Hub • Daily Safety, Production & Remediation Oversight'),
          subtitle: t('dash_sub_mh', 'Operational lead for on-site worker safety, contractor HEMM deployment, and corrective action approvals.'),
          scopeChip: t('scope_mine', 'Mine Operations Scope • Assigned Mine Only'),
        };
      case 'Safety Officer':
        return {
          title: t('dash_banner_so', 'Mine Safety & Hazard Command • Statutory Accident Prevention'),
          subtitle: t('dash_sub_so', 'Active hazard mitigation, root-cause investigation, and mandatory Section 22 compliance enforcement.'),
          scopeChip: t('scope_safety', 'Safety Department Scope • Hazard Mitigation'),
        };
      case 'Inspection Officer':
        return {
          title: t('dash_banner_io', 'Statutory Field Sweeps & Independent Inspection Board'),
          subtitle: t('dash_sub_io', 'Official field inspections, physical condition verification, and evidence certification registry.'),
          scopeChip: t('scope_inspection', 'Statutory Inspection Scope • Independent Audits'),
        };
      case 'Environment Officer':
        return {
          title: t('dash_banner_eo', 'Mine Ecological Monitoring • Air, Gas & Effluent Quality Telemetry'),
          subtitle: t('dash_sub_eo', 'Real-time telemetry of underground methane, airborne particulate matter (SPM), and wastewater pH.'),
          scopeChip: t('scope_environment', 'Environmental Scope • Sensor Telemetry & Ecology'),
        };
      case 'Contractor Manager':
        return {
          title: t('dash_banner_co', 'Contractor Compliance Scorecard & Machinery Fitness Registry'),
          subtitle: t('dash_sub_co', 'Vendor compliance scorecard, contractor worker rosters, and HEMM heavy machinery safety certifications.'),
          scopeChip: t('scope_contractor', 'Contractor Oversight Scope • Vendor Management'),
        };
      case 'Finance Officer':
        return {
          title: t('dash_banner_fo', 'Corporate Accounts & Statutory Compliance Payment Clearance Holds'),
          subtitle: t('dash_sub_fo', 'Automated invoice payment holds triggered by open critical safety breaches and statutory penalty deductions.'),
          scopeChip: t('scope_finance', 'Finance & Accounts Scope • Statutory Penalties'),
        };
      case 'Workforce Head':
        return {
          title: t('dash_banner_wo', 'Labour Welfare, Vocational Training & Shift Deployment Center'),
          subtitle: t('dash_sub_wo', 'Shift attendance tracking, mandatory vocational refresher courses, and confidential worker grievance resolution.'),
          scopeChip: t('scope_workforce', 'Workforce & Labour Scope • Welfare & Roster'),
        };
      case 'Worker':
        return {
          title: t('dash_banner_worker', 'Worker Field Portal • Shift Schedule, Hazard Reporting & Welfare'),
          subtitle: t('dash_sub_worker', 'Underground miner daily portal for fast hazard reporting, voice notes in Hindi, and safety certificates.'),
          scopeChip: t('scope_worker', 'Personal Field Scope • Underground Miner'),
        };
      case 'Regulatory Authority':
        return {
          title: t('dash_banner_dgms', 'DGMS Regulatory Surveillance & National Mine Safety Oversight'),
          subtitle: t('dash_sub_dgms', 'External statutory audit oversight, non-compliance notice tracking, and blockchain ledger validation.'),
          scopeChip: t('scope_regulatory', 'Regulatory Oversight Scope • DGMS Statutory Surveillance'),
        };
      default:
        return {
          title: 'MINEGOV AI Command Center',
          subtitle: 'Operational compliance monitoring system for coal mines.',
          scopeChip: 'Standard Scope',
        };
    }
  };

  const headerInfo = getRoleHeaderInfo();

  // Role-Specific KPI Cards Rendering
  const renderRoleCards = () => {
    switch (role) {
      case 'Coal Mine Manager':
        return (
          <>
            <StatCard
              title={t('kpi_enterprise_compliance', 'Statutory Compliance Score')}
              value={`${avgComplianceScore}%`}
              subtitle={t('scope_enterprise', 'Enterprise Benchmark')}
              icon={FileCheck2}
              trend="+2.4% vs last mo"
              trendType="up"
              riskLevel={avgComplianceScore < 75 ? 'MEDIUM' : 'LOW'}
              onClick={() => onNavigateTab('compliance')}
            />
            <StatCard
              title={t('kpi_critical_violations', 'Critical Violations')}
              value={criticalRisks.length}
              subtitle={t('dash_sub_so', 'Immediate hazard stop')}
              icon={ShieldAlert}
              trend={`${activeViolations.length} total active`}
              trendType="alert"
              riskLevel={criticalRisks.length > 0 ? 'CRITICAL' : 'LOW'}
              onClick={() => onNavigateTab('incidents')}
            />
            <StatCard
              title={t('kpi_total_mines', 'Active Coal Mines')}
              value={mines.length}
              subtitle="Jharkhand, WB, MP"
              icon={Building2}
              trend="5 Operating Sectors"
              riskLevel="LOW"
              onClick={() => onNavigateTab('mines')}
            />
            <StatCard
              title={t('kpi_overdue_actions', 'Overdue SLA Remediation')}
              value={overdueActions.length}
              subtitle={t('field_deadline', 'Statutory SLA breached')}
              icon={Clock}
              trend="L2/L3 Auto Escalation"
              trendType={overdueActions.length > 0 ? 'alert' : 'neutral'}
              riskLevel={overdueActions.length > 0 ? 'CRITICAL' : 'LOW'}
              onClick={() => onNavigateTab('corrective')}
            />
            <StatCard
              title={t('kpi_annual_production', 'Annual Capacity (MTPA)')}
              value="24.5 MT"
              subtitle="Planned Extraction"
              icon={Activity}
              trend="On Track"
              riskLevel="LOW"
              onClick={() => onNavigateTab('mines')}
            />
            <StatCard
              title={t('kpi_total_workforce', 'Total Deployed Workforce')}
              value="1,450"
              subtitle="All Mine Shifts"
              icon={Users2}
              trend="96.8% Attendance"
              riskLevel="LOW"
              onClick={() => onNavigateTab('workforce')}
            />
            <StatCard
              title={t('kpi_contractor_compliance', 'Contractor Compliance')}
              value={`${Math.round((compliantContractors.length / (contractors.length || 1)) * 100)}%`}
              subtitle={`${contractors.length - compliantContractors.length} vendors on hold`}
              icon={Users2}
              trend="Payment hold active"
              riskLevel={contractors.length - compliantContractors.length > 0 ? 'HIGH' : 'LOW'}
              onClick={() => onNavigateTab('contractors')}
            />
            <StatCard
              title={t('kpi_environmental_alerts', 'Environmental Alerts')}
              value={environmentalAlerts.length}
              subtitle={t('kpi_env_anomalies', 'Sensor Spikes')}
              icon={Activity}
              trend="Methane & Dust Spikes"
              trendType="alert"
              riskLevel={environmentalAlerts.length > 0 ? 'HIGH' : 'LOW'}
              onClick={() => onNavigateTab('environment')}
            />
          </>
        );

      case 'Area Manager':
        return (
          <>
            <StatCard
              title={t('kpi_area_compliance', 'Area Compliance Score')}
              value={`${avgComplianceScore}%`}
              subtitle="North Area (Jharia)"
              icon={FileCheck2}
              trend="+3.1% this month"
              trendType="up"
              riskLevel={avgComplianceScore < 75 ? 'MEDIUM' : 'LOW'}
              onClick={() => onNavigateTab('compliance')}
            />
            <StatCard
              title={t('kpi_area_violations', 'Active Area Violations')}
              value={activeViolations.length}
              subtitle={`${criticalRisks.length} critical in sector`}
              icon={AlertTriangle}
              trend="Assigned to mine heads"
              trendType={criticalRisks.length > 0 ? 'alert' : 'neutral'}
              riskLevel={criticalRisks.length > 0 ? 'HIGH' : 'MEDIUM'}
              onClick={() => onNavigateTab('incidents')}
            />
            <StatCard
              title={t('kpi_mines_in_area', 'Mines in Area Command')}
              value={mines.length}
              subtitle="Jharia Deep & Dhanbad Seam"
              icon={Building2}
              trend="2 Mines Active"
              riskLevel="LOW"
              onClick={() => onNavigateTab('mines')}
            />
            <StatCard
              title={t('kpi_overdue_actions', 'Overdue SLA Actions')}
              value={overdueActions.length}
              subtitle="Mandatory 24h/72h SLA"
              icon={Clock}
              trend="Requires Escalation"
              trendType={overdueActions.length > 0 ? 'alert' : 'neutral'}
              riskLevel={overdueActions.length > 0 ? 'CRITICAL' : 'LOW'}
              onClick={() => onNavigateTab('corrective')}
            />
            <StatCard
              title={t('kpi_contractor_compliance', 'Vendor Performance')}
              value={`${Math.round((compliantContractors.length / (contractors.length || 1)) * 100)}%`}
              subtitle="Area Contractors"
              icon={Users2}
              trend="Under Review"
              riskLevel="LOW"
              onClick={() => onNavigateTab('contractors')}
            />
            <StatCard
              title={t('kpi_area_environmental', 'Area Environmental Alerts')}
              value={environmentalAlerts.length}
              subtitle="Methane Spikes"
              icon={Activity}
              trend="Sensor Anomaly"
              trendType="alert"
              riskLevel={environmentalAlerts.length > 0 ? 'HIGH' : 'LOW'}
              onClick={() => onNavigateTab('environment')}
            />
          </>
        );

      case 'Mine Head':
        return (
          <>
            <StatCard
              title={t('kpi_mine_risk_score', 'Mine Risk Score')}
              value={`${mines[0]?.riskScore || 74}/100`}
              subtitle={mines[0]?.name || 'Jharia Deep Mine A'}
              icon={ShieldAlert}
              trend="Elevated - Electrical cable"
              trendType="alert"
              riskLevel={mines[0]?.riskScore >= 70 ? 'CRITICAL' : 'MEDIUM'}
              onClick={() => onNavigateTab('gis-map')}
            />
            <StatCard
              title={t('kpi_active_mine_violations', 'Active Mine Violations')}
              value={activeViolations.length}
              subtitle={`${criticalRisks.length} critical hazards`}
              icon={AlertTriangle}
              trend="Under remediation"
              riskLevel="HIGH"
              onClick={() => onNavigateTab('incidents')}
            />
            <StatCard
              title={t('kpi_pending_approvals', 'Actions Awaiting Approval')}
              value={violations.filter((v) => v.status === 'ACTION_SUBMITTED').length}
              subtitle="Inspection proof ready"
              icon={CheckCircle2}
              trend="Approval required"
              trendType="up"
              riskLevel="LOW"
              onClick={() => onNavigateTab('corrective')}
            />
            <StatCard
              title={t('kpi_shift_count', 'Active Working Shifts')}
              value="3 Shifts"
              subtitle="24h Continuous Cycle"
              icon={Clock}
              trend="Morning Shift A Active"
              riskLevel="LOW"
              onClick={() => onNavigateTab('workforce')}
            />
            <StatCard
              title={t('kpi_mine_personnel', 'On-Site Personnel')}
              value={workers.length || 450}
              subtitle="Mine Workforce"
              icon={HardHat}
              trend="96.2% Present"
              riskLevel="LOW"
              onClick={() => onNavigateTab('workforce')}
            />
            <StatCard
              title={t('kpi_machinery_fitness', 'HEMM Machinery Fitness')}
              value="94.8%"
              subtitle="Heavy Equipment Fitness"
              icon={Activity}
              trend="1 Unit on Inspection"
              riskLevel="LOW"
              onClick={() => onNavigateTab('contractors')}
            />
          </>
        );

      case 'Safety Officer':
        return (
          <>
            <StatCard
              title={t('kpi_open_hazards', 'Open Safety Hazards')}
              value={activeViolations.length}
              subtitle="Immediate action required"
              icon={AlertTriangle}
              trend={`${criticalRisks.length} Critical Risks`}
              trendType="alert"
              riskLevel={criticalRisks.length > 0 ? 'CRITICAL' : 'MEDIUM'}
              onClick={() => onNavigateTab('incidents')}
            />
            <StatCard
              title={t('kpi_critical_hazards', 'Immediate Threat (Critical)')}
              value={criticalRisks.length}
              subtitle="Zone 4 Substation & Face 3"
              icon={ShieldAlert}
              trend="CMR Regulation 123 Breach"
              trendType="alert"
              riskLevel="CRITICAL"
              onClick={() => onNavigateTab('incidents')}
            />
            <StatCard
              title={t('kpi_actions_in_progress', 'Actions Under Remediation')}
              value={pendingActions.length}
              subtitle="Assigned to engineers"
              icon={CheckCircle2}
              trend="Active Repair Cycle"
              riskLevel="LOW"
              onClick={() => onNavigateTab('corrective')}
            />
            <StatCard
              title={t('kpi_overdue_actions', 'Overdue SLA Violations')}
              value={overdueActions.length}
              subtitle="24h SLA breached"
              icon={Clock}
              trend="Escalated to Mine Head"
              trendType="alert"
              riskLevel={overdueActions.length > 0 ? 'CRITICAL' : 'LOW'}
              onClick={() => onNavigateTab('corrective')}
            />
            <StatCard
              title={t('kpi_inspections_month', 'Safety Sweeps This Month')}
              value={inspections.length || 8}
              subtitle="Physical Audits Conducted"
              icon={Eye}
              trend="Zone 1 - 5 Covered"
              riskLevel="LOW"
              onClick={() => onNavigateTab('inspections')}
            />
            <StatCard
              title={t('kpi_safety_training_rate', 'Worker Safety Certification')}
              value="91.4%"
              subtitle="Vocational Training Up-to-date"
              icon={ShieldCheck}
              trend="14 Refresher Due"
              riskLevel="LOW"
              onClick={() => onNavigateTab('incidents')}
            />
          </>
        );

      case 'Inspection Officer':
        return (
          <>
            <StatCard
              title={t('kpi_inspections_completed', 'Field Audits Completed')}
              value={inspections.filter((i) => i.status === 'Closed').length || 12}
              subtitle="Certified Records"
              icon={Eye}
              trend="+4 this week"
              trendType="up"
              riskLevel="LOW"
              onClick={() => onNavigateTab('inspections')}
            />
            <StatCard
              title={t('kpi_under_review_inspections', 'Audits Under Review')}
              value={inspections.filter((i) => i.status === 'Submitted' || i.status === 'Under Review').length || 4}
              subtitle="Verification pending"
              icon={Clock}
              trend="Requires Inspector Sign-off"
              riskLevel="MEDIUM"
              onClick={() => onNavigateTab('inspections')}
            />
            <StatCard
              title={t('kpi_violations_flagged', 'Violations Flagged')}
              value={activeViolations.length}
              subtitle="During Inspection Sweeps"
              icon={AlertTriangle}
              trend="Assigned for corrective action"
              riskLevel="HIGH"
              onClick={() => onNavigateTab('incidents')}
            />
            <StatCard
              title={t('kpi_evidence_uploaded', 'Evidence Photo Sets')}
              value="28 Photos"
              subtitle="Geo-stamped Records"
              icon={FileText}
              trend="Attached to Audit Ledger"
              riskLevel="LOW"
              onClick={() => onNavigateTab('inspections')}
            />
            <StatCard
              title={t('kpi_zones_inspected', 'Operational Zones Swept')}
              value="5 / 5 Zones"
              subtitle="100% Mine Spatial Sweep"
              icon={Building2}
              trend="Comprehensive Coverage"
              riskLevel="LOW"
              onClick={() => onNavigateTab('inspections')}
            />
            <StatCard
              title={t('kpi_dgms_readiness', 'DGMS Audit Readiness')}
              value="98.5%"
              subtitle="Form IV & VI Ready"
              icon={ShieldCheck}
              trend="Statutory Compliant"
              riskLevel="LOW"
              onClick={() => onNavigateTab('reports')}
            />
          </>
        );

      case 'Environment Officer':
        return (
          <>
            <StatCard
              title={t('kpi_air_quality', 'Air Quality Index (SPM)')}
              value="142 µg/m³"
              subtitle="Permissible: < 200 µg/m³"
              icon={Activity}
              trend="Within Normal Limit"
              trendType="up"
              riskLevel="LOW"
              onClick={() => onNavigateTab('environment')}
            />
            <StatCard
              title={t('kpi_methane_level', 'Methane (CH4) Concentration')}
              value="0.68%"
              subtitle="Permissible: < 0.75%"
              icon={AlertTriangle}
              trend="Substation Alert Spike (0.82%)"
              trendType="alert"
              riskLevel="HIGH"
              onClick={() => onNavigateTab('environment')}
            />
            <StatCard
              title={t('kpi_water_ph', 'Tailings Effluent pH')}
              value="7.2 pH"
              subtitle="Standard: 6.5 - 8.5"
              icon={CheckCircle2}
              trend="Neutralized"
              riskLevel="LOW"
              onClick={() => onNavigateTab('environment')}
            />
            <StatCard
              title={t('kpi_dust_suppression', 'Dust Suppression Rate')}
              value="96.4%"
              subtitle="Haul Road Water Mist"
              icon={Activity}
              trend="Mist Nozzles Active"
              riskLevel="LOW"
              onClick={() => onNavigateTab('environment')}
            />
            <StatCard
              title={t('kpi_env_anomalies', 'Telemetry Sensor Spikes')}
              value={environmentalAlerts.length}
              subtitle="Exceeding threshold"
              icon={ShieldAlert}
              trend="Zone 4 Substation Sensor"
              trendType="alert"
              riskLevel={environmentalAlerts.length > 0 ? 'CRITICAL' : 'LOW'}
              onClick={() => onNavigateTab('environment')}
            />
            <StatCard
              title={t('kpi_spcb_compliance', 'SPCB Environmental Consent')}
              value="Valid to 2028"
              subtitle="State Pollution Board Consent"
              icon={FileCheck2}
              trend="Consent to Operate Active"
              riskLevel="LOW"
              onClick={() => onNavigateTab('compliance')}
            />
          </>
        );

      case 'Contractor Manager':
        return (
          <>
            <StatCard
              title={t('kpi_registered_vendors', 'Registered Mining Vendors')}
              value={contractors.length}
              subtitle="Active Contractor Companies"
              icon={Users2}
              trend="ABC Mining & Allied"
              riskLevel="LOW"
              onClick={() => onNavigateTab('contractors')}
            />
            <StatCard
              title={t('kpi_compliant_vendors', 'Fully Compliant Vendors')}
              value={compliantContractors.length}
              subtitle="No pending safety breaches"
              icon={CheckCircle2}
              trend="Clearance Approved"
              riskLevel="LOW"
              onClick={() => onNavigateTab('contractors')}
            />
            <StatCard
              title={t('kpi_vendors_on_hold', 'Vendors with Payment Hold')}
              value={contractors.length - compliantContractors.length}
              subtitle="Automatic Safety Breach Lock"
              icon={Coins}
              trend="Invoice Clearance Blocked"
              trendType="alert"
              riskLevel={contractors.length - compliantContractors.length > 0 ? 'HIGH' : 'LOW'}
              onClick={() => onNavigateTab('contractors')}
            />
            <StatCard
              title={t('kpi_contract_workers', 'Contract Labour Deployed')}
              value="320 Personnel"
              subtitle="Verified Gate Passes"
              icon={HardHat}
              trend="100% Biometric Tagged"
              riskLevel="LOW"
              onClick={() => onNavigateTab('contractors')}
            />
            <StatCard
              title={t('kpi_hemm_units', 'Active Heavy Machinery Units')}
              value="42 Units"
              subtitle="Dumpers, Shovels, Loaders"
              icon={Activity}
              trend="Machinery Fitness Verified"
              riskLevel="LOW"
              onClick={() => onNavigateTab('contractors')}
            />
            <StatCard
              title={t('kpi_active_vendor_violations', 'Active Vendor Violations')}
              value={activeViolations.filter((v) => v.contractorName).length || 2}
              subtitle="Open Contractor Violations"
              icon={AlertTriangle}
              trend="Action required before payment"
              trendType="alert"
              riskLevel="HIGH"
              onClick={() => onNavigateTab('contractors')}
            />
          </>
        );

      case 'Finance Officer':
        return (
          <>
            <StatCard
              title={t('kpi_total_budget', 'Total Operational Budget')}
              value="₹48.5 Cr"
              subtitle="Safety & Production Reserve"
              icon={Coins}
              trend="Annual Allocation"
              riskLevel="LOW"
              onClick={() => onNavigateTab('finance')}
            />
            <StatCard
              title={t('kpi_active_contracts', 'Active Contract Value')}
              value="₹18.2 Cr"
              subtitle="8 Mining Contractor Orders"
              icon={FileText}
              trend="Commercial Execution"
              riskLevel="LOW"
              onClick={() => onNavigateTab('finance')}
            />
            <StatCard
              title={t('kpi_pending_invoices', 'Pending Vendor Bills')}
              value="₹4.8 Cr"
              subtitle="Submitted for Clearance"
              icon={Clock}
              trend="Under Audit Check"
              riskLevel="MEDIUM"
              onClick={() => onNavigateTab('finance')}
            />
            <StatCard
              title={t('kpi_compliance_payment_holds', 'Statutory Payment Holds')}
              value="₹1.25 Cr"
              subtitle="Automatic Safety Lock"
              icon={ShieldAlert}
              trend="Blocked Due to Open Violations"
              trendType="alert"
              riskLevel="CRITICAL"
              onClick={() => onNavigateTab('finance')}
            />
            <StatCard
              title={t('kpi_penalties_imposed', 'Penalties Deducted')}
              value="₹28.4 Lakh"
              subtitle="SLA Breach & Hazard Penalties"
              icon={AlertTriangle}
              trend="CMR Section 22 Deductions"
              trendType="alert"
              riskLevel="HIGH"
              onClick={() => onNavigateTab('finance')}
            />
            <StatCard
              title={t('kpi_cleared_payouts', 'Cleared Compliant Payouts')}
              value="₹3.55 Cr"
              subtitle="Compliant Invoices Paid"
              icon={CheckCircle2}
              trend="Zero Breach Verification"
              riskLevel="LOW"
              onClick={() => onNavigateTab('finance')}
            />
          </>
        );

      case 'Workforce Head':
        return (
          <>
            <StatCard
              title={t('kpi_total_workers', 'Total Registered Workers')}
              value={workers.length || 1240}
              subtitle="Mine Register Form B"
              icon={HardHat}
              trend="Across 3 Shifts"
              riskLevel="LOW"
              onClick={() => onNavigateTab('workforce')}
            />
            <StatCard
              title={t('kpi_shift_attendance', 'Daily Shift Attendance')}
              value="96.4%"
              subtitle="Biometric Attendance Log"
              icon={CheckCircle2}
              trend="+0.8% this week"
              trendType="up"
              riskLevel="LOW"
              onClick={() => onNavigateTab('workforce')}
            />
            <StatCard
              title={t('kpi_training_due', 'Safety Refresher Due')}
              value="14 Personnel"
              subtitle="Mandatory VTC Training"
              icon={Clock}
              trend="Training Slot Scheduled"
              trendType="alert"
              riskLevel="MEDIUM"
              onClick={() => onNavigateTab('workforce')}
            />
            <StatCard
              title={t('kpi_open_grievances', 'Open Labour Grievances')}
              value={grievances.filter((g) => g.status !== 'Resolved').length || 3}
              subtitle="Drinking water & PPE requests"
              icon={AlertTriangle}
              trend="Under Officer Review"
              riskLevel="MEDIUM"
              onClick={() => onNavigateTab('workforce')}
            />
            <StatCard
              title={t('kpi_resolved_grievances', 'Grievances Resolved')}
              value={grievances.filter((g) => g.status === 'Resolved').length || 8}
              subtitle="Resolved this quarter"
              icon={CheckCircle2}
              trend="100% SLA Resolution"
              riskLevel="LOW"
              onClick={() => onNavigateTab('workforce')}
            />
            <StatCard
              title={t('kpi_lti_frequency', 'Lost-Time Injury Rate')}
              value="0.08"
              subtitle="Per Million Man-Hours"
              icon={ShieldCheck}
              trend="Best-in-class benchmark"
              riskLevel="LOW"
              onClick={() => onNavigateTab('workforce')}
            />
          </>
        );

      case 'Worker':
        return (
          <>
            <StatCard
              title={t('kpi_my_shift', 'Assigned Shift')}
              value="Morning Shift (A)"
              subtitle="06:00 - 14:00"
              icon={Clock}
              trend="Currently On Duty"
              trendType="up"
              riskLevel="LOW"
              onClick={() => onNavigateTab('workforce')}
            />
            <StatCard
              title={t('kpi_my_zone', 'Operational Zone')}
              value="Face 3"
              subtitle="Excavation & Haulage"
              icon={Building2}
              trend="Active Extraction Area"
              riskLevel="LOW"
              onClick={() => onNavigateTab('workforce')}
            />
            <StatCard
              title={t('kpi_my_certification', 'Safety Certificate')}
              value="Certified Active"
              subtitle="Valid through 2027"
              icon={ShieldCheck}
              trend="VTC DGMS Verified"
              riskLevel="LOW"
              onClick={() => onNavigateTab('workforce')}
            />
            <StatCard
              title={t('kpi_my_reports', 'Hazards Reported by Me')}
              value="2 Hazards"
              subtitle="Water logged cable & dust"
              icon={AlertTriangle}
              trend="1 Remediated & Verified"
              riskLevel="MEDIUM"
              onClick={() => onNavigateTab('incidents')}
            />
            <StatCard
              title={t('kpi_my_open_grievances', 'Active Grievances')}
              value="1 Request"
              subtitle="Drinking water dispenser filter"
              icon={FileText}
              trend="In Progress with Welfare Officer"
              riskLevel="LOW"
              onClick={() => onNavigateTab('workforce')}
            />
            <StatCard
              title={t('kpi_sos_contact', 'Emergency SOS Hotline')}
              value="Ext: 108"
              subtitle="Control Room Dhanbad"
              icon={Activity}
              trend="24x7 Quick Dial"
              riskLevel="CRITICAL"
              onClick={() => onNavigateTab('incidents')}
            />
          </>
        );

      case 'Regulatory Authority':
        return (
          <>
            <StatCard
              title={t('kpi_dgms_compliance_index', 'National Compliance Index')}
              value={`${avgComplianceScore}%`}
              subtitle="Across Coal Mines Sector"
              icon={FileCheck2}
              trend="Benchmark Aligned"
              trendType="up"
              riskLevel="LOW"
              onClick={() => onNavigateTab('compliance')}
            />
            <StatCard
              title={t('kpi_statutory_violations', 'Active Statutory Breaches')}
              value={activeViolations.length}
              subtitle="Under Formal Notice"
              icon={AlertTriangle}
              trend={`${criticalRisks.length} Section 22 Risks`}
              trendType="alert"
              riskLevel={criticalRisks.length > 0 ? 'CRITICAL' : 'MEDIUM'}
              onClick={() => onNavigateTab('incidents')}
            />
            <StatCard
              title={t('kpi_stop_work_orders', 'Section 22 Orders Issued')}
              value="1 Order"
              subtitle="Tailings Pond Zone 5"
              icon={ShieldAlert}
              trend="Rectification in progress"
              trendType="alert"
              riskLevel="CRITICAL"
              onClick={() => onNavigateTab('incidents')}
            />
            <StatCard
              title={t('kpi_statutory_audits', 'Statutory Audits Conducted')}
              value="28 Audits"
              subtitle="Annual DGMS Sweeps"
              icon={Eye}
              trend="Q3 Surveillance Active"
              riskLevel="LOW"
              onClick={() => onNavigateTab('inspections')}
            />
            <StatCard
              title={t('kpi_blockchain_verified', 'Ledger Cryptographic Integrity')}
              value="100% Valid"
              subtitle="SHA-256 Recursive Chain"
              icon={ShieldCheck}
              trend="Zero Tampering Detected"
              riskLevel="LOW"
              onClick={() => onNavigateTab('audit-trail')}
            />
            <StatCard
              title={t('kpi_inquiry_reports', 'Statutory Inquiry Reports')}
              value="3 Reports"
              subtitle="Official DGMS Submissions"
              icon={FileText}
              trend="Archived & Signed"
              riskLevel="LOW"
              onClick={() => onNavigateTab('reports')}
            />
          </>
        );

      default:
        return null;
    }
  };

  // Role-Specific Quick Action Bar
  const renderQuickActions = () => {
    switch (role) {
      case 'Safety Officer':
        return (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onNavigateTab('incidents')}
              className="px-3.5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center space-x-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t('btn_report_hazard', 'Report Hazard / Violation')}</span>
            </button>
            <button
              onClick={() => onNavigateTab('inspections')}
              className="px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center space-x-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{t('btn_new_inspection', 'Log Field Inspection')}</span>
            </button>
          </div>
        );

      case 'Mine Head':
        return (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onNavigateTab('corrective')}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center space-x-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t('btn_verify_approve', 'Review Corrective Actions')}</span>
            </button>
            <button
              onClick={() => onNavigateTab('gis-map')}
              className="px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center space-x-1.5"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>{t('nav_gis', 'GIS Risk Map')}</span>
            </button>
          </div>
        );

      case 'Worker':
        return (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onNavigateTab('incidents')}
              className="px-3.5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center space-x-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{t('mob_report_unsafe', 'Report Unsafe Condition')}</span>
            </button>
            <button
              onClick={() => onNavigateTab('workforce')}
              className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center space-x-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{t('btn_submit_grievance', 'Submit Anonymous Grievance')}</span>
            </button>
          </div>
        );

      case 'Finance Officer':
        return (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onNavigateTab('finance')}
              className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center space-x-1.5"
            >
              <Coins className="w-3.5 h-3.5" />
              <span>{t('kpi_compliance_payment_holds', 'Review Payment Holds')}</span>
            </button>
            <button
              onClick={() => onNavigateTab('reports')}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 border border-slate-700"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t('btn_export_csv', 'Export CSV Dataset')}</span>
            </button>
          </div>
        );

      case 'Regulatory Authority':
        return (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onNavigateTab('audit-trail')}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center space-x-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t('btn_verify_ledger', 'Verify Blockchain Integrity')}</span>
            </button>
            <button
              onClick={() => onNavigateTab('reports')}
              className="px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center space-x-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{t('btn_print_report', 'Print Official Report')}</span>
            </button>
          </div>
        );

      default:
        return (
          <button
            onClick={() => onNavigateTab('risk-intelligence')}
            className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center space-x-1.5"
          >
            <span>{t('nav_ai', 'AI Risk Intelligence')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        );
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Scope Header Greeting Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-sky-600 dark:text-sky-400 bg-sky-500/10 border border-sky-400/20 uppercase tracking-widest">
              {headerInfo.scopeChip}
            </span>
            <span className="text-xs text-slate-400 font-medium">| {currentUser?.name}</span>
          </div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white mt-1">
            {headerInfo.title}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {headerInfo.subtitle}
          </p>
        </div>

        {/* Dynamic Action Buttons */}
        <div className="shrink-0">{renderQuickActions()}</div>
      </div>

      {/* Role-Specific Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {renderRoleCards()}
      </div>

      {/* Analytical Charts & Tactical Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: 6-Month Risk & Compliance Trends */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                {t('chart_risk_trend', 'Risk Score Evolution (Last 6 Months)')}
              </h3>
              <p className="text-[10px] text-slate-400">
                {t('chart_compliance_trend', 'Statutory Compliance Index Across Sectors')}
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-500 border border-sky-400/20">
              CMR 2017 KPI
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={riskTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="enterpriseRisk"
                  name={t('field_risk_score', 'AI Risk Score')}
                  stroke="#ef4444"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="complianceIndex"
                  name={t('kpi_compliance_score', 'Compliance Score')}
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Pipeline Distribution / Open vs Closed */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                {t('chart_open_vs_closed', 'Corrective Action Remediation Pipeline')}
              </h3>
              <p className="text-[10px] text-slate-400">
                Closed vs In-Remediation vs Under-Verification
              </p>
            </div>

            <div className="h-44 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={openVsClosedData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {openVsClosedData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '0.75rem',
                      color: '#fff',
                      fontSize: '11px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-1.5 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
            {openVsClosedData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-slate-600 dark:text-slate-400">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white font-mono">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sector Comparison Bar Chart (for Multi-mine Roles) */}
      {(role === 'Coal Mine Manager' || role === 'Area Manager' || role === 'Regulatory Authority') && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                {t('chart_mine_risk_comparison', 'Mine-wise Risk Score Comparison')}
              </h3>
              <p className="text-[10px] text-slate-400">
                Comparative analysis of risk scores vs statutory compliance indices
              </p>
            </div>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mineComparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
                <Bar dataKey="riskScore" name={t('field_risk_score', 'AI Risk Score')} fill="#f43f5e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="complianceScore" name={t('kpi_compliance_score', 'Compliance Score')} fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};
