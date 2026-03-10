import Link from 'next/link';
import { HeroSection } from '@/components/hero-section';
import { ReportForm } from '@/components/report-form';
import { Card } from '@/components/ui/card';

export default function HomePage() {
  return (
    <div className="space-y-8">
      <HeroSection />

      <section id="report-form" className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <ReportForm />

        <Card>
          <h2 className="text-lg font-semibold text-slate-900">Before you submit</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-700">
            <li>Provide the most precise location possible for faster dispatch.</li>
            <li>Mark severity as high for active flooding or major public safety risk.</li>
            <li>Include your contact details if follow-up may be required.</li>
          </ul>
        </Card>
      </section>
    </div>
  );
}
