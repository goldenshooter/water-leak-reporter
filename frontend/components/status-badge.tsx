import { ReportStatus } from '@/types/report';

const badgeStyles: Record<ReportStatus, string> = {
  open: 'bg-sky-100 text-sky-800',
  'in progress': 'bg-indigo-100 text-indigo-800',
  resolved: 'bg-slate-200 text-slate-800',
};

export function StatusBadge({ status }: { status: ReportStatus }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${badgeStyles[status]}`}>
      {status}
    </span>
  );
}
