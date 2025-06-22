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
import { MemberScheduleType, ScheduleType, WorkoutDayGroup } from "@/types";
import generateSchedulePDF from "@/utils/schedule-generate";
import { FileDownIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const ViewSchedulePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const memberId = searchParams.get("member");

  const [loading, setLoading] = useState<boolean>(false);
  const [memberSchedule, setMemberSchedule] = useState<MemberScheduleType>();
  const [workoutDays, setWorkoutDays] = useState<WorkoutDayGroup[]>([]);

  const fetchMemberSchedule = async () => {
    try {
      setLoading(true);
      const { schedule, user } = await fetchScheduleWithSingleMember(
        Number(memberId)
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
  }, [memberId]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold my-4 md:my-8">
          Workout Schedule - {memberSchedule?.users?.username}
        </h2>
        <div className="flex justify-between">
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
                      <TableCell>{schedule.exercises?.exerciseName}</TableCell>
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
          <Button
            className="px-16"
            onClick={() =>
              router.push(
                `/dashboard/workouts/all-schedules/edit-schedule?member=${memberId}`
              )
            }
            variant={"outline"}
          >
            Edit
          </Button>
          <Button
            className="px-16"
            onClick={() => router.push("/dashboard/workouts")}
          >
            Ok
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ViewSchedulePage;
