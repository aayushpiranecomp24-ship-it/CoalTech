// Coaltech - Local Relational Database & Risk Engine
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  scope: string; // 'all', 'area:<areaId>', 'mine:<mineId>'
  areaId?: string;
  mineId?: string;
  department?: string;
  shift?: string;
}


export interface Area {
  id: string;
  name: string;
  manager: string;
}

export interface Mine {
  id: string;
  name: string;
  areaId: string;
  manager: string;
  riskScore: number;
  complianceScore: number;
  latitude: number;
  longitude: number;
  zones: string[];
}

export interface Worker {
  id: string;
  name: string;
  mineId: string;
  department: string;
  role: string;
  shift: string;
  attendanceStatus: 'Present' | 'Absent';
  trainingStatus: 'Completed' | 'Pending' | 'None';
  supervisorId: string;
}

export interface Contractor {
  id: string;
  name: string;
  license: string;
  workersCount: number;
  violationsCount: number;
  complianceStatus: 'Compliant' | 'Non-Compliant';
  riskScore: number;
  contractValue: string;
  paymentStatus: string;
}

export interface Inspection {
  id: string;
  inspectorName: string;
  mineId: string;
  zone: string;
  category: string;
  date: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  observations: string;
  gps: string;
  photoUrl?: string;
  status: 'COMPLETED' | 'PENDING' | 'REWORK_REQUIRED';
}

export interface Violation {
  id: string;
  title: string;
  category: string;
  mineId: string;
  zone: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'ACTION_SUBMITTED' | 'UNDER_VERIFICATION' | 'CLOSED' | 'REWORK_REQUIRED';
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
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  deadline: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'SUBMITTED' | 'VERIFIED' | 'REJECTED';
  actionDescription: string;
  proofNotes?: string;
  proofPhotoUrl?: string;
  createdAt: string;
  completedAt?: string;
  verifiedAt?: string;
}

export interface EnvironmentalReading {
  id: string;
  mineId: string;
  parameter: 'Air Quality (PM2.5)' | 'Water pH' | 'Coal Dust Level' | 'Methane Level (CH4)' | 'Noise Level';
  value: number;
  unit: string;
  threshold: number;
  timestamp: string;
  anomaly: boolean;
  status: 'PENDING_REVIEW' | 'REVIEWED_OK' | 'NON_COMPLIANT';
}

