"use client";
import { addExerciseList } from "@/app/actions/exercisesManagement";
import { fetchAllExercisesType } from "@/app/actions/exercisesTypeManagement";
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
import { ExerciseType, WorkoutType } from "@/types";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const AddExercise = () => {
  const router = useRouter();

  const [categoryValue, setCategoryValue] = useState<string>("");
  const [rows, setRows] = useState<WorkoutType[]>([
    { id: 1, exercises: "", targetMuscleGroup: "" },
  ]);
  const [exercisesTypeList, setExercisesTypeList] = useState<ExerciseType[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(false);

  const addNewRow = () => {
    setRows((prevRows) => [
      ...prevRows,
      {
        id: prevRows.length + 1,
        exercises: "",
        targetMuscleGroup: "",
      },
    ]);
  };

  const handleRowChange = (
    id: number,
    field: keyof WorkoutType,
    value: string
  ) => {
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const fetchAllExercisesTypeList = async () => {
    setLoading(true);
    try {
      const res = await fetchAllExercisesType();
      setExercisesTypeList(res as ExerciseType[]);
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllExercisesTypeList();
  }, []);

  const handleSubmit = async () => {
    if ((rows.length === 0, categoryValue === "")) {
      toast.error("Please add at least one workout name and select category.", {
        style: { background: "red", color: "white" },
      });
      return;
    }
    try {
      const { data, error } = await addExerciseList(
        Number(categoryValue),
        rows
      );
      if (data) {
        toast.success("Workouts added successfully!", {
          style: { background: "green", color: "white" },
        });
        router.back();
      }
      if (error) {
        toast.error("Error adding workouts: " + error.message, {
          style: { background: "red", color: "white" },
        });
        console.error("Error adding workouts:", error.message);
        return;
      }
    } catch (error) {
      console.error("Error adding workouts:", error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mt-4 mb-4">Add Workouts</h2>
        <div className="space-y-5">
          <div className="space-y-2 w-96">
            <Label>Select workout category</Label>
            <Select value={categoryValue} onValueChange={setCategoryValue}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {exercisesTypeList.map((item) => (
                  <SelectItem key={item.id} value={item.id.toString()}>
                    {item.exercisesTypeName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Table>
              <TableHeader>
                <TableRow className="border-none">
                  <TableHead>Target Muscle Group</TableHead>
                  <TableHead>Workout Name</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow className="border-none" key={row.id}>
                    <TableCell>
                      <Input
                        value={row.targetMuscleGroup}
                        onChange={(e) =>
                          handleRowChange(
                            row.id,
                            "targetMuscleGroup",
                            e.target.value
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={row.exercises}
                        onChange={(e) =>
                          handleRowChange(row.id, "exercises", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      {row.id === rows[rows.length - 1].id && (
                        <Button variant={"outline"} onClick={addNewRow}>
                          <PlusIcon />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
              Add Workouts
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddExercise;
