'use client';

import { SessionProvider } from 'next-auth/react';

/**
 * Client-side providers wrapper component
 * Handles client-side authentication state
 */
export default function ClientProviders({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
} 