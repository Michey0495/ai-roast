"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface FeedItem {
  id: string;
  name: string;
  job: string;
  roast: string;
  createdAt: string;
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

export function RecentRoasts() {
  const [items, setItems] = useState<FeedItem[]>([]);

  useEffect(() => {
    fetch("/api/feed")
      .then((res) => res.json())
      .then((data) => setItems(data.slice(0, 5)))
      .catch(() => {});
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <Link
          key={item.id}
          href={`/result/${item.id}`}
          className="block bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-all duration-200 cursor-pointer"
        >
          <div className="flex items-center justify-between mb-1">
            <p className="text-white font-bold text-sm">{item.name}</p>
            <span className="text-white/30 text-xs">{timeAgo(item.createdAt)}</span>
          </div>
          <p className="text-white/50 text-xs line-clamp-2">{item.roast}</p>
        </Link>
      ))}
    </div>
  );
}
