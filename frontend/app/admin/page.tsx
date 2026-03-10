import { ReportsBoard } from '@/components/reports-board';
import { getReports } from '@/lib/report-service';

export default async function AdminPage() {
  const reports = await getReports();

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold text-slate-900">Admin: Leak reports</h1>
        <p className="mt-2 text-sm text-slate-600">
          Monitor incoming reports and prioritize high-risk incidents.
        </p>
      </header>
      <ReportsBoard initialReports={reports} />
    </section>
  );
}
