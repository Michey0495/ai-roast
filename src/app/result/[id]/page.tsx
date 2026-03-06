import { kv } from "@vercel/kv";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { RoastResult } from "@/types";
import { ShareButtons } from "@/components/ShareButtons";
import { LikeButton } from "@/components/LikeButton";
import Link from "next/link";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const result = await kv.get<RoastResult>(`roast:${id}`);
  if (!result) return { title: "結果が見つかりません" };

  const title = `${result.input.name}さんへのAIロースト`;
  const desc = result.roast.slice(0, 100) + "...";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://roast.ezoai.jp";

  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      url: `${siteUrl}/result/${id}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
    },
  };
}

export default async function ResultPage({ params }: Props) {
  const { id } = await params;
  const result = await kv.get<RoastResult>(`roast:${id}`);
  if (!result) notFound();

  const lines = result.roast.split("\n").filter((l) => l.trim());
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://roast.ezoai.jp";
  const shareUrl = `${siteUrl}/result/${id}`;
  const shareText = `AIにロースト（毒舌ツッコミ）されました\n\n${result.roast.slice(0, 80)}...\n\nあなたもやってみる`;

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <p className="text-orange-400 text-sm font-bold mb-2">{"// ROAST"}</p>
          <h1 className="text-2xl font-black text-white">
            {result.input.name}さんへのロースト
          </h1>
        </div>

        <div
          id="roast-card"
          className="bg-white/5 rounded-xl border border-white/10 p-8 mb-6"
        >
          <div className="mb-6">
            <p className="font-black text-xl text-white">
              {result.input.name}
            </p>
            {result.input.job && (
              <p className="text-sm text-white/40 mt-1">{result.input.job}</p>
            )}
          </div>

          <div className="space-y-3">
            {lines.map((line, i) => (
              <p
                key={i}
                className="text-white/70 leading-relaxed text-base border-l-4 border-orange-500/50 pl-4"
              >
                {line}
              </p>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
            <span className="text-xs text-white/30">by AIロースト</span>
            <span className="text-xs text-white/20">roast.ezoai.jp</span>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <LikeButton id={id} />
        </div>

        <ShareButtons shareUrl={shareUrl} shareText={shareText} name={result.input.name} />

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-block bg-orange-500 text-black font-bold px-8 py-3 rounded-lg hover:bg-orange-400 transition-all duration-200 cursor-pointer"
          >
            自分もローストされる
          </Link>
        </div>
      </div>
    </div>
  );
}
