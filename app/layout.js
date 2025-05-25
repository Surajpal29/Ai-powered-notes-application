// 'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';
import RootLayoutContent from '@/components/RootLayoutContent';

// Initialize Inter font
const inter = Inter({ subsets: ['latin'] });

/**
 * Metadata for the application
 */
export const metadata = {
  title: 'Notes App',
  description: 'A modern note-taking application',
};

/**
 * Root layout component
 * Wraps all pages with common providers and styles
 */
export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>
        <Providers>
          <RootLayoutContent>{children}</RootLayoutContent>
        </Providers>
      </body>
    </html>
  );
}
