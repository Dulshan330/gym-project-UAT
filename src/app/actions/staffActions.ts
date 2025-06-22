"use server";

import { Schedule, StaffMemberType, TrainerDataType } from "@/types";
import { createClient } from "@/utils/supabase/server";

export async function addStaffMember(formData: StaffMemberType) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("staff")
    .insert(formData)
    .select();
  return { data, error };
}

export async function addTrainer(formData: TrainerDataType) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trainer")
    .insert(formData)
    .select();
  return { data, error };
}

export async function updateStaffInfo(
  userId: number,
  formData: StaffMemberType
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("staff")
    .update(formData)
    .eq("user_id", userId)
    .select();
  return { data, error };
}

export async function updateTrainerInfo(
  userId: number,
  formData: TrainerDataType
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trainer")
    .update(formData)
    .eq("user_id", userId)
    .select();
  return { data, error };
}

export async function saveWorkingHours(userId: number, schedule: Schedule) {
  const supabase = await createClient();
  const workingHours = Object.entries(schedule)
    .filter(([, value]) => value.enabled)
    .map(([day, value]) => ({
      user_id: userId,
      day_of_week: [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ].indexOf(day),
      start_time: value.startTime,
      end_time: value.endTime,
    }));

  if (workingHours.length > 0) {
    const { data, error } = await supabase
      .from("workingHours")
      .insert(workingHours);

    if (error) {
      console.error("Error saving working hours:", error);
    }
    return data;
  }
}

export async function fetchWorkingHours(userId: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("workingHours")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching working hours:", error);
    return [];
  }
  return data;
}

export async function updatingWorkingHours(userId: number, schedule: Schedule) {
  const supabase = await createClient();

  const { error: deleteError } = await supabase
    .from("workingHours")
    .delete()
    .eq("user_id", userId);

  if (deleteError) {
    console.error("Error deleting existing working hours:", deleteError);
    return;
  }

  await saveWorkingHours(userId, schedule);
}
