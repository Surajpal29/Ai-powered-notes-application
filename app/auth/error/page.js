'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

/**
 * Error page component for authentication errors
 */
export default function AuthError() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  // Map error codes to user-friendly messages
  const getErrorMessage = (error) => {
    switch (error) {
      case 'Configuration':
        return 'There is a problem with the server configuration.';
      case 'AccessDenied':
        return 'Access denied. You do not have permission to access this resource.';
      case 'Verification':
        return 'The verification link is invalid or has expired.';
      default:
        return 'An error occurred during authentication. Please try again.';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg"
      >
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Authentication Error
          </h2>
          <div className="mt-4 text-center text-red-600">
            {getErrorMessage(error)}
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          <Button
            onClick={() => router.push('/auth/signin')}
            variant="primary"
            fullWidth
          >
            Try Again
          </Button>
          <Button
            onClick={() => router.push('/')}
            variant="outline"
            fullWidth
          >
            Go to Home
          </Button>
        </div>
      </motion.div>
    </div>
  );
} 