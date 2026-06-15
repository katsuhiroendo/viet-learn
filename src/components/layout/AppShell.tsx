import { useState } from 'react';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import { useWindowSize } from '../../hooks/useWindowSize';

interface AppShellProps {
  children: React.ReactNode;
}

const MD_BREAKPOINT = 768;

export default function AppShell({ children }: AppShellProps) {
  const { width } = useWindowSize();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isDesktop = width >= MD_BREAKPOINT;

  return (
    <div className="flex h-screen w-full bg-gray-50 dark:bg-gray-900">
      {/* Desktop Sidebar - Only render on desktop */}
      {isDesktop && (
        <div className="w-64 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
          <Sidebar />
        </div>
      )}

      {/* Mobile Sidebar Modal - Only render on mobile when open */}
      {!isDesktop && sidebarOpen && (
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

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          <div className="p-4 md:p-6">
            {children}
          </div>
        </main>

        {/* Mobile Bottom Navigation - Only render on mobile */}
        {!isDesktop && (
          <BottomNav onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        )}
      </div>
    </div>
  );
}
