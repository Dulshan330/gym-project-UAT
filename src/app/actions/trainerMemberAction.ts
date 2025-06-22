"use server";
import { createClient } from "@/utils/supabase/server";

export async function assignTrainerToMember(
  memberId: number,
  trainerId: number
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("memberTrainerRelations")
    .insert([{ memberId: memberId, trainerId: trainerId }])
    .select();
  return { data, error };
}

export async function isTrainerAssigned(userId: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("memberTrainerRelations")
    .select("*")
    .eq("memberId", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();
  if (error) {
    return { error: error.message };
  }
  if (data) {
    return data;
  }
}
