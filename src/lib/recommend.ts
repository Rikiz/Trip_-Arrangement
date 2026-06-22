import type {
  Response,
  AggregatedPreferences,
  RecommendationDraft,
  DayPlan,
  TravelPurpose,
  Budget,
  TravelPace,
  PhysicalCondition,
  DietaryRestriction,
} from "./types";

// Destination profiles - maps common destination types to their characteristics
interface DestinationProfile {
  name: string;
  purposes: Partial<Record<TravelPurpose, number>>;
  budget_fit: Partial<Record<Budget, number>>;
  pace_fit: Partial<Record<TravelPace, number>>;
  physical_demand: number; // 1-5, higher = more demanding
  dietary_score: number; // 1-5, higher = more dietary-friendly
  typical_activities: string[];
}

const DESTINATION_PROFILES: DestinationProfile[] = [
  {
    name: "京都",
    purposes: { culture: 1, food: 0.8, relaxation: 0.5, casual: 0.6 },
    budget_fit: { comfort: 1, luxury: 1, budget: 0.4 },
    pace_fit: { relaxed: 1, mixed: 0.9, intensive: 0.6 },
    physical_demand: 3,
    dietary_score: 3,
    typical_activities: [
      "清水寺参拜",
      "伏见稻荷千本���居",
      "金阁寺",
      "岚山竹林",
      "祇园花见小路",
      "锦市场美食",
      "二条城",
      "银阁寺",
      "哲学之道",
      "先斗町夜游",
    ],
  },
  {
    name: "清迈",
    purposes: { relaxation: 1, food: 0.9, culture: 0.7, nature: 0.7 },
    budget_fit: { budget: 1, comfort: 0.9, luxury: 0.5 },
    pace_fit: { relaxed: 1, mixed: 0.9, intensive: 0.5 },
    physical_demand: 2,
    dietary_score: 4,
    typical_activities: [
      "素贴山双龙寺",
      "古城寺庙巡礼",
      "夜市美食",
      "大象保护区",
      "泰式按摩",
      "烹饪课程",
      "茵他侬山一日游",
      "清莱白庙",
      "周六/周日夜市",
      "宁曼路咖啡探店",
    ],
  },
  {
    name: "大理",
    purposes: { relaxation: 1, nature: 0.9, culture: 0.6, casual: 0.8 },
    budget_fit: { budget: 1, comfort: 1, luxury: 0.6 },
    pace_fit: { relaxed: 1, mixed: 0.9, intensive: 0.4 },
    physical_demand: 3,
    dietary_score: 4,
    typical_activities: [
      "洱海环湖骑行",
      "古城闲逛",
      "苍山索道",
      "喜洲古镇",
      "双廊日落",
      "周城扎染",
      "沙溪古镇",
      "崇圣寺三塔",
      "寂照庵吃斋",
      "龙龛码头看日出",
    ],
  },
  {
    name: "巴厘岛",
    purposes: { relaxation: 1, nature: 0.9, culture: 0.6, food: 0.5 },
    budget_fit: { comfort: 1, luxury: 1, budget: 0.6 },
    pace_fit: { relaxed: 1, mixed: 0.8, intensive: 0.4 },
    physical_demand: 2,
    dietary_score: 4,
    typical_activities: [
      "乌布稻田漫步",
      "海神庙日落",
      "乌鲁瓦图悬崖",
      "圣泉寺",
      "金巴兰海滩晚餐",
      "德格拉朗梯田",
      "巴厘岛SPA",
      "水上神庙",
      "库塔冲浪",
      "乌布市场",
    ],
  },
  {
    name: "东京",
    purposes: { culture: 0.9, food: 1, casual: 0.8, nature: 0.2 },
    budget_fit: { comfort: 1, luxury: 1, budget: 0.3 },
    pace_fit: { intensive: 1, mixed: 0.9, relaxed: 0.4 },
    physical_demand: 4,
    dietary_score: 4,
    typical_activities: [
      "浅草寺与雷门",
      "涩谷十字路口",
      "筑地市场",
      "明治神宫",
      "秋叶原电器街",
      "新宿御苑",
      "银座购物",
      "台场海滨公园",
      "原宿竹下通",
      "六本木夜景",
    ],
  },
  {
    name: "北海道",
    purposes: { nature: 1, food: 0.9, relaxation: 0.8, culture: 0.3 },
    budget_fit: { comfort: 1, luxury: 0.9, budget: 0.4 },
    pace_fit: { relaxed: 1, mixed: 0.8, intensive: 0.5 },
    physical_demand: 2,
    dietary_score: 3,
    typical_activities: [
      "富良野花田",
      "小樽运河",
      "函馆山百万夜景",
      "洞爷湖温泉",
      "美瑛青池",
      "札幌啤酒园",
      "登别地狱谷",
      "二世谷户外",
      "白色恋人公园",
      "海鲜市场",
    ],
  },
  {
    name: "曼谷",
    purposes: { food: 1, culture: 0.8, casual: 0.7, relaxation: 0.5 },
    budget_fit: { budget: 1, comfort: 0.9, luxury: 0.7 },
    pace_fit: { mixed: 1, intensive: 0.8, relaxed: 0.5 },
    physical_demand: 3,
    dietary_score: 3,
    typical_activities: [
      "大皇宫与玉佛寺",
      "卧佛寺",
      "郑王庙",
      "水上市场",
      "考山路",
      "暹罗商圈",
      "昭披耶河夜游",
      "唐人街美食",
      "恰图恰周末市场",
      "暹罗天地",
    ],
  },
  {
    name: "成都",
    purposes: { food: 1, culture: 0.7, relaxation: 0.6, nature: 0.6 },
    budget_fit: { budget: 1, comfort: 1, luxury: 0.6 },
    pace_fit: { relaxed: 1, mixed: 0.9, intensive: 0.6 },
    physical_demand: 3,
    dietary_score: 3,
    typical_activities: [
      "大熊猫基地",
      "宽窄巷子",
      "锦里古街",
      "武侯祠",
      "杜甫草堂",
      "都江堰",
      "青城山",
      "人民公园喝茶",
      "太古里",
      "九眼桥夜生活",
    ],
  },
  {
    name: "普吉岛",
    purposes: { relaxation: 1, nature: 0.8, food: 0.5, casual: 0.7 },
    budget_fit: { comfort: 1, luxury: 1, budget: 0.5 },
    pace_fit: { relaxed: 1, mixed: 0.7, intensive: 0.3 },
    physical_demand: 2,
    dietary_score: 3,
    typical_activities: [
      "芭东海滩",
      "皮皮岛一日游",
      "攀牙湾",
      "神仙半岛日落",
      "普吉老城",
      "西蒙人妖秀",
      "查龙寺",
      "SPA水疗",
      "斯米兰群岛",
      "夜市",
    ],
  },
];

