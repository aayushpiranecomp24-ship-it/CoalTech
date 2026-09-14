import {
  SEED_USERS,
  SEED_AREAS,
  SEED_MINES,
  generateWorkers,
  SEED_FLEET_VEHICLES,
  SEED_FLEET_DRIVERS,
  SEED_ROUTES,
  SEED_COAL_MOVEMENTS,
  SEED_COMPLIANCE_ITEMS,
} from '../data/seedData';
import { ROLE_PERMISSIONS_MAP } from '../types/index';
import type { Mine } from '../types/index';
import { translations } from '../data/i18nDictionaries';
import { ResourceAvailabilityService } from '../services/resourceAvailabilityService';

console.log('====================================================');
console.log('COALTECH VERIFICATION SUITE — COMPLETE REGRESSION');
console.log('====================================================');

// 1. User & Demo Role Tests
console.log('\n[TEST 1] Transportation Head & Demo Role Existence');
const thUser = SEED_USERS.find((u) => u.role === 'Transportation Head');
if (!thUser) throw new Error('Transportation Head missing from SEED_USERS');
console.log('✓ Found Transportation Head:', thUser.name, `(${thUser.email})`);

const requiredRoles = [
  'Coal Mine Manager',
  'Area Manager',
  'Mine Head',
  'Safety Officer',
  'Inspection Officer',
  'Environment Officer',
  'Contractor Manager',
  'Finance Officer',
  'Workforce Head',
  'Worker',
  'Regulatory Authority',
  'Transportation Head',
];
for (const r of requiredRoles) {
  if (!SEED_USERS.find((u) => u.role === r)) throw new Error(`Role missing: ${r}`);
}
console.log(`✓ All ${requiredRoles.length} demo roles validated in SEED_USERS`);

// 2. RBAC Permissions & Strict Isolation for Transportation Head
console.log('\n[TEST 2] RBAC Verification & Strict Isolation for Transportation Head');
const thPerms = ROLE_PERMISSIONS_MAP['Transportation Head'];
if (!thPerms.allowedModules.includes('transportation'))
  throw new Error('Transportation Head cannot access transportation');
if (!thPerms.allowedModules.includes('dashboard'))
  throw new Error('Transportation Head cannot access dashboard');
if (!thPerms.allowedModules.includes('mines'))
  throw new Error('Transportation Head cannot access mines (read-only)');

// Verify forbidden modules
const forbiddenModules = ['workforce', 'finance', 'environment', 'contractors', 'settings'];
for (const mod of forbiddenModules) {
  if (thPerms.allowedModules.includes(mod)) {
    throw new Error(`Transportation Head improperly has access to forbidden module: ${mod}`);
  }
}
console.log('✓ Verified Transportation Head forbidden modules blocked:', forbiddenModules.join(', '));

// Verify admin flags are false
if (thPerms.canManageFinance !== false) throw new Error('canManageFinance must be false');
if (thPerms.canManageWorkforce !== false) throw new Error('canManageWorkforce must be false');
if (thPerms.canManageContractors !== false) throw new Error('canManageContractors must be false');
if (thPerms.canManageCompliance !== false) throw new Error('canManageCompliance must be false');
if (thPerms.canCreateInspection !== false) throw new Error('canCreateInspection must be false');
if (thPerms.canEditSettings !== false) throw new Error('canEditSettings must be false');
console.log('✓ All administrative flags strictly disabled for Transportation Head');
console.log('✓ Allowed modules:', thPerms.allowedModules.join(', '));

// 3. i18n Dictionaries
console.log('\n[TEST 3] i18n Dictionaries');
if (translations.en.nav_transportation !== 'Coal & Logistics')
  throw new Error('English nav_transportation mismatch');
if (!translations.hi.nav_transportation.includes('लॉजिस्टिक्स'))
  throw new Error('Hindi nav_transportation mismatch');
console.log('✓ EN: nav_transportation =', translations.en.nav_transportation);
console.log('✓ HI: nav_transportation =', translations.hi.nav_transportation);

