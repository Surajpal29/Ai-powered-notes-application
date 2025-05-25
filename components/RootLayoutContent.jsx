"use client";

import { useSession } from "next-auth/react";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "react-hot-toast";

export default function RootLayoutContent({ children }) {
  const { data: session } = useSession();

  return (
    <>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        {session && (
          <div className="fixed inset-y-0 left-0 w-64 z-40">
            <Sidebar />
          </div>
        )}
        <main className="flex-1 ml-64 relative">
          <div className="min-h-screen">{children}</div>
        </main>
      </div>
      <Toaster position="top-right" />
    </>
  );
}
