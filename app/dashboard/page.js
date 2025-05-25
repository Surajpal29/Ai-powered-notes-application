'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { FileText, Star, Clock, Sparkles, Filter, LayoutGrid, List } from 'lucide-react';
import QuickActions from '@/components/dashboard/QuickActions';
import NotesGrid from '@/components/NotesGrid';

const stats = [
  { name: 'Total Notes', value: '24', icon: FileText, color: 'bg-blue-500' },
  { name: 'Favorites', value: '5', icon: Star, color: 'bg-yellow-500' },
  { name: 'Recent', value: '12', icon: Clock, color: 'bg-green-500' },
  { name: 'AI Enhanced', value: '8', icon: Sparkles, color: 'bg-purple-500' },
];

const filters = [
  { name: 'All Notes', value: 'all' },
  { name: 'Recent', value: 'recent' },
  { name: 'Favorites', value: 'favorites' },
  { name: 'AI Enhanced', value: 'ai' },
  { name: 'Shared', value: 'shared' },
];

/**
 * Dashboard home page
 * Shows overview, quick stats, and notes
 */
export default function Dashboard() {
  const { data: session } = useSession();
  const userName = session?.user?.name || session?.user?.email?.split('@')[0] || 'there';
  const [activeFilter, setActiveFilter] = useState('all');
  const [view, setView] = useState('grid');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Bar */}
      <div className="border-b dark:border-gray-800 bg-white dark:bg-gray-800">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold">
            Welcome back, {userName}! 👋
          </h1>
          <p className="mt-1 text-base text-gray-600 dark:text-gray-400">
            Here's what's happening with your notes today.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="px-6 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.name}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center">
                  <div className={`${stat.color} p-2 rounded-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="ml-3">
                    <h2 className="text-xl font-semibold">
                      {stat.value}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">{stat.name}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="px-6 py-2 border-t dark:border-gray-800">
          <QuickActions />
        </div>

        {/* Filters and View Toggle */}
        <div className="px-6 py-2 border-t dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              className="text-sm font-medium bg-transparent border-0 focus:ring-0 cursor-pointer dark:text-gray-300"
            >
              {filters.map((filter) => (
                <option key={filter.value} value={filter.value}>
                  {filter.name}
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
        <NotesGrid view={view} filter={activeFilter} />
      </div>
    </div>
  );
} 