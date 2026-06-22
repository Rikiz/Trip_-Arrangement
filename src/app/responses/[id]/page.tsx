"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Copy, Users, ArrowRight, RefreshCw, Sparkles } from "lucide-react";
import type { Trip, Response } from "@/lib/types";
import {
  PURPOSE_LABELS,
  BUDGET_LABELS,
  PACE_LABELS,
  CHRONOTYPE_LABELS,
  PHYSICAL_LABELS,
  DIETARY_LABELS,
} from "@/lib/types";

export default function ResponsesPage() {
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [tripRes, respRes] = await Promise.all([
        fetch(`/api/trips/${id}`),
        fetch(`/api/trips/${id}/responses`),
      ]);
      const tripData = await tripRes.json();
      const respData = await respRes.json();
      if (!tripData.error) setTrip(tripData);
      if (!respData.error) setResponses(respData);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [loadData]);

  const copyLink = () => {
    const url = `${window.location.origin}/survey/${id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (loading) {
    return (
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  if (!trip) {
    return (
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="text-center space-y-4">
          <p className="text-[var(--muted-foreground)]">行程不存在</p>
          <Link href="/" className="text-sm underline">返回首页</Link>
        </div>
      </main>
    );
  }

  const surveyUrl = typeof window !== "undefined" ? `${window.location.origin}/survey/${id}` : "";

  return (
    <main className="flex-1 px-6 py-10">
      <div className="max-w-xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <Link
              href="/"
              className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            >
              ← 返回首页
            </Link>
            <h1 className="font-serif text-2xl font-bold">
              {trip.creator_name} 的旅行计划
            </h1>
            <p className="text-[var(--muted-foreground)]">
              {trip.departure_city}出发 · {trip.total_days}天
              {trip.destinations.length > 0 &&
                ` · 候选: ${trip.destinations.join("、")}`}
            </p>
          </div>
          <button
            onClick={loadData}
            className="p-2 rounded-lg hover:bg-[var(--muted)] transition-colors"
            title="刷新"
          >
            <RefreshCw className="w-5 h-5 text-[var(--muted-foreground)]" />
          </button>
        </div>

        {/* Share Section */}
        <div className="p-5 rounded-2xl bg-[var(--accent)]/5 border border-[var(--accent)]/20 space-y-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[var(--accent)]" />
            <span className="font-medium">
              已收集 {responses.length} 份回答
            </span>
          </div>
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={surveyUrl}
              className="flex-1 px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--card)] text-sm text-[var(--muted-foreground)]"
            />
            <button
              onClick={copyLink}
              className="px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity flex-shrink-0"
            >
              {copied ? "已复制" : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-xs text-[var(--muted-foreground)]">
            复制链接发送到微信群，朋友们就能填写问卷
          </p>
        </div>

        {/* Responses */}
        {responses.length > 0 ? (
          <div className="space-y-4">
            <h2 className="font-serif text-xl font-bold flex items-center gap-2">
              <Users className="w-5 h-5" />
              朋友们的回答
            </h2>

            {/* Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <SummaryCard
                title="旅行目的"
                data={countBy(responses, "purpose", PURPOSE_LABELS)}
              />
              <SummaryCard
                title="预算"
                data={countBy(responses, "budget", BUDGET_LABELS)}
              />
              <SummaryCard
                title="节奏偏好"
                data={countBy(responses, "pace", PACE_LABELS)}
              />
              <SummaryCard
                title="作息"
                data={countBy(responses, "chronotype", CHRONOTYPE_LABELS)}
              />
            </div>

            {/* Individual responses */}
            <details className="group">
              <summary className="cursor-pointer text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                查看每个人的详细回答 ({responses.length}人)
              </summary>
              <div className="mt-4 space-y-3">
                {responses.map((r) => (
                  <div
                    key={r.id}
                    className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)] space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{r.respondent_name}</span>
                      <span className="text-xs text-[var(--muted-foreground)]">
                        {new Date(r.created_at).toLocaleDateString("zh-CN")}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-sm text-[var(--muted-foreground)]">
                      <span>目的: {PURPOSE_LABELS[r.purpose]}</span>
                      <span>预算: {BUDGET_LABELS[r.budget]}</span>
                      <span>节奏: {PACE_LABELS[r.pace]}</span>
                      <span>作息: {CHRONOTYPE_LABELS[r.chronotype]}</span>
                    </div>
                    {r.physical_condition.length > 0 && (
                      <p className="text-xs text-[var(--muted-foreground)]">
                        体力: {r.physical_condition.map((c) => PHYSICAL_LABELS[c]).join("、")}
                      </p>
                    )}
                    {r.dietary_restrictions.length > 0 && (
                      <p className="text-xs text-[var(--muted-foreground)]">
                        饮食: {r.dietary_restrictions.map((d) => DIETARY_LABELS[d]).join("、")}
                      </p>
                    )}
                    {r.must_sees && (
                      <p className="text-xs text-[var(--muted-foreground)]">
                        想去: {r.must_sees}
                      </p>
                    )}
                    {r.notes && (
                      <p className="text-xs text-[var(--muted-foreground)] italic">
                        &ldquo;{r.notes}&rdquo;
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </details>
          </div>
        ) : (
          <div className="text-center py-12 space-y-3">
            <Users className="w-12 h-12 text-[var(--muted-foreground)] mx-auto opacity-30" />
            <p className="text-[var(--muted-foreground)]">还没有人填写问卷</p>
            <p className="text-sm text-[var(--muted-foreground)]">
              复制上方链接发给朋友们吧
            </p>
          </div>
        )}

        {/* Generate Recommendation */}
        {responses.length > 0 && (
          <Link
            href={`/recommend/${id}`}
            className="flex items-center justify-center gap-2 w-full px-6 py-4 rounded-xl bg-[var(--primary)] text-white font-medium text-lg hover:opacity-90 transition-all duration-200"
          >
            <Sparkles className="w-5 h-5" />
            查看行程推荐
            <ArrowRight className="w-5 h-5" />
          </Link>
        )}
      </div>
    </main>
  );
}

function countBy(
  responses: Response[],
  field: "purpose" | "budget" | "pace" | "chronotype",
  labels: Record<string, string>
) {
  const counts: Record<string, number> = {};
  for (const r of responses) {
    const val = r[field];
    const label = labels[val] || val;
    counts[label] = (counts[label] || 0) + 1;
  }
  const total = responses.length;
  return Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .map(([label, count]) => ({ label, count, pct: Math.round((count / total) * 100) }));
}

function SummaryCard({
  title,
  data,
}: {
  title: string;
  data: { label: string; count: number; pct: number }[];
}) {
  if (data.length === 0) return null;
  return (
    <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)]">
      <h3 className="text-xs font-medium text-[var(--muted-foreground)] mb-2">
        {title}
      </h3>
      <div className="space-y-1.5">
        {data.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div className="flex-1 h-2 rounded-full bg-[var(--muted)] overflow-hidden">
              <div
                className="h-full rounded-full bg-[var(--primary)] transition-all"
                style={{ width: `${item.pct}%` }}
              />
            </div>
            <span className="text-xs text-[var(--muted-foreground)] w-16 text-right">
              {item.label} ({item.count})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