export interface Document {
  id: string;
  title: string;
  category: 'License' | 'Environmental Clearance' | 'Safety Audit' | 'Contract' | 'Operator Cert';
  mineId?: string;
  contractorId?: string;
  status: 'VALID' | 'EXPIRING' | 'EXPIRED' | 'UNDER_REVIEW';
  expiryDate: string;
  ownerName: string;
  fileUrl: string;
  ocrExtractedText?: string;
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

export interface BlockchainEvent {
  id: string;
  eventId: string;
  eventType: string;
  timestamp: string;
  payloadHash: string;
  txHash: string;
  blockNumber: number;
}

export interface Notification {
  id: string;
  userId: string;
  role: string;
  mineId?: string;
  title: string;
  message: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  timestamp: string;
  read: boolean;
  channel?: 'in-app' | 'sms' | 'email' | 'voice' | 'whatsapp';
}

export interface OfflineQueueItem {
  id: string;
  action: 'CREATE_REPORT';
  payload: any;
  timestamp: string;
}

// SEED DATA PREPARATION
export const SEED_USERS: User[] = [
  { id: 'u1', name: 'Rajesh Kumar', email: 'corporate@coaltech.in', role: 'Coal Mine Manager', scope: 'all' },
  { id: 'u2', name: 'Amitabh Sen', email: 'area.north@coaltech.in', role: 'Area Manager', scope: 'area:a1', areaId: 'a1' },
  { id: 'u3', name: 'Sanjay Sharma', email: 'head.mine.a@coaltech.in', role: 'Mine Head', scope: 'mine:m1', mineId: 'm1', areaId: 'a1' },
  { id: 'u4', name: 'Sunil Patil', email: 'safety.mine.a@coaltech.in', role: 'Safety Officer', scope: 'mine:m1', mineId: 'm1', areaId: 'a1', department: 'Safety' },
  { id: 'u5', name: 'Devendra Joshi', email: 'inspector@coaltech.in', role: 'Inspector', scope: 'all', department: 'Statutory Board' },
  { id: 'u6', name: 'Vikram Singh', email: 'env.mine.a@coaltech.in', role: 'Environment Officer', scope: 'mine:m1', mineId: 'm1', areaId: 'a1', department: 'Environment' },
  { id: 'u7', name: 'Rahul Verma', email: 'corrective.mine.a@coaltech.in', role: 'Corrective Officer', scope: 'mine:m1', mineId: 'm1', areaId: 'a1', department: 'Operations' },
  { id: 'u8', name: 'Pankaj Gupta', email: 'contractor@abcmining.in', role: 'Contractor Manager', scope: 'mine:m1', mineId: 'm1', areaId: 'a1' },
  { id: 'u9', name: 'Anil Yadav', email: 'anil.yadav@coaltech.in', role: 'Worker', scope: 'mine:m1', mineId: 'm1', areaId: 'a1', department: 'Excavation', shift: 'Morning Shift (A)' },
  { id: 'u10', name: 'Dr. Satish Deshmukh', email: 'regulator@dgms.gov.in', role: 'Regulatory Authority', scope: 'all' }
];

export const SEED_AREAS: Area[] = [
  { id: 'a1', name: 'North Area (Jharia)', manager: 'Amitabh Sen' },
  { id: 'a2', name: 'Central Area (Raniganj)', manager: 'Siddharth Roy' },
  { id: 'a3', name: 'East Area (Singrauli)', manager: 'Praveen Nair' }
];

export const SEED_MINES: Mine[] = [
  { id: 'm1', name: 'Jharia Deep Mine A', areaId: 'a1', manager: 'Sanjay Sharma', riskScore: 82, complianceScore: 78, latitude: 23.75, longitude: 86.42, zones: ['Zone 1 (Shaft Entrance)', 'Zone 2 (Haulage Way)', 'Zone 3 (Excavation Face)', 'Zone 4 (Electrical Substations)', 'Zone 5 (Tailings Pond)'] },
  { id: 'm2', name: 'Raniganj OpenCast B', areaId: 'a2', manager: 'Ramesh Hembram', riskScore: 54, complianceScore: 85, latitude: 23.61, longitude: 87.12, zones: ['Pit Alpha', 'Overburden Dump 1', 'Coal Handling Plant', 'Zone 4 (Electrical Substations)'] },
  { id: 'm3', name: 'Singrauli OpenCast C', areaId: 'a3', manager: 'Manoj Mishra', riskScore: 68, complianceScore: 70, latitude: 24.20, longitude: 82.68, zones: ['Main Incline', 'Crusher Station', 'Conveyor Belt D', 'Zone 5 (Tailings Pond)'] },
  { id: 'm4', name: 'Kargali Underground D', areaId: 'a1', manager: 'Vipin Sinha', riskScore: 28, complianceScore: 92, latitude: 23.77, longitude: 85.98, zones: ['Shaft 1', 'Seam A Loading', 'Ventilation Fan Station'] },
  { id: 'm5', name: 'Bokaro OpenCast E', areaId: 'a2', manager: 'Niranjan Prasad', riskScore: 42, complianceScore: 88, latitude: 23.78, longitude: 85.95, zones: ['Excavation Pit', 'Workshop Area', 'Explosives Magazine'] }
];

// Generates 30 realistic workers
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
      role: idx % 6 === 0 ? 'Shovel Operator' : idx % 6 === 1 ? 'Ventilation Staff' : idx % 6 === 2 ? 'Conveyor Belt Operator' : idx % 6 === 3 ? 'Substation Helper' : idx % 6 === 4 ? 'Explosives Handler' : 'Driller Helper',
      shift: shifts[idx % shifts.length],
      attendanceStatus: idx % 12 === 0 ? 'Absent' : 'Present',
      trainingStatus: idx % 7 === 0 ? 'Pending' : idx % 10 === 0 ? 'None' : 'Completed',
      supervisorId: 'u3' // Default to Sanjay Sharma
    });
  });
  return workers;
};

