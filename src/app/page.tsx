import Link from "next/link";
import { RoastForm } from "@/components/RoastForm";
import { RecentRoasts } from "@/components/RecentRoasts";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black">
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(249,115,22,0.3),transparent)]" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px] animate-[float_8s_ease-in-out_infinite]" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-orange-400/5 rounded-full blur-[100px] animate-[float-reverse_12s_ease-in-out_infinite]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>
        <div className="relative text-center px-4 animate-[fade-in-up_0.8s_ease-out]">
          <p className="text-orange-400 text-sm font-bold tracking-widest mb-3">
            {"// AI ROAST"}
          </p>
          <h1 className="text-3xl font-black text-white mb-2">
            AI ロースト
          </h1>
          <p className="text-white/70 text-lg">
            あなたのプロフィールをAIが
            <span className="text-orange-400 font-bold">愛のある毒舌</span>
            でツッコみます
          </p>
          <p className="text-sm text-white/40 mt-1">
            ※ 笑えるツッコミです。傷つけるものではありません
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
      </section>

      <div className="max-w-2xl mx-auto px-4 pb-12">
        <RoastForm />

        {/* Recent Roasts */}
        <div className="mt-12 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">最近のロースト</h2>
            <Link
              href="/gallery"
              className="text-sm text-red-500 hover:text-red-400 transition-colors cursor-pointer"
            >
              すべて見る
            </Link>
          </div>
          <RecentRoasts />
        </div>

        <footer className="text-center mt-12 text-xs text-white/30">
          <p>Powered by AI | &copy; 2026 AIロースト</p>
        </footer>
      </div>
    </main>
  );
}
