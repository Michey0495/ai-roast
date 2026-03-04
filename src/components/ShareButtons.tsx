"use client";

import { toast } from "sonner";

type Props = {
  shareUrl: string;
  shareText: string;
  name: string;
};

export function ShareButtons({ shareUrl, shareText, name }: Props) {
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    toast.success("リンクをコピーしました");
  };

  return (
    <div className="space-y-3">
      <p className="text-center text-sm text-white/40">
        {name}さんのロースト結果をシェア
      </p>
      <div className="flex gap-3">
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-white/10 text-white font-medium px-4 py-2.5 rounded-lg text-center text-sm hover:bg-white/20 transition-all duration-200 cursor-pointer"
        >
          X (Twitter) でシェア
        </a>
        <button
          onClick={copyLink}
          className="flex-1 bg-white/5 text-white/70 font-medium px-4 py-2.5 rounded-lg text-sm border border-white/10 hover:bg-white/10 transition-all duration-200 cursor-pointer"
        >
          リンクをコピー
        </button>
      </div>
    </div>
  );
}
