'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

/**
 * Global error page component
 * @param {Object} props - Component props
 * @param {Error} props.error - The error object
 * @param {() => void} props.reset - Function to reset the error boundary
 */
export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg"
      >
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Something went wrong!
          </h2>
          <div className="mt-4 text-center text-gray-600">
            {error.message || 'An unexpected error occurred'}
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          <Button onClick={reset} variant="primary" fullWidth>
            Try again
          </Button>
          <Button
            onClick={() => window.location.href = '/'}
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