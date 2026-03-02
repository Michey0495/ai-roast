import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { kv } from "@vercel/kv";
import { nanoid } from "nanoid";
import type { RoastInput, RoastResult } from "@/types";

const client = new Anthropic();

/**
 * MCP-compatible JSON-RPC endpoint
 *
 * Exposes the roast functionality as an MCP tool.
 * Tool: "generate_roast"
 *   - name (string, required): Person's name
 *   - occupation (string, optional): Job title
 *   - hobby (string, optional): Hobbies
 *   - selfPR (string, optional): Self-introduction
 *
 * JSON-RPC request format:
 * {
 *   "jsonrpc": "2.0",
 *   "id": 1,
 *   "method": "tools/call",
 *   "params": {
 *     "name": "generate_roast",
 *     "arguments": { "name": "...", "occupation": "...", "hobby": "...", "selfPR": "..." }
 *   }
 * }
 */

interface JsonRpcRequest {
  jsonrpc: string;
  id: string | number;
  method: string;
  params?: Record<string, unknown>;
}

const TOOL_DEFINITION = {
  name: "generate_roast",
  description:
    "Generate a humorous, loving roast (Japanese-style tsukkomi) based on a person's profile. Returns funny but warm commentary.",
  inputSchema: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Person's name (required)",
      },
      occupation: {
        type: "string",
        description: "Job title or role",
      },
      hobby: {
        type: "string",
        description: "Hobbies or interests",
      },
      selfPR: {
        type: "string",
        description: "Self-introduction or PR text",
      },
    },
    required: ["name"],
  },
};

async function generateRoast(args: {
  name: string;
  occupation?: string;
  hobby?: string;
  selfPR?: string;
}): Promise<{ id: string; roast: string }> {
  const input: RoastInput = {
    name: String(args.name ?? "").slice(0, 50),
    job: String(args.occupation ?? "").slice(0, 100),
    hobbies: String(args.hobby ?? "").slice(0, 200),
    selfpr: String(args.selfPR ?? "").slice(0, 300),
    bio: "",
  };

  const profileText = [
    `名前: ${input.name}`,
    input.job ? `職業/肩書き: ${input.job}` : null,
    input.hobbies ? `趣味: ${input.hobbies}` : null,
    input.selfpr ? `自己PR: ${input.selfpr}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 800,
    messages: [
      {
        role: "user",
        content: `あなたは愛のある毒舌キャラです。以下のプロフィールを読んで、愛情たっぷりの面白いツッコミ（ロースト）を日本語でしてください。

ルール：
- 傷つけず、笑いを取る「愛のあるツッコミ」にする
- 3〜5個のポイントでツッコミ
- 各ポイントは1〜2文で簡潔に
- 最後は「でも実は◯◯なところが最高！」で締める
- 絵文字は一切使わないこと（重要）
- フォーマット：番号なし、各ポイントは改行で区切る

プロフィール：
${profileText}

ロースト開始：`,
      },
    ],
  });

  const roastText =
    message.content[0].type === "text" ? message.content[0].text : "";

  const id = nanoid(10);
  const result: RoastResult = {
    id,
    input,
    roast: roastText,
    createdAt: new Date().toISOString(),
  };

  await kv.set(`roast:${id}`, result, { ex: 60 * 60 * 24 * 30 });

  return { id, roast: roastText };
}

function jsonRpcError(id: string | number | null, code: number, message: string) {
  return NextResponse.json({
    jsonrpc: "2.0",
    id,
    error: { code, message },
  });
}

export async function POST(req: NextRequest) {
  let body: JsonRpcRequest;

  try {
    body = await req.json();
  } catch {
    return jsonRpcError(null, -32700, "Parse error");
  }

  if (body.jsonrpc !== "2.0" || !body.method) {
    return jsonRpcError(body.id ?? null, -32600, "Invalid Request");
  }

  // Handle tools/list - return available tools
  if (body.method === "tools/list") {
    return NextResponse.json({
      jsonrpc: "2.0",
      id: body.id,
      result: {
        tools: [TOOL_DEFINITION],
      },
    });
  }

  // Handle tools/call - execute a tool
  if (body.method === "tools/call") {
    const params = body.params as { name?: string; arguments?: Record<string, unknown> } | undefined;

    if (!params || params.name !== "generate_roast") {
      return jsonRpcError(body.id, -32601, "Tool not found");
    }

    const args = (params.arguments ?? {}) as {
      name: string;
      occupation?: string;
      hobby?: string;
      selfPR?: string;
    };

    if (!args.name?.trim()) {
      return jsonRpcError(body.id, -32602, "Parameter 'name' is required");
    }

    try {
      const result = await generateRoast(args);

      return NextResponse.json({
        jsonrpc: "2.0",
        id: body.id,
        result: {
          content: [
            {
              type: "text",
              text: result.roast,
            },
          ],
          meta: {
            resultId: result.id,
            resultUrl: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://roast.ezoai.jp"}/result/${result.id}`,
          },
        },
      });
    } catch (e) {
      console.error("MCP roast generation error:", e);
      return jsonRpcError(body.id, -32000, "Internal error generating roast");
    }
  }

  return jsonRpcError(body.id, -32601, "Method not found");
}

// GET: Return tool metadata for discovery
export async function GET() {
  return NextResponse.json({
    name: "ai-roast",
    version: "1.0.0",
    description:
      "AI Roast - Generate humorous, loving roasts (tsukkomi) based on user profiles. Powered by Claude AI.",
    tools: [TOOL_DEFINITION],
    endpoint: "/api/mcp",
    protocol: "jsonrpc",
  });
}
