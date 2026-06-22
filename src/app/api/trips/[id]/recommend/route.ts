import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";
import {
  aggregatePreferences,
  generateRecommendation,
} from "@/lib/recommend";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: trip_id } = await params;
    const supabase = getServerSupabase();

    // Get trip
    const { data: trip, error: tripError } = await supabase
      .from("trips")
      .select("*")
      .eq("id", trip_id)
      .single();

    if (tripError || !trip) {
      return NextResponse.json({ error: "行程不存在" }, { status: 404 });
    }

    // Get all responses
    const { data: responses, error: respError } = await supabase
      .from("responses")
      .select("*")
      .eq("trip_id", trip_id);

    if (respError) throw respError;

    if (!responses || responses.length === 0) {
      return NextResponse.json(
        { error: "还没有人填写问卷" },
        { status: 400 }
      );
    }

    // Generate recommendation
    const prefs = aggregatePreferences(responses);
    const recommendation = generateRecommendation(
      prefs,
      trip.total_days,
      trip.departure_city
    );

    // Upsert recommendation
    const { data: saved, error: saveError } = await supabase
      .from("recommendations")
      .upsert(
        {
          trip_id,
          draft: recommendation,
          status: "draft",
        },
        { onConflict: "trip_id" }
      )
      .select()
      .single();

    if (saveError) throw saveError;

    return NextResponse.json(saved);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "生成推荐失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: trip_id } = await params;
    const supabase = getServerSupabase();

    const { data, error } = await supabase
      .from("recommendations")
      .select("*")
      .eq("trip_id", trip_id)
      .single();

    if (error) {
      return NextResponse.json({ error: "还没有生成推荐" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "查询失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
