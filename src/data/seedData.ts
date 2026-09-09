// MINEGOV AI - Comprehensive Relational Seed Datasets
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
  BlockchainBlock,
  FinanceBudget,
  WorkerGrievance,
  NotificationItem,
} from '../types';
import { GENESIS_HASH } from '../utils/hashChain';

export const SEED_USERS: User[] = [
  {
    id: 'u1',
    name: 'Rajesh Kumar',
    email: 'corporate@coaltech.in',
    role: 'Coal Mine Manager',
    scope: 'all',
    phone: '+91 98110 23456',
  },
  {
    id: 'u2',
    name: 'Amitabh Sen',
    email: 'area.north@coaltech.in',
    role: 'Area Manager',
    scope: 'area:a1',
    areaId: 'a1',
    phone: '+91 98220 34567',
  },
  {
    id: 'u3',
    name: 'Sanjay Sharma',
    email: 'head.mine.a@coaltech.in',
    role: 'Mine Head',
    scope: 'mine:m1',
    mineId: 'm1',
    areaId: 'a1',
    phone: '+91 98330 45678',
  },
  {
    id: 'u4',
    name: 'Sunil Patil',
    email: 'safety.mine.a@coaltech.in',
    role: 'Safety Officer',
    scope: 'mine:m1',
    mineId: 'm1',
    areaId: 'a1',
    department: 'Safety & Hazard Control',
    phone: '+91 98440 56789',
  },
  {
    id: 'u5',
    name: 'Devendra Joshi',
    email: 'inspector@coaltech.in',
    role: 'Inspection Officer',
    scope: 'all',
    department: 'Statutory Inspection Board',
    phone: '+91 98550 67890',
  },
  {
    id: 'u6',
    name: 'Vikram Singh',
    email: 'env.mine.a@coaltech.in',
    role: 'Environment Officer',
    scope: 'mine:m1',
    mineId: 'm1',
    areaId: 'a1',
    department: 'Environment & Ecology',
    phone: '+91 98660 78901',
  },
  {
    id: 'u7',
    name: 'Pankaj Gupta',
    email: 'contractor@abcmining.in',
    role: 'Contractor Manager',
    scope: 'mine:m1',
    mineId: 'm1',
    areaId: 'a1',
    department: 'Vendor & Contract Operations',
    phone: '+91 98770 89012',
  },
  {
    id: 'u8',
    name: 'Alok Roy',
    email: 'finance@coaltech.in',
    role: 'Finance Officer',
    scope: 'all',
    department: 'Corporate Accounts & Penalties',
    phone: '+91 98880 90123',
  },
  {
    id: 'u9',
    name: 'Mahesh Bauri',
    email: 'workforce@coaltech.in',
    role: 'Workforce Head',
    scope: 'mine:m1',
    mineId: 'm1',
    areaId: 'a1',
    department: 'Human Resources & Labour Welfare',
    phone: '+91 98990 01234',
  },
  {
    id: 'u10',
    name: 'Anil Yadav',
    email: 'anil.yadav@coaltech.in',
    role: 'Worker',
    scope: 'mine:m1',
    mineId: 'm1',
    areaId: 'a1',
    department: 'Excavation Face',
    shift: 'Morning Shift (A)',
    phone: '+91 97000 12345',
  },
  {
    id: 'u11',
    name: 'Dr. Satish Deshmukh',
    email: 'regulator@dgms.gov.in',
    role: 'Regulatory Authority',
    scope: 'all',
    department: 'DGMS Central Directorate (Dhanbad)',
    phone: '+91 97111 23456',
  },
];

export const SEED_AREAS: Area[] = [
  { id: 'a1', name: 'North Area (Jharia)', manager: 'Amitabh Sen', state: 'Jharkhand', headquarters: 'Dhanbad' },
  { id: 'a2', name: 'Central Area (Raniganj)', manager: 'Siddharth Roy', state: 'West Bengal', headquarters: 'Asansol' },
  { id: 'a3', name: 'East Area (Singrauli)', manager: 'Praveen Nair', state: 'Madhya Pradesh', headquarters: 'Singrauli' },
];

