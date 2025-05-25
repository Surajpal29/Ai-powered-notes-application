"use client";

import { useState } from "react";
import {
  Home,
  FileText,
  FolderOpen,
  Star,
  Clock,
  Share2,
  Trash2,
  Settings,
  Search,
  Plus,
  ChevronDown,
  ChevronUp,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const mainMenu = [
    { name: "Home", icon: Home, href: "/dashboard" },
    { name: "All Notes", icon: FileText, href: "/notes" },
    { name: "Folders", icon: FolderOpen, href: "/explorer" },
    { name: "Favorites", icon: Star, href: "/favorites" },
    { name: "Recent", icon: Clock, href: "/recent" },
    { name: "Shared", icon: Share2, href: "/shared" },
    { name: "Trash", icon: Trash2, href: "/trash" },
    { name: "Settings", icon: Settings, href: "/settings" },
  ];

  const quickActions = [
    {
      name: "New Note",
      icon: Plus,
      action: () => router.push("/notes/new"),
    },
    {
      name: "New Folder",
      icon: FolderOpen,
      action: () => router.push("/explorer?action=new-folder"),
    },
    {
      name: "Import Notes",
      icon: Upload,
      action: () => router.push("/import"),
    },
  ];

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(searchQuery)}`
      );
      if (!response.ok) throw new Error("Search failed");
      const results = await response.json();

      // Store results in localStorage for the search page to use
      localStorage.setItem("lastSearchResults", JSON.stringify(results));
      localStorage.setItem("lastSearchQuery", searchQuery);

      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    } catch (error) {
      toast.error("Failed to perform search");
      console.error("Search error:", error);
    }
  };

  return (
    <div className="h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col shadow-lg">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 border-0 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </form>

      {/* Quick Actions */}
      <div className="px-3 mb-4">
        <button
          onClick={() => setIsQuickMenuOpen(!isQuickMenuOpen)}
          className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
          <div className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Quick Actions
          </div>
          {isQuickMenuOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {isQuickMenuOpen && (
          <div className="mt-2 py-1 px-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            {quickActions.map((action) => (
              <button
                key={action.name}
                onClick={action.action}
                className="w-full flex items-center px-2 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                <action.icon className="h-4 w-4 mr-2" />
                {action.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Menu */}
      <nav className="flex-1 overflow-y-auto px-3">
        {mainMenu.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg mb-1 ${
                isActive
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}>
              <item.icon
                className={`h-5 w-5 mr-3 ${
                  isActive
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-400 dark:text-gray-500"
                }`}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              User Name
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              user@example.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
