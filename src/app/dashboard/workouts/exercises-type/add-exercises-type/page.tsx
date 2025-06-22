"use client";
import { addExerciseTypeList } from "@/app/actions/exercisesTypeManagement";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

const AddExerciseTypePage = () => {
  const router = useRouter();

  const [rowsCount, setRowsCount] = useState<number>(1);
  const [workoutNames, setWorkoutNames] = useState<string[]>([]);

  const handleWorkoutCategoryNameChange = (index: number, value: string) => {
    const updatedNames = [...workoutNames];
    updatedNames[index] = value;
    setWorkoutNames(updatedNames);
  };

  const handleSubmit = async () => {
    try {
      if (workoutNames.length === 0) {
        toast.error("Please add at least one workout category name.", {
          style: { background: "red", color: "white" },
        });
        return;
      }
      const { data, error } = await addExerciseTypeList(workoutNames);
      if (data) {
        toast.success("Workout Categories added successfully!", {
          style: { background: "green", color: "white" },
        });
        router.back();
      }
      if (error) {
        toast.error("Error adding workouts categories: " + error.message, {
          style: { background: "red", color: "white" },
        });
        console.error("Error adding workouts:", error.message);
        return;
      }
    } catch (error) {
      console.error("Error adding workout categories:", error);
    }
  };

  return (
    <div className="p-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mt-4 mb-4">
          Add Workout Categories
        </h2>
        <div className="space-y-5">
          <div className="space-y-2">
            <Label>Workout Category Name</Label>
            {[...Array(rowsCount)].map((_, index) => (
              <div key={index} className="flex w-full items-center space-x-2">
                <Input
                  className="w-96"
                  placeholder="Type a workout category name"
                  value={workoutNames[index] || ""}
                  onChange={(e) =>
                    handleWorkoutCategoryNameChange(index, e.target.value)
                  }
                />
                {index === rowsCount - 1 && (
                  <Button
                    variant={"outline"}
                    onClick={() => setRowsCount(rowsCount + 1)}
                  >
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
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

export default AddExerciseTypePage;
