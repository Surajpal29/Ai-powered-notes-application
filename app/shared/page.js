'use client';

import { Share2 } from 'lucide-react';
import NotesGrid from '@/components/NotesGrid';

export default function SharedPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <Share2 className="h-6 w-6 text-green-500 mr-2" />
          Shared Notes
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Notes shared with you by others
        </p>
      </div>

      <NotesGrid filter="shared" />
    </div>
  );
} 