// Score a destination against aggregated preferences
function scoreDestination(
  dest: DestinationProfile,
  prefs: AggregatedPreferences
): number {
  let score = 0;

  // Purpose match (weight: 30%)
  const topPurpose = getTopKey(prefs.purposes);
  if (topPurpose && dest.purposes[topPurpose]) {
    score += dest.purposes[topPurpose]! * 30;
  }

  // Budget match (weight: 25%)
  const topBudget = getTopKey(prefs.budgets);
  if (topBudget && dest.budget_fit[topBudget]) {
    score += dest.budget_fit[topBudget]! * 25;
  }

  // Pace match (weight: 20%)
  const topPace = getTopKey(prefs.paces);
  if (topPace && dest.pace_fit[topPace]) {
    score += dest.pace_fit[topPace]! * 20;
  }

  // Physical demand compatibility (weight: 15%)
  const mostDemanding = getMostDemanding(prefs.physical_conditions);
  const physicalScore = 
    mostDemanding === "can_walk_all_day" || mostDemanding === "can_hike"
      ? 1
      : mostDemanding === "needs_nap"
        ? Math.max(0, 5 - dest.physical_demand) / 5
        : (5 - Math.abs(3 - dest.physical_demand)) / 5;
  score += physicalScore * 15;

  // Dietary friendliness (weight: 10%)
  const restrictiveDiet = hasRestrictiveDiet(prefs.dietary_restrictions);
  score += restrictiveDiet ? (dest.dietary_score / 5) * 10 : 10;

  return Math.round(score);
}

function getTopKey<T extends string>(record: Record<T, number>): T | null {
  let max = 0;
  let top: T | null = null;
  for (const [key, val] of Object.entries(record) as [T, number][]) {
    if (val > max) {
      max = val;
      top = key;
    }
  }
  return top;
}

function getMostDemanding(
  conditions: Record<PhysicalCondition, number>
): PhysicalCondition {
  const order: PhysicalCondition[] = [
    "can_hike",
    "can_walk_all_day",
    "light_only",
    "needs_nap",
  ];
  for (const c of order) {
    if (conditions[c] > 0) return c;
  }
  return "can_walk_all_day";
}

function hasRestrictiveDiet(
  diets: Record<DietaryRestriction, number>
): boolean {
  for (const [key, val] of Object.entries(diets) as [
    DietaryRestriction,
    number,
  ][]) {
    if (key !== "none" && val > 0) return true;
  }
  return false;
}

// Aggregate all responses into preferences
export function aggregatePreferences(responses: Response[]): AggregatedPreferences {
  const prefs: AggregatedPreferences = {
    purposes: {
      relaxation: 0,
      culture: 0,
      nature: 0,
      food: 0,
      casual: 0,
    },
    budgets: { budget: 0, comfort: 0, luxury: 0, unlimited: 0 },
    paces: { intensive: 0, relaxed: 0, mixed: 0 },
    physical_conditions: {
      can_walk_all_day: 0,
      can_hike: 0,
      light_only: 0,
      needs_nap: 0,
    },
    dietary_restrictions: {
      none: 0,
      vegetarian: 0,
      no_spicy: 0,
      allergic: 0,
      halal: 0,
      other: 0,
    },
    chronotypes: { early_bird: 0, night_owl: 0, flexible: 0 },
    all_must_sees: [],
    respondent_count: responses.length,
  };

  for (const r of responses) {
    prefs.purposes[r.purpose]++;
    prefs.budgets[r.budget]++;
    prefs.paces[r.pace]++;
    prefs.chronotypes[r.chronotype]++;

    for (const c of r.physical_condition) {
      prefs.physical_conditions[c]++;
    }
    for (const d of r.dietary_restrictions) {
      prefs.dietary_restrictions[d]++;
    }

    if (r.must_sees) {
      prefs.all_must_sees.push(r.must_sees);
    }
  }

  return prefs;
}