export const SEED_MINES: Mine[] = [
  {
    id: 'm1',
    name: 'Jharia Deep Mine A',
    areaId: 'a1',
    manager: 'Sanjay Sharma',
    riskScore: 82,
    complianceScore: 78,
    latitude: 23.75,
    longitude: 86.42,
    type: 'Underground',
    zones: [
      'Zone 1 (Shaft Entrance)',
      'Zone 2 (Haulage Way)',
      'Zone 3 (Excavation Face)',
      'Zone 4 (Electrical Substations)',
      'Zone 5 (Tailings Pond)',
    ],
    productionCapacityMTPA: 2.8,
    workforceCount: 840,
  },
  {
    id: 'm2',
    name: 'Raniganj OpenCast B',
    areaId: 'a2',
    manager: 'Ramesh Hembram',
    riskScore: 54,
    complianceScore: 85,
    latitude: 23.61,
    longitude: 87.12,
    type: 'Opencast',
    zones: ['Pit Alpha', 'Overburden Dump 1', 'Coal Handling Plant', 'Zone 4 (Electrical Substations)'],
    productionCapacityMTPA: 4.5,
    workforceCount: 620,
  },
  {
    id: 'm3',
    name: 'Singrauli OpenCast C',
    areaId: 'a3',
    manager: 'Manoj Mishra',
    riskScore: 68,
    complianceScore: 70,
    latitude: 24.2,
    longitude: 82.68,
    type: 'Opencast',
    zones: ['Main Incline', 'Crusher Station', 'Conveyor Belt D', 'Zone 5 (Tailings Pond)'],
    productionCapacityMTPA: 6.2,
    workforceCount: 1150,
  },
  {
    id: 'm4',
    name: 'Kargali Underground D',
    areaId: 'a1',
    manager: 'Vipin Sinha',
    riskScore: 28,
    complianceScore: 92,
    latitude: 23.77,
    longitude: 85.98,
    type: 'Underground',
    zones: ['Shaft 1', 'Seam A Loading', 'Ventilation Fan Station'],
    productionCapacityMTPA: 1.6,
    workforceCount: 430,
  },
  {
    id: 'm5',
    name: 'Bokaro OpenCast E',
    areaId: 'a2',
    manager: 'Niranjan Prasad',
    riskScore: 42,
    complianceScore: 88,
    latitude: 23.78,
    longitude: 85.95,
    type: 'Opencast',
    zones: ['Excavation Pit', 'Workshop Area', 'Explosives Magazine'],
    productionCapacityMTPA: 3.4,
    workforceCount: 510,
  },
];

export const generateWorkers = (): Worker[] => {
  const workers: Worker[] = [];
  const depts = ['Excavation', 'Ventilation', 'Haulage', 'Electrical', 'Maintenance', 'Explosives'];
  const shifts = ['Morning Shift (A)', 'Afternoon Shift (B)', 'Night Shift (C)'];
  const names = [
    'Ramesh Lal', 'Shyam Murmu', 'Dilip Tudu', 'Nirmal Bauri', 'Suresh Soren',
    'Mohammad Ali', 'Karan Mahato', 'Deepak Gope', 'Ganesh Kewat', 'Sanjoy Das',
    'Arjun Prasad', 'Rajen Hansda', 'Sitaram Kisku', 'Jiban Bauri', 'Babulal Hembram',
    'Madan Mahato', 'Bhola Paswan', 'Gopal Dom', 'Ashok Saw', 'Bijay Rawani',
    'Ajay Nunia', 'Subhash Bauri', 'Naru Gopal', 'Anil Yadav', 'Lakhan Tudu',
    'Kripa Sindhu', 'Manik Gope', 'Suraj Ram', 'Sudhir Koda', 'Tapan Ray'
  ];

  names.forEach((name, idx) => {
    const mineId = `m${(idx % 5) + 1}`;
    workers.push({
      id: `w${idx + 1}`,
      name,
      mineId,
      department: depts[idx % depts.length],
      role:
        idx % 6 === 0
          ? 'Shovel Operator'
          : idx % 6 === 1
          ? 'Ventilation Staff'
          : idx % 6 === 2
          ? 'Conveyor Belt Operator'
          : idx % 6 === 3
          ? 'Substation Helper'
          : idx % 6 === 4
          ? 'Explosives Handler'
          : 'Driller Helper',
      shift: shifts[idx % shifts.length],
      attendanceStatus: idx % 12 === 0 ? 'Absent' : idx % 15 === 0 ? 'On Leave' : 'Present',
      trainingStatus: idx % 7 === 0 ? 'Pending' : idx % 11 === 0 ? 'Expired' : 'Completed',
      supervisorId: 'u3',
      badgeNumber: `CLT-WK-${1000 + idx}`,
      safetyScore: 75 + (idx % 25),
      emergencyContact: `+91 943${idx % 9}0 11${idx % 9}9`,
    });
  });
  return workers;
};

