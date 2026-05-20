import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { Playfair_Display, Space_Mono } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const geist = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
  weight: ['700', '800'],
  style: ['normal', 'italic'],
});

const spaceMono = Space_Mono({
  variable: '--font-space-mono',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: 'The Vinyl Archive',
  description: 'Our record collection',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${playfair.variable} ${spaceMono.variable} h-full`}>
      <body className="min-h-full antialiased">
        <header
          className="sticky top-0 z-10"
          style={{ background: 'var(--sleeve)', borderBottom: '1px solid var(--groove)' }}
        >
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <div>
              <p
                className="text-[10px] tracking-[0.35em] uppercase mb-0.5"
                style={{ color: 'var(--ember)', fontFamily: 'var(--font-space-mono)' }}
              >
                ▸ EST. 2025
              </p>
              <span
                className="text-xl font-bold italic leading-none"
                style={{ color: 'var(--paper)', fontFamily: 'var(--font-playfair)' }}
              >
                The Vinyl Archive
              </span>
            </div>

            <nav className="flex items-center gap-6">
              <Link
                href="/"
                className="text-[11px] tracking-[0.2em] uppercase transition-colors hover:opacity-100"
                style={{ color: 'var(--paper-dim)', fontFamily: 'var(--font-space-mono)' }}
              >
                Collection
              </Link>
              <span style={{ color: 'var(--groove-hi)' }}>·</span>
              <Link
                href="/wishlist"
                className="text-[11px] tracking-[0.2em] uppercase transition-colors hover:opacity-100"
                style={{ color: 'var(--paper-dim)', fontFamily: 'var(--font-space-mono)' }}
              >
                Wishlist
              </Link>
            </nav>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-10">{children}</main>
      </body>
    </html>
  );
}