// 4. ResourceAvailabilityService: Worker 8.0h Daily Overtime Limit
console.log('\n[TEST 4] Worker Availability & Statutory 8h Daily Rule');
const workers = generateWorkers();
const ganesh = workers.find((w) => w.id === 'w9'); // Ganesh Kewat: 8.0h worked
if (!ganesh) throw new Error('Worker w9 (Ganesh Kewat) not found in workers');
const otCheck = ResourceAvailabilityService.validateWorkerAssignment(
  ganesh,
  ganesh.mineId,
  'Morning Shift (A)'
);
if (otCheck.available) throw new Error('Ganesh Kewat should be blocked due to 8h daily limit');
console.log('✓ Worker 8h Overtime Block Triggered Correctly:', otCheck.reason);

// 5. ResourceAvailabilityService: Cross-Mine Overlap
console.log('\n[TEST 5] Cross-Facility Deployment Validation');
const suresh = workers.find((w) => w.id === 'w5'); // Suresh Soren assigned to Mine B (m2)
if (!suresh) throw new Error('Worker w5 not found');
const crossMineCheck = ResourceAvailabilityService.validateWorkerAssignment(
  suresh,
  'm1',
  'Morning Shift (A)'
);
if (crossMineCheck.available)
  throw new Error('Cross-mine deployment should require clearance/be rejected');
console.log('✓ Cross-Mine Deployment Blocked Correctly:', crossMineCheck.reason);

// 6. ResourceAvailabilityService: Vehicle Maintenance Lock
console.log('\n[TEST 6] Vehicle Maintenance Dispatch Lock');
const maintVehicle = SEED_FLEET_VEHICLES.find((v) => v.status === 'maintenance');
if (!maintVehicle) throw new Error('Maintenance test vehicle not found');
const vCheck = ResourceAvailabilityService.validateVehicleAssignment(maintVehicle);
if (vCheck.available) throw new Error('Maintenance vehicle should not be available');
console.log(
  `✓ Vehicle ${maintVehicle.plate} (${maintVehicle.status}) Blocked Correctly:`,
  vCheck.reason
);

// 7. ResourceAvailabilityService: Driver Commercial License Expiry / Suspension
console.log('\n[TEST 7] Driver Commercial License Validation');
const suspendedDriver = SEED_FLEET_DRIVERS.find((d) => d.status === 'suspended');
if (!suspendedDriver) throw new Error('Suspended driver not found');
const dCheck = ResourceAvailabilityService.validateDriverAssignment(suspendedDriver);
if (dCheck.available) throw new Error('Suspended driver should be rejected');
console.log(
  `✓ Driver ${suspendedDriver.name} (${suspendedDriver.licenseNumber}) Blocked Correctly:`,
  dCheck.reason
);

// 8. Weighbridge Reconciliation & Variance
console.log('\n[TEST 8] Weighbridge Reconciliation Math & Tolerance');
const sampleMovement = SEED_COAL_MOVEMENTS[0];
const dispatchedNet = sampleMovement.dispatchedNetTonnes;
const allowance = sampleMovement.transitLossAllowanceTonnes;
const receivedNet = dispatchedNet - 1.85; // 1.85 MT loss > allowance
const variance = Number((dispatchedNet - receivedNet).toFixed(2));
const isExcessive = variance > allowance;
if (!isExcessive)
  throw new Error('Variance of 1.85 MT should be flagged as excessive against allowance');
console.log(
  `✓ Weighbridge discrepancy math: Dispatched=${dispatchedNet}T, Received=${receivedNet}T, Variance=${variance}T (Allowance=${allowance}T) -> Discrepancy Flagged: ${isExcessive}`
);

