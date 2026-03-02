import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { kv } from "@vercel/kv";
import { nanoid } from "nanoid";
import type { RoastInput, RoastResult } from "@/types";

const client = new Anthropic();

const RATE_LIMIT = 5;
const RATE_WINDOW = 10 * 60; // 10 minutes

async function checkRateLimit(ip: string): Promise<boolean> {
  const key = `rate:roast:${ip}`;
  const count = (await kv.get<number>(key)) ?? 0;
  if (count >= RATE_LIMIT) return false;
  await kv.set(key, count + 1, { ex: RATE_WINDOW });
  return true;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";

  const allowed = await checkRateLimit(ip).catch(() => true);
  if (!allowed) {
    return NextResponse.json(
      { error: "しばらく待ってからもう一度お試しください（10分に5回まで）" },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  if (!body?.name?.trim()) {
    return NextResponse.json({ error: "名前は必須です" }, { status: 400 });
  }

  const input: RoastInput = {
    name: String(body.name ?? "").slice(0, 50),
    job: String(body.job ?? "").slice(0, 100),
    hobbies: String(body.hobbies ?? "").slice(0, 200),
    selfpr: String(body.selfpr ?? "").slice(0, 300),
    bio: String(body.bio ?? "").slice(0, 500),
  };

  const profileText = [
    `名前: ${input.name}`,
    input.job ? `職業/肩書き: ${input.job}` : null,
    input.hobbies ? `趣味: ${input.hobbies}` : null,
    input.selfpr ? `自己PR: ${input.selfpr}` : null,
    input.bio ? `SNSプロフィール文: ${input.bio}` : null,
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

  await kv.set(`roast:${id}`, result, { ex: 60 * 60 * 24 * 30 }); // 30 days

  return NextResponse.json({ id });
}
