'use client';

import { useState } from 'react';
import { Trash2, RefreshCw } from 'lucide-react';
import NotesGrid from '@/components/NotesGrid';

export default function TrashPage() {
  const [isRestoring, setIsRestoring] = useState(false);

  const handleEmptyTrash = async () => {
    if (!confirm('Are you sure you want to permanently delete all items in trash?')) {
      return;
    }
    // Add empty trash logic here
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center">
            <Trash2 className="h-6 w-6 text-red-500 mr-2" />
            Trash
          </h1>
          <div className="space-x-2">
            <button
              onClick={() => setIsRestoring(true)}
              disabled={isRestoring}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-md shadow-sm">
              <RefreshCw className={`h-4 w-4 ${isRestoring ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleEmptyTrash}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md shadow-sm">
              Empty Trash
            </button>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Items in trash will be permanently deleted after 30 days
        </p>
      </div>

      <NotesGrid filter="trash" />
    </div>
  );
} 