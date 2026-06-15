import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReviewStore } from '../../stores/reviewStore';
import { useVocabStore } from '../../stores/vocabStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { calculateSM2, calculateNextReviewDate } from '../../services/srs';
import { Volume2, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ReviewSession() {
  const navigate = useNavigate();
  const { currentQueue, currentIndex, loadTodayQueue } = useReviewStore();
  const { updateEntry } = useVocabStore();
  const { dailyReviewLimit } = useSettingsStore();
  const [loading, setLoading] = useState(true);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    loadTodayQueue(dailyReviewLimit);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="text-center py-20">読み込み中...</div>;
  }

  if (currentQueue.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          復習はありません！
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          お疲れ様でした。明日もがんばってください！
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-vietnamese hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg"
        >
          ダッシュボードに戻る
        </button>
      </div>
    );
  }

  const current = currentQueue[currentIndex];
  const progress = `${currentIndex + 1} / ${currentQueue.length}`;

  const handleGrade = async (grade: number) => {
    const sm2Result = calculateSM2({
      easeFactor: current.srsData.easeFactor,
      interval: current.srsData.interval,
      repetitions: current.srsData.repetitions,
      grade,
    });

    const updated = {
      ...current,
      srsData: {
        ...current.srsData,
        easeFactor: sm2Result.easeFactor,
        interval: sm2Result.interval,
        repetitions: sm2Result.repetitions,
        nextReviewDate: calculateNextReviewDate(sm2Result.interval),
        lastReviewDate: new Date(),
        lastGrade: grade,
      },
      updatedAt: new Date(),
    };

    await updateEntry(updated);

    if (currentIndex < currentQueue.length - 1) {
      useReviewStore.getState().nextCard();
      setShowAnswer(false);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">SRS復習</h1>
          <span className="text-lg font-semibold text-gray-600 dark:text-gray-400">
            {progress}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-vietnamese h-2 rounded-full transition-all"
            style={{ width: `${((currentIndex + 1) / currentQueue.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Flashcard */}
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 mb-8 cursor-pointer min-h-96 flex flex-col justify-center items-center"
        onClick={() => setShowAnswer(!showAnswer)}
      >
        {!showAnswer ? (
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">ベトナム語</p>
            <h2 className="text-5xl font-bold text-vietnamese mb-4">{current.vietnamese}</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
              {current.pronunciation}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if ('speechSynthesis' in window) {
                  const utterance = new SpeechSynthesisUtterance(current.vietnamese);
                  utterance.lang = 'vi-VN';
                  window.speechSynthesis.speak(utterance);
                }
              }}
              className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
            >
              <Volume2 className="w-5 h-5" />
              再生
            </button>
            <p className="text-gray-500 dark:text-gray-400 mt-8 text-sm">
              クリックして答えを表示
            </p>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">日本語訳</p>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              {current.japanese.join(' / ')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              例: {current.exampleJa}
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              クリックして隠す
            </p>
          </div>
        )}
      </div>

      {/* Grade Buttons */}
      {showAnswer && (
        <div className="space-y-3 mb-6">
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => handleGrade(1)}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg"
            >
              忘れた
            </button>
            <button
              onClick={() => handleGrade(3)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-4 rounded-lg"
            >
              なんとか
            </button>
            <button
              onClick={() => handleGrade(4)}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg"
            >
              覚えていた
            </button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between gap-4">
        <button
          onClick={() => useReviewStore.getState().previousCard()}
          disabled={currentIndex === 0}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg disabled:opacity-50"
        >
          <ChevronLeft className="w-5 h-5" />
          前へ
        </button>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg"
        >
          終了
        </button>
        <button
          onClick={() => useReviewStore.getState().nextCard()}
          disabled={currentIndex === currentQueue.length - 1}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg disabled:opacity-50"
        >
          次へ
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
