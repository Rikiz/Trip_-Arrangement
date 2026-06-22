"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, X, Send } from "lucide-react";

export default function CreatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [destinations, setDestinations] = useState<string[]>([]);
  const [destInput, setDestInput] = useState("");

  const [form, setForm] = useState({
    creator_name: "",
    departure_city: "",
    total_days: 5,
    notes: "",
  });

  const addDestination = () => {
    const trimmed = destInput.trim();
    if (trimmed && !destinations.includes(trimmed)) {
      setDestinations([...destinations, trimmed]);
      setDestInput("");
    }
  };

  const removeDestination = (d: string) => {
    setDestinations(destinations.filter((x) => x !== d));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          destinations,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "创建失败");
      }

      const trip = await res.json();
      router.push(`/responses/${trip.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "未知错误");
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 px-6 py-10">
      <div className="max-w-lg mx-auto">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          返回首页
        </Link>

        {/* Header */}
        <div className="mb-10">
          <h1 className="font-serif text-3xl font-bold mb-3">设定行程框架</h1>
          <p className="text-[var(--muted-foreground)] leading-relaxed">
            填写你的出行计划。创建完成后你会获得一个分享链接，发给朋友们填写偏好。
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Your Name */}
          <div>
            <label className="block text-sm font-medium mb-2">
              你的名字 <span className="text-[var(--destructive)]">*</span>
            </label>
            <input
              type="text"
              required
              value={form.creator_name}
              onChange={(e) =>
                setForm({ ...form, creator_name: e.target.value })
              }
              placeholder="例如：小明"
              className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--card)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] transition-all"
            />
          </div>

          {/* Departure City */}
          <div>
            <label className="block text-sm font-medium mb-2">
              出发城市 <span className="text-[var(--destructive)]">*</span>
            </label>
            <input
              type="text"
              required
              value={form.departure_city}
              onChange={(e) =>
                setForm({ ...form, departure_city: e.target.value })
              }
              placeholder="例如：上海"
              className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--card)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] transition-all"
            />
          </div>

          {/* Total Days */}
          <div>
            <label className="block text-sm font-medium mb-2">
              旅行天数 <span className="text-[var(--destructive)]">*</span>
            </label>
            <input
              type="number"
              required
              min={1}
              max={30}
              value={form.total_days}
              onChange={(e) =>
                setForm({ ...form, total_days: Number(e.target.value) })
              }
              className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--card)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] transition-all"
            />
          </div>

          {/* Destinations */}
          <div>
            <label className="block text-sm font-medium mb-2">
              候选目的地（选填，不填则系统自动推荐）
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={destInput}
                onChange={(e) => setDestInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addDestination())}
                placeholder="输入目的地后按回车或点击添加"
                className="flex-1 px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--card)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] transition-all"
              />
              <button
                type="button"
                onClick={addDestination}
                className="px-4 py-3 rounded-xl bg-[var(--muted)] hover:bg-[var(--border)] transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            {destinations.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {destinations.map((d) => (
                  <span
                    key={d}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-sm"
                  >
                    {d}
                    <button
                      type="button"
                      onClick={() => removeDestination(d)}
                      className="hover:text-[var(--destructive)] transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium mb-2">
              补充说明（选填）
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="例如：这次想去海边、避开暑假高峰期、有老人同行需要无障碍设施..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--card)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] transition-all resize-none"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[var(--foreground)] text-[var(--background)] font-medium text-lg hover:opacity-90 transition-all duration-200 disabled:opacity-50"
          >
            {loading ? (
              <span className="animate-pulse">创建中...</span>
            ) : (
              <>
                <Send className="w-5 h-5" />
                创建行程 & 获取分享链接
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
