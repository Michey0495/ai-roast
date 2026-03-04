import Link from "next/link";
import type { Metadata } from "next";
import { FeedList } from "@/components/FeedList";

export const metadata: Metadata = {
  title: "ギャラリー | AIロースト",
  description: "AIが生成した愛のあるロースト一覧",
};

async function getInitialFeed() {
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const res = await fetch(`${siteUrl}/api/feed?cursor=0&limit=20`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return { items: [], nextCursor: null };
    return await res.json();
  } catch {
    return { items: [], nextCursor: null };
  }
}

export default async function GalleryPage() {
  const { items, nextCursor } = await getInitialFeed();

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">ギャラリー</h1>
        <Link
          href="/"
          className="px-4 py-2 bg-orange-500 text-black font-bold rounded-lg text-sm hover:bg-orange-400 transition-all duration-200 cursor-pointer"
        >
          ローストする
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-white/50">まだローストがありません</p>
          <Link
            href="/"
            className="inline-block mt-4 text-orange-400 hover:text-orange-300 transition-colors cursor-pointer"
          >
            最初のローストを生成する
          </Link>
        </div>
      ) : (
        <FeedList initialItems={items} initialNextCursor={nextCursor} />
      )}
    </div>
  );
}
