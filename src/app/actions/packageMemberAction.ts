"use server";
import { createClient } from "@/utils/supabase/server";

export async function assignPackageToMember(
  memberId: number,
  packageId: number,
  startDate: Date,
  endDate: Date
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("memberPackageRelations")
    .insert([
      {
        memberId: memberId,
        planId: packageId,
        startDate: startDate,
        endDate: endDate,
      },
    ])
    .select();
  return { data, error };
}

export async function isPackageAssigned(memberId: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("memberPackageRelations")
    .select("*")
    .eq("memberId", memberId)
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

export async function getAssignedPackage(memberId: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("memberPackageRelations")
    .select(`*,packages(id,package_name)`)
    .eq("memberId", memberId)
    .order("created_at", { ascending: false });
  if (error) {
    return { error: error.message };
  }
  if (data) {
    return data;
  }
}
