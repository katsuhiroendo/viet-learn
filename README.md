# VietLearn - ベトナム語学習支援ツール

個人カスタマイズされたベトナム語学習ツール。60歳のユーザーが2028年8月の移住を目指し、A1〜A2レベルのベトナム語を効率的に習得するためのアプリケーション。

## 主な機能

### 📚 学習管理
- **ダッシュボード** - 移住カウントダウン、連続学習日数、復習キュー表示
- **単語帳** - 単語の追加・編集・削除、習熟度管理（1〜5段階）
- **インタラクティブリーダー** - ベトナム語テキストの読み込み、単語の色分け表示

### 🎓 復習システム
- **SRS復習** - SM-2アルゴリズムによる最適な復習スケジューリング
- **フラッシュカード** - シンプルな暗記練習
- **多肢選択問題** - 4択問題で理解度確認
- **穴埋め問題** - 日本語訳を入力する練習

### 🤖 AI機能
- **AI翻訳** - Claude APIを使用した単語の自動翻訳・発音ガイド生成
- **AI会話練習** - シーン別の会話ロールプレイ（8シーン搭載）
- **文法チェック** - ユーザー入力の間違い指摘

### 📊 学習分析
- **学習分析ページ** - 習熟度分布、週間学習進捗、シーン別統計
- **統計グラフ** - Rechart による可視化

### ⚙️ カスタマイズ
- Claude API キー管理
- 1日の復習上限・新規単語上限設定
- 移住予定日のカウントダウン設定
- ダークモード対応
- フォントサイズ調整

## 技術スタック

フロントエンド: React 18 + TypeScript
スタイリング: Tailwind CSS v4
状態管理: Zustand
データベース: Dexie.js (IndexedDB)
グラフ: Recharts
UI: Lucide React
AI: Claude API

## セットアップ

### インストール
```bash
npm install
```

### 開発サーバー起動
```bash
npm run dev
```
ブラウザで http://localhost:5173 にアクセス

### ビルド
```bash
npm run build
```

## Claude API設定

1. Anthropic Console でAPIキーを取得
2. アプリの設定画面にAPIキーを入力
3. AI機能が使用可能になります

## GitHub Pagesへのデプロイ

```bash
npm run deploy
```

base が `/viet-learn/` に設定されているため、自動的に GitHub Pages にデプロイされます。

## ディレクトリ構成

```
viet-learn/
├── src/
│   ├── components/
│   ├── stores/
│   ├── services/
│   ├── db/
│   ├── types/
│   └── App.tsx
├── public/presets/phrases/
└── dist/
```

---

Happy Learning! 🇻🇳