// Generates 8 contractors
export const SEED_CONTRACTORS: Contractor[] = [
  { id: 'c1', name: 'ABC Mining Services Ltd.', license: 'LIC-2024-001', workersCount: 145, violationsCount: 14, complianceStatus: 'Non-Compliant', riskScore: 84, contractValue: '₹4.2 Cr', paymentStatus: 'Fully Paid' },
  { id: 'c2', name: 'Chhota Nagpur Excavation Corp.', license: 'LIC-2023-149', workersCount: 98, violationsCount: 6, complianceStatus: 'Compliant', riskScore: 48, contractValue: '₹2.8 Cr', paymentStatus: 'Billing Pending' },
  { id: 'c3', name: 'Jharkhand Blasting & Infra', license: 'LIC-2025-088', workersCount: 54, violationsCount: 8, complianceStatus: 'Non-Compliant', riskScore: 71, contractValue: '₹1.5 Cr', paymentStatus: 'Paid Part' },
  { id: 'c4', name: 'Eastern Coal Logistics', license: 'LIC-2022-311', workersCount: 220, violationsCount: 3, complianceStatus: 'Compliant', riskScore: 24, contractValue: '₹6.0 Cr', paymentStatus: 'Fully Paid' },
  { id: 'c5', name: 'Dhanbad Safety Gear & Supplies', license: 'LIC-2024-910', workersCount: 12, violationsCount: 0, complianceStatus: 'Compliant', riskScore: 12, contractValue: '₹45 Lakh', paymentStatus: 'Fully Paid' },
  { id: 'c6', name: 'Damodar Pump & Dewatering', license: 'LIC-2023-042', workersCount: 36, violationsCount: 2, complianceStatus: 'Compliant', riskScore: 32, contractValue: '₹95 Lakh', paymentStatus: 'Billing Pending' },
  { id: 'c7', name: 'Singrauli Haulage Partners', license: 'LIC-2024-555', workersCount: 80, violationsCount: 5, complianceStatus: 'Compliant', riskScore: 59, contractValue: '₹2.1 Cr', paymentStatus: 'Paid Part' },
  { id: 'c8', name: 'Raniganj Ventilation Erectors', license: 'LIC-2024-219', workersCount: 42, violationsCount: 1, complianceStatus: 'Compliant', riskScore: 19, contractValue: '₹1.1 Cr', paymentStatus: 'Fully Paid' }
];

