import { ScheduleType, WorkoutDayGroup } from "@/types";

export const groupByWorkoutDay = (
  schedule: ScheduleType[]
): WorkoutDayGroup[] => {
  if (!Array.isArray(schedule)) return [];

  const grouped: Record<string, ScheduleType[]> = {};

  schedule.forEach((exercise) => {
    if (!grouped[exercise.workoutDay]) {
      grouped[exercise.workoutDay] = [];
    }
    grouped[exercise.workoutDay].push(exercise);
  });

  return Object.entries(grouped).map(([day, exercises]) => ({
    day,
    exercises,
  }));
};
