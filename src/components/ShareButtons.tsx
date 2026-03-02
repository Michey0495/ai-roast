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
    toast.success("リンクをコピーしました！");
  };

  return (
    <div className="space-y-3">
      <p className="text-center text-sm font-bold text-white/60">
        {name}さんのロースト結果をシェアしよう
      </p>
      <div className="flex gap-3">
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white font-bold py-3 rounded-lg hover:bg-white/10 transition-all duration-200 cursor-pointer"
        >
          <span>Xでシェア</span>
        </a>
        <button
          onClick={copyLink}
          className="flex-1 flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white font-bold py-3 rounded-lg hover:bg-white/10 transition-all duration-200 cursor-pointer"
        >
          リンクをコピー
        </button>
      </div>
    </div>
  );
}
