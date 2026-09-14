// COALTECH - Central Resource Availability, Conflict Detection & Operational Rule Engine
import type { Worker, FleetVehicle, TransporterDriver, CoalMovement, OvertimeApprovalRecord } from '../types';
export type { OvertimeApprovalRecord };

export interface AvailabilityResult {
  available: boolean;
  reason?: string;
  warning?: string;
  conflictDetails?: {
    entityType: 'Worker' | 'Vehicle' | 'Driver';
    currentLocation?: string;
    currentShift?: string;
    currentAssignment?: string;
    timeWindow?: string;
  };
  requiresOvertimeApproval?: boolean;
}

export interface DocumentExpiryStatus {
  docType: string;
  docNumber?: string;
  expiryDate: string;
  daysRemaining: number;
  status: 'valid' | 'expiring_30' | 'expiring_15' | 'expiring_7' | 'expired';
  isCritical: boolean;
}

export class ResourceAvailabilityService {
  /**
   * Standard Shift Time Ranges
   */
  public static readonly SHIFT_TIMINGS: Record<string, { start: string; end: string; startHour: number; endHour: number }> = {
    'Morning Shift (A)': { start: '08:00', end: '16:00', startHour: 8, endHour: 16 },
    'Afternoon Shift (B)': { start: '16:00', end: '00:00', startHour: 16, endHour: 24 },
    'Night Shift (C)': { start: '00:00', end: '08:00', startHour: 0, endHour: 8 },
    'General Shift (G)': { start: '09:00', end: '17:00', startHour: 9, endHour: 17 },
  };

  /**
   * Standard Daily Limit: 8 hours
   */
  public static readonly MAX_DAILY_REGULAR_HOURS = 8;
  public static readonly MAX_DAILY_TOTAL_HOURS = 12; // with approved overtime
  public static readonly MIN_REST_PERIOD_HOURS = 8;

  /**
   * Evaluates worker assignment availability against shift overlaps, mine locations, and daily hours
   */
  public static validateWorkerAssignment(
    worker: Worker,
    targetMineId: string,
    targetShift: string,
    targetMineName?: string,
    options?: {
      date?: string;
      requestedHours?: number;
      hasApprovedOvertime?: boolean;
      allWorkers?: Worker[];
    }
  ): AvailabilityResult {
    // 1. Status checks
    const status = (worker.attendanceStatus || '').toLowerCase();
    if (status === 'on leave' || status === 'leave') {
      return {
        available: false,
        reason: `${worker.name} is currently On Leave and cannot be deployed to active shifts.`,
        conflictDetails: { entityType: 'Worker', currentAssignment: 'On Leave' },
      };
    }

    if (worker.role?.toLowerCase().includes('suspended') || (worker as any).status === 'SUSPENDED') {
      return {
        available: false,
        reason: `${worker.name} is currently Suspended under pending disciplinary / inquiry.`,
        conflictDetails: { entityType: 'Worker', currentAssignment: 'Suspended' },
      };
    }

    if (worker.trainingStatus === 'Expired') {
      return {
        available: false,
        reason: `${worker.name}'s mandatory Vocational DGMS Safety Training has Expired. Recertification required before underground deployment.`,
        conflictDetails: { entityType: 'Worker', currentAssignment: 'Training Expired' },
      };
    }

    // 2. Working hours and Overtime check
    const currentDailyHours = (worker as any).dailyHoursWorked || 0;
    const requestedShiftHours = options?.requestedHours || 8;
    const projectedHours = currentDailyHours + requestedShiftHours;

    if (currentDailyHours >= this.MAX_DAILY_REGULAR_HOURS) {
      if (!options?.hasApprovedOvertime) {
        return {
          available: false,
          requiresOvertimeApproval: true,
          reason: `Daily working-hour limit reached. ${worker.name} has already completed ${currentDailyHours} hours today. Statutory overtime authorization required.`,
          conflictDetails: {
            entityType: 'Worker',
            currentShift: worker.shift,
            timeWindow: `${currentDailyHours}h completed`,
          },
        };
      } else if (projectedHours > this.MAX_DAILY_TOTAL_HOURS) {
        return {
          available: false,
          reason: `Maximum statutory safety ceiling exceeded (${this.MAX_DAILY_TOTAL_HOURS} hours max allowed including overtime). Rest period required under CMR 2017.`,
        };
      }
    }

    // 3. Location and Shift Overlap Check
    // If worker is already active in a different mine on an overlapping shift
    const currentShift = worker.shift;
    const isDifferentMine = worker.mineId && worker.mineId !== targetMineId;

    if (isDifferentMine && currentShift === targetShift) {
      const currentMineDisplay = (worker as any).assignedMineName || `Mine ${worker.mineId}`;
      const timing = this.SHIFT_TIMINGS[currentShift] || { start: '08:00', end: '16:00' };

      return {
        available: false,
        reason: `${worker.name} is already assigned to ${currentMineDisplay} from ${timing.start} to ${timing.end}. Overlapping deployments are strictly prohibited.`,
        conflictDetails: {
          entityType: 'Worker',
          currentLocation: currentMineDisplay,
          currentShift: currentShift,
          timeWindow: `${timing.start}–${timing.end}`,
        },
      };
    }

    // Check partial shift overlaps (e.g. Morning 08:00–16:00 vs Afternoon 16:00–00:00 back-to-back rest rule)
    if (isDifferentMine) {
      const targetMineDisplay = targetMineName || `Mine ${targetMineId}`;
      return {
        available: false,
        reason: `${worker.name} is registered at a different facility. Cross-mine transfer clearance required before assigning to ${targetMineDisplay}.`,
        conflictDetails: {
          entityType: 'Worker',
          currentLocation: (worker as any).assignedMineName || `Mine ${worker.mineId}`,
        },
      };
    }

    return {
      available: true,
      warning:
        worker.trainingStatus === 'Pending'
          ? 'Notice: Worker safety refresher is due within 15 days.'
          : undefined,
    };
  }

