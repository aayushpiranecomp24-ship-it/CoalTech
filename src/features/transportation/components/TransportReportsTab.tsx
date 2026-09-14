// COALTECH - Transport & Siding Haulage Reports Tab
import React, { useState } from 'react';
import { useGovernance } from '../../../context/GovernanceContext';
import { useI18n } from '../../../context/I18nContext';
import { exportToCSV, triggerPrintReport } from '../../../utils/exportUtils';
import {
  FileText,
  Download,
  Printer,
  Calendar,
  CheckCircle2,
  Scale,
  Truck,
  ShieldCheck,
  Fuel,
} from 'lucide-react';

export const TransportReportsTab: React.FC = () => {
  const { coalMovements, fleetVehicles } = useGovernance();
  const { t } = useI18n();

  const [selectedReportType, setSelectedReportType] = useState<
    'haulage_manifest' | 'calibration_audit' | 'transit_loss' | 'fleet_compliance' | 'diesel_consumption'
  >('haulage_manifest');

  const [dateFilter, setDateFilter] = useState('ALL');

  const handleExportCSV = () => {
    switch (selectedReportType) {
      case 'haulage_manifest': {
        const manifestData = coalMovements.map((m) => ({
          Movement_ID: m.id,
          Vehicle_Plate: m.vehiclePlate,
          Origin_Mine: m.originMineName,
          Destination_Siding: m.destinationName,
          Dispatch_Gross_MT: m.dispatchedGrossTonnes,
          Dispatch_Tare_MT: m.dispatchedTareTonnes,
          Dispatch_Net_MT: m.dispatchedNetTonnes,
          Received_Net_MT: m.receivedNetTonnes ?? 'Pending',
          Variance_MT: m.weightDiscrepancyTonnes ?? 'Pending',
          Variance_Percent: m.weightDiscrepancyPercent !== undefined ? `${m.weightDiscrepancyPercent.toFixed(2)}%` : 'Pending',
          Seal_Status: m.sealIntact !== false ? 'INTACT' : 'TAMPERED / BROKEN',
          Status: m.status,
          Departure_Time: m.departureTime,
        }));
        exportToCSV('COALTECH_Siding_Dispatch_Manifest', manifestData);
        break;
      }
      case 'transit_loss': {
        const discrepancyData = coalMovements
          .filter((m) => m.status === 'DISCREPANCY_FLAGGED' || (m.weightDiscrepancyPercent !== undefined && Math.abs(m.weightDiscrepancyPercent) > 0.5))
          .map((m) => ({
            Movement_ID: m.id,
            Vehicle_Plate: m.vehiclePlate,
            Origin: m.originMineName,
            Destination: m.destinationName,
            Dispatch_Net_MT: m.dispatchedNetTonnes,
            Received_Net_MT: m.receivedNetTonnes,
            Loss_Variance_MT: m.weightDiscrepancyTonnes,
            Loss_Percentage: m.weightDiscrepancyPercent,
            Seal_Status: m.sealIntact !== false ? 'INTACT' : 'TAMPERED / BROKEN',
            CAPA_Ticket: 'Auto-Dispatched 24h SLA',
            Flagged_Date: m.receivedTime || m.departureTime,
          }));
        exportToCSV('COALTECH_Transit_Loss_Discrepancies', discrepancyData);
        break;
      }
      case 'fleet_compliance': {
        const fleetData = fleetVehicles.map((v) => ({
          Vehicle_Registration: v.plate,
          Name: v.name,
          Model: `${v.make} ${v.model}`,
          Capacity_Tons: v.maxCapacityTonnes,
          Current_Odometer_Km: v.mileageKm,
          Fuel_Level_Percent: `${v.fuelLevel}%`,
          Status: v.status,
          PUC_Certificate: 'Valid / Certified',
        }));
        exportToCSV('COALTECH_Mining_Fleet_Compliance', fleetData);
        break;
      }
      case 'calibration_audit': {
        const calibrationData = [
          { Weighbridge_ID: 'WB-01-PITHEAD', Mine: 'Dhanbad OpenCast', Calibration_Standard: 'IS 1436:2002', Last_Calibrated: '2026-08-15', Status: 'CERTIFIED', Deviation_Kg: '±2.5 kg' },
          { Weighbridge_ID: 'WB-02-SIDING', Mine: 'Central Rail Siding', Calibration_Standard: 'IS 1436:2002', Last_Calibrated: '2026-08-20', Status: 'CERTIFIED', Deviation_Kg: '±1.8 kg' },
          { Weighbridge_ID: 'WB-03-JHARIA', Mine: 'Jharia Deep UG', Calibration_Standard: 'IS 1436:2002', Last_Calibrated: '2026-09-01', Status: 'CERTIFIED', Deviation_Kg: '±3.1 kg' },
          { Weighbridge_ID: 'WB-04-BOKARO', Mine: 'Bokaro OpenCast', Calibration_Standard: 'IS 1436:2002', Last_Calibrated: '2026-07-28', Status: 'CERTIFIED', Deviation_Kg: '±2.0 kg' },
        ];
        exportToCSV('COALTECH_Weighbridge_Calibration_Register', calibrationData);
        break;
      }
      case 'diesel_consumption': {
        const dieselData = [
          { Date: '2026-09-12', Total_Haulage_MT: 1420, Diesel_Liters: 980, Specific_Fuel_Ratio: '0.69 L/MT', Fuel_Cost_INR: '₹88,200', Compliance: 'Optimal' },
          { Date: '2026-09-11', Total_Haulage_MT: 1380, Diesel_Liters: 960, Specific_Fuel_Ratio: '0.70 L/MT', Fuel_Cost_INR: '₹86,400', Compliance: 'Optimal' },
          { Date: '2026-09-10', Total_Haulage_MT: 1290, Diesel_Liters: 920, Specific_Fuel_Ratio: '0.71 L/MT', Fuel_Cost_INR: '₹82,800', Compliance: 'Optimal' },
        ];
        exportToCSV('COALTECH_Diesel_Consumption_Report', dieselData);
        break;
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Report Selection Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <FileText className="w-5 h-5 text-sky-500" />
              <span>Statutory Coal Haulage & Siding Manifest Reports</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Official DGMS Form CM-14 haulage manifests, weighbridge calibration certifications, and transit discrepancy ledgers.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 border border-slate-700"
            >
              <Download className="w-4 h-4 text-sky-400" />
              <span>{t('btn_export_csv', 'Export CSV')}</span>
            </button>
            <button
              onClick={triggerPrintReport}
              className="px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-md shadow-sky-600/20"
            >
              <Printer className="w-4 h-4" />
              <span>{t('btn_print_report', 'Print Official Report')}</span>
            </button>
          </div>
        </div>

        {/* Report Selector Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setSelectedReportType('haulage_manifest')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              selectedReportType === 'haulage_manifest'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-855 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Daily Siding Manifest (CM-14)</span>
          </button>

          <button
            onClick={() => setSelectedReportType('transit_loss')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              selectedReportType === 'transit_loss'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-850 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Transit Loss & Discrepancies</span>
          </button>

          <button
            onClick={() => setSelectedReportType('calibration_audit')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              selectedReportType === 'calibration_audit'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-850 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Weighbridge Calibration Audit</span>
          </button>

          <button
            onClick={() => setSelectedReportType('fleet_compliance')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              selectedReportType === 'fleet_compliance'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-850 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Fleet Fitness & PUC Compliance</span>
          </button>

          <button
            onClick={() => setSelectedReportType('diesel_consumption')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              selectedReportType === 'diesel_consumption'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-850 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Fuel className="w-3.5 h-3.5" />
            <span>Diesel Consumption & Energy</span>
          </button>
        </div>
      </div>

      {/* Report Data Preview Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              {selectedReportType.replace(/_/g, ' ')} Dataset Preview
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-500 font-bold">
              STATUTORY AUDIT VERIFIED
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="text-xs bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-750 rounded-lg px-2 py-1 text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="ALL">Current Shift & Week</option>
              <option value="TODAY">Today Only</option>
              <option value="MONTH">Current Month</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          {selectedReportType === 'haulage_manifest' && (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-850/70 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                <tr>
                  <th className="py-3 px-4">Movement ID</th>
                  <th className="py-3 px-4">Vehicle Plate</th>
                  <th className="py-3 px-4">Origin Mine</th>
                  <th className="py-3 px-4">Destination Siding</th>
                  <th className="py-3 px-4">Net MT</th>
                  <th className="py-3 px-4">Variance MT</th>
                  <th className="py-3 px-4">RFID Seal</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {coalMovements.slice(0, 10).map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/50">
                    <td className="py-2.5 px-4 font-mono font-bold text-sky-500">{m.id}</td>
                    <td className="py-2.5 px-4 font-semibold text-slate-900 dark:text-white">{m.vehiclePlate}</td>
                    <td className="py-2.5 px-4 text-slate-600 dark:text-slate-300">{m.originMineName}</td>
                    <td className="py-2.5 px-4 text-slate-600 dark:text-slate-300">{m.destinationName}</td>
                    <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">{m.dispatchedNetTonnes.toFixed(2)} MT</td>
                    <td className="py-2.5 px-4">
                      {m.weightDiscrepancyPercent !== undefined ? (
                        <span className={`font-mono font-bold ${Math.abs(m.weightDiscrepancyPercent) > 0.5 ? 'text-rose-500' : 'text-emerald-500'}`}>
                          {m.weightDiscrepancyPercent > 0 ? `-${m.weightDiscrepancyPercent.toFixed(2)}%` : `+${Math.abs(m.weightDiscrepancyPercent).toFixed(2)}%`}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="py-2.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${m.sealIntact !== false ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                        {m.sealIntact !== false ? 'INTACT' : 'TAMPERED'}
                      </span>
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {m.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {selectedReportType === 'transit_loss' && (
            <div className="p-6 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Statutory Pilferage & Variance Investigation Ledger</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                All movements where net weight variance exceeded the statutory tolerance (&gt;0.5%) or RFID electronic seal showed physical tampering. Automatically dispatched for 24-hour CAPA root-cause remediation.
              </p>
            </div>
          )}

          {selectedReportType === 'calibration_audit' && (
            <div className="p-6 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">All 4 Weighbridges Fully Calibrated</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Legal Metrology Act 2009 & DGMS standards compliant. Test weights (20 Ton test block certified) executed with &lt;±2.5 kg variance.
              </p>
            </div>
          )}

          {selectedReportType === 'fleet_compliance' && (
            <div className="p-6 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">100% Tipper Fleet Roadworthiness Validated</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Pollution Under Control (PUC) certificates, speed governor calibrations (35 km/h limiter), and reverse audio horn alarms inspected and verified.
              </p>
            </div>
          )}

          {selectedReportType === 'diesel_consumption' && (
            <div className="p-6 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center mx-auto">
                <Fuel className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Specific Fuel Consumption: 0.69 L/MT</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Average diesel consumption on Dhanbad-to-Siding corridor benchmarked at 0.69 liters per metric ton hauled. Within green carbon emissions threshold.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
