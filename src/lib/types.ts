export type TravelPurpose =
  | "relaxation"
  | "culture"
  | "nature"
  | "food"
  | "casual";

export type Budget = "budget" | "comfort" | "luxury" | "unlimited";

export type TravelPace = "intensive" | "relaxed" | "mixed";

export type Chronotype = "early_bird" | "night_owl" | "flexible";

export type PhysicalCondition = "can_walk_all_day" | "can_hike" | "light_only" | "needs_nap";

export type DietaryRestriction = "none" | "vegetarian" | "no_spicy" | "allergic" | "halal" | "other";

export interface Trip {
  id: string;
  creator_name: string;
  departure_city: string;
  total_days: number;
  destinations: string[];
  notes: string | null;
  created_at: string;
}

export interface Response {
  id: string;
  trip_id: string;
  respondent_name: string;
  purpose: TravelPurpose;
  budget: Budget;
  pace: TravelPace;
  physical_condition: PhysicalCondition[];
  dietary_restrictions: DietaryRestriction[];
  chronotype: Chronotype;
  must_sees: string;
  notes: string;
  created_at: string;
}

export interface Recommendation {
  id: string;
  trip_id: string;
  draft: RecommendationDraft;
  status: "draft" | "approved" | "sent";
  created_at: string;
}

export interface RecommendationDraft {
  suggested_destination: string;
  match_score: number;
  summary: string;
  daily_itinerary: DayPlan[];
  considerations: string[];
  alternative_destinations: string[];
}

export interface DayPlan {
  day: number;
  theme: string;
  morning: Activity[];
  afternoon: Activity[];
  evening: Activity | null;
}

export interface Activity {
  name: string;
  duration_hours: number;
  notes: string;
}

export interface CreateTripInput {
  creator_name: string;
  departure_city: string;
  total_days: number;
  destinations: string[];
  notes?: string;
}

export interface SubmitResponseInput {
  trip_id: string;
  respondent_name: string;
  purpose: TravelPurpose;
  budget: Budget;
  pace: TravelPace;
  physical_condition: PhysicalCondition[];
  dietary_restrictions: DietaryRestriction[];
  chronotype: Chronotype;
  must_sees: string;
  notes?: string;
}

export interface AggregatedPreferences {
  purposes: Record<TravelPurpose, number>;
  budgets: Record<Budget, number>;
  paces: Record<TravelPace, number>;
  physical_conditions: Record<PhysicalCondition, number>;
  dietary_restrictions: Record<DietaryRestriction, number>;
  chronotypes: Record<Chronotype, number>;
  all_must_sees: string[];
  respondent_count: number;
}

// Display labels
export const PURPOSE_LABELS: Record<TravelPurpose, string> = {
  relaxation: "放松度假",
  culture: "文化历史",
  nature: "自然探险",
  food: "美食之旅",
  casual: "随意走走",
};

export const BUDGET_LABELS: Record<Budget, string> = {
  budget: "穷游省钱",
  comfort: "舒适为主",
  luxury: "轻奢享受",
  unlimited: "预算不限",
};

export const PACE_LABELS: Record<TravelPace, string> = {
  intensive: "特种兵式·打卡狂魔",
  relaxed: "慢节奏·深度漫游",
  mixed: "有紧有松·灵活安排",
};

export const CHRONOTYPE_LABELS: Record<Chronotype, string> = {
  early_bird: "早起鸟",
  night_owl: "夜猫子",
  flexible: "无所谓",
};

export const PHYSICAL_LABELS: Record<PhysicalCondition, string> = {
  can_walk_all_day: "能暴走一天",
  can_hike: "可以爬山徒步",
  light_only: "轻松为主·怕累",
  needs_nap: "需要午休",
};

export const DIETARY_LABELS: Record<DietaryRestriction, string> = {
  none: "无限制·什么都吃",
  vegetarian: "素食",
  no_spicy: "不吃辣",
  allergic: "有过敏源",
  halal: "清真",
  other: "其它限制",
};
