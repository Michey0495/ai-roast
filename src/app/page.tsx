import { RoastForm } from "@/components/RoastForm";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <span className="text-4xl font-black text-orange-400 tracking-tight">//</span>
          </div>
          <h1 className="text-3xl font-black text-white mb-2">
            AI ROAST
          </h1>
          <p className="text-white/60 text-lg">
            あなたのプロフィールをAIが
            <span className="text-orange-400 font-bold">愛のある毒舌</span>
            でツッコみます
          </p>
          <p className="text-sm text-white/40 mt-1">
            ※ 笑えるツッコミです。傷つけるものではありません
          </p>
        </div>

        <RoastForm />

        <footer className="text-center mt-12 text-xs text-white/40">
          <p>Powered by Claude AI | &copy; 2026 AI ROAST</p>
        </footer>
      </div>
    </main>
  );
}
