# Pro Critic Review: AIロースト
## Date: 2026-03-04
## Review: #001 (Initial)
## Overall Score: 52/100

---

### Industry Comparison References
- **Comedy Central Roast**: ロースト文化の元祖。プロの構成、ビジュアル演出、シェアラビリティ
- **ShindanMaker (診断メーカー)**: 日本のSNS診断系サービス。入力→結果→シェアの完璧なループ
- **Roast My Startup (YC)**: AI+ロースト。シンプルだが笑えるフィードバック
- **AI Dungeon**: AI生成コンテンツのエンタメ体験。演出とインタラクション
- **Linear / Vercel Dashboard**: ダークテーマの洗練度

---

### Category Scores

| Category | Score | Details |
|----------|-------|---------|
| ブラウザアプリ完成度 | 11/20 | 致命的: メタデータに絵文字(🔥)使用(CLAUDE.md違反)。`<html>`に`dark`クラスなし(shadcnのダークテーマ未有効化)。robots.txtが全API無差別許可。JSON-LD未実装。keywords/canonical/robots metadata未設定。OG画像参照なし(トップページ)。Navなし。CrossPromoがlayoutになくページ個別。CSS変数がshadcnデフォルト(oklch)で`#000000`純黒ではない。footerがpage.tsx内にインライン |
| UI/UXデザイン | 13/20 | ヒーローのオレンジグラデーション、フェードインアニメは良好。問題: Navなし(ギャラリー→トップの導線がない)。shadcn/uiコンポーネント使用だがダークテーマ未有効化で表示不整合の可能性。ローディング時のアニメが`*`文字の回転(地味)。結果ページのロースト表示はテキストのみで視覚的演出不足。ShindanMakerと比較すると「結果をシェアしたくなる」ビジュアルインパクトが弱い |
| システム設計 | 9/20 | 致命的: **本番AI生成不能**(Ollama localhost)。レート制限に`kv.get`→`kv.set`競合状態。MCPにレート制限なし。MCPに`initialize`ハンドラなし(MCP仕様違反)。ロースト生成ロジックが`/api/roast`と`/api/mcp`で重複。llms.txtは「Claude Haiku」と記載するがコードはOllama(ドキュメント不整合)。未使用依存: lucide-react, @anthropic-ai/sdk(インポートなし), radix-ui(使用箇所なし) |
| AIエージェント導線 | 12/20 | agent.jsonの構造は比較的充実(tools, protocol, authentication, skills)。llms.txtにMCPツール情報あり。問題: MCPに`initialize`ハンドラなし(agents/initialized も)→エージェントが初期化フローを完走できない。robots.txtが内部API保護なし。llms.txtに3ステップフロー未記載。URLが`ai-roast.ezoai.jp`と`roast.ezoai.jp`で不統一(agent.jsonとサイトURLの不一致) |
| 人間エンタメ体験 | 7/20 | コンセプトは良い(ロースト=笑い+シェア)。ギャラリーでソーシャルプルーフ。Like/Share機能あり。致命的: **本番で動かない**。ロースト生成時の演出なし(ローディング→リダイレクト)。結果ページに「もう一度やる」CTAが目立たない。プロンプトの絵文字指示が`/api/roast`では「適度に使う」、MCPでは「一切使わない」で矛盾。エンプティステート未対応 |

---

### Critical Issues (P0 - Must Fix)

1. **本番AI生成不能**: Ollama(`localhost:11434`)はVercel到達不能。Anthropicフォールバック必須
2. **MCPに`initialize`ハンドラなし**: MCP仕様ではinitialize→tools/list→tools/callの順。initializeがないとエージェントが接続できない
3. **メタデータ絵文字(🔥)**: CLAUDE.md「絵文字: 一切禁止」に違反
4. **`<html>`にdarkクラスなし**: shadcnのダークテーマCSS変数が有効化されていない。body直接のbg-black指定とshadcn変数が矛盾する可能性
5. **レート制限競合状態**: `kv.get`→`kv.set`は非アトミック

### Major Issues (P1)

6. **Navなし**: グローバルナビゲーションがない
7. **robots.txt**: `/api/mcp`のみ許可し他をDisallow
8. **llms.txt不正確**: 「Claude Haiku」と記載するがOllama使用。MCP 3ステップフロー未記載
9. **JSON-LD未実装**
10. **OG画像参照なし**(layout.tsx)
11. **MCPレート制限なし**
12. **URL不統一**: `roast.ezoai.jp` vs `ai-roast.ezoai.jp`
13. **AI共通モジュールなし**: ロースト生成ロジックが2箇所に重複
14. **CrossPromo未配置**(layoutレベル)

### Minor Issues (P2)

15. **プロンプト絵文字矛盾**: `/api/roast`は「適度に使う」、MCPは「一切使わない」
16. **CSS変数**: shadcnデフォルトのoklch値。純黒`#000000`ではない
17. **未使用依存**: lucide-react, radix-ui(未使用)
18. **footerがpage.tsx内**: layoutに移動すべき

---

### Score Breakdown

```
ブラウザアプリ完成度:  11/20
UI/UXデザイン:        13/20
システム設計:           9/20
AIエージェント導線:    12/20
人間エンタメ体験:       7/20
──────────────────────
合計:                  52/100
```

**目標スコア80点に未到達。P0・P1の修正が必要。**
