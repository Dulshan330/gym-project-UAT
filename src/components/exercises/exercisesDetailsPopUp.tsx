"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Exercise, ExerciseType } from "@/types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { fetchAllExercisesType } from "@/app/actions/exercisesTypeManagement";
import {
  fetchExerciseById,
  updateExercise,
} from "@/app/actions/exercisesManagement";
import { toast } from "sonner";
import { PencilIcon } from "lucide-react";

interface ExercisesDetailsPopUpProps {
  exerciseId: number;
}

const ExercisesDetailsPopUp: React.FC<ExercisesDetailsPopUpProps> = ({
  exerciseId,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [exerciseName, setExerciseName] = useState<Exercise>();
  const [exercisesTypeList, setExercisesTypeList] = useState<ExerciseType[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(false);

  const handleFetchExerciseById = async () => {
    try {
      setLoading(true);
      const res = await fetchExerciseById(exerciseId);
      if (!res) return;
      setExerciseName(res);
    } catch (error) {
      console.error("Error fetching exercise:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchAllExercisesType = async () => {
    try {
      setLoading(true);
      const res = await fetchAllExercisesType();
      setExercisesTypeList(res as ExerciseType[]);
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditExerciseButton = async () => {
    if (!exerciseName?.exerciseName || !exerciseName.exercisesTypeId) {
      toast.error("Please fill all fields", {
        style: { backgroundColor: "red", color: "white" },
      });
      return;
    }
    await updateExercise(
      exerciseId,
      exerciseName.exerciseName,
      exerciseName.exercisesTypeId
    );
    toast.success("Exercise Type updated successfully!", {
      style: { backgroundColor: "green", color: "white" },
    });
    window.location.reload();
  };

  useEffect(() => {
    if (open) {
      handleFetchExerciseById();
      handleFetchAllExercisesType();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"outline"}>
          <PencilIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Exercise</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="w-full flex justify-center">
            <div className="w-6 h-6 border-4 border-t-white border-gray-600 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-3">
            <div className="w-full flex flex-row gap-4 justify-between">
              <Label htmlFor="name" className="w-fit">
                Exercise Name
              </Label>
              <Input
                id="name"
                value={exerciseName?.exerciseName}
                onChange={(e) =>
                  setExerciseName((prev) => ({
                    ...(prev || {
                      id: exerciseId,
                      exercisesTypeId: 0,
                      targetMuscleGroup: "",
                      exercisesType: { exercisesTypeName: "", id: 0 },
                    }),
                    exerciseName: e.target.value,
                  }))
                }
                className="w-[300px]"
              />
            </div>
            <div className="w-full flex flex-row gap-4 justify-between">
              <Label htmlFor="name" className="w-fit">
                Exercise Type Name
              </Label>
              <Select
                value={exerciseName?.exercisesTypeId?.toString()}
                onValueChange={(value) =>
                  setExerciseName((prev) => ({
                    ...(prev || {
                      id: exerciseId,
                      exerciseName: "",
                      targetMuscleGroup: "",
                      exercisesType: { exercisesTypeName: "", id: 0 },
                    }),
                    exercisesTypeId: parseInt(value),
                    exercisesType: exercisesTypeList.find(
                      (item) => item.id === parseInt(value)
                    ) || {
                      exercisesTypeName: "",
                      id: 0,
                    },
                  }))
                }
              >
                <SelectTrigger className="w-[300px]">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {exercisesTypeList.map((item, index) => (
                      <SelectItem key={index} value={item.id.toString()}>
                        {item.exercisesTypeName}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button type="submit" onClick={handleEditExerciseButton}>
            Edit Exercise
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExercisesDetailsPopUp;
