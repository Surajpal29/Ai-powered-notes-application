'use client';

import { SessionProvider } from 'next-auth/react';

/**
 * Authentication provider component
 * Wraps the application with NextAuth session management
 */
export default function AuthProvider({ children }) {
  return (
    <SessionProvider 
      refetchInterval={0} 
      refetchOnWindowFocus={false}
    >
      {children}
    </SessionProvider>
  );
} 