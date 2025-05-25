'use client';

import { useState } from 'react';
import { Settings, Moon, Sun, User, Bell, Shield, Database } from 'lucide-react';

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const settingsSections = [
    {
      title: 'Account',
      icon: User,
      description: 'Manage your account settings and preferences',
      href: '/settings/account',
    },
    {
      title: 'Appearance',
      icon: darkMode ? Moon : Sun,
      description: 'Customize the look and feel of the application',
      action: () => setDarkMode(!darkMode),
      current: darkMode ? 'Dark Mode' : 'Light Mode',
    },
    {
      title: 'Notifications',
      icon: Bell,
      description: 'Configure how you want to be notified',
      action: () => setNotifications(!notifications),
      current: notifications ? 'Enabled' : 'Disabled',
    },
    {
      title: 'Security',
      icon: Shield,
      description: 'Manage your security preferences',
      href: '/settings/security',
    },
    {
      title: 'Data & Storage',
      icon: Database,
      description: 'Manage your data and storage preferences',
      href: '/settings/data',
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <Settings className="h-6 w-6 text-gray-500 mr-2" />
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your application preferences
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {settingsSections.map((section) => {
          const Icon = section.icon;
          return (
            <div
              key={section.title}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <Icon className="h-6 w-6 text-blue-500 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">
                      {section.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {section.description}
                    </p>
                  </div>
                </div>
                {section.action ? (
                  <button
                    onClick={section.action}
                    className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-md">
                    {section.current}
                  </button>
                ) : (
                  <a
                    href={section.href}
                    className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">
                    Configure
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 