// Generates 50 inspections
export const generateInspections = (): Inspection[] => {
  const inspections: Inspection[] = [];
  const categories = ['Safety Barrier', 'Ventilation Fan', 'Gas Concentration', 'Roof Bolting', 'Electrical Safety', 'Environmental Audit'];
  const severities: ('LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL')[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  const zones = ['Zone 1', 'Zone 2', 'Zone 3', 'Zone 4', 'Zone 5'];

  for (let i = 1; i <= 50; i++) {
    const mineNum = (i % 5) + 1;
    const cat = categories[i % categories.length];
    const sev = severities[i % 4];
    const zone = zones[i % zones.length];
    
    inspections.push({
      id: `ins-${1000 + i}`,
      inspectorName: i % 2 === 0 ? 'Devendra Joshi' : 'Suresh Prasad',
      mineId: `m${mineNum}`,
      zone: `Zone ${mineNum === 1 ? (i % 5) + 1 : (i % 3) + 1}`,
      category: cat,
      date: new Date(Date.now() - (i * 2 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0], // Every 2 days backward
      severity: sev,
      observations: `Inspected ${cat} at ${zone}. Checked physical components and safety guidelines conformity. Found ${sev.toLowerCase()} compliance issue.`,
      gps: `23.7${i}N, 86.4${i}E`,
      status: i % 10 === 0 ? 'PENDING' : i % 12 === 0 ? 'REWORK_REQUIRED' : 'COMPLETED'
    });
  }
  return inspections;
};

// Generates 30 violations
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
      description: 'Severe water accumulation was detected near the high-voltage electrical transformer in Zone 4. This is a severe electrocution and equipment fire hazard.',
      reportedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      riskScore: 87,
      isEscalated: true,
      escalationLevel: 1,
      contractorName: 'ABC Mining Services Ltd.'
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
      description: 'Coal dust accumulations exceed 1/8 inch thickness in the primary haulage shaft, presenting a severe gas/dust explosion trigger risk.',
      reportedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      riskScore: 72,
      isEscalated: false,
      escalationLevel: 0,
      contractorName: 'ABC Mining Services Ltd.'
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
      description: 'The physical chain-link safety barriers guarding the Pit Alpha shaft entrance have been damaged by heavy machinery. Risk of fall.',
      reportedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      deadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // Overdue
      riskScore: 58,
      isEscalated: true,
      escalationLevel: 2, // Escalated to Area Manager
      contractorName: 'Chhota Nagpur Excavation Corp.'
    },
    {
      id: 'v-1004',
      title: 'Methane level reading spike at Face 3',
      category: 'Gas concentration',
      mineId: 'm3',
      zone: 'Main Incline',
      severity: 'CRITICAL',
      status: 'ACTION_SUBMITTED',
      reporterName: 'Manoj Mishra',
      assigneeName: 'Rahul Verma',
      description: 'Methane level reading peaked at 1.45% during shift B. Sensor alerted automatically. Ventilation flow has been redirected.',
      reportedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      deadline: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
      riskScore: 92,
      isEscalated: false,
      escalationLevel: 0,
      contractorName: 'Jharkhand Blasting & Infra'
    }
  ];

  const categories = ['PPE Violation', 'Ventilation Failure', 'Roof Bolting Laxity', 'Machinery Guard Absent', 'Hydraulic Leak', 'Spillway Blockage'];
  const severities: ('LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL')[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  const statuses: ('OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'ACTION_SUBMITTED' | 'CLOSED' | 'REWORK_REQUIRED')[] = [
    'CLOSED', 'CLOSED', 'CLOSED', 'OPEN', 'IN_PROGRESS', 'CLOSED', 'CLOSED'
  ];

  for (let i = 5; i <= 30; i++) {
    const mineNum = (i % 5) + 1;
    const sev = severities[i % 4];
    const cat = categories[i % categories.length];
    const status = statuses[i % statuses.length];
    const isEsc = status !== 'CLOSED' && i % 3 === 0;

    violations.push({
      id: `v-${1000 + i}`,
      title: `Violation of ${cat} protocol`,
      category: cat,
      mineId: `m${mineNum}`,
      zone: `Zone ${(i % 4) + 1}`,
      severity: sev,
      status: status,
      reporterName: i % 2 === 0 ? 'Sunil Patil' : 'Devendra Joshi',
      assigneeName: status !== 'OPEN' ? 'Rahul Verma' : undefined,
      assigneeRole: status !== 'OPEN' ? 'Corrective Officer' : undefined,
      description: `Observed statutory non-compliance regarding ${cat.toLowerCase()} in underground zone. Remedial actions required to avoid penalties.`,
      reportedAt: new Date(Date.now() - (i * 3 * 24 * 60 * 60 * 1000)).toISOString(),
      deadline: new Date(Date.now() - ((i - 2) * 24 * 60 * 60 * 1000)).toISOString(),
      riskScore: sev === 'CRITICAL' ? 85 : sev === 'HIGH' ? 68 : sev === 'MEDIUM' ? 44 : 22,
      isEscalated: isEsc,
      escalationLevel: isEsc ? (i % 3) + 1 : 0,
      contractorName: SEED_CONTRACTORS[i % SEED_CONTRACTORS.length].name
    });
  }

  return violations;
};

