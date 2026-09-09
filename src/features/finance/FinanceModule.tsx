// MINEGOV AI - Finance, Penalties & Compliance Budget Module
import React from 'react';
import { useGovernance } from '../../context/GovernanceContext';
import { useI18n } from '../../context/I18nContext';
import { Coins } from 'lucide-react';

export const FinanceModule: React.FC = () => {
  const { financeBudgets, contractors, mines, canPerform } = useGovernance();
  const { t } = useI18n();

  const totalSafetyBudget = financeBudgets.reduce((acc, f) => acc + f.totalSafetyBudget, 0);
  const totalUtilized = financeBudgets.reduce((acc, f) => acc + f.utilizedBudget, 0);
  const totalPenalties = financeBudgets.reduce((acc, f) => acc + f.penaltiesLevied, 0);
  const totalWithheld = financeBudgets.reduce((acc, f) => acc + f.contractorPayableWithheld, 0);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <Coins className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            {t('nav_finance', 'Finance, Statutory Penalties & Safety Capex')}
          </h1>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {t('dash_sub_fo', 'Safety capex utilization, statutory environmental cess, and vendor payment hold reserves for compliance breaches.')}
        </p>
      </div>

      {!canPerform('canManageFinance') && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-600 dark:text-amber-400 font-medium">
          {t('msg_unauthorized', 'Notice: You are viewing financial metrics in read-only audit mode.')}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            {t('kpi_total_budget', 'Total Safety Capex')}
          </span>
          <span className="text-xl font-black text-slate-900 dark:text-white font-sans">₹{totalSafetyBudget} Lakhs</span>
          <span className="text-[10px] text-slate-400 block mt-1">FY 2026-27 Allocated</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/40 p-4 rounded-xl border-l-4 border-l-emerald-500">
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
            {t('kpi_cleared_payouts', 'Utilized Capex')}
          </span>
          <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-sans">₹{totalUtilized} Lakhs</span>
          <span className="text-[10px] text-slate-400 block mt-1">
            {Math.round((totalUtilized / (totalSafetyBudget || 1)) * 100)}% utilized
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/40 p-4 rounded-xl border-l-4 border-l-rose-500">
          <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block">
            {t('kpi_penalties_imposed', 'Penalties Levied')}
          </span>
          <span className="text-xl font-black text-rose-600 dark:text-rose-400 font-sans">₹{totalPenalties} Lakhs</span>
          <span className="text-[10px] text-slate-400 block mt-1">DGMS Statutory Fines</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/40 p-4 rounded-xl border-l-4 border-l-amber-500">
          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
            {t('kpi_compliance_payment_holds', 'Vendor Payment Withheld')}
          </span>
          <span className="text-xl font-black text-amber-600 dark:text-amber-400 font-sans">₹{totalWithheld} Lakhs</span>
          <span className="text-[10px] text-slate-400 block mt-1">Held Pending Verification</span>
        </div>
      </div>

      {/* Mine Capex Budget Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">
            {t('kpi_total_budget', 'Safety Budget Allocation & Statutory Penalties')}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">{t('field_mine', 'Coal Mine Sector')}</th>
                <th className="py-3 px-4">{t('kpi_total_budget', 'Total Safety Budget')}</th>
                <th className="py-3 px-4">{t('kpi_cleared_payouts', 'Utilized Budget')}</th>
                <th className="py-3 px-4">{t('kpi_penalties_imposed', 'Statutory Penalties')}</th>
                <th className="py-3 px-4">{t('kpi_compliance_payment_holds', 'Vendor Payment Withheld')}</th>
                <th className="py-3 px-4">Environmental Cess</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {financeBudgets.map((f) => {
                const mine = mines.find((m) => m.id === f.mineId);
                return (
                  <tr key={f.mineId} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/50 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">{mine?.name || f.mineId}</td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-800 dark:text-slate-200">₹{f.totalSafetyBudget} L</td>
                    <td className="py-3.5 px-4 font-mono text-emerald-600 dark:text-emerald-400">₹{f.utilizedBudget} L</td>
                    <td className="py-3.5 px-4 font-mono text-rose-600 dark:text-rose-400">₹{f.penaltiesLevied} L</td>
                    <td className="py-3.5 px-4 font-mono text-amber-600 dark:text-amber-400">₹{f.contractorPayableWithheld} L</td>
                    <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-400">₹{f.environmentalCess} L</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contractor Invoicing & Hold Release Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">
            {t('kpi_vendors_on_hold', 'Contractor Billing Approvals & Statutory Holds')}
          </h3>
          <span className="text-[11px] text-slate-400">Rule Engine auto-locks vendors with Risk Score &gt; 70</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">{t('field_contractor', 'Contractor')}</th>
                <th className="py-3 px-4">{t('field_contract_value', 'Contract Value')}</th>
                <th className="py-3 px-4">{t('field_risk_score', 'Risk Score')}</th>
                <th className="py-3 px-4">{t('nav_incidents', 'Violations Count')}</th>
                <th className="py-3 px-4">{t('field_status', 'Billing Status')}</th>
                <th className="py-3 px-4 text-right">Finance Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {contractors.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/50 transition">
                  <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100">{c.name}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-800 dark:text-slate-200">{c.contractValue}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`font-mono font-bold ${
                        c.riskScore >= 70 ? 'text-red-500' : c.riskScore >= 40 ? 'text-amber-500' : 'text-emerald-500'
                      }`}
                    >
                      {c.riskScore}/100
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">{c.violationsCount} breaches</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        c.paymentStatus.includes('Hold')
                          ? 'bg-red-500/10 text-red-600 border-red-300'
                          : 'bg-emerald-500/10 text-emerald-600 border-emerald-300'
                      }`}
                    >
                      {c.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {c.paymentStatus.includes('Hold') ? (
                      <span className="text-red-500 text-[10px] font-bold">
                        {t('status_payment_hold', 'LOCKED BY RULE ENGINE')}
                      </span>
                    ) : (
                      <span className="text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold">
                        {t('status_certified', 'CLEARED FOR PAYMENT')}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
