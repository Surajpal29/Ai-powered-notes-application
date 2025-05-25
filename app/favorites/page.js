'use client';

import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import NotesGrid from '@/components/NotesGrid';

export default function FavoritesPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <Star className="h-6 w-6 text-yellow-500 mr-2" />
          Favorite Notes
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Your most important notes in one place
        </p>
      </div>

      <NotesGrid filter="favorites" />
    </div>
  );
} 