  /**
   * Evaluates Vehicle Availability for transport movements
   */
  public static validateVehicleAssignment(
    vehicle: FleetVehicle,
    options?: {
      targetCargoWeightTonnes?: number;
      targetMineId?: string;
      departureTime?: string;
      estimatedArrivalTime?: string;
      activeMovements?: CoalMovement[];
    }
  ): AvailabilityResult {
    // 1. Maintenance and Breakdown rules
    const status = (vehicle.status || '').toLowerCase();
    if (status === 'maintenance') {
      return {
        available: false,
        reason: `Vehicle ${vehicle.plate} is currently undergoing scheduled maintenance / workshop calibration.`,
        conflictDetails: { entityType: 'Vehicle', currentAssignment: 'Maintenance' },
      };
    }

    if (status === 'breakdown' || (vehicle as any).status === 'BREAKDOWN') {
      return {
        available: false,
        reason: `Vehicle ${vehicle.plate} has an active mechanical breakdown log. Fitness re-inspection required.`,
        conflictDetails: { entityType: 'Vehicle', currentAssignment: 'Breakdown' },
      };
    }

    if (status === 'retired' || status === 'out_of_service' || status === 'inactive') {
      return {
        available: false,
        reason: `Vehicle ${vehicle.plate} is decommissioned / out of service.`,
        conflictDetails: { entityType: 'Vehicle', currentAssignment: 'Out of Service' },
      };
    }

    // 2. Overlapping active movement check
    if (status === 'on_trip' || (vehicle as any).status === 'IN_TRANSIT') {
      return {
        available: false,
        reason: `Vehicle ${vehicle.plate} is currently In Transit on an active coal dispatch corridor. Double-booking is rejected.`,
        conflictDetails: { entityType: 'Vehicle', currentAssignment: 'Active Trip / In Transit' },
      };
    }

    // Check against movements list if provided
    if (options?.activeMovements && options.activeMovements.length > 0) {
      const activeTrip = options.activeMovements.find(
        (m) =>
          m.vehicleId === vehicle.id &&
          (m.status === 'DISPATCHED' || m.status === 'IN_TRANSIT')
      );
      if (activeTrip) {
        return {
          available: false,
          reason: `Vehicle ${vehicle.plate} is already allocated to Dispatch ${activeTrip.id} (${activeTrip.originMineName} → ${activeTrip.destinationName}).`,
          conflictDetails: {
            entityType: 'Vehicle',
            currentAssignment: activeTrip.id,
            timeWindow: `${activeTrip.departureTime} – ${activeTrip.estimatedArrival}`,
          },
        };
      }
    }

    // 3. Statutory Document Expiry Checks
    const docs = vehicle.documents || [];
    for (const doc of docs) {
      const expiry = new Date(doc.expiryDate);
      if (expiry.getTime() < Date.now()) {
        return {
          available: false,
          reason: `Statutory compliance violation: Vehicle ${vehicle.plate} has an Expired ${doc.type.toUpperCase()} Certificate (Doc #${doc.docNumber || 'N/A'}). Dispatch prohibited under CMR 2017.`,
          conflictDetails: { entityType: 'Vehicle', currentAssignment: `Expired ${doc.type}` },
        };
      }
    }

    // 4. Capacity overload check
    if (options?.targetCargoWeightTonnes && vehicle.maxCapacityTonnes) {
      if (options.targetCargoWeightTonnes > vehicle.maxCapacityTonnes + 1.0) {
        return {
          available: false,
          reason: `Requested coal payload (${options.targetCargoWeightTonnes} MT) exceeds vehicle gross safe axle limit (${vehicle.maxCapacityTonnes} MT).`,
          conflictDetails: { entityType: 'Vehicle', currentAssignment: 'Gross Overload' },
        };
      }
    }

    return { available: true };
  }

