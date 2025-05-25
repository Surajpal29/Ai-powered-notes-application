'use client';

import { Clock } from 'lucide-react';
import NotesGrid from '@/components/NotesGrid';

export default function RecentPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <Clock className="h-6 w-6 text-blue-500 mr-2" />
          Recent Notes
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Your recently viewed and edited notes
        </p>
      </div>

      <NotesGrid filter="recent" sortBy="lastModified" />
    </div>
  );
} 