export const SEED_CONTRACTORS: Contractor[] = [
  {
    id: 'c1',
    name: 'ABC Mining Services Ltd.',
    license: 'LIC-2024-001',
    workersCount: 145,
    equipmentCount: 28,
    violationsCount: 14,
    complianceStatus: 'Non-Compliant',
    riskScore: 84,
    contractValue: '₹4.2 Cr',
    paymentStatus: 'Hold (Violation)',
    validTill: '2026-11-30',
    category: 'Heavy Earth Moving Machinery (HEMM)',
  },
  {
    id: 'c2',
    name: 'Chhota Nagpur Excavation Corp.',
    license: 'LIC-2023-149',
    workersCount: 98,
    equipmentCount: 16,
    violationsCount: 6,
    complianceStatus: 'Compliant',
    riskScore: 48,
    contractValue: '₹2.8 Cr',
    paymentStatus: 'Billing Pending',
    validTill: '2027-03-31',
    category: 'Surface Excavation & Transport',
  },
  {
    id: 'c3',
    name: 'Jharkhand Blasting & Infra',
    license: 'LIC-2025-088',
    workersCount: 54,
    equipmentCount: 12,
    violationsCount: 8,
    complianceStatus: 'Non-Compliant',
    riskScore: 71,
    contractValue: '₹1.5 Cr',
    paymentStatus: 'Paid Part',
    validTill: '2026-12-15',
    category: 'Controlled Blasting & Drilling',
  },
  {
    id: 'c4',
    name: 'Eastern Coal Logistics',
    license: 'LIC-2022-311',
    workersCount: 220,
    equipmentCount: 45,
    violationsCount: 3,
    complianceStatus: 'Compliant',
    riskScore: 24,
    contractValue: '₹6.0 Cr',
    paymentStatus: 'Fully Paid',
    validTill: '2028-06-30',
    category: 'Railhead Loading & Logistics',
  },
  {
    id: 'c5',
    name: 'Dhanbad Safety Gear & Supplies',
    license: 'LIC-2024-910',
    workersCount: 12,
    equipmentCount: 4,
    violationsCount: 0,
    complianceStatus: 'Compliant',
    riskScore: 12,
    contractValue: '₹45 Lakh',
    paymentStatus: 'Fully Paid',
    validTill: '2027-08-31',
    category: 'PPE & Safety Barrier Maintenance',
  },
  {
    id: 'c6',
    name: 'Damodar Pump & Dewatering',
    license: 'LIC-2023-042',
    workersCount: 36,
    equipmentCount: 8,
    violationsCount: 2,
    complianceStatus: 'Compliant',
    riskScore: 32,
    contractValue: '₹95 Lakh',
    paymentStatus: 'Billing Pending',
    validTill: '2027-05-15',
    category: 'Sub-surface Dewatering Services',
  },
  {
    id: 'c7',
    name: 'Singrauli Haulage Partners',
    license: 'LIC-2024-555',
    workersCount: 80,
    equipmentCount: 22,
    violationsCount: 5,
    complianceStatus: 'Compliant',
    riskScore: 59,
    contractValue: '₹2.1 Cr',
    paymentStatus: 'Paid Part',
    validTill: '2026-10-31',
    category: 'Dumper Fleet Management',
  },
  {
    id: 'c8',
    name: 'Raniganj Ventilation Erectors',
    license: 'LIC-2024-219',
    workersCount: 42,
    equipmentCount: 6,
    violationsCount: 1,
    complianceStatus: 'Compliant',
    riskScore: 19,
    contractValue: '₹1.1 Cr',
    paymentStatus: 'Fully Paid',
    validTill: '2027-09-30',
    category: 'Underground Ventilation Shafts',
  },
];

export const SEED_COMPLIANCE_ITEMS: ComplianceItem[] = [
  {
    id: 'comp-101',
    requirement: 'Continuous Flame Safety Lamp & Multi-gas Detection Calibration',
    category: 'Safety',
    responsibleDepartment: 'Safety & Ventilation',
    responsibleOfficer: 'Sunil Patil',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Due Soon',
    severity: 'CRITICAL',
    lastInspectionDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    nextReviewDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    regulationCitation: 'Regulation 169, CMR 2017',
    mineId: 'm1',
  },
  {
    id: 'comp-102',
    requirement: 'Effluent Treatment Plant (ETP) pH and Heavy Metal Verification',
    category: 'Environment',
    responsibleDepartment: 'Environment',
    responsibleOfficer: 'Vikram Singh',
    dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Overdue',
    severity: 'HIGH',
    lastInspectionDate: new Date(Date.now() - 33 * 24 * 60 * 60 * 1000).toISOString(),
    nextReviewDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    regulationCitation: 'Water (Prevention & Control of Pollution) Act Sec 25',
    mineId: 'm3',
  },
  {
    id: 'comp-103',
    requirement: 'Statutory Vocational Training Refresher for HEMM Operators',
    category: 'Labour',
    responsibleDepartment: 'Human Resources',
    responsibleOfficer: 'Mahesh Bauri',
    dueDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Compliant',
    severity: 'MEDIUM',
    lastInspectionDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    nextReviewDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
    regulationCitation: 'Mines Vocational Training Rules 1966',
    mineId: 'm2',
  },
  {
    id: 'comp-104',
    requirement: 'Quarterly Roof Bolting Pull-Test Load Verification (10 Tonnes)',
    category: 'Safety',
    responsibleDepartment: 'Strata Control',
    responsibleOfficer: 'Sunil Patil',
    dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Compliant',
    severity: 'CRITICAL',
    lastInspectionDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    nextReviewDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    regulationCitation: 'Regulation 123, CMR 2017 (Strata Management)',
    mineId: 'm1',
  },
  {
    id: 'comp-105',
    requirement: 'Contractor Workforce Form B Register & ESI/PF Audit',
    category: 'Contractor',
    responsibleDepartment: 'Contractor Operations',
    responsibleOfficer: 'Pankaj Gupta',
    dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Violation',
    severity: 'HIGH',
    lastInspectionDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
    nextReviewDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    regulationCitation: 'Contract Labour (Regulation & Abolition) Act 1970',
    mineId: 'm1',
  },
  {
    id: 'comp-106',
    requirement: 'Flameproof Electrical Substation Switchgear Enclosure Testing',
    category: 'Equipment',
    responsibleDepartment: 'Electrical Engineering',
    responsibleOfficer: 'Sunil Patil',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Due Soon',
    severity: 'CRITICAL',
    lastInspectionDate: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
    nextReviewDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    regulationCitation: 'CEA (Measures Relating to Safety & Electric Supply) Reg 100',
    mineId: 'm1',
  },
  {
    id: 'comp-107',
    requirement: 'Continuous Ambient Air Quality Monitoring System (CAAQMS) PM10 Audit',
    category: 'Environment',
    responsibleDepartment: 'Environment',
    responsibleOfficer: 'Vikram Singh',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Compliant',
    severity: 'MEDIUM',
    lastInspectionDate: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(),
    nextReviewDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    regulationCitation: 'Air (Prevention & Control of Pollution) Act 1981',
    mineId: 'm2',
  },
  {
    id: 'comp-108',
    requirement: 'Haul Road Dust Suppression Water Sprinkler Auto-Timer Check',
    category: 'Production',
    responsibleDepartment: 'Surface Operations',
    responsibleOfficer: 'Manoj Mishra',
    dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Under Review',
    severity: 'LOW',
    lastInspectionDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    nextReviewDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
    regulationCitation: 'DGMS Tech Circular No 4 of 2019',
    mineId: 'm3',
  },
];

