"use client";

import { useState } from "react";

/**
 * フィードバックウィジェット - 全アプリに埋め込む
 * ユーザーからのフィードバックを GitHub Issues に自動投稿
 */
export function FeedbackWidget({ repoName }: { repoName: string }) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"bug" | "feature" | "other">("bug");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const submit = async () => {
    if (!message.trim()) return;
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, message, repo: repoName }),
      });
      setSent(true);
      setTimeout(() => {
        setOpen(false);
        setSent(false);
        setMessage("");
      }, 2000);
    } catch {
      alert("送信に失敗しました");
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors text-sm z-50"
      >
        フィードバック
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white border border-gray-200 rounded-xl shadow-2xl p-4 z-50">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-gray-800">フィードバック</h3>
        <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">&times;</button>
      </div>
      {sent ? (
        <p className="text-green-600 text-center py-4">送信しました！ありがとうございます</p>
      ) : (
        <>
          <div className="flex gap-2 mb-3">
            {(["bug", "feature", "other"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-3 py-1 rounded-full text-xs ${
                  type === t ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
                }`}
              >
                {t === "bug" ? "不具合" : t === "feature" ? "要望" : "その他"}
              </button>
            ))}
          </div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="ご意見をお聞かせください..."
            className="w-full border border-gray-200 rounded-lg p-2 text-sm h-24 resize-none mb-3"
          />
          <button
            onClick={submit}
            className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700"
          >
            送信
          </button>
        </>
      )}
    </div>
  );
}
