import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import type { AvailabilityResult } from '../../services/resourceAvailabilityService';

export interface SmartResourceItem<T> {
  id: string;
  title: string;
  subtitle: string;
  badgeText?: string;
  availability: AvailabilityResult;
  data: T;
}

interface SmartResourcePickerProps<T> {
  label: string;
  items: SmartResourceItem<T>[];
  selectedId: string;
  onSelect: (item: SmartResourceItem<T>) => void;
  onRequestOvertime?: (workerId: string) => void;
  emptyMessage?: string;
}

export function SmartResourcePicker<T>({
  label,
  items,
  selectedId,
  onSelect,
  onRequestOvertime,
  emptyMessage = 'No resources found in current scope',
}: SmartResourcePickerProps<T>) {
  const availableItems = items.filter((i) => i.availability.available);
  const conflictedItems = items.filter((i) => !i.availability.available);

  return (
    <div className="space-y-2 text-xs">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          {label}
        </label>
        <span className="text-[10px] text-slate-400">
          {availableItems.length} available · {conflictedItems.length} conflicted
        </span>
      </div>

      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
        {/* Available Group */}
        {availableItems.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block px-1">
              Available & Verified ({availableItems.length})
            </span>
            {availableItems.map((item) => {
              const isSelected = item.id === selectedId;
              return (
                <div
                  key={item.id}
                  onClick={() => onSelect(item)}
                  className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:border-slate-300 dark:hover:border-slate-700 text-slate-900 dark:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <CheckCircle2 className={`w-4 h-4 shrink-0 ${isSelected ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <div>
                      <div className="font-semibold text-xs">{item.title}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{item.subtitle}</div>
                    </div>
                  </div>
                  {item.badgeText && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                      {item.badgeText}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Conflicted / Blocked Group */}
        {conflictedItems.length > 0 && (
          <div className="space-y-1.5 pt-2">
            <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block px-1">
              Statutory Conflict / Locked ({conflictedItems.length})
            </span>
            {conflictedItems.map((item) => {
              const isSelected = item.id === selectedId;
              const isOTRequired = item.availability.requiresOvertimeApproval;

              return (
                <div
                  key={item.id}
                  className={`p-2.5 rounded-xl border transition flex flex-col space-y-1.5 opacity-90 ${
                    isSelected
                      ? 'border-rose-500 bg-rose-50/70 dark:bg-rose-950/40 text-rose-950 dark:text-rose-200'
                      : 'border-rose-200 dark:border-rose-900/40 bg-rose-50/30 dark:bg-rose-950/20 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                      <div>
                        <div className="font-semibold text-xs">{item.title}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">{item.subtitle}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300">
                      {isOTRequired ? 'OT Approval Needed' : 'Unavailable'}
                    </span>
                  </div>

                  {/* Conflict Diagnostic Explainer */}
                  <div className="text-[11px] text-rose-700 dark:text-rose-300 bg-white/60 dark:bg-black/30 p-2 rounded-lg border border-rose-200/50 dark:border-rose-800/40 flex items-start justify-between gap-2">
                    <div className="flex items-start space-x-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                      <span className="leading-snug">{item.availability.reason}</span>
                    </div>
                    {isOTRequired && onRequestOvertime && (
                      <button
                        type="button"
                        onClick={() => onRequestOvertime(item.id)}
                        className="shrink-0 px-2 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded text-[10px] font-bold transition shadow"
                      >
                        Authorize OT
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {items.length === 0 && (
          <div className="p-4 text-center text-slate-400 text-xs border border-dashed rounded-xl">
            {emptyMessage}
          </div>
        )}
      </div>
    </div>
  );
}
