import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: trip_id } = await params;
    const body = await request.json();
    const {
      respondent_name,
      purpose,
      budget,
      pace,
      physical_condition,
      dietary_restrictions,
      chronotype,
      must_sees,
      notes,
    } = body;

    if (!respondent_name || !purpose || !budget || !pace || !chronotype) {
      return NextResponse.json(
        { error: "缺少必填字段" },
        { status: 400 }
      );
    }

    const supabase = getServerSupabase();

    // Verify trip exists
    const { data: trip } = await supabase
      .from("trips")
      .select("id")
      .eq("id", trip_id)
      .single();

    if (!trip) {
      return NextResponse.json({ error: "行程不存在" }, { status: 404 });
    }

    const { data, error } = await supabase
      .from("responses")
      .insert({
        trip_id,
        respondent_name,
        purpose,
        budget,
        pace,
        physical_condition: physical_condition || [],
        dietary_restrictions: dietary_restrictions || [],
        chronotype,
        must_sees: must_sees || "",
        notes: notes || "",
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "提交失败";
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
      .from("responses")
      .select("*")
      .eq("trip_id", trip_id)
      .order("created_at", { ascending: true });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "查询失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