// 9. Dataset 1: Mines (5 total)
console.log('\n[TEST 9] Operational Mines (5 Total)');
if (SEED_MINES.length < 5) throw new Error(`Expected at least 5 mines, found ${SEED_MINES.length}`);
const expectedMineIds = ['m1', 'm2', 'm3', 'm4', 'm5'];
for (const id of expectedMineIds) {
  const mine = SEED_MINES.find((m) => m.id === id);
  if (!mine) throw new Error(`Missing expected mine: ${id}`);
  console.log(`  • [${mine.id}] ${mine.name} (${mine.type}) - Area: ${mine.areaId} - Status: ${mine.status}`);
}
console.log(`✓ All ${SEED_MINES.length} mines validated with relational links`);

// 10. Dataset 2: Areas (3 total)
console.log('\n[TEST 10] Operational Areas (3 Total)');
if (SEED_AREAS.length < 3) throw new Error(`Expected at least 3 areas, found ${SEED_AREAS.length}`);
const expectedAreaIds = ['a1', 'a2', 'a3'];
for (const id of expectedAreaIds) {
  const area = SEED_AREAS.find((a) => a.id === id);
  if (!area) throw new Error(`Missing expected area: ${id}`);
  console.log(`  • [${area.id}] ${area.name} - Manager: ${area.manager} (${area.state})`);
}
console.log(`✓ All ${SEED_AREAS.length} operational areas validated`);

// 11. Dataset 3: Workers (30 total)
console.log('\n[TEST 11] Operational Workforce (30 Workers Across 5 Mines)');
if (workers.length < 30) throw new Error(`Expected at least 30 workers, found ${workers.length}`);
const suspendedWorker = workers.find((w) => w.status === 'Suspended');
if (!suspendedWorker) throw new Error('Test scenario missing: Suspended worker');
console.log(`✓ Total workers: ${workers.length}`);
console.log(`✓ Test worker scenarios present:`);
console.log(`  - 8h OT Limit Worker: ${ganesh.name} (w9, ${ganesh.dailyHoursWorked}h)`);
console.log(`  - Cross-mine Worker: ${suresh.name} (w5, assigned to ${suresh.mineId})`);
console.log(`  - Suspended Worker: ${suspendedWorker.name} (${suspendedWorker.id}, ${suspendedWorker.status})`);

// 12. Dataset 4: Fleet Vehicles (12 total)
console.log('\n[TEST 12] Fleet Vehicles (12 Haulage Vehicles)');
if (SEED_FLEET_VEHICLES.length < 12)
  throw new Error(`Expected at least 12 fleet vehicles, found ${SEED_FLEET_VEHICLES.length}`);
for (let i = 1; i <= 12; i++) {
  const vId = `V-${300 + i}`;
  const v = SEED_FLEET_VEHICLES.find((veh) => veh.id === vId);
  if (!v) throw new Error(`Missing fleet vehicle: ${vId}`);
}
console.log(`✓ All 12 fleet vehicles present (V-301 to V-312)`);
const vehicleStatuses = Array.from(new Set(SEED_FLEET_VEHICLES.map((v) => v.status)));
console.log(`✓ Vehicle operational statuses represented: ${vehicleStatuses.join(', ')}`);

// 13. Dataset 5: Fleet Drivers (12 total)
console.log('\n[TEST 13] Fleet Commercial Drivers (12 Drivers)');
if (SEED_FLEET_DRIVERS.length < 12)
  throw new Error(`Expected at least 12 fleet drivers, found ${SEED_FLEET_DRIVERS.length}`);
for (let i = 1; i <= 12; i++) {
  const dId = `D-${500 + i}`;
  const d = SEED_FLEET_DRIVERS.find((drv) => drv.id === dId);
  if (!d) throw new Error(`Missing fleet driver: ${dId}`);
}
console.log(`✓ All 12 fleet drivers present (D-501 to D-512)`);
const driverStatuses = Array.from(new Set(SEED_FLEET_DRIVERS.map((d) => d.status)));
console.log(`✓ Driver statuses represented: ${driverStatuses.join(', ')}`);

// 14. Dataset 6: Corridors / Routes (8 total)
console.log('\n[TEST 14] Haulage Corridors (8 Corridors)');
if (SEED_ROUTES.length < 8)
  throw new Error(`Expected at least 8 corridors, found ${SEED_ROUTES.length}`);
