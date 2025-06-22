"use client";
import { fetchExerciseListById } from "@/app/actions/exercisesManagement";
import { fetchAllExercisesType } from "@/app/actions/exercisesTypeManagement";
import {
  fetchScheduleWithSingleMember,
  updateSchedule,
} from "@/app/actions/scheduleManagement";
import { fetchUser } from "@/app/actions/userManagement";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { groupByWorkoutDay } from "@/lib/transformSchedule";
import {
  Exercise,
  ExerciseRowType,
  ExerciseType,
  MemberScheduleType,
  ScheduleType,
  UsersData,
  WorkoutDayGroup,
} from "@/types";
import { Minus, PlusIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const EditSchedule = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const memberId = searchParams.get("member");

  const [member, setMember] = useState<UsersData>();
  const [loading, setLoading] = useState<boolean>(false);
  const [exercisesByType, setExercisesByType] = useState<{
    [key: string]: Exercise[];
  }>({});
  const [startDate, setStartDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();
  const [exercisesTypeList, setExercisesTypeList] = useState<ExerciseType[]>(
    []
  );
  const [memberSchedule, setMemberSchedule] = useState<MemberScheduleType>();
  const [, setWorkoutDays] = useState<WorkoutDayGroup[]>([]);

  const tabs = [
    "day_01",
    "day_02",
    "day_03",
    "day_04",
    "day_05",
    "day_06",
    "day_07",
    "Abdominal",
  ];

  const [rowsByDay, setRowsByDay] = useState<Record<string, ExerciseRowType[]>>(
    () =>
      tabs.reduce(
        (acc, day) => ({
          ...acc,
          [day]: [
            { id: 1, exerciseType: "", exercise: "", reps: "", sets: "" },
          ],
        }),
        {}
      )
  );

  // Handler for row changes per day
  const handleRowChange = (
    id: number,
    field: keyof ExerciseRowType,
    value: string,
    day: string
  ) => {
    setRowsByDay((prev) => ({
      ...prev,
      [day]: prev[day].map((row) =>
        row.id === id
          ? {
              ...row,
              [field]: value,
              ...(field === "exerciseType" ? { exercise: "" } : {}),
            }
          : row
      ),
    }));
  };

  const addNewRow = (day: string) => {
    setRowsByDay((prev) => ({
      ...prev,
      [day]: [
        ...prev[day],
        {
          id: prev[day].length + 1,
          exerciseType: "",
          exercise: "",
          reps: "",
          sets: "",
          rest: "",
        },
      ],
    }));
  };

  const removeRow = (day: string, id: number) => {
    setRowsByDay((prev) => ({
      ...prev,
      [day]:
        prev[day].length > 1
          ? prev[day].filter((row) => row.id !== id)
          : prev[day],
    }));
  };

  const fetchMember = async () => {
    try {
      setLoading(true);
      const userData = await fetchUser(Number(memberId));
      setMember(userData);
    } catch (error) {
      console.error("Error fetching member:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllExercisesTypeList = async () => {
    try {
      setLoading(true);
      const res = await fetchAllExercisesType();
      setExercisesTypeList(res as ExerciseType[]);
    } catch (error) {
      console.error("Error fetching exercises type list:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMember();
  }, [memberId]);

  useEffect(() => {
    fetchAllExercisesTypeList();
  }, []);

  useEffect(() => {
    if (memberSchedule) {
      // Convert to YYYY-MM-DD if it's a Date object, else use as is
      const formatDate = (dateVal: Date | string) => {
        if (!dateVal) return "";
        if (dateVal instanceof Date) {
          return dateVal.toISOString().split("T")[0];
        }
        // If it's a string, try to parse and format
        const d = new Date(dateVal);
        return !isNaN(d.getTime()) ? d.toISOString().split("T")[0] : dateVal;
      };
      setStartDate(formatDate(memberSchedule.startDate));
      setEndDate(formatDate(memberSchedule.endDate));
    }
  }, [memberSchedule]);

  // Fetch exercises by type and cache them
  useEffect(() => {
    const fetchExercisesForTypes = async () => {
      setLoading(true);
      try {
        const newExercisesByType: { [key: string]: Exercise[] } = {};
        for (const type of exercisesTypeList) {
          const exercises = await fetchExerciseListById(Number(type.id));
          newExercisesByType[type.id] = Array.isArray(exercises)
            ? exercises
            : [];
        }
        setExercisesByType(newExercisesByType);
      } catch (error) {
        console.error("Error fetching exercises by type:", error);
      } finally {
        setLoading(false);
      }
    };

    if (exercisesTypeList.length > 0) {
      fetchExercisesForTypes();
    }
  }, [exercisesTypeList]);

  // retrieve member schedule
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

        // Transform grouped to rowsByDay shape
        const newRowsByDay: Record<string, ExerciseRowType[]> = {};
        grouped.forEach((group) => {
          newRowsByDay[group.day] = group.exercises.map((ex, idx) => ({
            id: idx + 1,
            exerciseType: ex.exerciseTypeId?.toString() || "",
            exercise: ex.exerciseId?.toString() || "",
            reps: ex.reps || "",
            sets: ex.sets || "",
            rest: ex.rest || "",
          }));
        });

        // Fill missing days with default row
        tabs.forEach((day) => {
          if (!newRowsByDay[day]) {
            newRowsByDay[day] = [
              {
                id: 1,
                exerciseType: "",
                exercise: "",
                reps: "",
                sets: "",
                rest: "",
              },
            ];
          }
        });
        setRowsByDay(newRowsByDay);
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

  useEffect(() => {
    console.log("Member Schedule:", memberSchedule);
  }, [memberSchedule]);

  const handleSubmit = async () => {
    if (!memberId || !startDate || !endDate) {
      toast.error("Please fill all fields", {
        style: { background: "red", color: "white" },
      });
      return;
    }
    if (!memberSchedule?.scheduleUniqueID) {
      toast.error("Schedule Unique ID is required", {
        style: { background: "red", color: "white" },
      });
      return;
    }
    try {
      const { data, error } = await updateSchedule(
        memberSchedule?.scheduleUniqueID,
        rowsByDay,
        new Date(startDate),
        new Date(endDate),
        Number(memberId)
      );
      if (data) {
        toast.success("Schedule updated successfully!", {
          style: { background: "green", color: "white" },
        });
        router.push(
          `/dashboard/workouts/view-schedules/view-schedule?member=${memberId}`
        );
      }
      if (error) {
        toast.error("Error adding schedule: " + error, {
          style: { background: "red", color: "white" },
        });
        console.error("Error adding schedule:", error);
        return;
      }
    } catch (error) {
      console.error("Error updating schedule:", error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mt-4 mb-4">
          Edit Workout Schedule
        </h2>
        <div className="w-full mt-4">
          {/* header info */}
          <div className="flex justify-between">
            <div className="space-y-2">
              <Label>Member Name</Label>
              <Input className="w-72" value={member?.username} readOnly />
            </div>
            <div className="flex space-x-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  className="w-44"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  className="w-44"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>
          {/* schedule */}
          <div className="space-y-2 my-6">
            <Tabs defaultValue={tabs[0]} className="w-full">
              <TabsList className="space-x-6 bg-white">
                {tabs.map((day) => (
                  <TabsTrigger
                    key={day}
                    value={day}
                    className="px-5 border-b-2 border-transparent data-[state=active]:border-b-black transition rounded-none data-[state=active]:shadow-none"
                  >
                    {day
                      .replace(/_/g, " ")
                      .replace(/^./, (c) => c.toUpperCase())}
                  </TabsTrigger>
                ))}
              </TabsList>
              {tabs.map((day) => (
                <TabsContent key={day} value={day}>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-none">
                        <TableHead>Workout Category</TableHead>
                        <TableHead>Workout Name</TableHead>
                        <TableHead>Reps</TableHead>
                        <TableHead>Sets</TableHead>
                        <TableHead>Rest</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rowsByDay[day].map((row) => (
                        <TableRow key={row.id} className="border-none">
                          <TableCell>
                            <Select
                              value={row.exerciseType}
                              onValueChange={(value) =>
                                handleRowChange(
                                  row.id,
                                  "exerciseType",
                                  value,
                                  day
                                )
                              }
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Exercise Type" />
                              </SelectTrigger>
                              <SelectContent>
                                {exercisesTypeList.map((item) => (
                                  <SelectItem
                                    key={item.id}
                                    value={item.id.toString()}
                                  >
                                    {item.exercisesTypeName}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={row.exercise}
                              onValueChange={(value) =>
                                handleRowChange(row.id, "exercise", value, day)
                              }
                              disabled={!row.exerciseType}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Exercise" />
                              </SelectTrigger>
                              <SelectContent>
                                {row.exerciseType &&
                                  exercisesByType[row.exerciseType]?.map(
                                    (item) => (
                                      <SelectItem
                                        key={item.id}
                                        value={item.id.toString()}
                                      >
                                        {item.exerciseName}
                                      </SelectItem>
                                    )
                                  )}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="w-36">
                            <Input
                              value={row.reps}
                              onChange={(e) =>
                                handleRowChange(
                                  row.id,
                                  "reps",
                                  e.target.value,
                                  day
                                )
                              }
                            />
                          </TableCell>
                          <TableCell className="w-22">
                            <Input
                              value={row.sets}
                              onChange={(e) =>
                                handleRowChange(
                                  row.id,
                                  "sets",
                                  e.target.value,
                                  day
                                )
                              }
                            />
                          </TableCell>
                          <TableCell className="w-32">
                            <Input
                              value={row.rest}
                              onChange={(e) =>
                                handleRowChange(
                                  row.id,
                                  "rest",
                                  e.target.value,
                                  day
                                )
                              }
                            />
                          </TableCell>
                          <TableCell>
                            {rowsByDay[day].length > 1 && (
                              <Button
                                variant="outline"
                                onClick={() => removeRow(day, row.id)}
                                className="mr-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                              >
                                <Minus />
                              </Button>
                            )}
                            {row.id ===
                              rowsByDay[day][rowsByDay[day].length - 1].id && (
                              <Button
                                variant={"outline"}
                                onClick={() => addNewRow(day)}
                                className="hover:bg-black hover:text-white"
                              >
                                <PlusIcon />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
              ))}
            </Tabs>
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <Button
              className="w-32"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button className="w-32" variant="default" onClick={handleSubmit}>
              Save Workouts
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditSchedule;
