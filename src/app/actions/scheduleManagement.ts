"use server";
import { ExerciseRowType } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { v4 as uuidv4 } from "uuid";

export async function addSchedule(
  scheduleInfo: Record<string, ExerciseRowType[]>,
  startDate: Date,
  endDate: Date,
  memberID: number
) {
  const supabase = await createClient();
  const scheduleUniqueId = uuidv4();

  // Flatten and include day info, but filter out incomplete rows
  const allRows = Object.entries(scheduleInfo).flatMap(([day, rows]) =>
    rows
      .filter(
        (exercise) =>
          exercise.exerciseType &&
          exercise.exercise &&
          exercise.reps &&
          exercise.sets
      )
      .map((exercise) => ({
        ...exercise,
        day,
      }))
  );

  const { data, error } = await supabase
    .from("allSchedule")
    .insert(
      allRows.map((exerice) => ({
        exerciseTypeId: exerice.exerciseType,
        exerciseId: exerice.exercise,
        reps: exerice.reps,
        sets: exerice.sets,
        rest: exerice.rest,
        scheduleUniqueID: scheduleUniqueId,
        workoutDay: exerice.day,
      }))
    )
    .select();

  await supabase
    .from("memberSchedule")
    .insert([
      {
        scheduleUniqueID: scheduleUniqueId,
        userId: memberID,
        startDate: startDate,
        endDate: endDate,
      },
    ])
    .select();

  if (error) {
    console.error("Error fetching exercises details:", error);
    return { data: null, error };
  }
  return { data, error: null };
}

export async function fetchScheduleWithSingleMember(memberId: number) {
  const supabase = await createClient();

  const { data: member, error: memError } = await supabase
    .from("memberSchedule")
    .select("*,users(username,gender)")
    .eq("userId", memberId)
    .order("startDate", { ascending: false })
    .limit(1);

  if (memError) {
    console.error("Error fetching member schedule:", memError);
    return { data: null, error: memError.message };
  }

  const scheduleUniqueId = member?.[0]?.scheduleUniqueID;
  if (!scheduleUniqueId) {
    return { data: null, error: "No schedule found for this member." };
  }

  const { data: schedule, error: scheduleError } = await supabase
    .from("allSchedule")
    .select(
      "*,exercisesType(exercisesTypeName),exercises(exerciseName,targetMuscleGroup)"
    )
    .eq("scheduleUniqueID", scheduleUniqueId);

  if (scheduleError) {
    console.error("Error fetching schedule:", scheduleError);
    return { data: null, error: scheduleError.message };
  }
  return { schedule: schedule, user: member, error: null };
}

export async function updateSchedule(
  scheduleUniqueID: string,
  scheduleInfo: Record<string, ExerciseRowType[]>,
  startDate: Date,
  endDate: Date,
  memberID: number
) {
  const supabase = await createClient();

  const { error: deleteScheduleError } = await supabase
    .from("allSchedule")
    .delete()
    .eq("scheduleUniqueID", scheduleUniqueID);

  if (deleteScheduleError) {
    console.error("Error deleting old schedule:", deleteScheduleError);
    return { error: deleteScheduleError.message };
  }

  const { error: deleteMemberScheduleError } = await supabase
    .from("memberSchedule")
    .delete()
    .eq("scheduleUniqueID", scheduleUniqueID);

  if (deleteMemberScheduleError) {
    console.error(
      "Error deleting old member schedule:",
      deleteMemberScheduleError
    );
    return { error: deleteMemberScheduleError.message };
  }

  const { data, error } = await addSchedule(
    scheduleInfo,
    startDate,
    endDate,
    memberID
  );
  if (error) {
    console.error("Error adding new schedule:", error);
    return { error: error.message };
  }
  return { data, error: null };
}
