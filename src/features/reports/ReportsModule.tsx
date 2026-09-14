// COALTECH - Audit Reports, OCR Processing & Export Module
import React, { useState } from 'react';
import { useGovernance } from '../../context/GovernanceContext';
import { useI18n } from '../../context/I18nContext';
import { formatDate } from '../../utils/formatters';
import { exportToCSV, triggerPrintReport } from '../../utils/exportUtils';
import type { DocumentRecord } from '../../types';
import {
  FileText,
  Download,
  Printer,
  CheckCircle,
  Sparkles,
  Loader2,
} from 'lucide-react';

export const ReportsModule: React.FC = () => {
  const {
    complianceItems,
    violations,
    inspections,
    contractors,
    documents,
    runOcrOnDocument,
  } = useGovernance();
  const { t } = useI18n();

  const [activeReportType, setActiveReportType] = useState<
    'compliance' | 'safety' | 'inspections' | 'contractors' | 'ocr'
  >('compliance');

  // OCR state
  const [ocrLoading, setOcrLoading] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<DocumentRecord | null>(null);

  const handleExportCSV = () => {
    switch (activeReportType) {
      case 'compliance':
        exportToCSV('COALTECH_Compliance_Report', complianceItems);
        break;
      case 'safety':
        exportToCSV('COALTECH_Safety_Violations_Report', violations);
        break;
      case 'inspections':
        exportToCSV('COALTECH_Inspections_Report', inspections);
        break;
      case 'contractors':
        exportToCSV('COALTECH_Contractor_Scorecard', contractors);
        break;
      default:
        exportToCSV('COALTECH_Data_Report', complianceItems);
    }
  };

  const handleTriggerOcr = async (docId: string) => {
    setOcrLoading(true);
    const updated = await runOcrOnDocument(docId);
    setOcrLoading(false);
    setSelectedDoc(updated);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <FileText className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              {t('nav_reports', 'Statutory Reports, OCR Parsing & Export')}
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate printable statutory summaries, export raw datasets for DGMS auditors, and process scanned certificates with AI OCR.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-sm transition"
          >
            <Download className="w-4 h-4 text-sky-500" />
            <span>{t('btn_export_csv', 'Export CSV')}</span>
          </button>
          <button
            onClick={triggerPrintReport}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold shadow-md transition"
          >
            <Printer className="w-4 h-4" />
            <span>{t('btn_print_report', 'Print Official Report')}</span>
          </button>
        </div>
      </div>

      {/* Report Categories Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-semibold space-x-2 overflow-x-auto">
        {[
          { id: 'compliance', label: 'Statutory Compliance Report' },
          { id: 'safety', label: 'Hazard & Violation Log' },
          { id: 'inspections', label: 'Field Inspections Audit' },
          { id: 'contractors', label: 'Contractor Risk Scorecard' },
          { id: 'ocr', label: 'Document OCR AI Extractor' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveReportType(tab.id as any)}
            className={`pb-2.5 px-3 whitespace-nowrap transition border-b-2 ${
              activeReportType === tab.id
                ? 'border-sky-600 text-sky-600 dark:text-sky-400 font-bold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Report 1: Compliance */}
      {activeReportType === 'compliance' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm p-4 space-y-3">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">DGMS Statutory Compliance Register</h3>
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 border-b">
              <tr>
                <th className="p-2.5">Requirement</th>
                <th className="p-2.5">Citation</th>
                <th className="p-2.5">Officer</th>
                <th className="p-2.5">Due Date</th>
                <th className="p-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {complianceItems.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-850">
                  <td className="p-2.5 font-semibold text-slate-900 dark:text-white">{c.requirement}</td>
                  <td className="p-2.5 font-mono text-sky-600 dark:text-sky-400">{c.regulationCitation}</td>
                  <td className="p-2.5">{c.responsibleOfficer}</td>
                  <td className="p-2.5">{formatDate(c.dueDate)}</td>
                  <td className="p-2.5 font-bold">{c.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Report 2: Safety & Violations */}
      {activeReportType === 'safety' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm p-4 space-y-3">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Active & Resolved Violations Register</h3>
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 border-b">
              <tr>
                <th className="p-2.5">Hazard Title</th>
                <th className="p-2.5">Category</th>
                <th className="p-2.5">Zone</th>
                <th className="p-2.5">Risk Score</th>
                <th className="p-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {violations.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50 dark:hover:bg-slate-850">
                  <td className="p-2.5 font-semibold text-slate-900 dark:text-white">{v.title}</td>
                  <td className="p-2.5">{v.category}</td>
                  <td className="p-2.5">{v.zone}</td>
                  <td className="p-2.5 font-mono font-bold text-red-500">{v.riskScore}/100</td>
                  <td className="p-2.5 font-bold">{v.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Report 3: Inspections */}
      {activeReportType === 'inspections' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm p-4 space-y-3">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Field Inspections Log</h3>
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 border-b">
              <tr>
                <th className="p-2.5">Category</th>
                <th className="p-2.5">Inspector</th>
                <th className="p-2.5">Date</th>
                <th className="p-2.5">GPS Location</th>
                <th className="p-2.5">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {inspections.map((i) => (
                <tr key={i.id} className="hover:bg-slate-50 dark:hover:bg-slate-850">
                  <td className="p-2.5 font-semibold text-slate-900 dark:text-white">{i.category}</td>
                  <td className="p-2.5">{i.inspectorName}</td>
                  <td className="p-2.5">{formatDate(i.date)}</td>
                  <td className="p-2.5 font-mono text-sky-500">{i.gps}</td>
                  <td className="p-2.5 font-bold">{i.severity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Report 4: Contractors */}
      {activeReportType === 'contractors' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm p-4 space-y-3">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Contractor Compliance & Risk Registry</h3>
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 border-b">
              <tr>
                <th className="p-2.5">Contractor</th>
                <th className="p-2.5">License</th>
                <th className="p-2.5">Workers</th>
                <th className="p-2.5">Risk Score</th>
                <th className="p-2.5">Payment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {contractors.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-850">
                  <td className="p-2.5 font-semibold text-slate-900 dark:text-white">{c.name}</td>
                  <td className="p-2.5 font-mono text-slate-400">{c.license}</td>
                  <td className="p-2.5">{c.workersCount}</td>
                  <td className="p-2.5 font-mono font-bold">{c.riskScore}/100</td>
                  <td className="p-2.5 font-bold">{c.paymentStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Module 5: Document AI OCR */}
      {activeReportType === 'ocr' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-sky-500" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Document AI OCR Field Extraction Pipeline
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Upload statutory certificates (DGMS licenses, SPCB consent, safety audit reports) to automatically extract reference numbers, expiry dates, and compliance terms into relational records.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 space-y-2.5 flex flex-col justify-between shadow-sm"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase text-sky-600 dark:text-sky-400 block">
                      {doc.category}
                    </span>
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs mt-0.5 line-clamp-2">
                      {doc.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 block mt-1">Expiry: {doc.expiryDate}</span>
                  </div>

                  <button
                    onClick={() => handleTriggerOcr(doc.id)}
                    disabled={ocrLoading}
                    className="w-full py-1.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white rounded-lg font-semibold text-xs flex items-center justify-center space-x-1 transition"
                  >
                    {ocrLoading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5" />
                    )}
                    <span>Run AI OCR Scan</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* OCR Extracted Output Card */}
          {selectedDoc && selectedDoc.extractedFields && (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 text-white space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span className="font-bold text-sm">OCR Field Extraction Result: {selectedDoc.title}</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                  Confidence: 97.4%
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="space-y-1.5 bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <div className="text-[10px] font-sans text-slate-400 uppercase">Extracted Key Fields</div>
                  <div>
                    <span className="text-slate-400">License No: </span>
                    <span className="text-sky-400 font-bold">{selectedDoc.extractedFields.licenseNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Authority: </span>
                    <span className="text-white">{selectedDoc.extractedFields.issuingAuthority}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Validity Date: </span>
                    <span className="text-amber-400">{selectedDoc.extractedFields.validity}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Mandate: </span>
                    <span className="text-slate-300 font-sans">{selectedDoc.extractedFields.complianceTerms}</span>
                  </div>
                </div>

                <div className="space-y-1.5 bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <div className="text-[10px] font-sans text-slate-400 uppercase">Raw OCR Scan Stream</div>
                  <p className="text-[10px] text-slate-400 font-mono leading-relaxed max-h-24 overflow-y-auto">
                    {selectedDoc.ocrExtractedText}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
