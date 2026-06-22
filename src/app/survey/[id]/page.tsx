"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import SurveyForm from "@/components/SurveyForm";
import { CheckCircle2 } from "lucide-react";
import type { Trip } from "@/lib/types";

export default function SurveyPage() {
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch(`/api/trips/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setTrip(data);
        }
      })
      .catch(() => setError("加载失败"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-[var(--muted-foreground)]">加载中...</p>
        </div>
      </main>
    );
  }

  if (error || !trip) {
    return (
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="text-center space-y-4">
          <p className="text-[var(--destructive)] font-medium">
            {error || "问卷不存在"}
          </p>
          <Link
            href="/"
            className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] underline"
          >
            返回首页
          </Link>
        </div>
      </main>
    );
  }

  if (submitted) {
    return (
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="text-center space-y-6 max-w-sm">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <div className="space-y-2">
            <h1 className="font-serif text-2xl font-bold">提交成功！</h1>
            <p className="text-[var(--muted-foreground)] leading-relaxed">
              你的旅行偏好已记录。
              {trip.creator_name} 会根据大家的偏好推荐一个最合适的行程。
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 px-6 py-10">
      <div className="max-w-lg mx-auto">
        {/* Trip Info Header */}
        <div className="mb-8 space-y-2">
          <p className="text-sm text-[var(--muted-foreground)]">
            {trip.creator_name} 发起的旅行计划
          </p>
          <h1 className="font-serif text-3xl font-bold">
            {trip.departure_city}出发 · {trip.total_days}天
          </h1>
          {trip.destinations.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {trip.destinations.map((d) => (
                <span
                  key={d}
                  className="px-2.5 py-0.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-xs"
                >
                  {d}
                </span>
              ))}
            </div>
          )}
          {trip.notes && (
            <p className="text-sm text-[var(--muted-foreground)] bg-[var(--muted)] px-3 py-2 rounded-lg">
              {trip.notes}
            </p>
          )}
        </div>

        {/* Survey */}
        <SurveyForm tripId={id} onSubmitSuccess={() => setSubmitted(true)} />
      </div>
    </main>
  );
}
