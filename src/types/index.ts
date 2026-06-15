export type MasteryLevel = 1 | 2 | 3 | 4 | 5;

export type SceneTag =
  | 'greetings'    // 挨拶・自己紹介
  | 'numbers'      // 数字・時間・日付
  | 'shopping'     // 買い物
  | 'restaurant'   // レストラン・飲食
  | 'transport'    // 交通・移動
  | 'housing'      // 住居・アパート
  | 'medical'      // 医療・薬局
  | 'emergency'    // 緊急時
  | 'admin'        // 行政手続き
  | 'community'    // 近隣コミュニティ
  | 'custom';      // ユーザー独自

export interface SRSData {
  interval: number;          // 次回復習までの日数
  repetitions: number;       // 連続正解回数
  easeFactor: number;        // 難易度係数（SM-2: 初期値2.5）
  nextReviewDate: Date;      // 次回復習日
  lastReviewDate?: Date;     // 前回復習日
  lastGrade?: number;        // 前回の評価（0〜5）
}

export interface VocabEntry {
  id: string;                    // UUID v4
  vietnamese: string;            // ベトナム語テキスト（声調記号付き）
  pronunciation: string;         // 発音ガイド（任意）
  japanese: string[];            // 日本語訳（複数可）
  exampleVi: string;             // 例文（ベトナム語）
  exampleJa: string;             // 例文（日本語訳）
  audioUrl?: string;             // 音声ファイルURL（任意）
  tags: SceneTag[];              // 生活シーンタグ
  mastery: MasteryLevel;         // 習熟度（1〜5）
  srsData: SRSData;              // SRS管理データ
  notes: string;                 // メモ
  createdAt: Date;
  updatedAt: Date;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;           // ベトナム語テキスト
  translation?: string;      // 日本語全文訳
  sceneTag?: SceneTag;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewSession {
  id: string;
  date: Date;
  wordsReviewed: number;
  correct: number;
  duration: number;          // 秒
}

export interface AppSettings {
  dailyReviewLimit: number;  // 1日最大復習数（デフォルト30）
  newWordsPerDay: number;    // 1日新規単語上限（デフォルト10）
  claudeApiKey: string;      // Claude API Key（ローカル保存）
  darkMode: boolean;
  migrationDate: Date;       // 移住予定日（カウントダウン用）
  fontSize: 'normal' | 'large' | 'xlarge';
}

export interface TranslateResponse {
  japanese: string[];     // 日本語訳候補
  pronunciation: string;  // 発音ガイド（声調番号付き）
  notes: string;          // 使用上の注意・ニュアンス
}

export interface ExampleSentence {
  vietnamese: string;
  japanese: string;
}
