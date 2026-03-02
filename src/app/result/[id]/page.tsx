import { kv } from "@vercel/kv";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { RoastResult } from "@/types";
import { ShareButtons } from "@/components/ShareButtons";
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
    <main className="min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-2">
            <span className="text-3xl font-black text-orange-400 tracking-tight">//</span>
          </div>
          <h1 className="text-2xl font-black text-white">
            {result.input.name}さんへのロースト
          </h1>
        </div>

        {/* Result Card */}
        <div
          id="roast-card"
          className="bg-white/5 rounded-xl p-8 mb-6 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded bg-orange-500/20 flex items-center justify-center shrink-0">
              <span className="text-orange-400 font-black text-sm">#</span>
            </div>
            <div>
              <p className="font-black text-xl text-white">
                {result.input.name}
              </p>
              {result.input.job && (
                <p className="text-sm text-white/60">{result.input.job}</p>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {lines.map((line, i) => (
              <p
                key={i}
                className="text-white/90 leading-relaxed text-base border-l-4 border-orange-400/60 pl-4"
              >
                {line}
              </p>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
            <span className="text-xs text-white/40">by AI ROAST</span>
            <span className="text-xs text-white/40">roast.ezoai.jp</span>
          </div>
        </div>

        <ShareButtons shareUrl={shareUrl} shareText={shareText} name={result.input.name} />

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-orange-500 text-white font-bold px-8 py-3 rounded-lg hover:bg-orange-600 transition-all duration-200 cursor-pointer"
          >
            自分もローストされる
          </Link>
        </div>
      </div>
    </main>
  );
}