  /**
   * Evaluates Driver Availability for haulage trips
   */
  public static validateDriverAssignment(
    driver: TransporterDriver,
    options?: {
      targetVehicleId?: string;
      activeMovements?: CoalMovement[];
    }
  ): AvailabilityResult {
    // 1. Status checks
    const status = (driver.status || '').toLowerCase();
    if (status === 'on_trip') {
      return {
        available: false,
        reason: `Driver ${driver.name} is currently on an active haulage trip. Drivers cannot operate multiple vehicles simultaneously.`,
        conflictDetails: { entityType: 'Driver', currentAssignment: 'Active Trip' },
      };
    }

    if (status === 'on_leave' || status === 'leave') {
      return {
        available: false,
        reason: `Driver ${driver.name} is marked On Leave.`,
        conflictDetails: { entityType: 'Driver', currentAssignment: 'On Leave' },
      };
    }

    if (status === 'suspended') {
      return {
        available: false,
        reason: `Driver ${driver.name} is currently suspended due to safety violation / inquiry.`,
        conflictDetails: { entityType: 'Driver', currentAssignment: 'Suspended' },
      };
    }

    // 2. License Expiry Check
    if (driver.licenseExpiry) {
      const expDate = new Date(driver.licenseExpiry);
      if (expDate.getTime() < Date.now()) {
        return {
          available: false,
          reason: `Commercial Heavy Vehicle Driving License (${driver.licenseNumber}) for ${driver.name} is EXPIRED. Statutory bar under Motor Vehicles Act & DGMS regulations.`,
          conflictDetails: { entityType: 'Driver', currentAssignment: 'License Expired' },
        };
      }
    }

    // 3. Movement list check
    if (options?.activeMovements && options.activeMovements.length > 0) {
      const activeTrip = options.activeMovements.find(
        (m) =>
          m.driverId === driver.id &&
          (m.status === 'DISPATCHED' || m.status === 'IN_TRANSIT')
      );
      if (activeTrip) {
        return {
          available: false,
          reason: `Driver ${driver.name} is already assigned to Dispatch ${activeTrip.id}. Simultaneous dispatches are blocked.`,
          conflictDetails: { entityType: 'Driver', currentAssignment: activeTrip.id },
        };
      }
    }

    return { available: true };
  }

  /**
   * Evaluates document expiry status against 30, 15, 7 days and expired thresholds
   */
  public static evaluateDocumentExpiry(expiryDateStr: string, docType: string, docNumber?: string): DocumentExpiryStatus {
    const expiry = new Date(expiryDateStr);
    const now = new Date();
    const diffMs = expiry.getTime() - now.getTime();
    const daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    let status: DocumentExpiryStatus['status'] = 'valid';
    if (daysRemaining < 0) {
      status = 'expired';
    } else if (daysRemaining <= 7) {
      status = 'expiring_7';
    } else if (daysRemaining <= 15) {
      status = 'expiring_15';
    } else if (daysRemaining <= 30) {
      status = 'expiring_30';
    }

    const isCritical = status === 'expired' || status === 'expiring_7';

    return {
      docType,
      docNumber,
      expiryDate: expiryDateStr,
      daysRemaining,
      status,
      isCritical,
    };
  }
}
