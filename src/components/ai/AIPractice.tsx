import { useState } from 'react';
import { useSettingsStore } from '../../stores/settingsStore';
import { chatPractice } from '../../services/claudeAPI';
import { Send, AlertCircle } from 'lucide-react';

const SCENES = {
  taxi: 'ダナンでタクシーに乗ってビーチに向かう場面',
  market: 'ダナン市場で野菜と果物を買う場面',
  apartment: '大家さんにエアコンの修理を依頼する場面',
  restaurant: 'ミー・クアン（ダナン名物麺料理）を注文する場面',
  clinic: '地元の診療所で腹痛を訴える場面',
  shopping: 'ショップで靴を買う場面',
  hotel: 'ホテルでチェックインする場面',
  bank: '銀行で口座を開設する場面',
};

interface Message {
  role: 'user' | 'assistant';
  content: string;
  corrections?: string[];
}

export default function AIPractice() {
  const { claudeApiKey } = useSettingsStore();
  const [scene, setScene] = useState<keyof typeof SCENES>('taxi');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Xin chào! (こんにちは!) では、会話を始めましょう。',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    if (!claudeApiKey) {
      setError('Claude API キーが設定されていません。設定画面で入力してください。');
      return;
    }

    const userMessage = input.trim();
    setInput('');
    setError('');

    const newMessages: Message[] = [
      ...messages,
      { role: 'user', content: userMessage },
    ];
    setMessages(newMessages);

    setLoading(true);
    try {
      const response = await chatPractice(
        claudeApiKey,
        newMessages.map(m => ({ role: m.role, content: m.content })),
        SCENES[scene]
      );

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.reply,
        corrections: response.corrections,
      };

      setMessages([...newMessages, assistantMessage]);
    } catch (err) {
      setError(`エラーが発生しました: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">AI会話練習</h1>

      {/* Scene Selector */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          シーンを選択
        </label>
        <select
          value={scene}
          onChange={(e) => {
            setScene(e.target.value as keyof typeof SCENES);
            setMessages([
              {
                role: 'assistant',
                content: 'Xin chào! (こんにちは!) では、新しいシーンで会話を始めましょう。',
              },
            ]);
          }}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
        >
          {Object.entries(SCENES).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>
      </div>

      {/* API Key Warning */}
      {!claudeApiKey && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-4 mb-6 flex gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-yellow-800 dark:text-yellow-300">
            Claude API キーが設定されていません。
            <a href="/settings" className="underline font-semibold">
              設定ページ
            </a>
            で入力してください。
          </p>
        </div>
      )}

      {/* Chat Area */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6 h-96 overflow-y-auto">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-3 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-vietnamese text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
              }`}
            >
              <p className="text-sm">{msg.content}</p>
              {msg.corrections && msg.corrections.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-300 dark:border-gray-600 text-xs">
                  <p className="font-semibold mb-1">【修正】</p>
                  <ul>
                    {msg.corrections.map((correction, cidx) => (
                      <li key={cidx} className="text-yellow-600 dark:text-yellow-400">
                        • {correction}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white max-w-xs px-4 py-3 rounded-lg">
              <p className="text-sm">考え中...</p>
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-4 mb-6">
          <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Input Area */}
      <div className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="ベトナム語または日本語で入力..."
          disabled={loading || !claudeApiKey}
          className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white disabled:opacity-50"
        />
        <button
          onClick={handleSendMessage}
          disabled={loading || !claudeApiKey || !input.trim()}
          className="bg-vietnamese hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50 flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          送信
        </button>
      </div>
    </div>
  );
}
