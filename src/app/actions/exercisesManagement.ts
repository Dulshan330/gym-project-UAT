"use server";
import { WorkoutType } from "@/types";
import { createClient } from "@/utils/supabase/server";

export async function fetchAllExercises(status: string) {
  const supabase = await createClient();
  let query = supabase
    .from("exercises")
    .select("*,exercisesType(exercisesTypeName,id)");

  if (status === "all") {
    query = query;
  } else {
    query = query.eq("exercisesTypeId", Number(status));
  }

  const { data, error } = await query;
  if (error) {
    console.error("Error fetching user details:", error);
    return { data: null, error };
  }
  return data;
}

export async function fetchExerciseById(exerciseId: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("exercises")
    .select(`*`)
    .eq("id", exerciseId)
    .single();
  if (error) {
    console.error("Error fetching user details:", error);
    return { data: null, error };
  }
  return data;
}

export async function fetchExerciseListById(exerciseId: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("exercises")
    .select(`*`)
    .eq("exercisesTypeId", exerciseId);
  if (error) {
    console.error("Error fetching user details:", error);
    return { data: null, error };
  }
  return data;
}

export async function addExerciseList(
  exercisesTypeId: number,
  exercises: WorkoutType[]
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("exercises")
    .insert(
      exercises.map((exercise) => ({
        exerciseName: exercise.exercises,
        targetMuscleGroup: exercise.targetMuscleGroup,
        exercisesTypeId: exercisesTypeId,
      }))
    )
    .select();
  if (error) {
    console.error("Error fetching exercises details:", error);
    return { data: null, error };
  }
  return { data, error: null };
}

export async function addExercise(
  exerciseName: string,
  exerciseTypeId: string
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("exercises")
    .insert([
      { exerciseName: exerciseName, exercisesTypeId: Number(exerciseTypeId) },
    ])
    .select();
  if (error) {
    console.error("Error fetching user details:", error);
    return { data: null, error };
  }
  return data;
}

export async function deleteExercise(exerciseId: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("exercises")
    .delete()
    .eq("id", exerciseId);
  if (error) {
    console.error("Error deleting package:", error);
    return { data: null, error };
  }
  return { data, error: null };
}

export async function updateExercise(
  exerciseId: number,
  exerciseName: string,
  exerciseTypeId: number
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("exercises")
    .update({ exerciseName: exerciseName, exercisesTypeId: exerciseTypeId })
    .eq("id", exerciseId)
    .select();
  if (error) {
    console.error("Error deleting package:", error);
    return { data: null, error };
  }
  return { data, error: null };
}
