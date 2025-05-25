'use client';

import { useState } from 'react';
import { Filter, LayoutGrid, List } from 'lucide-react';
import NotesGrid from '@/components/NotesGrid';

const sortOptions = [
  { name: 'Most Recent', value: 'recent' },
  { name: 'Title A-Z', value: 'title' },
  { name: 'Last Modified', value: 'modified' },
  { name: 'Created Date', value: 'created' },
];

export default function NotesPage() {
  const [view, setView] = useState('grid');
  const [sortBy, setSortBy] = useState('recent');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b dark:border-gray-800 bg-white dark:bg-gray-800">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold">All Notes</h1>
          <p className="mt-1 text-base text-gray-600 dark:text-gray-400">
            View and manage all your notes in one place.
          </p>
        </div>

        {/* Filters and View Toggle */}
        <div className="px-6 py-2 border-t dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm font-medium bg-transparent border-0 focus:ring-0 cursor-pointer dark:text-gray-300"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setView('grid')}
              className={`p-1.5 rounded ${
                view === 'grid'
                  ? 'bg-white dark:bg-gray-600 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-1.5 rounded ${
                view === 'list'
                  ? 'bg-white dark:bg-gray-600 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Notes Grid */}
      <div className="p-6">
        <NotesGrid view={view} sortBy={sortBy} />
      </div>
    </div>
  );
} 