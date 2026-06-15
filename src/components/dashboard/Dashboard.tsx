import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useVocabStore } from '../../stores/vocabStore';
import { useStatsStore } from '../../stores/statsStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { getTodayQueue } from '../../services/srs';
import { db } from '../../db/database';

export default function Dashboard() {
  const navigate = useNavigate();
  const { loadVocab } = useVocabStore();
  const { totalWords, streak, masteryDistribution, weeklyStats, loadStats } = useStatsStore();
  const { migrationDate } = useSettingsStore();

  useEffect(() => {
    loadVocab();
    loadStats();
    useSettingsStore.getState().loadSettings();
  }, []);

  const calculateCountdown = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(migrationDate);
    target.setHours(0, 0, 0, 0);
    const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  };

  const handleReviewStart = async () => {
    const queue = await getTodayQueue(db, 30);
    if (queue.length === 0) {
      alert('本日の復習はありません！');
      return;
    }
    navigate('/review');
  };

  const masteryData = [
    { name: '新規', value: masteryDistribution[1] || 0, color: '#3b82f6' },
    { name: '学習中', value: masteryDistribution[2] || 0, color: '#fbbf24' },
    { name: '定着中', value: masteryDistribution[3] || 0, color: '#10b981' },
    { name: '既知', value: masteryDistribution[4] + masteryDistribution[5] || 0, color: '#6366f1' },
  ].filter(item => item.value > 0);

  const chartData = [
    { day: '月', value: weeklyStats[0] || 0 },
    { day: '火', value: weeklyStats[1] || 0 },
    { day: '水', value: weeklyStats[2] || 0 },
    { day: '木', value: weeklyStats[3] || 0 },
    { day: '金', value: weeklyStats[4] || 0 },
    { day: '土', value: weeklyStats[5] || 0 },
    { day: '日', value: weeklyStats[6] || 0 },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">ダッシュボード</h1>

      {/* Countdown Card */}
      <div className="bg-vietnamese bg-opacity-10 border-2 border-vietnamese rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">🇻🇳 ベトナム移住まで</p>
            <p className="text-4xl font-bold text-vietnamese mt-2">{calculateCountdown()} 日</p>
          </div>
          <div className="text-6xl opacity-50">🇻🇳</div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Streak Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">🔥 連続学習日数</p>
          <p className="text-4xl font-bold text-orange-500">{streak}</p>
        </div>

        {/* Total Words Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">📚 総単語数</p>
          <p className="text-4xl font-bold text-blue-500">{totalWords}</p>
        </div>
      </div>

      {/* Today Queue */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">📋 本日の復習</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              復習キュー
            </p>
          </div>
          <button
            onClick={handleReviewStart}
            className="bg-vietnamese hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            復習を始める →
          </button>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mastery Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <p className="text-lg font-semibold text-gray-900 dark:text-white mb-4">習熟度分布</p>
          {masteryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={masteryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {masteryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500">データがありません</p>
          )}
        </div>

        {/* Weekly Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <p className="text-lg font-semibold text-gray-900 dark:text-white mb-4">今週の学習</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#DA251D" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
