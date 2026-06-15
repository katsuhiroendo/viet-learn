import { useState } from 'react';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden md:flex h-screen bg-gray-50 dark:bg-gray-900">
        {/* Desktop Sidebar */}
        <div className="w-64 flex-shrink-0 border-r border-gray-200 dark:border-gray-700">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto">
            <div className="p-6">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="flex flex-col h-screen md:hidden bg-gray-50 dark:bg-gray-900">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black bg-opacity-50"
            onClick={() => setSidebarOpen(false)}
          >
            <div
              className="w-64 h-full bg-white dark:bg-gray-800 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <Sidebar />
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto pb-16">
          <div className="p-4">
            {children}
          </div>
        </main>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 z-40">
          <BottomNav onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        </div>
      </div>
    </>
  );
}
