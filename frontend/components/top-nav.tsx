import Link from 'next/link';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/admin', label: 'Admin' },
];

export function TopNav() {
  return (
    <header className="border-b border-slate-200/80 bg-white/85 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-sm font-semibold tracking-wide text-brand-800">
          WATER LEAK REPORTER
        </Link>

        <ul className="flex items-center gap-2 sm:gap-3">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-brand-50 hover:text-brand-800"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
