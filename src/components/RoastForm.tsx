"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Spinner } from "@/components/spell/Spinner";

export function RoastForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    job: "",
    hobbies: "",
    selfpr: "",
    bio: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("名前を入力してください");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "エラーが発生しました");
        return;
      }
      router.push(`/result/${data.id}`);
    } catch {
      toast.error("ネットワークエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/5 rounded-xl border border-white/10 p-6 space-y-5">
      <div>
        <label className="block text-sm font-medium text-white/70 mb-1.5">
          名前 <span className="text-orange-400">*</span>
        </label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="例：田中太郎"
          maxLength={50}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-orange-400/50 transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white/70 mb-1.5">
          職業 / 肩書き
        </label>
        <input
          name="job"
          value={form.job}
          onChange={handleChange}
          placeholder="例：フリーランスエンジニア、会社員（営業）など"
          maxLength={100}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-orange-400/50 transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white/70 mb-1.5">
          趣味
        </label>
        <input
          name="hobbies"
          value={form.hobbies}
          onChange={handleChange}
          placeholder="例：筋トレ、アニメ鑑賞、読書、カフェ巡り"
          maxLength={200}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-orange-400/50 transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white/70 mb-1.5">
          自己PR
        </label>
        <textarea
          name="selfpr"
          value={form.selfpr}
          onChange={handleChange}
          placeholder="例：誰よりも努力家です。毎朝5時起きでジムに行き..."
          maxLength={300}
          rows={3}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-orange-400/50 transition-colors resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white/70 mb-1.5">
          SNSプロフィール文 / 一言
        </label>
        <textarea
          name="bio"
          value={form.bio}
          onChange={handleChange}
          placeholder="例：「好きな人と好きなことを好きなだけ」がモットー。夢は世界一周。"
          maxLength={500}
          rows={3}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-orange-400/50 transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading || !form.name.trim()}
        className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-lg text-base hover:from-orange-600 hover:to-red-600 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Spinner size="sm" />
            AIがロースト中...
          </span>
        ) : (
          "ロースト される"
        )}
      </button>
    </form>
  );
}