// Generates 25 corrective actions
export const generateCorrectiveActions = (): CorrectiveAction[] => {
  const actions: CorrectiveAction[] = [
    {
      id: 'ca-2001',
      violationId: 'v-1003',
      assigneeName: 'Ajay Kher',
      department: 'Operations',
      priority: 'MEDIUM',
      deadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'IN_PROGRESS',
      actionDescription: 'Procure heavy duty replacement fencing and secure the barrier poles with fresh anchor concrete.',
      createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'ca-2002',
      violationId: 'v-1004',
      assigneeName: 'Rahul Verma',
      department: 'Ventilation',
      priority: 'CRITICAL',
      deadline: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
      status: 'SUBMITTED',
      actionDescription: 'Diverted main auxiliary fan blower #3 directly onto Face 3 and successfully flushed methane concentrations down to 0.28%.',
      proofNotes: 'Gas sensor reading log attached showing methane levels dropped. Blower redirected and verified.',
      proofPhotoUrl: 'https://images.unsplash.com/photo-1579226905180-636b76d96082?auto=format&fit=crop&w=400&q=80',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      completedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
    }
  ];

  for (let i = 3; i <= 25; i++) {
    const isSubmitted = i % 3 === 0;
    const isVerified = i % 3 === 1;
    const status = isVerified ? 'VERIFIED' : isSubmitted ? 'SUBMITTED' : 'IN_PROGRESS';

    actions.push({
      id: `ca-${2000 + i}`,
      violationId: `v-${1000 + i}`,
      assigneeName: 'Rahul Verma',
      department: 'Operations',
      priority: i % 4 === 0 ? 'CRITICAL' : i % 4 === 1 ? 'HIGH' : i % 4 === 2 ? 'MEDIUM' : 'LOW',
      deadline: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString(),
      status: status,
      actionDescription: `Remedial action plan execution to resolve the safety violation regarding security parameters and equipment maintenance.`,
      createdAt: new Date(Date.now() - ((i + 3) * 24 * 60 * 60 * 1000)).toISOString(),
      completedAt: isSubmitted || isVerified ? new Date(Date.now() - (i * 12 * 60 * 60 * 1000)).toISOString() : undefined,
      verifiedAt: isVerified ? new Date(Date.now() - (i * 6 * 60 * 60 * 1000)).toISOString() : undefined,
      proofNotes: isSubmitted || isVerified ? 'All repairs completed. Verified under supervision.' : undefined,
      proofPhotoUrl: isSubmitted || isVerified ? 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80' : undefined
    });
  }

  return actions;
};

