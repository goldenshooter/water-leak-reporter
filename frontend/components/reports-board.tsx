'use client';

import { useMemo, useState } from 'react';
import { SeverityBadge } from '@/components/severity-badge';
import { StatusBadge } from '@/components/status-badge';
import { Card } from '@/components/ui/card';
import { formatDateTime } from '@/lib/utils';
import { WaterLeakReport } from '@/types/report';

type FilterKey = 'all' | 'high' | 'open';

const filterOptions: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'high', label: 'High severity' },
  { key: 'open', label: 'Open only' },
];

export function ReportsBoard({ initialReports }: { initialReports: WaterLeakReport[] }) {
  const [filter, setFilter] = useState<FilterKey>('all');

  const filteredReports = useMemo(() => {
    if (filter === 'high') {
      return initialReports.filter((report) => report.severity === 'high');
    }

    if (filter === 'open') {
      return initialReports.filter((report) => report.status === 'open');
    }

    return initialReports;
  }, [filter, initialReports]);

  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-600">{filteredReports.length} report(s) shown</p>
        <div className="flex gap-2 rounded-lg bg-slate-100 p-1">
          {filterOptions.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setFilter(option.key)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                filter === option.key
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {filteredReports.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <h3 className="text-base font-semibold text-slate-900">No matching reports</h3>
          <p className="mt-1 text-sm text-slate-600">Try another filter or check again when new reports arrive.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="px-3 py-2">ID</th>
                <th className="px-3 py-2">Location</th>
                <th className="px-3 py-2">Severity</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Created</th>
                <th className="px-3 py-2">Description</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr key={report.id} className="rounded-lg bg-slate-50 text-sm text-slate-700">
                  <td className="whitespace-nowrap px-3 py-3 font-semibold text-slate-900">{report.id}</td>
                  <td className="min-w-64 px-3 py-3">{report.location}</td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <SeverityBadge severity={report.severity} />
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <StatusBadge status={report.status} />
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">{formatDateTime(report.createdAt)}</td>
                  <td className="max-w-xs px-3 py-3">
                    {report.description ? (
                      <span className="line-clamp-2">{report.description}</span>
                    ) : (
                      <span className="text-slate-400">No description</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
