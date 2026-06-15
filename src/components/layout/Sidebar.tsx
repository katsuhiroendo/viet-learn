import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, RotateCcw, MessageSquare, Layers, Settings } from 'lucide-react';

const navItems = [
  { path: '/', icon: Home, label: 'ダッシュボード' },
  { path: '/vocabulary', icon: BookOpen, label: '単語帳' },
  { path: '/review', icon: RotateCcw, label: '復習' },
  { path: '/reader', icon: Layers, label: 'リーダー' },
  { path: '/practice', icon: MessageSquare, label: 'AI会話練習' },
  { path: '/settings', icon: Settings, label: '設定' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-gray-800 shadow-lg">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-vietnamese">🇻🇳 VietLearn</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">ベトナム語学習</p>
      </div>

      <nav className="flex-1 mt-6 overflow-y-auto">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center px-6 py-3 transition-colors ${
                isActive
                  ? 'bg-vietnamese bg-opacity-10 text-vietnamese border-r-4 border-vietnamese'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              <span className="font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="flex-shrink-0 p-6 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          <p>v1.0.0</p>
        </div>
      </div>
    </div>
  );
}
