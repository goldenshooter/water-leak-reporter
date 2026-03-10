import { Severity } from '@/types/report';

const badgeStyles: Record<Severity, string> = {
  low: 'bg-emerald-100 text-emerald-800',
  medium: 'bg-amber-100 text-amber-800',
  high: 'bg-rose-100 text-rose-800',
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${badgeStyles[severity]}`}>
      {severity}
    </span>
  );
}
