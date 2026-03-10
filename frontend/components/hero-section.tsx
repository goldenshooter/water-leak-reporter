import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="rounded-2xl border border-brand-100 bg-white/90 px-6 py-8 shadow-sm sm:px-10">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">Water Leak Reporting</p>
      <h1 className="mt-3 text-balance text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">
        Report leaks quickly. Help teams respond faster.
      </h1>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-700 sm:text-base">
        Submit incidents in one step and let operations teams triage them through the admin dashboard.
      </p>
    </section>
  );
}
