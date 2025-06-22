"use server";
import { createClient } from "@/utils/supabase/server";

export async function fetchAllExercisesType() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("exercisesType").select(`*`);
  if (error) {
    console.error("Error fetching user details:", error);
    return { data: null, error };
  }
  return data;
}

export async function fetchExerciseTypeById(exerciseTypeId: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("exercisesType")
    .select(`*`)
    .eq("id", exerciseTypeId)
    .single();
  if (error) {
    console.error("Error fetching user details:", error);
    return { data: null, error };
  }
  return data;
}

export async function addExerciseTypeList(exerciseTypes: string[]) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("exercisesType")
    .insert(
      exerciseTypes.map((exerciseType) => ({
        exercisesTypeName: exerciseType,
      }))
    )
    .select();
  if (error) {
    console.error("Error fetching exercises details:", error);
    return { data: null, error };
  }
  return { data, error: null };
}

export async function addExerciseType(exerciseType: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("exercisesType")
    .insert([{ exercisesTypeName: exerciseType }]);
  if (error) {
    console.error("Error adding new package:", error);
    return { data: null, error };
  }
  return { data, error: null };
}

export async function deleteExerciseType(exerciseTypeId: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("exercisesType")
    .delete()
    .eq("id", exerciseTypeId);
  if (error) {
    console.error("Error deleting package:", error);
    return { data: null, error };
  }
  return { data, error: null };
}

export async function updateExerciseType(
  exerciseTypeId: number,
  exerciseType: string
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("exercisesType")
    .update({ exercisesTypeName: exerciseType })
    .eq("id", exerciseTypeId)
    .select();
  if (error) {
    console.error("Error updating package:", error);
    return { data: null, error };
  }
  return { data, error: null };
}
