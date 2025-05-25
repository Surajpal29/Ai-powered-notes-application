'use client';

import { useState } from 'react';
import { FolderOpen } from 'lucide-react';
import FolderTree from '@/components/FolderTree';
import NotesGrid from '@/components/NotesGrid';

export default function ExplorerPage() {
  const [selectedFolderId, setSelectedFolderId] = useState(null);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <FolderOpen className="h-6 w-6 text-blue-500 mr-2" />
          Folders
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Organize your notes in folders
        </p>
      </div>

      <div className="flex gap-6">
        <div className="w-72 shrink-0">
          <div className="sticky top-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <FolderTree
              onFolderSelect={setSelectedFolderId}
              selectedFolderId={selectedFolderId}
            />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <NotesGrid selectedFolderId={selectedFolderId} />
        </div>
      </div>
    </div>
  );
} 