// Generates 100 environmental readings
export const generateEnvironmentalReadings = (): EnvironmentalReading[] => {
  const readings: EnvironmentalReading[] = [];
  const params: { name: 'Air Quality (PM2.5)' | 'Water pH' | 'Coal Dust Level' | 'Methane Level (CH4)' | 'Noise Level'; unit: string; threshold: number; normalMin: number; normalMax: number }[] = [
    { name: 'Air Quality (PM2.5)', unit: 'µg/m³', threshold: 150, normalMin: 35, normalMax: 110 },
    { name: 'Water pH', unit: 'pH', threshold: 8.5, normalMin: 6.5, normalMax: 7.8 },
    { name: 'Coal Dust Level', unit: 'mg/m³', threshold: 2.0, normalMin: 0.2, normalMax: 1.2 },
    { name: 'Methane Level (CH4)', unit: '%', threshold: 1.25, normalMin: 0.05, normalMax: 0.4 },
    { name: 'Noise Level', unit: 'dB', threshold: 85, normalMin: 55, normalMax: 78 }
  ];

  let readIdx = 1;
  // Generate data for 5 mines over past 4 intervals (5 parameters * 5 mines = 25 readings per timestamp, 4 timestamps = 100 readings)
  for (let hour = 1; hour <= 4; hour++) {
    for (let mineIdx = 1; mineIdx <= 5; mineIdx++) {
      params.forEach((param) => {
        let val = param.normalMin + Math.random() * (param.normalMax - param.normalMin);
        
        if (mineIdx === 3 && param.name === 'Water pH' && hour === 2) {
          val = 9.4; // Strong Alkaline Anomaly
        }
        if (mineIdx === 3 && param.name === 'Coal Dust Level' && hour === 3) {
          val = 2.45; // Dust explosion risk threshold exceeded
        }
        if (mineIdx === 1 && param.name === 'Methane Level (CH4)' && hour === 1) {
          val = 1.38; // Gas buildup
        }

        const isAnomaly = val > param.threshold || (param.name === 'Water pH' && (val < 6.0 || val > 8.5));

        readings.push({
          id: `env-${readIdx++}`,
          mineId: `m${mineIdx}`,
          parameter: param.name,
          value: parseFloat(val.toFixed(2)),
          unit: param.unit,
          threshold: param.threshold,
          timestamp: new Date(Date.now() - hour * 4 * 60 * 60 * 1000).toISOString(),
          anomaly: isAnomaly,
          status: isAnomaly ? 'PENDING_REVIEW' : 'REVIEWED_OK'
        });
      });
    }
  }
  return readings;
};

// Generates 15 documents
export const SEED_DOCUMENTS: Document[] = [
  {
    id: 'doc-001',
    title: 'DGMS Clearance Certificate - Shaft 1',
    category: 'License',
    mineId: 'm1',
    status: 'VALID',
    expiryDate: '2027-12-31',
    ownerName: 'Sanjay Sharma',
    fileUrl: '/docs/dgms_clearance.pdf',
    ocrExtractedText: 'DGMS CLEARANCE CERTIFICATE FOR DEEP SHAFT MINING. LICENSE REF: JH-MINE-001-A. VALID UNTIL 31-DEC-2027. SUBJECT TO ANNUAL SHIELD WALL PRESSURE VERIFICATIONS.'
  },
  {
    id: 'doc-002',
    title: 'State Pollution Control Consent to Operate',
    category: 'Environmental Clearance',
    mineId: 'm1',
    status: 'EXPIRING',
    expiryDate: '2026-09-10', // Expiring soon relative to Aug 2026!
    ownerName: 'Vikram Singh',
    fileUrl: '/docs/spcb_consent.pdf',
    ocrExtractedText: 'STATE POLLUTION CONTROL BOARD CONSENT TO OPERATE UNDER AIR ACT SECTION 21. EXPIRY DATE: 10-SEPTEMBER-2026. PM10 LIMITATIONS 100UG/M3 MAX.'
  },
  {
    id: 'doc-003',
    title: 'Contractor Operations Safety License - ABC Mining',
    category: 'License',
    contractorId: 'c1',
    status: 'EXPIRED',
    expiryDate: '2026-06-15', // Already expired!
    ownerName: 'Pankaj Gupta',
    fileUrl: '/docs/abc_safety.pdf',
    ocrExtractedText: 'CONTRACTOR SAFETY REGISTRATION - ABC MINING SERVICES LTD. EXPIRY DATE: 15-JUNE-2026. REQUIREMENT: ZERO MINER FATALITIES UNDER SUPERVISION CONTRACT.'
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
    ocrExtractedText: 'SINGRAULI OPENCAST SAFETY AUDIT 2026. GRADE: A-. VENTILATION VELOCITY: SATISFACTORY. DETECTED 3 DEVIATIONS IN ELECTRICAL ISOLATOR STATIONS.'
  }
];

