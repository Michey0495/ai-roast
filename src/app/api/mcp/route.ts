import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { callAI, buildRoastPrompt, buildProfileText, sanitizeInput } from "@/lib/ai";
import type { RoastInput, RoastResult } from "@/types";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-roast.ezoai.jp";

const RATE_LIMIT = 10;
const RATE_WINDOW_SEC = 600;
const memRateMap = new Map<string, { count: number; resetAt: number }>();

async function isRateLimited(ip: string): Promise<boolean> {
  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const { kv } = await import("@vercel/kv");
      const key = `ratelimit:roast:mcp:${ip}`;
      const count = await kv.incr(key);
      if (count === 1) {
        await kv.expire(key, RATE_WINDOW_SEC);
      }
      return count > RATE_LIMIT;
    }
  } catch {
    // Fall through
  }
  const now = Date.now();
  const entry = memRateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    memRateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_SEC * 1000 });
    return false;
  }
  if (entry.count >= RATE_LIMIT) return true;
  entry.count++;
  return false;
}

interface JsonRpcRequest {
  jsonrpc: string;
  id: string | number;
  method: string;
  params?: Record<string, unknown>;
}

const TOOL_DEFINITION = {
  name: "generate_roast",
  description:
    "プロフィール情報からAIが愛のある毒舌ツッコミ（ロースト）を生成する。結果ページURLも返す。",
  inputSchema: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "名前（必須）",
      },
      occupation: {
        type: "string",
        description: "職業や肩書き（省略可）",
      },
      hobby: {
        type: "string",
        description: "趣味（省略可）",
      },
      selfPR: {
        type: "string",
        description: "自己PR（省略可）",
      },
    },
    required: ["name"],
  },
};

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

  switch (body.method) {
    case "initialize":
      return NextResponse.json({
        jsonrpc: "2.0",
        id: body.id,
        result: {
          protocolVersion: "2024-11-05",
          serverInfo: { name: "ai-roast-mcp", version: "1.0.0" },
          capabilities: { tools: {} },
        },
      });

    case "notifications/initialized":
      return NextResponse.json({ jsonrpc: "2.0" });

    case "tools/list":
      return NextResponse.json({
        jsonrpc: "2.0",
        id: body.id,
        result: { tools: [TOOL_DEFINITION] },
      });

    case "tools/call": {
      const ip =
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
      if (await isRateLimited(ip)) {
        return jsonRpcError(body.id, -32000, "Rate limit exceeded. Try again later.");
      }

      const params = body.params as {
        name?: string;
        arguments?: Record<string, unknown>;
      };

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
        const input: RoastInput = {
          name: sanitizeInput(String(args.name), 50),
          job: sanitizeInput(String(args.occupation ?? ""), 100),
          hobbies: sanitizeInput(String(args.hobby ?? ""), 200),
          selfpr: sanitizeInput(String(args.selfPR ?? ""), 300),
          bio: "",
        };

        const profileText = buildProfileText(input);
        const prompt = buildRoastPrompt(profileText);
        const roastText = await callAI(prompt);

        const id = nanoid(10);
        const result: RoastResult = {
          id,
          input,
          roast: roastText,
          createdAt: new Date().toISOString(),
        };

        const { kv } = await import("@vercel/kv");
        await kv.set(`roast:${id}`, result, { ex: 60 * 60 * 24 * 365 });
        await kv.zadd("roast:feed", { score: Date.now(), member: id });

        return NextResponse.json({
          jsonrpc: "2.0",
          id: body.id,
          result: {
            content: [{ type: "text", text: roastText }],
            meta: {
              resultId: id,
              resultUrl: `${siteUrl}/result/${id}`,
            },
          },
        });
      } catch (e) {
        const msg = e instanceof Error ? e.message : "ロースト生成に失敗しました";
        return jsonRpcError(body.id, -32000, msg);
      }
    }

    default:
      return jsonRpcError(body.id, -32601, "Method not found");
  }
}

export async function GET() {
  return NextResponse.json({
    name: "ai-roast",
    version: "1.0.0",
    description:
      "プロフィール情報からAIが愛のある毒舌ツッコミ（ロースト）を生成するサービス。",
    tools: [TOOL_DEFINITION],
    endpoint: "/api/mcp",
    protocol: "jsonrpc",
  });
}
