import { useState } from 'react';
import { useSettingsStore } from '../../stores/settingsStore';
import { useVocabStore } from '../../stores/vocabStore';
import { db } from '../../db/database';
import { Download } from 'lucide-react';

export default function Settings() {
  const settings = useSettingsStore();
  const { entries } = useVocabStore();

  const [apiKey, setApiKey] = useState(settings.claudeApiKey);
  const [dailyLimit, setDailyLimit] = useState(settings.dailyReviewLimit);
  const [newWordsPerDay, setNewWordsPerDay] = useState(settings.newWordsPerDay);
  const [migrationDate, setMigrationDate] = useState(
    settings.migrationDate.toISOString().split('T')[0]
  );
  const [darkMode, setDarkMode] = useState(settings.darkMode);
  const [fontSize, setFontSize] = useState(settings.fontSize);
  const [message, setMessage] = useState('');

  const handleSaveSettings = () => {
    settings.updateSettings({
      claudeApiKey: apiKey,
      dailyReviewLimit: dailyLimit,
      newWordsPerDay: newWordsPerDay,
      migrationDate: new Date(migrationDate),
      darkMode,
      fontSize: fontSize as 'normal' | 'large' | 'xlarge',
    });
    setMessage('設定を保存しました！');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleExport = () => {
    const data = {
      vocab: entries,
      exportDate: new Date().toISOString(),
      version: '1.0',
    };
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    const exportFileDefaultName = `viet-learn-backup-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    setMessage('データをエクスポートしました！');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (data.vocab && Array.isArray(data.vocab)) {
        for (const entry of data.vocab) {
          entry.createdAt = new Date(entry.createdAt);
          entry.updatedAt = new Date(entry.updatedAt);
          entry.srsData.nextReviewDate = new Date(entry.srsData.nextReviewDate);
          if (entry.srsData.lastReviewDate) {
            entry.srsData.lastReviewDate = new Date(entry.srsData.lastReviewDate);
          }
          await db.vocab.put(entry);
        }
        setMessage('データをインポートしました！');
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (err) {
      setMessage(`エラー: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">設定</h1>

      {message && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl p-4 mb-6">
          <p className="text-sm text-green-800 dark:text-green-300">{message}</p>
        </div>
      )}

      {/* API Key Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Claude API 設定
        </h2>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          API キー
        </label>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="sk-ant-..."
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white mb-4"
        />
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Claude API キーはローカルに保存されます。
        </p>
      </div>

      {/* Learning Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          学習設定
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            1日最大復習数
          </label>
          <input
            type="number"
            value={dailyLimit}
            onChange={(e) => setDailyLimit(Number(e.target.value))}
            min={5}
            max={100}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            1日新規単語上限
          </label>
          <input
            type="number"
            value={newWordsPerDay}
            onChange={(e) => setNewWordsPerDay(Number(e.target.value))}
            min={1}
            max={50}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      {/* Personal Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          個人設定
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            ベトナム移住予定日
          </label>
          <input
            type="date"
            value={migrationDate}
            onChange={(e) => setMigrationDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            フォントサイズ
          </label>
          <select
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value as 'normal' | 'large' | 'xlarge')}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
          >
            <option value="normal">標準</option>
            <option value="large">大</option>
            <option value="xlarge">特大</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="darkMode"
            checked={darkMode}
            onChange={(e) => setDarkMode(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="darkMode" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            ダークモード
          </label>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          データ管理
        </h2>

        <div className="mb-4">
          <button
            onClick={handleExport}
            className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg"
          >
            <Download className="w-5 h-5" />
            データをエクスポート
          </button>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            データをインポート
          </label>
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSaveSettings}
        className="w-full bg-vietnamese hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg"
      >
        設定を保存
      </button>
    </div>
  );
}