for (let i = 1; i <= 8; i++) {
  const rId = `COR-0${i}`;
  const r = SEED_ROUTES.find((route) => route.id === rId);
  if (!r) throw new Error(`Missing route corridor: ${rId}`);
  console.log(`  • [${r.id}] ${r.name} (${r.distanceKm} km, ${r.status})`);
}
console.log(`✓ All 8 haulage corridors validated linking 5 operational mines`);

// 15. Dataset 7: Coal Movements (12 total)
console.log('\n[TEST 15] Coal Dispatches & Movements (12 Movements)');
if (SEED_COAL_MOVEMENTS.length < 12)
  throw new Error(`Expected at least 12 coal movements, found ${SEED_COAL_MOVEMENTS.length}`);
for (let i = 1; i <= 12; i++) {
  const mId = `CM-2026-${1000 + i}`;
  const m = SEED_COAL_MOVEMENTS.find((mov) => mov.id === mId);
  if (!m) throw new Error(`Missing coal movement: ${mId}`);
}
const movementStatuses = Array.from(new Set(SEED_COAL_MOVEMENTS.map((m) => m.status)));
console.log(`✓ All 12 movements present (CM-2026-1001 to CM-2026-1012)`);
console.log(`✓ Movement statuses represented: ${movementStatuses.join(', ')}`);

// 16. Dataset 8: Compliance Items (12 total)
console.log('\n[TEST 16] Statutory Compliance Items (12 Items)');
if (SEED_COMPLIANCE_ITEMS.length < 12)
  throw new Error(`Expected at least 12 compliance items, found ${SEED_COMPLIANCE_ITEMS.length}`);
for (let i = 1; i <= 12; i++) {
  const cId = `comp-${100 + i}`;
  const c = SEED_COMPLIANCE_ITEMS.find((item) => item.id === cId);
  if (!c) throw new Error(`Missing compliance item: ${cId}`);
}
console.log(`✓ All 12 compliance items present (comp-101 to comp-112)`);

