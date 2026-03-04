# AIロースト🔥

プロフィールを入力するとAIが愛のある毒舌ツッコミ（ロースト）をしてくれるWebアプリ。
結果カードはスクショしてSNSで拡散しやすい設計。

## URL

- 本番: https://roast.ezoai.jp

## 技術スタック

- Next.js 15 (App Router)
- TypeScript strict
- Tailwind CSS
- shadcn/ui
- Vercel KV (結果保存)
- Anthropic Claude Haiku (AI生成)
- sonner (トースト通知)
- nanoid (ID生成)

## 機能

- プロフィールフォーム（名前・職業・趣味・自己PR・SNSプロフ）
- Claude Haiku による愛のある毒舌ロースト生成
- 結果カード（スクショ映え設計）
- X(Twitter) シェアボタン + リンクコピー
- OGP対応（結果URLをシェアするとカード表示）
- レート制限（5回/10分/IP）
- フィードバックウィジェット

## セットアップ

```bash
npm install
npm run dev
```

## 環境変数

```env
ANTHROPIC_API_KEY=
KV_REST_API_URL=
KV_REST_API_TOKEN=
NEXT_PUBLIC_SITE_URL=https://roast.ezoai.jp
NEXT_PUBLIC_GA_ID=  # オプション
GITHUB_TOKEN=       # フィードバック機能用（オプション）
```

## 進捗

### Night 1 (2026-03-01) ✅
- [x] Next.js 15 プロジェクト初期化
- [x] shadcn/ui セットアップ
- [x] プロフィール入力フォーム
- [x] AIロースト生成API (`POST /api/roast`)
- [x] 結果カードページ (`/result/[id]`)
- [x] シェアボタン（X + リンクコピー）
- [x] OGP / SEO設定
- [x] フィードバックウィジェット
- [x] レート制限
- [x] `npm run build` ✅

### Night 2 (予定)
- [ ] Google Analytics 統合強化
- [ ] ローディングアニメーション改善
- [ ] 404/エラーページ
- [ ] 人気のロースト一覧（ランキング）
