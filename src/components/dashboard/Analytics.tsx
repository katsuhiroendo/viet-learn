import { useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useVocabStore } from '../../stores/vocabStore';
import { useStatsStore } from '../../stores/statsStore';

export default function Analytics() {
  const { entries, loadVocab } = useVocabStore();
  const { totalWords, streak, masteryDistribution, weeklyStats, loadStats } = useStatsStore();

  useEffect(() => {
    loadVocab();
    loadStats();
  }, []);

  const calculateStats = () => {
    // 習熟度の詳細分析
    const masteryBreakdown = [
      { name: '新規 (1)', value: masteryDistribution[1] || 0, color: '#3b82f6' },
      { name: '学習中 (2)', value: masteryDistribution[2] || 0, color: '#f59e0b' },
      { name: '定着中 (3)', value: masteryDistribution[3] || 0, color: '#10b981' },
      { name: '習得済 (4)', value: masteryDistribution[4] || 0, color: '#6366f1' },
      { name: '完全習得 (5)', value: masteryDistribution[5] || 0, color: '#8b5cf6' },
    ].filter(item => item.value > 0);

    // 累積復習日数
    const cumulativeData = weeklyStats.map((val, idx) => {
      const cumulative = weeklyStats.slice(0, idx + 1).reduce((a, b) => a + b, 0);
      return {
        day: ['月', '火', '水', '木', '金', '土', '日'][idx],
        value: val,
        cumulative,
      };
    });

    // シーン別統計
    const sceneStats: Record<string, number> = {};
    entries.forEach(entry => {
      entry.tags.forEach(tag => {
        sceneStats[tag] = (sceneStats[tag] || 0) + 1;
      });
    });

    const sceneData = Object.entries(sceneStats)
      .map(([scene, count]) => ({
        name: scene,
        value: count,
      }))
      .sort((a, b) => b.value - a.value);

    return {
      masteryBreakdown,
      cumulativeData,
      sceneData,
    };
  };

  const { masteryBreakdown, cumulativeData, sceneData } = calculateStats();

  const stats = [
    { label: '総単語数', value: totalWords, color: 'text-blue-600' },
    { label: '連続学習日数', value: streak, color: 'text-orange-600' },
    { label: '学習中の単語', value: (masteryDistribution[2] || 0) + (masteryDistribution[3] || 0), color: 'text-yellow-600' },
    { label: '習得済み', value: (masteryDistribution[4] || 0) + (masteryDistribution[5] || 0), color: 'text-green-600' },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">学習分析</h1>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{stat.label}</p>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Mastery Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            習熟度分布
          </h2>
          {masteryBreakdown.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={masteryBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {masteryBreakdown.map((entry, index) => (
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

        {/* Weekly Progress */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            週間学習進捗
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={cumulativeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#DA251D" name="当日" />
              <Bar dataKey="cumulative" fill="#8b5cf6" name="累積" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Scene Distribution */}
      {sceneData.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            シーン別学習
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sceneData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="value" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Detailed Stats Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mt-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          習熟度別統計
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-300 dark:border-gray-600">
              <tr>
                <th className="text-left py-3 px-4">習熟度</th>
                <th className="text-right py-3 px-4">単語数</th>
                <th className="text-right py-3 px-4">割合</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map(level => {
                const count = masteryDistribution[level as keyof typeof masteryDistribution] || 0;
                const percentage = totalWords > 0 ? ((count / totalWords) * 100).toFixed(1) : '0.0';
                const labels = ['新規', '学習中', '定着中', '習得済み', '完全習得'];
                return (
                  <tr key={level} className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-3 px-4">{labels[level - 1]} ({level})</td>
                    <td className="text-right py-3 px-4">{count}</td>
                    <td className="text-right py-3 px-4">{percentage}%</td>
                  </tr>
                );
              })}
              <tr className="font-semibold bg-gray-50 dark:bg-gray-700">
                <td className="py-3 px-4">合計</td>
                <td className="text-right py-3 px-4">{totalWords}</td>
                <td className="text-right py-3 px-4">100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
