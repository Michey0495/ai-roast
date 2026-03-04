"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

interface FeedItem {
  id: string;
  name: string;
  job: string;
  roast: string;
  createdAt: string;
  likes: number;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}秒前`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}分前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}時間前`;
  const days = Math.floor(hours / 24);
  return `${days}日前`;
}

export function FeedList({ initialItems, initialNextCursor }: {
  initialItems: FeedItem[];
  initialNextCursor: number | null;
}) {
  const [items, setItems] = useState(initialItems);
  const [nextCursor, setNextCursor] = useState(initialNextCursor);
  const [sort, setSort] = useState<"new" | "popular">("new");
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  const fetchMore = useCallback(async (cursor: number, sortMode: string, replace = false) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/feed?cursor=${cursor}&limit=20&sort=${sortMode}`);
      const data = await res.json();
      if (replace) {
        setItems(data.items);
      } else {
        setItems((prev) => [...prev, ...data.items]);
      }
      setNextCursor(data.nextCursor);
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMore(0, sort, true);
  }, [sort, fetchMore]);

  useEffect(() => {
    const el = observerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && nextCursor !== null && !loading) {
          fetchMore(nextCursor, sort);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [nextCursor, loading, sort, fetchMore]);

  return (
    <div>
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setSort("new")}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
            sort === "new" ? "bg-white/10 text-white" : "text-white/40 hover:text-white/60"
          }`}
        >
          新着
        </button>
        <button
          onClick={() => setSort("popular")}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
            sort === "popular" ? "bg-white/10 text-white" : "text-white/40 hover:text-white/60"
          }`}
        >
          人気
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/result/${item.id}`}
            className="block bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-white font-bold">{item.name}</p>
                {item.job && (
                  <p className="text-white/40 text-xs mt-0.5">{item.job}</p>
                )}
              </div>
              <span className="text-white/30 text-xs ml-4 shrink-0">
                {timeAgo(item.createdAt)}
              </span>
            </div>
            <p className="text-white/60 text-sm line-clamp-3">{item.roast}</p>
            {item.likes > 0 && (
              <p className="text-white/30 text-xs mt-2">+ {item.likes}</p>
            )}
          </Link>
        ))}
      </div>

      <div ref={observerRef} className="py-8 text-center">
        {loading && <p className="text-white/30 text-sm">読み込み中...</p>}
      </div>
    </div>
  );
}
