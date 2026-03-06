"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-8 space-y-5">
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">
          名前 <span className="text-red-500">*</span>
        </label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="例：田中太郎"
          maxLength={50}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">
          職業 / 肩書き
        </label>
        <input
          name="job"
          value={form.job}
          onChange={handleChange}
          placeholder="例：フリーランスエンジニア、会社員（営業）など"
          maxLength={100}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">
          趣味
        </label>
        <input
          name="hobbies"
          value={form.hobbies}
          onChange={handleChange}
          placeholder="例：筋トレ、アニメ鑑賞、読書、カフェ巡り"
          maxLength={200}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">
          自己PR
        </label>
        <Textarea
          name="selfpr"
          value={form.selfpr}
          onChange={handleChange}
          placeholder="例：誰よりも努力家です。毎朝5時起きでジムに行き…"
          maxLength={300}
          rows={3}
          className="resize-none rounded-xl focus:ring-orange-300"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">
          SNSプロフィール文 / 一言
        </label>
        <Textarea
          name="bio"
          value={form.bio}
          onChange={handleChange}
          placeholder="例：「好きな人と好きなことを好きなだけ」がモットー。夢は世界一周。"
          maxLength={500}
          rows={3}
          className="resize-none rounded-xl focus:ring-orange-300"
        />
      </div>

      <Button
        type="submit"
        disabled={loading || !form.name.trim()}
        className="w-full h-14 text-base font-black rounded-xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:opacity-50"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <Spinner size="sm" />
            AIがロースト中...
          </span>
        ) : (
          "ロースト される"
        )}
      </Button>
    </form>
  );
}
