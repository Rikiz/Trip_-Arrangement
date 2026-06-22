"use client";

import type {
  TravelPurpose,
  Budget,
  TravelPace,
  Chronotype,
  PhysicalCondition,
  DietaryRestriction,
} from "@/lib/types";
import {
  PURPOSE_LABELS,
  BUDGET_LABELS,
  PACE_LABELS,
  CHRONOTYPE_LABELS,
  PHYSICAL_LABELS,
  DIETARY_LABELS,
} from "@/lib/types";
import { useState } from "react";
import { Send } from "lucide-react";

const ALL_PURPOSES = Object.keys(PURPOSE_LABELS) as TravelPurpose[];
const ALL_BUDGETS = Object.keys(BUDGET_LABELS) as Budget[];
const ALL_PACES = Object.keys(PACE_LABELS) as TravelPace[];
const ALL_CHRONOTYPES = Object.keys(CHRONOTYPE_LABELS) as Chronotype[];
const ALL_PHYSICAL = Object.keys(PHYSICAL_LABELS) as PhysicalCondition[];
const ALL_DIETARY = Object.keys(DIETARY_LABELS) as DietaryRestriction[];

interface SurveyFormProps {
  tripId: string;
  onSubmitSuccess: () => void;
}

export default function SurveyForm({ tripId, onSubmitSuccess }: SurveyFormProps) {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [purpose, setPurpose] = useState<TravelPurpose | null>(null);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [pace, setPace] = useState<TravelPace | null>(null);
  const [physical, setPhysical] = useState<PhysicalCondition[]>([]);
  const [dietary, setDietary] = useState<DietaryRestriction[]>([]);
  const [chronotype, setChronotype] = useState<Chronotype | null>(null);
  const [mustSees, setMustSees] = useState("");
  const [notes, setNotes] = useState("");

  const totalSteps = 8;

  const toggleArray = <T,>(arr: T[], item: T): T[] =>
    arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];

  const canProceed = (): boolean => {
    switch (step) {
      case 0: return name.trim().length > 0;
      case 1: return purpose !== null;
      case 2: return budget !== null;
      case 3: return pace !== null;
      case 4: return true;
      case 5: return true;
      case 6: return chronotype !== null;
      case 7: return true;
      default: return true;
    }
  };

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    }
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`/api/trips/${tripId}/responses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          respondent_name: name,
          purpose,
          budget,
          pace,
          physical_condition: physical,
          dietary_restrictions: dietary,
          chronotype,
          must_sees: mustSees,
          notes,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "提交失败");
      }

      onSubmitSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "提交失败，请重试");
      setLoading(false);
    }
  };

  const progressPercent = ((step + 1) / totalSteps) * 100;

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-[var(--muted-foreground)]">
          <span>
            第 {step + 1} / {totalSteps} 步
          </span>
          <span>{Math.round(progressPercent)}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-[var(--muted)] overflow-hidden">
          <div
            className="h-full rounded-full bg-[var(--primary)] transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Step 0: Name */}
      {step === 0 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
          <h2 className="font-serif text-2xl font-bold">你好，先告诉我你的名字</h2>
          <p className="text-sm text-[var(--muted-foreground)]">
            让发起人知道这份偏好是谁填的
          </p>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="你的昵称或名字"
            className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--card)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] transition-all text-lg"
            autoFocus
            onKeyDown={(e) => e.key === "Enter" && canProceed() && handleNext()}
          />
        </div>
      )}

      {/* Step 1: Purpose */}
      {step === 1 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
          <h2 className="font-serif text-2xl font-bold">这次旅行你最想实现什么？</h2>
          <p className="text-sm text-[var(--muted-foreground)]">单选</p>
          <div className="grid gap-2">
            {ALL_PURPOSES.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPurpose(p)}
                className={`w-full text-left px-5 py-4 rounded-xl border transition-all duration-200 ${
                  purpose === p
                    ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)] font-medium"
                    : "border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)]/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      purpose === p
                        ? "border-[var(--primary)]"
                        : "border-[var(--border)]"
                    }`}
                  >
                    {purpose === p && (
                      <span className="w-2.5 h-2.5 rounded-full bg-[var(--primary)]" />
                    )}
                  </span>
                  <span>{PURPOSE_LABELS[p]}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Budget */}
      {step === 2 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
          <h2 className="font-serif text-2xl font-bold">你的预算范围？</h2>
          <p className="text-sm text-[var(--muted-foreground)]">单选</p>
          <div className="grid gap-2">
            {ALL_BUDGETS.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setBudget(b)}
                className={`w-full text-left px-5 py-4 rounded-xl border transition-all duration-200 ${
                  budget === b
                    ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)] font-medium"
                    : "border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)]/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      budget === b
                        ? "border-[var(--primary)]"
                        : "border-[var(--border)]"
                    }`}
                  >
                    {budget === b && (
                      <span className="w-2.5 h-2.5 rounded-full bg-[var(--primary)]" />
                    )}
                  </span>
                  <span>{BUDGET_LABELS[b]}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Pace */}
      {step === 3 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
          <h2 className="font-serif text-2xl font-bold">你偏好的旅行节奏？</h2>
          <p className="text-sm text-[var(--muted-foreground)]">单选</p>
          <div className="grid gap-2">
            {ALL_PACES.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPace(p)}
                className={`w-full text-left px-5 py-4 rounded-xl border transition-all duration-200 ${
                  pace === p
                    ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)] font-medium"
                    : "border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)]/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      pace === p
                        ? "border-[var(--primary)]"
                        : "border-[var(--border)]"
                    }`}
                  >
                    {pace === p && (
                      <span className="w-2.5 h-2.5 rounded-full bg-[var(--primary)]" />
                    )}
                  </span>
                  <span>{PACE_LABELS[p]}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Physical Condition */}
      {step === 4 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
          <h2 className="font-serif text-2xl font-bold">你的体力情况？</h2>
          <p className="text-sm text-[var(--muted-foreground)]">可多选</p>
          <div className="grid gap-2">
            {ALL_PHYSICAL.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPhysical(toggleArray(physical, p))}
                className={`w-full text-left px-5 py-4 rounded-xl border transition-all duration-200 ${
                  physical.includes(p)
                    ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)] font-medium"
                    : "border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)]/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      physical.includes(p)
                        ? "border-[var(--primary)] bg-[var(--primary)]"
                        : "border-[var(--border)]"
                    }`}
                  >
                    {physical.includes(p) && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </span>
                  <span>{PHYSICAL_LABELS[p]}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 5: Dietary */}
      {step === 5 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
          <h2 className="font-serif text-2xl font-bold">饮食限制或偏好？</h2>
          <p className="text-sm text-[var(--muted-foreground)]">可多选</p>
          <div className="grid gap-2">
            {ALL_DIETARY.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDietary(toggleArray(dietary, d))}
                className={`w-full text-left px-5 py-4 rounded-xl border transition-all duration-200 ${
                  dietary.includes(d)
                    ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)] font-medium"
                    : "border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)]/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      dietary.includes(d)
                        ? "border-[var(--primary)] bg-[var(--primary)]"
                        : "border-[var(--border)]"
                    }`}
                  >
                    {dietary.includes(d) && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </span>
                  <span>{DIETARY_LABELS[d]}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 6: Chronotype */}
      {step === 6 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
          <h2 className="font-serif text-2xl font-bold">早起型还是夜猫子？</h2>
          <p className="text-sm text-[var(--muted-foreground)]">单选</p>
          <div className="grid gap-2">
            {ALL_CHRONOTYPES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setChronotype(c)}
                className={`w-full text-left px-5 py-4 rounded-xl border transition-all duration-200 ${
                  chronotype === c
                    ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)] font-medium"
                    : "border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)]/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      chronotype === c
                        ? "border-[var(--primary)]"
                        : "border-[var(--border)]"
                    }`}
                  >
                    {chronotype === c && (
                      <span className="w-2.5 h-2.5 rounded-full bg-[var(--primary)]" />
                    )}
                  </span>
                  <span>{CHRONOTYPE_LABELS[c]}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 7: Must-sees & Notes */}
      {step === 7 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-bold">你最想去的 3-5 个地方或体验</h2>
            <textarea
              value={mustSees}
              onChange={(e) => setMustSees(e.target.value)}
              placeholder="例如：海边看日出、米其林餐厅、博物馆、爬山..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--card)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] transition-all resize-none"
            />
          </div>

          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-bold">还有什么想说的？</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="选填：特殊需求、期望、建议..."
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--card)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] transition-all resize-none"
            />
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3">
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="px-6 py-3 rounded-xl border border-[var(--border)] hover:bg-[var(--muted)] transition-colors"
          >
            上一步
          </button>
        )}

        {step < totalSteps - 1 ? (
          <button
            type="button"
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex-1 px-6 py-3 rounded-xl bg-[var(--foreground)] text-[var(--background)] font-medium hover:opacity-90 transition-all duration-200 disabled:opacity-30"
          >
            下一步
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[var(--foreground)] text-[var(--background)] font-medium hover:opacity-90 transition-all duration-200 disabled:opacity-50"
          >
            {loading ? (
              <span className="animate-pulse">提交中...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                提交偏好
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
