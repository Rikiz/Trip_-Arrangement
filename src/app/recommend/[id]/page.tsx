"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  RefreshCw,
  Calendar,
  Sun,
  Moon,
  AlertTriangle,
  ThumbsUp,
  ChevronDown,
} from "lucide-react";
import type { Trip, RecommendationDraft } from "@/lib/types";

export default function RecommendPage() {
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [recommendation, setRecommendation] = useState<{
    draft: RecommendationDraft;
    status: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set([1]));

  const loadData = useCallback(async () => {
    try {
      const [tripRes, recRes] = await Promise.all([
        fetch(`/api/trips/${id}`),
        fetch(`/api/trips/${id}/recommend`),
      ]);
      const tripData = await tripRes.json();
      const recData = await recRes.json();
      if (!tripData.error) setTrip(tripData);
      if (!recData.error) setRecommendation(recData);
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

  const generateRecommendation = async () => {
    setGenerating(true);
    setError("");
    try {
      const res = await fetch(`/api/trips/${id}/recommend`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "生成失败");
      setRecommendation(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "生成失败");
    } finally {
      setGenerating(false);
    }
  };

  const toggleDay = (day: number) => {
    const next = new Set(expandedDays);
    if (next.has(day)) next.delete(day);
    else next.add(day);
    setExpandedDays(next);
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

  return (
    <main className="flex-1 px-6 py-10">
      <div className="max-w-xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-1">
          <Link
            href={`/responses/${id}`}
            className="inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回回答汇总
          </Link>
          <h1 className="font-serif text-3xl font-bold">行程推荐</h1>
          <p className="text-[var(--muted-foreground)]">
            {trip.departure_city}出发 · {trip.total_days}天
          </p>
        </div>

        {/* No recommendation yet */}
        {!recommendation && (
          <div className="text-center py-16 space-y-6">
            <Sparkles className="w-16 h-16 text-[var(--primary)] mx-auto opacity-50" />
            <div className="space-y-2">
              <h2 className="font-serif text-xl font-bold">还没有生成推荐</h2>
              <p className="text-[var(--muted-foreground)]">
                确认朋友们都已填写问卷后，点击下方按钮生成推荐。
              </p>
            </div>
            <button
              onClick={generateRecommendation}
              disabled={generating}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[var(--primary)] text-white font-medium text-lg hover:opacity-90 transition-all duration-200 disabled:opacity-50"
            >
              {generating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  分析偏好中...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  生成推荐
                </>
              )}
            </button>
          </div>
        )}

        {error && (
          <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Recommendation Result */}
        {recommendation && (
          <div className="space-y-8">
            {/* Top Result */}
            <div className="p-6 rounded-2xl border-2 border-[var(--primary)] bg-[var(--primary)]/5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[var(--primary)]">
                  推荐目的地
                </span>
                <span className="px-3 py-1 rounded-full bg-[var(--primary)]/20 text-[var(--primary)] text-sm font-medium">
                  匹配度 {recommendation.draft.match_score}%
                </span>
              </div>
              <h2 className="font-serif text-4xl font-bold">
                {recommendation.draft.suggested_destination}
              </h2>
              <p className="text-[var(--muted-foreground)] leading-relaxed">
                {recommendation.draft.summary}
              </p>
            </div>

            {/* Alternative Destinations */}
            {recommendation.draft.alternative_destinations.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                <span>备选方案：</span>
                {recommendation.draft.alternative_destinations.map((d, i) => (
                  <span
                    key={d}
                    className="px-2.5 py-1 rounded-full bg-[var(--muted)]"
                  >
                    {d}
                    {i < recommendation.draft.alternative_destinations.length - 1
                      ? ""
                      : ""}
                  </span>
                ))}
              </div>
            )}

            {/* Daily Itinerary */}
            <div className="space-y-3">
              <h3 className="font-serif text-xl font-bold flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                每日行程
              </h3>

              {recommendation.draft.daily_itinerary.map((day) => {
                const isExpanded = expandedDays.has(day.day);
                return (
                  <div
                    key={day.day}
                    className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden"
                  >
                    <button
                      onClick={() => toggleDay(day.day)}
                      className="w-full flex items-center justify-between p-4 hover:bg-[var(--muted)]/50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-serif text-2xl font-bold text-[var(--primary)]">
                          {day.day}
                        </span>
                        <div>
                          <span className="font-medium">{day.theme}</span>
                          <span className="text-xs text-[var(--muted-foreground)] ml-2">
                            {day.morning.length + day.afternoon.length}
                            {day.evening ? " + 晚间" : ""} 个活动
                          </span>
                        </div>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-[var(--muted-foreground)] transition-transform duration-200 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-4 space-y-2 border-t border-[var(--border)] pt-3">
                        {/* Morning */}
                        <div className="flex gap-3">
                          <div className="flex flex-col items-center gap-1 pt-1">
                            <Sun className="w-4 h-4 text-amber-500 flex-shrink-0" />
                            <div className="w-px flex-1 bg-[var(--border)]" />
                          </div>
                          <div className="flex-1 space-y-2 pb-1">
                            {day.morning.map((a, i) => (
                              <div key={i} className="space-y-1">
                                <p className="font-medium text-sm">{a.name}</p>
                                <p className="text-xs text-[var(--muted-foreground)]">
                                  {a.duration_hours}h · {a.notes}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Afternoon */}
                        <div className="flex gap-3">
                          <div className="flex flex-col items-center gap-1 pt-1">
                            <Sun className="w-4 h-4 text-orange-400 flex-shrink-0" />
                            <div className="w-px flex-1 bg-[var(--border)]" />
                          </div>
                          <div className="flex-1 space-y-2 pb-1">
                            {day.afternoon.map((a, i) => (
                              <div key={i} className="space-y-1">
                                <p className="font-medium text-sm">{a.name}</p>
                                <p className="text-xs text-[var(--muted-foreground)]">
                                  {a.duration_hours}h · {a.notes}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Evening */}
                        {day.evening && (
                          <div className="flex gap-3">
                            <div className="flex flex-col items-center gap-1 pt-1">
                              <Moon className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                            </div>
                            <div className="flex-1 space-y-2 pb-1">
                              <div className="space-y-1">
                                <p className="font-medium text-sm">
                                  {day.evening.name}
                                </p>
                                <p className="text-xs text-[var(--muted-foreground)]">
                                  {day.evening.duration_hours}h ·{" "}
                                  {day.evening.notes}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Considerations */}
            {recommendation.draft.considerations.length > 0 && (
              <div className="p-5 rounded-xl bg-amber-50 border border-amber-200 space-y-3">
                <h3 className="font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  注意事项
                </h3>
                <ul className="space-y-1.5">
                  {recommendation.draft.considerations.map((c, i) => (
                    <li
                      key={i}
                      className="text-sm text-amber-800 flex items-start gap-2"
                    >
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-amber-400 flex-shrink-0" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={generateRecommendation}
                disabled={generating}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-[var(--border)] hover:border-[var(--primary)]/50 transition-all duration-200 disabled:opacity-50"
              >
                {generating ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                重新生成
              </button>
              <Link
                href={`/responses/${id}`}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[var(--foreground)] text-[var(--background)] font-medium hover:opacity-90 transition-all duration-200"
              >
                <ThumbsUp className="w-4 h-4" />
                回到汇总
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
