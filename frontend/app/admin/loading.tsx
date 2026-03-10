export default function AdminLoading() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-52 animate-pulse rounded bg-slate-200" />
      <div className="h-5 w-80 animate-pulse rounded bg-slate-200" />
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="h-48 animate-pulse rounded bg-slate-100" />
      </div>
    </div>
  );
}
