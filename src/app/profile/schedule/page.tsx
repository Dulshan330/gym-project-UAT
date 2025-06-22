"use client";
import { fetchScheduleWithSingleMember } from "@/app/actions/scheduleManagement";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { groupByWorkoutDay } from "@/lib/transformSchedule";
import { userAtom } from "@/store/atom";
import { MemberScheduleType, ScheduleType, WorkoutDayGroup } from "@/types";
import generateSchedulePDF from "@/utils/schedule-generate";
import { useAtom } from "jotai";
import { FileDownIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const SchedulePage = () => {
  const router = useRouter();

  const [member] = useAtom(userAtom);

  const [loading, setLoading] = useState<boolean>(false);
  const [memberSchedule, setMemberSchedule] = useState<MemberScheduleType>();
  const [workoutDays, setWorkoutDays] = useState<WorkoutDayGroup[]>([]);

  const fetchMemberSchedule = async () => {
    try {
      setLoading(true);
      const { schedule, user } = await fetchScheduleWithSingleMember(
        Number(member.id)
      );

      if (Array.isArray(user) && user.length > 0) {
        setMemberSchedule(user[0]);
      } else {
        setMemberSchedule(undefined);
      }

      if (Array.isArray(schedule) && schedule.length > 0) {
        const grouped = groupByWorkoutDay(schedule as ScheduleType[]);
        setWorkoutDays(grouped);
      } else {
        setWorkoutDays([]);
        console.error("No schedule found for this member.");
      }
    } catch (error) {
      setMemberSchedule(undefined);
      setWorkoutDays([]);
      console.error("Error fetching member schedule:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemberSchedule();
  }, [member.id]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-4">
      {memberSchedule === undefined ? (
        <div className="max-w-6xl mx-auto pt-10 flex justify-center">
          <div className="font-semibold w-fit">
            You are not assigned a workout schedule yet!
          </div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold my-4 md:my-8">
            Workout Schedule
          </h2>
          <div className="flex justify-between max-md:flex-col max-md:mb-3 max-md:text-sm">
            {memberSchedule?.startDate && (
              <h2 className="mb-4">
                Valid Period :{" "}
                {memberSchedule.startDate instanceof Date
                  ? memberSchedule.startDate.toLocaleDateString()
                  : memberSchedule.startDate}
                {" to "}
                {memberSchedule.endDate instanceof Date
                  ? memberSchedule.endDate.toLocaleDateString()
                  : memberSchedule.endDate}
              </h2>
            )}
            <Button
              className="px-16"
              onClick={() =>
                generateSchedulePDF(
                  memberSchedule?.users?.username || "Member",
                  memberSchedule?.users?.gender || "",
                  "2025.05.01 - 2025.08.31",
                  workoutDays
                )
              }
            >
              <FileDownIcon /> Download Report
            </Button>
          </div>
          <div className="space-y-14">
            {workoutDays.map((workout, index) => (
              <div key={index} className="space-y-3">
                <h2 className="font-semibold text-xl">
                  {workout.day
                    .replace(/_/g, " ")
                    .replace(/^./, (c) => c.toUpperCase())}{" "}
                  - Workout Schedule
                </h2>
                <Table className="border">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Exercise</TableHead>
                      <TableHead>Target Muscle</TableHead>
                      <TableHead>Sets</TableHead>
                      <TableHead>Reps</TableHead>
                      <TableHead>Rest</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {workout.exercises.map((schedule, idx) => (
                      <TableRow key={idx}>
                        <TableCell>
                          {schedule.exercises?.exerciseName}
                        </TableCell>
                        <TableCell>
                          {schedule.exercises?.targetMuscleGroup}
                        </TableCell>
                        <TableCell>{schedule.sets}</TableCell>
                        <TableCell>{schedule.reps}</TableCell>
                        <TableCell>{schedule.rest}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))}
          </div>
          <div className="my-16 flex justify-end space-x-4">
            <Button className="px-16" onClick={() => router.back()}>
              Ok
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchedulePage;