// Generate a recommended itinerary
export function generateRecommendation(
  prefs: AggregatedPreferences,
  totalDays: number,
  departureCity: string
): RecommendationDraft {
  // Score and rank destinations
  const scored = DESTINATION_PROFILES.map((dest) => ({
    ...dest,
    score: scoreDestination(dest, prefs),
  }));

  scored.sort((a, b) => b.score - a.score);
  const best = scored[0];
  const alternatives = scored.slice(1, 4).map((d) => d.name);

  // Determine pace for itinerary generation
  const topPace = getTopKey(prefs.paces) || "mixed";

  // Determine chronotype
  const topChrono = getTopKey(prefs.chronotypes) || "flexible";
  const startTime = topChrono === "night_owl" ? "10:00" : "08:30";

  // Generate daily itinerary
  const dailyItinerary: DayPlan[] = [];
  const activities = [...best.typical_activities];
  let activityIndex = 0;

  const paceMultiplier = topPace === "intensive" ? 3 : topPace === "relaxed" ? 2 : 2;

  for (let day = 1; day <= totalDays; day++) {
    // Every 3rd day is lighter if mixed/relaxed
    const isRestDay = day % 3 === 0 && topPace !== "intensive";

    const dayActivities = isRestDay ? 1 : paceMultiplier;

    const morning: DayPlan["morning"] = [];
    const afternoon: DayPlan["afternoon"] = [];
    let evening: DayPlan["evening"] = null;

    if (isRestDay) {
      morning.push({
        name: "自由活动 / 周边探索",
        duration_hours: 2,
        notes: "轻松日，不安排密集行程。可睡到自然醒，周边随意走走。",
      });
      afternoon.push({
        name: "SPA / 咖啡馆 / 当地市场",
        duration_hours: 2,
        notes: "享受慢时光，给身体充电。",
      });
    } else {
      for (let i = 0; i < dayActivities && activityIndex < activities.length; i++) {
        const activity = activities[activityIndex % activities.length];
        const isMorning = i < Math.ceil(dayActivities / 2);

        if (isMorning) {
          morning.push({
            name: activity,
            duration_hours: 2.5,
            notes: `建议 ${startTime} 出发`,
          });
        } else {
          afternoon.push({
            name: activity,
            duration_hours: 2.5,
            notes: "下午游览，注意防晒补水",
          });
        }
        activityIndex++;
      }

      if (activityIndex < activities.length && topPace !== "relaxed") {
        evening = {
          name: activities[activityIndex % activities.length],
          duration_hours: 2,
          notes: "晚间活动，注意回程交通",
        };
        activityIndex++;
      }
    }

    // Determine day theme
    let theme: string;
    if (isRestDay) theme = "轻松恢复日";
    else if (day === 1) theme = "抵达适应日";
    else if (day === totalDays) theme = "告别日";
    else theme = `探索第${day}天`;

    dailyItinerary.push({ day, theme, morning, afternoon, evening });
  }

  // Generate considerations
  const considerations: string[] = [];
  const topPhysical = getMostDemanding(prefs.physical_conditions);
  if (topPhysical === "needs_nap" || topPhysical === "light_only") {
    considerations.push("团队体力偏弱，已安排每3天一个轻松日，行程强度适中。");
  }
  if (hasRestrictiveDiet(prefs.dietary_restrictions)) {
    considerations.push("团队中有饮食限制，建议提前查询当地适合的餐厅。");
  }
  if (topChrono === "night_owl") {
    considerations.push("团队偏夜猫子型，早间活动已推迟至10点开始。");
  }
  considerations.push(`从${departureCity}出发，建议提前确认航班/火车时间。`);
  considerations.push("以上行程为草案，实际可根据天气和体力灵活调整。");

  const summary = `根据${prefs.respondent_count}位朋友的偏好分析，最推荐目的地是「${best.name}」（匹配度 ${best.score}%）。${
    topPace === "intensive"
      ? "团队偏好高效打卡，行程安排较紧凑。"
      : topPace === "relaxed"
        ? "团队偏好慢节奏，安排以深度体验为主。"
        : "团队偏好灵活节奏，张弛有度。"
  }`;

  return {
    suggested_destination: best.name,
    match_score: best.score,
    summary,
    daily_itinerary: dailyItinerary,
    considerations,
    alternative_destinations: alternatives,
  };
}
