# Architecture — AIロースト🔥

## 概要

シンプルな2ページ構成のバイラルSNSアプリ。
入力 → AI生成 → 永続化 → 結果URLシェア のフローを最短で実現。

## ページ構成

| ルート | 種別 | 役割 |
|-------|------|------|
| `/` | Static | プロフィール入力フォーム |
| `/result/[id]` | SSR | 結果表示 + シェアボタン |
| `/api/roast` | API | ロースト生成 + KV保存 |
| `/api/feedback` | API | フィードバック → GitHub Issue |

## データフロー

```
ユーザー入力 (RoastForm)
    ↓ POST /api/roast
    ↓ Claude Haiku でロースト生成
    ↓ Vercel KV に保存 (roast:{id}, TTL 30日)
    ↓ id を返却
    ↓ /result/{id} にリダイレクト
    ↓ KV から結果取得 → 表示
    ↓ X/リンクシェア → OGP表示
```

## AIプロンプト設計

- **モデル**: Claude Haiku (高速・低コスト)
- **トーン**: 愛のある毒舌、傷つけない
- **フォーマット**: 3〜5個のポイント + 最後に褒めで締め
- **出力**: 絵文字付きの短い段落

## コンポーネント構成

```
src/
├── app/
│   ├── layout.tsx       # メタデータ・GA・Toast・FeedbackWidget
│   ├── page.tsx         # ホーム (RoastForm)
│   ├── result/[id]/
│   │   └── page.tsx     # 結果カード + ShareButtons
│   ├── api/
│   │   ├── roast/route.ts    # メインAPI
│   │   └── feedback/route.ts # フィードバックAPI
│   ├── robots.ts
│   └── sitemap.ts
├── components/
│   ├── RoastForm.tsx    # 入力フォーム (Client)
│   ├── ShareButtons.tsx # シェアボタン (Client)
│   └── FeedbackWidget.tsx
└── types/index.ts
```

## バイラル設計

1. **スクショ映えカード**: 白背景・ボーダー・名前表示で撮影しやすい
2. **OGP**: 結果URLシェア時に名前+ロースト冒頭が表示
3. **Xシェアテキスト**: 回答の一部を含めてCTRを高める
4. **CTA**: 「自分もロースト される」ボタンで循環

## レート制限

- 5回/10分/IP
- Vercel KV で `rate:roast:{ip}` キーにカウント保存
- 制限超過時は 429 + 日本語エラーメッセージ

## 環境変数

| 変数 | 必須 | 説明 |
|------|------|------|
| `ANTHROPIC_API_KEY` | ✅ | Claude API |
| `KV_REST_API_URL` | ✅ | Vercel KV |
| `KV_REST_API_TOKEN` | ✅ | Vercel KV |
| `NEXT_PUBLIC_SITE_URL` | ✅ | OGP URL生成 |
| `NEXT_PUBLIC_GA_ID` | ❌ | Google Analytics |
| `GITHUB_TOKEN` | ❌ | フィードバック→Issue |
