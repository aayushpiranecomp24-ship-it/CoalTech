// Formatters utility for MINEGOV AI

export function formatDate(isoString?: string): string {
  if (!isoString) return 'N/A';
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return isoString;
  }
}

export function formatDateTime(isoString?: string): string {
  if (!isoString) return 'N/A';
  try {
    const d = new Date(isoString);
    return d.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

export function formatRelativeTime(isoString?: string): string {
  if (!isoString) return 'N/A';
  try {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHrs < 1) return 'Just now';
    if (diffHrs < 24) return `${diffHrs}h ago`;
    const diffDays = Math.floor(diffHrs / 24);
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  } catch {
    return isoString;
  }
}

export function getSeverityBadgeClass(severity: string): string {
  switch (severity?.toUpperCase()) {
    case 'CRITICAL':
      return 'bg-red-500/10 text-red-700 border-red-300 dark:text-red-400 dark:border-red-900/50';
    case 'HIGH':
      return 'bg-orange-500/10 text-orange-700 border-orange-300 dark:text-orange-400 dark:border-orange-900/50';
    case 'MEDIUM':
      return 'bg-amber-500/10 text-amber-700 border-amber-300 dark:text-amber-400 dark:border-amber-900/50';
    case 'LOW':
    default:
      return 'bg-emerald-500/10 text-emerald-700 border-emerald-300 dark:text-emerald-400 dark:border-emerald-900/50';
  }
}

export function getStatusBadgeClass(status: string): string {
  switch (status) {
    case 'Compliant':
    case 'CLOSED':
    case 'Closed':
    case 'Approved':
    case 'VERIFIED':
    case 'REVIEWED_OK':
    case 'VALID':
      return 'bg-emerald-500/10 text-emerald-700 border-emerald-300 dark:text-emerald-400 dark:border-emerald-900/50';
    case 'OPEN':
    case 'Violation':
    case 'Rejected':
    case 'REJECTED':
    case 'NON_COMPLIANT':
    case 'EXPIRED':
      return 'bg-red-500/10 text-red-700 border-red-300 dark:text-red-400 dark:border-red-900/50';
    case 'Due Soon':
    case 'ACTION_SUBMITTED':
    case 'Evidence Submitted':
    case 'Verification Pending':
    case 'UNDER_VERIFICATION':
    case 'PENDING_REVIEW':
    case 'EXPIRING':
      return 'bg-amber-500/10 text-amber-700 border-amber-300 dark:text-amber-400 dark:border-amber-900/50';
    case 'Overdue':
    case 'REWORK_REQUIRED':
    case 'Rework Required':
      return 'bg-rose-500/10 text-rose-700 border-rose-300 dark:text-rose-400 dark:border-rose-900/50';
    case 'IN_PROGRESS':
    case 'In Progress':
    case 'ASSIGNED':
    case 'Assigned':
    case 'Under Review':
    case 'UNDER_REVIEW':
    case 'Scheduled':
      return 'bg-blue-500/10 text-blue-700 border-blue-300 dark:text-blue-400 dark:border-blue-900/50';
    default:
      return 'bg-slate-500/10 text-slate-700 border-slate-300 dark:text-slate-400 dark:border-slate-800';
  }
}

export function getRiskColor(score: number): { hex: string; text: string; label: string } {
  if (score >= 81) return { hex: '#ef4444', text: 'text-red-600', label: 'CRITICAL' };
  if (score >= 61) return { hex: '#f97316', text: 'text-orange-500', label: 'HIGH' };
  if (score >= 31) return { hex: '#f59e0b', text: 'text-amber-500', label: 'MEDIUM' };
  return { hex: '#22c55e', text: 'text-emerald-500', label: 'LOW' };
}