export const generateInspections = (): Inspection[] => {
  const inspections: Inspection[] = [];
  const categories = [
    'Safety Barrier Inspection',
    'Ventilation & Airflow Measurement',
    'Methane Gas Concentration',
    'Roof Bolting & Strata Control',
    'High Voltage Electrical Isolators',
    'Environmental Dust & Water Audit',
    'Haul Road Berm Height & Incline',
    'Heavy Machinery Guard Check',
  ];
  const severities: ('LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL')[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  const zones = [
    'Zone 1 (Shaft Entrance)',
    'Zone 2 (Haulage Way)',
    'Zone 3 (Excavation Face)',
    'Zone 4 (Electrical Substations)',
    'Zone 5 (Tailings Pond)',
  ];

  for (let i = 1; i <= 35; i++) {
    const mineNum = (i % 5) + 1;
    const cat = categories[i % categories.length];
    const sev = severities[i % 4];
    const zone = zones[i % zones.length];

    inspections.push({
      id: `ins-${1000 + i}`,
      inspectorName: i % 2 === 0 ? 'Devendra Joshi' : 'Sunil Patil',
      mineId: `m${mineNum}`,
      zone: zone,
      department: i % 3 === 0 ? 'Electrical' : i % 3 === 1 ? 'Ventilation' : 'Mining Operations',
      category: cat,
      date: new Date(Date.now() - i * 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      severity: sev,
      observations: `Thorough physical examination of ${cat} in ${zone}. Verified against CMR 2017 standards. ${
        sev === 'CRITICAL'
          ? 'Immediate remediation mandated due to elevated risk.'
          : sev === 'HIGH'
          ? 'Non-compliance detected; corrective timeline established.'
          : 'Minor observations documented.'
      }`,
      remarks: 'Inspection recorded with geo-stamping and tamper-evident audit.',
      gps: `23.75${i}N, 86.42${i}E`,
      photoUrl:
        i % 4 === 0
          ? 'https://images.unsplash.com/photo-1579226905180-636b76d96082?auto=format&fit=crop&w=400&q=80'
          : undefined,
      status: i % 6 === 0 ? 'Scheduled' : i % 8 === 0 ? 'Under Review' : 'Closed',
    });
  }
  return inspections;
};

export const generateViolations = (): Violation[] => {
  const violations: Violation[] = [
    {
      id: 'v-1001',
      title: 'Water accumulation near electrical substation',
      category: 'Electrical Safety',
      mineId: 'm1',
      zone: 'Zone 4 (Electrical Substations)',
      severity: 'CRITICAL',
      status: 'OPEN',
      reporterName: 'Anil Yadav',
      description:
        'Severe water accumulation was detected near the high-voltage 11kV electrical transformer in Zone 4. Poses immediate electrocution hazard and fire risk to subterranean workers.',
      reportedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      riskScore: 87,
      isEscalated: true,
      escalationLevel: 1,
      contractorName: 'ABC Mining Services Ltd.',
      beforePhotoUrl:
        'https://images.unsplash.com/photo-1579226905180-636b76d96082?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'v-1002',
      title: 'Excessive Coal Dust in Haulage Way',
      category: 'Ventilation & Dust Control',
      mineId: 'm1',
      zone: 'Zone 2 (Haulage Way)',
      severity: 'HIGH',
      status: 'ASSIGNED',
      reporterName: 'Sunil Patil',
      assigneeName: 'Rahul Verma',
      assigneeRole: 'Corrective Officer',
      description:
        'Coal dust accumulations exceed 1/8 inch thickness in primary haulage shaft, presenting severe secondary explosion propagation risk.',
      reportedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      riskScore: 72,
      isEscalated: false,
      escalationLevel: 0,
      contractorName: 'ABC Mining Services Ltd.',
    },
    {
      id: 'v-1003',
      title: 'Broken safety barriers near Shaft 1 entrance',
      category: 'Safety Barrier',
      mineId: 'm2',
      zone: 'Pit Alpha',
      severity: 'MEDIUM',
      status: 'IN_PROGRESS',
      reporterName: 'Ramesh Hembram',
      assigneeName: 'Ajay Kher',
      assigneeRole: 'Corrective Officer',
      description:
        'Physical chain-link safety barriers guarding Pit Alpha shaft mouth were crushed by haulage dumper. Edge protection breach.',
      reportedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      deadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      riskScore: 58,
      isEscalated: true,
      escalationLevel: 2,
      contractorName: 'Chhota Nagpur Excavation Corp.',
    },
    {
      id: 'v-1004',
      title: 'Methane level reading spike at Face 3',
      category: 'Gas Concentration',
      mineId: 'm3',
      zone: 'Main Incline',
      severity: 'CRITICAL',
      status: 'ACTION_SUBMITTED',
      reporterName: 'Manoj Mishra',
      assigneeName: 'Rahul Verma',
      assigneeRole: 'Corrective Officer',
      description:
        'Methane concentration spiked to 1.45% during shift handover. Automatic sensor alarmed. Ventilation flow redirected.',
      reportedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      deadline: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
      riskScore: 92,
      isEscalated: false,
      escalationLevel: 0,
      contractorName: 'Jharkhand Blasting & Infra',
      afterPhotoUrl:
        'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80',
      verificationNotes:
        'Auxiliary blower fan re-routed. Face methane reduced to 0.28%. Awaiting supervisor approval.',
    },
  ];

  const categories = [
    'PPE Non-Compliance',
    'Auxiliary Ventilation Duct Tear',
    'Conveyor Emergency Pull-Wire Sluggish',
    'Dumper Reverse Horn Inoperative',
    'Explosives Storage Temperature Variance',
    'Tailings Dam Seepage Discoloration',
  ];
  const severities: ('LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL')[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  const statuses: (
    | 'OPEN'
    | 'ASSIGNED'
    | 'IN_PROGRESS'
    | 'ACTION_SUBMITTED'
    | 'UNDER_VERIFICATION'
    | 'CLOSED'
    | 'REWORK_REQUIRED'
  )[] = ['CLOSED', 'CLOSED', 'OPEN', 'IN_PROGRESS', 'CLOSED', 'ASSIGNED', 'CLOSED'];

  for (let i = 5; i <= 25; i++) {
    const mineNum = (i % 5) + 1;
    const sev = severities[i % 4];
    const cat = categories[i % categories.length];
    const status = statuses[i % statuses.length];
    const isEsc = status !== 'CLOSED' && i % 3 === 0;

    violations.push({
      id: `v-${1000 + i}`,
      title: `Statutory breach: ${cat}`,
      category: cat,
      mineId: `m${mineNum}`,
      zone: `Zone ${(i % 4) + 1}`,
      severity: sev,
      status: status,
      reporterName: i % 2 === 0 ? 'Sunil Patil' : 'Devendra Joshi',
      assigneeName: status !== 'OPEN' ? 'Rahul Verma' : undefined,
      assigneeRole: status !== 'OPEN' ? 'Corrective Officer' : undefined,
      description: `Observed statutory non-compliance regarding ${cat.toLowerCase()} in operational zone during safety sweep.`,
      reportedAt: new Date(Date.now() - i * 3 * 24 * 60 * 60 * 1000).toISOString(),
      deadline: new Date(Date.now() - (i - 2) * 24 * 60 * 60 * 1000).toISOString(),
      riskScore: sev === 'CRITICAL' ? 85 : sev === 'HIGH' ? 68 : sev === 'MEDIUM' ? 44 : 22,
      isEscalated: isEsc,
      escalationLevel: isEsc ? (i % 3) + 1 : 0,
      contractorName: SEED_CONTRACTORS[i % SEED_CONTRACTORS.length].name,
    });
  }

  return violations;
};

export const generateCorrectiveActions = (): CorrectiveAction[] => {
  const actions: CorrectiveAction[] = [
    {
      id: 'ca-2001',
      violationId: 'v-1003',
      assigneeName: 'Ajay Kher',
      department: 'Mining Operations',
      priority: 'MEDIUM',
      deadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'In Progress',
      actionDescription:
        'Procure heavy-duty replacement crash fencing and secure mounting poles with fresh anchor concrete.',
      createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'ca-2002',
      violationId: 'v-1004',
      assigneeName: 'Rahul Verma',
      department: 'Ventilation',
      priority: 'CRITICAL',
      deadline: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
      status: 'Evidence Submitted',
      actionDescription:
        'Diverted main auxiliary fan blower #3 directly onto Face 3 and successfully flushed methane concentrations down to 0.28%.',
      proofNotes: 'Gas sensor reading log attached showing methane levels dropped. Blower redirected and verified.',
      proofPhotoUrl:
        'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      completedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    },
  ];

  for (let i = 3; i <= 20; i++) {
    const isSubmitted = i % 3 === 0;
    const isVerified = i % 3 === 1;
    const status: CorrectiveAction['status'] = isVerified
      ? 'Approved'
      : isSubmitted
      ? 'Evidence Submitted'
      : 'In Progress';

    actions.push({
      id: `ca-${2000 + i}`,
      violationId: `v-${1000 + i}`,
      assigneeName: 'Rahul Verma',
      department: 'Mining Operations',
      priority: i % 4 === 0 ? 'CRITICAL' : i % 4 === 1 ? 'HIGH' : i % 4 === 2 ? 'MEDIUM' : 'LOW',
      deadline: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      status: status,
      actionDescription:
        'Executed designated statutory remedial procedure, safety perimeter re-established, and warning signages updated.',
      createdAt: new Date(Date.now() - (i + 3) * 24 * 60 * 60 * 1000).toISOString(),
      completedAt: isSubmitted || isVerified ? new Date(Date.now() - i * 12 * 60 * 60 * 1000).toISOString() : undefined,
      verifiedAt: isVerified ? new Date(Date.now() - i * 6 * 60 * 60 * 1000).toISOString() : undefined,
      proofNotes: isSubmitted || isVerified ? 'All remediation verified in the field.' : undefined,
      proofPhotoUrl:
        isSubmitted || isVerified
          ? 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80'
          : undefined,
    });
  }

  return actions;
};

export const generateEnvironmentalReadings = (): EnvironmentalReading[] => {
  const readings: EnvironmentalReading[] = [];
  const params: {
    name: EnvironmentalReading['parameter'];
    unit: string;
    threshold: number;
    normalMin: number;
    normalMax: number;
  }[] = [
    { name: 'Air Quality (PM2.5)', unit: 'µg/m³', threshold: 150, normalMin: 35, normalMax: 110 },
    { name: 'Air Quality (PM10)', unit: 'µg/m³', threshold: 300, normalMin: 80, normalMax: 240 },
    { name: 'Water pH', unit: 'pH', threshold: 8.5, normalMin: 6.5, normalMax: 7.8 },
    { name: 'Coal Dust Level', unit: 'mg/m³', threshold: 2.0, normalMin: 0.2, normalMax: 1.2 },
    { name: 'Methane Level (CH4)', unit: '%', threshold: 1.25, normalMin: 0.05, normalMax: 0.4 },
    { name: 'Noise Level', unit: 'dB', threshold: 85, normalMin: 55, normalMax: 78 },
  ];

  let readIdx = 1;
  for (let hour = 1; hour <= 4; hour++) {
    for (let mineIdx = 1; mineIdx <= 5; mineIdx++) {
      params.forEach((param) => {
        let val = param.normalMin + Math.random() * (param.normalMax - param.normalMin);

        if (mineIdx === 3 && param.name === 'Water pH' && hour === 2) {
          val = 9.4; // Alkaline Anomaly
        }
        if (mineIdx === 3 && param.name === 'Coal Dust Level' && hour === 3) {
          val = 2.45; // Exceeded threshold
        }
        if (mineIdx === 1 && param.name === 'Methane Level (CH4)' && hour === 1) {
          val = 1.38; // Gas buildup
        }

        const isAnomaly =
          val > param.threshold || (param.name === 'Water pH' && (val < 6.0 || val > 8.5));

        readings.push({
          id: `env-${readIdx++}`,
          mineId: `m${mineIdx}`,
          parameter: param.name,
          value: parseFloat(val.toFixed(2)),
          unit: param.unit,
          threshold: param.threshold,
          timestamp: new Date(Date.now() - hour * 4 * 60 * 60 * 1000).toISOString(),
          anomaly: isAnomaly,
          status: isAnomaly ? 'PENDING_REVIEW' : 'REVIEWED_OK',
        });
      });
    }
  }
  return readings;
};

export const SEED_DOCUMENTS: DocumentRecord[] = [
  {
    id: 'doc-001',
    title: 'DGMS Clearance Certificate - Shaft 1',
    category: 'License',
    mineId: 'm1',
    status: 'VALID',
    expiryDate: '2027-12-31',
    ownerName: 'Sanjay Sharma',
    fileUrl: '/docs/dgms_clearance.pdf',
    ocrExtractedText:
      'DGMS CLEARANCE CERTIFICATE FOR DEEP SHAFT MINING. LICENSE REF: JH-MINE-001-A. VALID UNTIL 31-DEC-2027. SUBJECT TO ANNUAL SHIELD WALL PRESSURE VERIFICATIONS.',
    extractedFields: {
      licenseNumber: 'JH-MINE-001-A',
      issuingAuthority: 'Directorate General of Mines Safety (Dhanbad)',
      validity: '31-Dec-2027',
      complianceTerms: 'Annual shield wall pressure tests mandatory.',
    },
  },
  {
    id: 'doc-002',
    title: 'State Pollution Control Consent to Operate (CTO)',
    category: 'Environmental Clearance',
    mineId: 'm1',
    status: 'EXPIRING',
    expiryDate: '2026-09-10',
    ownerName: 'Vikram Singh',
    fileUrl: '/docs/spcb_consent.pdf',
    ocrExtractedText:
      'STATE POLLUTION CONTROL BOARD CONSENT TO OPERATE UNDER AIR ACT SECTION 21. EXPIRY DATE: 10-SEPTEMBER-2026. PM10 LIMITATIONS 100UG/M3 MAX.',
    extractedFields: {
      licenseNumber: 'SPCB-AIR-JH-2024',
      issuingAuthority: 'State Pollution Control Board',
      validity: '10-Sept-2026',
      complianceTerms: 'Maintain CAAQMS uptime > 95%.',
    },
  },
  {
    id: 'doc-003',
    title: 'Contractor Operations Safety License - ABC Mining',
    category: 'License',
    contractorId: 'c1',
    status: 'EXPIRED',
    expiryDate: '2026-06-15',
    ownerName: 'Pankaj Gupta',
    fileUrl: '/docs/abc_safety.pdf',
    ocrExtractedText:
      'CONTRACTOR SAFETY REGISTRATION - ABC MINING SERVICES LTD. EXPIRY DATE: 15-JUNE-2026. ZERO MINER FATALITIES UNDER SUPERVISION CONTRACT.',
    extractedFields: {
      licenseNumber: 'C-LIC-ABC-098',
      issuingAuthority: 'Ministry of Labour & Employment',
      validity: '15-June-2026 (EXPIRED)',
      complianceTerms: 'All machinery must possess valid fitness certificates.',
    },
  },
  {
    id: 'doc-004',
    title: 'Singrauli Mine Safety Audit Report 2026',
    category: 'Safety Audit',
    mineId: 'm3',
    status: 'VALID',
    expiryDate: '2027-01-15',
    ownerName: 'Manoj Mishra',
    fileUrl: '/docs/safety_audit_singrauli.pdf',
    ocrExtractedText:
      'SINGRAULI OPENCAST SAFETY AUDIT 2026. GRADE: A-. VENTILATION VELOCITY: SATISFACTORY. DETECTED 3 DEVIATIONS IN ELECTRICAL ISOLATOR STATIONS.',
    extractedFields: {
      licenseNumber: 'AUD-SIN-2026-01',
      issuingAuthority: 'Central Statutory Audit Panel',
      validity: '15-Jan-2027',
      complianceTerms: 'Rectify isolator station deviations within 45 days.',
    },
  },
];

export const SEED_GENESIS_BLOCK: BlockchainBlock = {
  id: 'blk-0',
  blockNumber: 0,
  timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  actor: 'Genesis Authority',
  action: 'SYSTEM_INITIALIZATION',
  entityId: 'MINEGOV_GENESIS',
  payloadHash: '0x3a5b2c9d1e4f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b',
  previousHash: GENESIS_HASH,
  currentHash: '0x88f2a1b94c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f',
  verified: true,
};

export const SEED_INCIDENTS: IncidentReport[] = [
  {
    id: 'inc-01',
    mineId: 'm1',
    zone: 'Zone 4 (Electrical Substations)',
    reportedBy: 'Anil Yadav',
    incidentType: 'Unsafe Condition',
    severity: 'CRITICAL',
    description: 'Underground runoff water pooling adjacent to 11kV transformer feeder base.',
    reportedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Investigating',
    gps: '23.754N, 86.421E',
  },
  {
    id: 'inc-02',
    mineId: 'm2',
    zone: 'Pit Alpha',
    reportedBy: 'Ramesh Lal',
    incidentType: 'Equipment Breakdown',
    severity: 'MEDIUM',
    description: 'Hydraulic steering pressure drop observed on Dumper D-14 while ascending ramp.',
    reportedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Remediated',
    gps: '23.612N, 87.123E',
  },
];

export const SEED_GRIEVANCES: WorkerGrievance[] = [
  {
    id: 'grv-01',
    isAnonymous: true,
    category: 'PPE Defect',
    description: 'Dust respirators supplied in Shift B are tearing around the strap seams.',
    submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Under Review',
  },
  {
    id: 'grv-02',
    isAnonymous: false,
    workerId: 'w24',
    category: 'Sanitation / Drinking Water',
    description: 'Drinking water chiller station in Zone 2 is non-functional.',
    submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Resolved',
    resolutionNotes: 'Water chiller compressor repaired by contractor Damodar Pumps.',
  },
];

export const SEED_FINANCE: FinanceBudget[] = [
  {
    mineId: 'm1',
    totalSafetyBudget: 450, // Lakhs
    utilizedBudget: 342,
    penaltiesLevied: 28.5,
    contractorPayableWithheld: 84.0,
    environmentalCess: 52.0,
  },
  {
    mineId: 'm2',
    totalSafetyBudget: 380,
    utilizedBudget: 290,
    penaltiesLevied: 8.0,
    contractorPayableWithheld: 15.0,
    environmentalCess: 44.0,
  },
  {
    mineId: 'm3',
    totalSafetyBudget: 620,
    utilizedBudget: 510,
    penaltiesLevied: 34.0,
    contractorPayableWithheld: 62.0,
    environmentalCess: 78.0,
  },
  {
    mineId: 'm4',
    totalSafetyBudget: 240,
    utilizedBudget: 185,
    penaltiesLevied: 2.5,
    contractorPayableWithheld: 0,
    environmentalCess: 26.0,
  },
  {
    mineId: 'm5',
    totalSafetyBudget: 310,
    utilizedBudget: 230,
    penaltiesLevied: 12.0,
    contractorPayableWithheld: 22.0,
    environmentalCess: 38.0,
  },
];

export const SEED_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'u1',
    role: 'Coal Mine Manager',
    mineId: 'm3',
    title: 'High-Risk Methane Gas Anomaly Detected',
    message: 'Sub-surface CAAQMS sensor telemetry spiked to 1.45% CH4 at Face 3, Singrauli OpenCast C. Automatic threshold exceeded CMR 169 limit (1.25%). Immediate ventilation sweep activated.',
    severity: 'CRITICAL',
    timestamp: '2026-09-04T08:30:00.000Z',
    read: false,
    channel: 'sms',
    deliveryStatus: 'Delivered (Simulated)',
  },
  {
    id: 'notif-2',
    userId: 'u4',
    role: 'Safety Officer',
    mineId: 'm1',
    title: 'New Critical Violation: Water Accumulation',
    message: 'Field worker Anil Yadav reported severe water accumulation rising within 1.5m of the 11kV transformer substation in Zone 4 (Jharia Deep Mine A).',
    severity: 'CRITICAL',
    timestamp: '2026-09-03T10:15:00.000Z',
    read: false,
    channel: 'whatsapp',
    deliveryStatus: 'Delivered (Simulated)',
  },
  {
    id: 'notif-3',
    userId: 'u7',
    role: 'Corrective Officer',
    mineId: 'm1',
    title: 'Corrective Action Assigned (24h SLA)',
    message: 'Task assigned to Rahul Verma: Dewater cable trench and Megger insulation test for 11kV transformer switchgear in Zone 4 under statutory SLA deadline.',
    severity: 'HIGH',
    timestamp: '2026-09-03T11:00:00.000Z',
    read: false,
    channel: 'in-app',
    deliveryStatus: 'Delivered (Simulated)',
  },
  {
    id: 'notif-4',
    userId: 'u3',
    role: 'Mine Head',
    mineId: 'm1',
    title: 'Statutory SLA Deadline Approaching',
    message: 'Statutory remediation deadline expires in 24 hours for Explosives Storage Temperature Variance in Zone 3 (CMR Reg 152). Hierarchical escalation imminent.',
    severity: 'HIGH',
    timestamp: '2026-09-02T14:20:00.000Z',
    read: true,
    channel: 'sms',
    deliveryStatus: 'Delivered (Simulated)',
  },
  {
    id: 'notif-5',
    userId: 'u5',
    role: 'Inspection Officer',
    mineId: 'm1',
    title: 'Rectification Evidence Awaiting Verification',
    message: 'Submersible dewatering pump installed and photographic proof uploaded for Haulage Way Dust Suppression. Awaiting Inspector verification gate approval.',
    severity: 'MEDIUM',
    timestamp: '2026-09-01T16:45:00.000Z',
    read: true,
    channel: 'in-app',
    deliveryStatus: 'Delivered (Simulated)',
  },
  {
    id: 'notif-6',
    userId: 'u1',
    role: 'Coal Mine Manager',
    mineId: 'm1',
    title: 'Violation Closed & Anchored to Blockchain',
    message: 'CMR 2017 Section 22 violation for Dumper Reverse Horn inoperative successfully verified by Inspector Devendra Joshi. Block #1 anchored to SHA-256 ledger.',
    severity: 'LOW',
    timestamp: '2026-08-25T09:10:00.000Z',
    read: true,
    channel: 'email',
    deliveryStatus: 'Delivered (Simulated)',
  },
];
