import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Vinyl Collection',
  description: 'Track your vinyl record collection',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="min-h-full bg-stone-50 text-stone-900 antialiased">
        <header className="bg-white border-b border-stone-200 sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl" aria-hidden>
                💿
              </span>
              <span className="font-bold text-xl">Vinyl Collection</span>
            </div>
            <nav className="flex gap-6">
              <Link
                href="/"
                className="font-medium text-stone-600 hover:text-amber-600 transition-colors"
              >
                Collection
              </Link>
              <Link
                href="/wishlist"
                className="font-medium text-stone-600 hover:text-amber-600 transition-colors"
              >
                Wishlist
              </Link>
            </nav>
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
