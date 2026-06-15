import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, RotateCcw, Menu } from 'lucide-react';

interface BottomNavProps {
  onMenuClick: () => void;
}

const navItems = [
  { path: '/', icon: Home, label: 'ホーム' },
  { path: '/vocabulary', icon: BookOpen, label: '単語帳' },
  { path: '/review', icon: RotateCcw, label: '復習' },
];

export default function BottomNav({ onMenuClick }: BottomNavProps) {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="flex justify-around">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex-1 flex flex-col items-center justify-center py-2 transition-colors ${
                isActive ? 'text-vietnamese' : 'text-gray-400'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs mt-1">{label}</span>
            </Link>
          );
        })}
        <button
          onClick={onMenuClick}
          className="flex-1 flex flex-col items-center justify-center py-2 text-gray-400"
        >
          <Menu className="w-6 h-6" />
          <span className="text-xs mt-1">メニュー</span>
        </button>
      </div>
    </div>
  );
}
