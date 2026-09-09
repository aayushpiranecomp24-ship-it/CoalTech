// MINEGOV AI - Contractor Governance Module
import React, { useState } from 'react';
import { useGovernance } from '../../context/GovernanceContext';
import { useI18n } from '../../context/I18nContext';
import type { Contractor } from '../../types';
import {
  Users2,
  ShieldAlert,
  Search,
} from 'lucide-react';

export const ContractorsModule: React.FC = () => {
  const { contractors } = useGovernance();
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContractor, setSelectedContractor] = useState<Contractor | null>(null);

  const filtered = contractors.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.license.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Users2 className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              {t('nav_contractors', 'Contractor Governance & Vendor Risk Scorecard')}
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('dash_sub_co', 'Vendor workforce compliance, machinery fitness certification, and statutory payment clearance hold protocols.')}
          </p>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            {t('kpi_registered_vendors', 'Contractor Entities')}
          </span>
          <span className="text-xl font-black text-slate-900 dark:text-white">{contractors.length}</span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/40 p-3 rounded-xl border-l-4 border-l-emerald-500">
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
            {t('kpi_compliant_vendors', 'Compliant Vendors')}
          </span>
          <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
            {contractors.filter((c) => c.complianceStatus === 'Compliant').length}
          </span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/40 p-3 rounded-xl border-l-4 border-l-red-500">
          <span className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider block">
            {t('kpi_vendors_on_hold', 'Non-Compliant / Hold')}
          </span>
          <span className="text-xl font-black text-red-600 dark:text-red-400">
            {contractors.filter((c) => c.complianceStatus === 'Non-Compliant').length}
          </span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900/40 p-3 rounded-xl border-l-4 border-l-blue-500">
          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
            {t('kpi_contract_workers', 'Deployed Workforce')}
          </span>
          <span className="text-xl font-black text-blue-600 dark:text-blue-400">
            {contractors.reduce((acc, c) => acc + c.workersCount, 0)}
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm flex items-center text-xs">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('filter_search', 'Search contractor, license code, category...')}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white outline-none focus:border-sky-500 text-xs"
          />
        </div>
      </div>

      {/* Contractors Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center text-slate-500 dark:text-slate-400 text-xs">
          {t('empty_no_contractors', 'No contractors registered under this mine sector.')}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c) => {
            const isHighRisk = c.riskScore >= 60;
            return (
              <div
                key={c.id}
                onClick={() => setSelectedContractor(c)}
                className={`bg-white dark:bg-slate-900 border ${
                  isHighRisk ? 'border-red-300 dark:border-red-900/60' : 'border-slate-200 dark:border-slate-800'
                } hover:border-sky-400/40 rounded-xl p-5 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between space-y-4`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-[10px] font-mono text-slate-400">{c.license}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        c.complianceStatus === 'Compliant'
                          ? 'bg-emerald-500/10 text-emerald-600 border-emerald-300'
                          : 'bg-red-500/10 text-red-600 border-red-300'
                      }`}
                    >
                      {c.complianceStatus}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 dark:text-white text-base">{c.name}</h3>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">{c.category}</span>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 block">{t('nav_workforce', 'Workers')}</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{c.workersCount}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">HEMM Units</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{c.equipmentCount}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">{t('nav_incidents', 'Violations')}</span>
                    <span className={`font-bold text-sm ${c.violationsCount > 5 ? 'text-red-500' : 'text-slate-800 dark:text-slate-200'}`}>
                      {c.violationsCount}
                    </span>
                  </div>
                </div>

                {/* Risk Score Meter & Payment */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 dark:text-slate-400">{t('field_risk_score', 'Vendor Risk Score')}:</span>
                    <span
                      className={`font-mono font-black ${
                        c.riskScore >= 80 ? 'text-red-600' : c.riskScore >= 50 ? 'text-orange-500' : 'text-emerald-500'
                      }`}
                    >
                      {c.riskScore}/100
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        c.riskScore >= 80 ? 'bg-red-500' : c.riskScore >= 50 ? 'bg-orange-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${c.riskScore}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-[11px] pt-1">
                    <span className="text-slate-400">{t('field_contract_value', 'Contract')}: {c.contractValue}</span>
                    <span
                      className={`font-semibold px-2 py-0.5 rounded text-[10px] ${
                        c.paymentStatus.includes('Hold')
                          ? 'bg-rose-500/10 text-rose-600 border border-rose-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {c.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Contractor Detail Modal */}
      {selectedContractor && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono text-slate-400">{selectedContractor.license}</span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base mt-0.5">
                  {selectedContractor.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedContractor(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">{t('field_department', 'Scope Category')}:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{selectedContractor.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{t('field_contract_value', 'Contract Valuation')}:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{selectedContractor.contractValue}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{t('field_deadline', 'License Valid Till')}:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{selectedContractor.validTill}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{t('field_status', 'Payment Status')}:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedContractor.paymentStatus}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{t('nav_incidents', 'Violations Registered')}:</span>
                <span className="font-bold text-rose-500">{selectedContractor.violationsCount} infractions</span>
              </div>
            </div>

            {selectedContractor.riskScore > 60 && (
              <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-xl text-xs text-red-800 dark:text-red-300">
                <div className="font-bold flex items-center mb-1">
                  <ShieldAlert className="w-4 h-4 mr-1 text-red-500" /> Statutory Billing Hold Applied
                </div>
                Due to elevated risk score ({selectedContractor.riskScore}/100) and repeated violations, payment disbursements are suspended until full field verification.
              </div>
            )}

            <button
              onClick={() => setSelectedContractor(null)}
              className="w-full py-2 bg-slate-900 dark:bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
            >
              {t('btn_close', 'Close Profile')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
