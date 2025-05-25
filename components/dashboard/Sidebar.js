'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  PlusCircle,
  FolderOpen,
  Star,
  Archive,
  Trash2,
  Settings,
  X,
} from 'lucide-react';

const navigation = [
  { name: 'Home', href: '/dashboard', icon: Home },
  { name: 'All Notes', href: '/dashboard/notes', icon: FolderOpen },
  { name: 'Favorites', href: '/dashboard/favorites', icon: Star },
  { name: 'Archive', href: '/dashboard/archive', icon: Archive },
  { name: 'Trash', href: '/dashboard/trash', icon: Trash2 },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

/**
 * Dashboard sidebar component
 * Contains main navigation and quick actions
 */
export default function Sidebar({ isOpen, setIsOpen }) {
  const pathname = usePathname();

  return (
    <aside
      className={`
        fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200
        transform transition-transform duration-300 ease-in-out z-30
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      <div className="flex items-center justify-between p-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-xl font-bold text-blue-600">AI Notes</span>
        </Link>
        <button
          onClick={() => setIsOpen(false)}
          className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="p-4">
        <button
          onClick={() => {/* Handle new note */}}
          className="w-full flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusCircle className="w-5 h-5" />
          <span>New Note</span>
        </button>
      </div>

      <nav className="mt-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center gap-2 px-4 py-2 mx-2 rounded-lg
                ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900">Storage</h3>
          <div className="mt-2">
            <div className="bg-blue-100 rounded-full h-2">
              <div
                className="bg-blue-600 rounded-full h-2"
                style={{ width: '60%' }}
              />
            </div>
            <p className="text-xs text-blue-700 mt-2">
              6 GB of 10 GB used
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
} 