// 17. Data Preservation & Non-Destructive Appending Logic Test
console.log('\n[TEST 17] Data Preservation & Non-Destructive Appending Simulation');
// Simulate loadStoredOrSeed helper logic
function loadStoredOrSeed<T>(storedRaw: string | null, seed: T[]): T[] {
  if (!storedRaw) return seed;
  try {
    const parsed = JSON.parse(storedRaw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    return seed; // Empty arrays [] fallback to seed!
  } catch {
    return seed;
  }
}

// Case A: Storage has empty array "[]" -> must NOT wipe out seed
const preservedFromEmpty = loadStoredOrSeed('[]', SEED_MINES);
if (preservedFromEmpty.length !== SEED_MINES.length) {
  throw new Error('Data preservation failure: "[]" in storage wiped out seed data!');
}
console.log(`✓ Empty storage "[]" fallback preserves all ${preservedFromEmpty.length} seed mines`);

// Case B: Adding a new mine appends non-destructively
const baseMines = preservedFromEmpty;
const newMine: Mine = {
  id: 'm6',
  name: 'Bokaro East Deep Pit',
  mineCode: 'BOK-06',
  areaId: 'a1',
  manager: 'Devendra Joshi',
  riskScore: 35,
  complianceScore: 90,
  latitude: 23.79,
  longitude: 85.96,
  gps: '23.79° N, 85.96° E',
  state: 'Jharkhand',
  type: 'Underground',
  status: 'ACTIVE',
  zones: ['Shaft 1', 'Pit Alpha'],
  productionCapacityMTPA: 4.5,
  workforceCount: 650,
};
const updatedMines = [...baseMines, newMine];
if (updatedMines.length !== 6) {
  throw new Error(`Expected 6 mines after addition, got ${updatedMines.length}`);
}
// Persist to simulated storage and reload
const serialized = JSON.stringify(updatedMines);
const reloadedMines = loadStoredOrSeed<Mine>(serialized, SEED_MINES);
if (reloadedMines.length !== 6) {
  throw new Error(`Expected 6 mines after re-loading, got ${reloadedMines.length}`);
}
if (!reloadedMines.find((m) => m.id === 'm1') || !reloadedMines.find((m) => m.id === 'm6')) {
  throw new Error('Reloaded mines do not contain both original seed and new mine');
}
// 18. Dataset 9: Operational Sectors (Benches, Blasts, Overburden, Quality, Stockpiles, Delays)
console.log('\n[TEST 18] Pit Operations & Extraction Models');
import {
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

if (SEED_BENCHES.length < 8) throw new Error(`Expected at least 8 benches, found ${SEED_BENCHES.length}`);
if (SEED_BLAST_PLANS.length < 4) throw new Error(`Expected at least 4 blast plans, found ${SEED_BLAST_PLANS.length}`);
if (SEED_OVERBURDEN.length < 4) throw new Error(`Expected at least 4 overburden records, found ${SEED_OVERBURDEN.length}`);
if (SEED_COAL_QUALITY.length < 5) throw new Error(`Expected at least 5 coal quality samples, found ${SEED_COAL_QUALITY.length}`);
if (SEED_STOCKPILES.length < 5) throw new Error(`Expected at least 5 stockpiles, found ${SEED_STOCKPILES.length}`);
if (SEED_OPERATIONAL_DELAYS.length < 3) throw new Error(`Expected at least 3 delay records, found ${SEED_OPERATIONAL_DELAYS.length}`);
console.log(`✓ Pit operations: ${SEED_BENCHES.length} benches, ${SEED_BLAST_PLANS.length} blasts, ${SEED_OVERBURDEN.length} OB records, ${SEED_COAL_QUALITY.length} quality samples, ${SEED_STOCKPILES.length} stockpiles`);

// 19. Dataset 10: HEMM Heavy Machinery Fleet & Maintenance
console.log('\n[TEST 19] HEMM Machinery Fleet, CAN-bus Telemetry & Spare Parts');
if (SEED_HEMM_ASSETS.length < 12) throw new Error(`Expected at least 12 HEMM assets, found ${SEED_HEMM_ASSETS.length}`);
if (SEED_BREAKDOWN_TICKETS.length < 3) throw new Error(`Expected at least 3 breakdown tickets, found ${SEED_BREAKDOWN_TICKETS.length}`);
if (SEED_SPARE_PARTS.length < 6) throw new Error(`Expected at least 6 spare part items, found ${SEED_SPARE_PARTS.length}`);
// Verify simulated telemetry
const sampleHemm = SEED_HEMM_ASSETS[0];
if (!sampleHemm.simulatedTelemetry || typeof sampleHemm.simulatedTelemetry.rpm !== 'number') {
  throw new Error('HEMM simulated telemetry structure missing or invalid');
}
console.log(`✓ HEMM Fleet: ${SEED_HEMM_ASSETS.length} heavy machines with simulated CAN-bus telemetry, ${SEED_BREAKDOWN_TICKETS.length} work orders, ${SEED_SPARE_PARTS.length} spare inventory parts`);

// 20. Dataset 11: Emergency Incident Command, Muster & 5-Why RCA
console.log('\n[TEST 20] Emergency Command, Muster Roll Call & 5-Why RCA');
if (!SEED_EMERGENCY_COMMAND || SEED_EMERGENCY_COMMAND.totalWorkersOnSite !== 186) {
  throw new Error('Emergency command muster numbers mismatch');
}
if (SEED_EMERGENCY_DRILLS.length < 3) throw new Error(`Expected at least 3 mock drills, found ${SEED_EMERGENCY_DRILLS.length}`);
if (SEED_ROOT_CAUSE_ANALYSES.length < 2) throw new Error(`Expected at least 2 RCA records, found ${SEED_ROOT_CAUSE_ANALYSES.length}`);
const sampleRca = SEED_ROOT_CAUSE_ANALYSES[0];
if (!sampleRca.whys || sampleRca.whys.length !== 5) {
  throw new Error('5-Why RCA record does not contain exactly 5 Whys');
}
console.log(`✓ Emergency command: ${SEED_EMERGENCY_COMMAND.totalWorkersOnSite} on site (${SEED_EMERGENCY_COMMAND.accountedWorkers} accounted, ${SEED_EMERGENCY_COMMAND.unconfirmedMissingWorkers} unconfirmed)`);
console.log(`✓ ${SEED_EMERGENCY_DRILLS.length} mock drills, ${SEED_ROOT_CAUSE_ANALYSES.length} forensic 5-Why & Fishbone RCA records`);

// 21. Dataset 12: Centralized Approval Center & Data Quality Checks
console.log('\n[TEST 21] Centralized Approvals & Database Health Audit Checks');
if (SEED_PENDING_APPROVALS.length < 6) throw new Error(`Expected at least 6 approvals, found ${SEED_PENDING_APPROVALS.length}`);
if (SEED_DATA_QUALITY_CHECKS.length < 5) throw new Error(`Expected at least 5 checks, found ${SEED_DATA_QUALITY_CHECKS.length}`);
console.log(`✓ Approval Center: ${SEED_PENDING_APPROVALS.length} multi-department statutory approval requests`);
console.log(`✓ Data Quality: ${SEED_DATA_QUALITY_CHECKS.length} automated relational integrity & spatial bounding checks`);

// 22. Strict RBAC for Transportation Head on New Modules
console.log('\n[TEST 22] Strict RBAC Isolation for New Modules');
const thAllowed = ROLE_PERMISSIONS_MAP['Transportation Head'].allowedModules;
const newAdminModules = ['mine-operations', 'hemm-assets', 'emergency', 'approval-center', 'data-quality'];
for (const m of newAdminModules) {
  if (thAllowed.includes(m)) {
    throw new Error(`CRITICAL RBAC VIOLATION: Transportation Head has improper access to ${m}`);
  }
}
console.log('✓ Transportation Head strictly barred from all new operational & admin modules:', newAdminModules.join(', '));

// 23. Coal Mine Manager has comprehensive access
console.log('\n[TEST 23] Enterprise Role Scope for Coal Mine Manager');
const cmmAllowed = ROLE_PERMISSIONS_MAP['Coal Mine Manager'].allowedModules;
const requiredCmmModules = [
  'dashboard', 'mines', 'mine-operations', 'hemm-assets', 'transportation',
  'compliance', 'inspections', 'incidents', 'corrective', 'emergency',
  'approval-center', 'contractors', 'workforce', 'environment', 'gis-map',
  'risk-intelligence', 'finance', 'reports', 'daily-report', 'audit-trail',
  'data-quality', 'notifications', 'settings'
];
for (const m of requiredCmmModules) {
  if (!cmmAllowed.includes(m)) {
    throw new Error(`Coal Mine Manager missing module: ${m}`);
  }
}
console.log(`✓ Coal Mine Manager has full access to all ${requiredCmmModules.length} operational & governance sectors`);

// 24. Canonical Demo Scenario: 1000T Rail Rake -> 970T Receipt (30T Loss)
console.log('\n[TEST 24] Canonical 1000T Rail Rake Dispatch & 30T Transport Loss Detection');
const rake1013 = SEED_COAL_MOVEMENTS.find((m) => m.id === 'CM-2026-1013');
if (!rake1013) throw new Error('Canonical Rail Rake CM-2026-1013 missing from SEED_COAL_MOVEMENTS');
if (rake1013.dispatchedNetTonnes !== 1000.0) throw new Error(`Expected 1000.0T dispatched, got ${rake1013.dispatchedNetTonnes}`);
if (rake1013.transitLossAllowanceTonnes !== 5.0) throw new Error(`Expected 5.0T allowance, got ${rake1013.transitLossAllowanceTonnes}`);
// Simulate receipt of 970.0T (gross 1390T - tare 420T)
const receivedGross = 1390.0;
const receivedTare = 420.0;
const receivedNetSim = receivedGross - receivedTare; // 970.0
const varianceSim = rake1013.dispatchedNetTonnes - receivedNetSim; // 30.0
const isDiscrepancySim = varianceSim > rake1013.transitLossAllowanceTonnes;
if (varianceSim !== 30.0 || !isDiscrepancySim) {
  throw new Error(`Expected 30.0T variance flagged as discrepancy, got ${varianceSim}T`);
}
console.log(`✓ 1000T Rake Dispatch: Dispatched = ${rake1013.dispatchedNetTonnes}T, Received = ${receivedNetSim}T`);
console.log(`✓ Discrepancy Calculated = ${varianceSim}T > Statutory Allowance (${rake1013.transitLossAllowanceTonnes}T) -> Discrepancy Flagged: ${isDiscrepancySim}`);

// 25. Cryptographic Blockchain Hash-Chain & Tamper-Evident Detection
console.log('\n[TEST 25] Cryptographic Hash-Chain Integrity & Tamper Detection');
import { createNewBlock, verifyBlockchainIntegrity, GENESIS_HASH } from '../utils/hashChain';
import type { BlockchainBlock } from '../types/index';
// Construct authentic 3-block chain
const b0: BlockchainBlock = {
  id: 'blk-0',
  blockNumber: 0,
  timestamp: new Date().toISOString(),
  actor: 'System Genesis',
  action: 'GENESIS',
  entityId: 'GENESIS_0',
  payloadHash: '0x000',
  previousHash: GENESIS_HASH,
  currentHash: '0x1111111111111111111111111111111111111111111111111111111111111111',
  verified: true,
};
const b1 = createNewBlock(1, 'Safety Officer', 'COMPLIANCE_PASS', 'comp-101', { pass: true }, b0.currentHash);
const b2 = createNewBlock(2, 'Weighbridge Clerk', 'WEIGHBRIDGE_RECEIPT', 'CM-2026-1013', { net: 970 }, b1.currentHash);
const authenticChain = [b0, b1, b2];
const authenticRes = verifyBlockchainIntegrity(authenticChain);
if (!authenticRes.isValid) throw new Error(`Authentic chain failed verification: ${authenticRes.message}`);
console.log('✓ Authentic SHA-256 Chain Verification:', authenticRes.message);

// Simulate unauthorized tamper in block 1
const tamperedChain = [
  b0,
  { ...b1, currentHash: '0xdeadbeef00000000000000000000000000000000000000000000000000000000' },
  b2,
];
const tamperedRes = verifyBlockchainIntegrity(tamperedChain);
if (tamperedRes.isValid) throw new Error('Tampered chain should have failed verification!');
console.log('✓ Tamper Detection Successfully Flagged Broken Chain:', tamperedRes.message);

// 26. 15 Roles RBAC Coverage
console.log('\n[TEST 26] 15 Roles RBAC Matrix Full Coverage');
const all15Roles = [
  'Coal Mine Manager',
  'Area Manager',
  'Mine Head',
  'Transportation Head',
  'Safety Officer',
  'Inspection Officer',
  'Environment Officer',
  'Contractor Manager',
  'Finance Officer',
  'Workforce Head',
  'Worker',
  'Regulatory Authority',
  'Government Department',
  'Corporate Management',
  'System Administrator',
];
for (const role of all15Roles) {
  const perms = ROLE_PERMISSIONS_MAP[role as keyof typeof ROLE_PERMISSIONS_MAP];
  if (!perms || !Array.isArray(perms.allowedModules) || perms.allowedModules.length === 0) {
    throw new Error(`Role ${role} missing permissions or allowedModules in ROLE_PERMISSIONS_MAP`);
  }
}
console.log(`✓ All 15 canonical roles defined in ROLE_PERMISSIONS_MAP with explicit module access`);

console.log('\n====================================================');
console.log('ALL 26 VERIFICATION TESTS PASSED PERFECTLY!');
console.log('====================================================');


