'use client';

import { useState } from 'react';
import {
  PlusCircle,
  Upload,
  Download,
  Share2,
  Search,
  Sparkles,
} from 'lucide-react';
import NoteModal from './NoteModal';

export default function QuickActions() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSaveNote = async (noteData) => {
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noteData),
      });

      if (!response.ok) throw new Error('Failed to create note');
      
      // Refresh the page to show the new note
      window.location.reload();
    } catch (error) {
      console.error('Error creating note:', error);
      throw new Error('Failed to create note');
    }
  };

  const actions = [
    {
      name: 'New Note',
      description: 'Create a new note',
      icon: PlusCircle,
      color: 'bg-blue-500',
      onClick: () => setIsModalOpen(true),
    },
    {
      name: 'Import',
      description: 'Import from file',
      icon: Upload,
      color: 'bg-green-500',
      onClick: () => {/* Handle import */},
    },
    {
      name: 'Export',
      description: 'Export notes',
      icon: Download,
      color: 'bg-purple-500',
      onClick: () => {/* Handle export */},
    },
    {
      name: 'Share',
      description: 'Share notes',
      icon: Share2,
      color: 'bg-yellow-500',
      onClick: () => {/* Handle share */},
    },
    {
      name: 'Advanced Search',
      description: 'Search in notes',
      icon: Search,
      color: 'bg-pink-500',
      onClick: () => {/* Handle search */},
    },
    {
      name: 'AI Assistant',
      description: 'Get AI help',
      icon: Sparkles,
      color: 'bg-indigo-500',
      onClick: () => {/* Handle AI */},
    },
  ];

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.name}
              onClick={action.onClick}
              className="flex flex-col items-center p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all duration-200"
            >
              <div className={`${action.color} p-3 rounded-lg mb-3`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-sm font-medium text-gray-900">{action.name}</h3>
              <p className="text-xs text-gray-500 text-center mt-1">
                {action.description}
              </p>
            </button>
          );
        })}
      </div>

      <NoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        note={null}
        onSave={handleSaveNote}
      />
    </>
  );
} 