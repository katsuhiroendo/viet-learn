import { useState } from 'react';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import { useWindowSize } from '../../hooks/useWindowSize';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const { isDesktop } = useWindowSize();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isDesktop) {
    // Mobile Layout
    return (
      <div className="w-full h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        {/* Mobile Sidebar Modal - Only render when open */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50"
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
        <main className="flex-1 overflow-y-auto">
          <div className="p-4">
            {children}
          </div>
        </main>

        {/* Bottom Navigation on Mobile */}
        <BottomNav onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      </div>
    );
  }

  // Desktop Layout
  return (
    <div className="w-full h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Desktop Sidebar */}
      <div className="w-64 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
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
  );
}