// RISK intelligence formulas
export const calculateRiskScore = (
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
  recurrenceCount: number,
  overdueHours: number,
  historicalRisk: number, // 0-100
  locationScore: number // 0-100
): { score: number; level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'; factors: string[] } => {
  
  let sevWeight = severity === 'CRITICAL' ? 30 : severity === 'HIGH' ? 22 : severity === 'MEDIUM' ? 12 : 5;
  let recWeight = Math.min(recurrenceCount * 5, 20); // max 20%
  let delayWeight = Math.min((overdueHours / 24) * 4, 15); // max 15%
  let exposureWeight = severity === 'CRITICAL' || severity === 'HIGH' ? 15 : 8; // context exposure
  let histWeight = (historicalRisk / 100) * 10; // max 10%
  let locWeight = (locationScore / 100) * 10; // max 10%

  let score = Math.round(sevWeight + recWeight + delayWeight + exposureWeight + histWeight + locWeight);
  score = Math.min(Math.max(score, 0), 100);

  let level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
  if (score >= 81) level = 'CRITICAL';
  else if (score >= 61) level = 'HIGH';
  else if (score >= 31) level = 'MEDIUM';

  const factors: string[] = [];
  if (severity === 'CRITICAL') factors.push('Critical Severity violation type');
  else if (severity === 'HIGH') factors.push('High Severity observation category');

  if (recurrenceCount > 0) {
    factors.push(`${recurrenceCount} similar violations detected in the same zone within 14 days`);
  }
  if (overdueHours > 0) {
    factors.push(`Corrective action is overdue by ${Math.round(overdueHours)} hours`);
  }
  if (historicalRisk > 50) {
    factors.push('Elevated historical hazard logs in this specific mine sector');
  }
  if (locationScore > 50) {
    factors.push('Zone is classified as a hazardous workspace (substation/shaft entry)');
  }

  if (factors.length === 0) factors.push('Baseline compliance metrics');

  return { score, level, factors };
};

// Simulated Blockchain utility (SHA-256 Mocked Adapter)
export const mockSHA256 = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `0x${hex}47f2b960c1d2e8ae8f7734898c0b2d352b86e0fc21ae54a${hex}`;
};

// Database Initialization in LocalStorage
export const initializeDatabase = () => {
  if (!localStorage.getItem('coaltech_initialized')) {
    localStorage.setItem('coaltech_users', JSON.stringify(SEED_USERS));
    localStorage.setItem('coaltech_areas', JSON.stringify(SEED_AREAS));
    localStorage.setItem('coaltech_mines', JSON.stringify(SEED_MINES));
    localStorage.setItem('coaltech_workers', JSON.stringify(generateWorkers()));
    localStorage.setItem('coaltech_contractors', JSON.stringify(SEED_CONTRACTORS));
    localStorage.setItem('coaltech_inspections', JSON.stringify(generateInspections()));
    localStorage.setItem('coaltech_violations', JSON.stringify(generateViolations()));
    localStorage.setItem('coaltech_corrective_actions', JSON.stringify(generateCorrectiveActions()));
    localStorage.setItem('coaltech_readings', JSON.stringify(generateEnvironmentalReadings()));
    localStorage.setItem('coaltech_documents', JSON.stringify(SEED_DOCUMENTS));
    localStorage.setItem('coaltech_audit_logs', JSON.stringify([]));
    localStorage.setItem('coaltech_blockchain_events', JSON.stringify([]));
    localStorage.setItem('coaltech_notifications', JSON.stringify([]));
    localStorage.setItem('coaltech_offline_queue', JSON.stringify([]));
    localStorage.setItem('coaltech_settings', JSON.stringify({
      escalationHours: 24, // Escalates after 24 hrs
      weights: { severity: 0.3, recurrence: 0.2, overdue: 0.15, exposure: 0.15, history: 0.1, location: 0.1 }
    }));
    localStorage.setItem('coaltech_initialized', 'true');
  }
};
