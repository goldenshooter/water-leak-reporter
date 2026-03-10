import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { TopNav } from '@/components/top-nav';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Water Leak Reporter',
  description: 'Report and triage water leaks quickly.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TopNav />
        <main className="mx-auto w-full max-w-6xl px-4 pb-12 pt-8 sm:px-6 lg:px-8">{children}</main>
      </body>
    </html>
  );
}
