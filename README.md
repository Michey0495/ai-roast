# AIロースト

プロフィールを入力するとAIが愛のある毒舌ツッコミ（ロースト）を生成するWebサービス。

## Try it

https://ai-roast.ezoai.jp

## For AI Agents (MCP)

MCP endpoint: `https://ai-roast.ezoai.jp/api/mcp`

### Available Tools

| Tool | Description |
|------|-------------|
| `generate_roast` | プロフィールから愛のある毒舌ツッコミを生成 |

### Example Request

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "generate_roast",
    "arguments": {
      "name": "田中太郎",
      "occupation": "エンジニア",
      "hobby": "プログラミングとコーヒー",
      "selfPR": "効率化が好きです"
    }
  }
}
```

### Example Response

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "（愛のある毒舌ツッコミがここに入ります）"
      }
    ],
    "meta": {
      "resultId": "abc123",
      "resultUrl": "https://ai-roast.ezoai.jp/result/abc123"
    }
  }
}
```

### Tool Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | Yes | 名前 |
| `occupation` | string | No | 職業・肩書き |
| `hobby` | string | No | 趣味 |
| `selfPR` | string | No | 自己紹介・PR文 |

## Features

- プロフィールから愛のある毒舌ロースト生成
- 結果カード（SNS映え設計）
- X(Twitter)シェア + リンクコピー
- OGP対応の結果ページ
- レート制限（5回/10分/IP）

## Tech Stack

Next.js 15 / TypeScript / Tailwind CSS / Claude Haiku / Vercel KV / Vercel

## License

MIT
