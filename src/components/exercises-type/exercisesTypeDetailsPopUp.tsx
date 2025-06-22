"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  fetchExerciseTypeById,
  updateExerciseType,
} from "@/app/actions/exercisesTypeManagement";
import { ExerciseType } from "@/types";
import { toast } from "sonner";
import { PencilIcon } from "lucide-react";

interface ExercisesTypeDetailsPopUpProps {
  exerciseTypeId: number;
}

const ExercisesTypeDetailsPopUp: React.FC<ExercisesTypeDetailsPopUpProps> = ({
  exerciseTypeId,
}) => {
  const [exerciseTypeName, setExerciseTypeName] = useState<ExerciseType>();
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchExerciseType = async () => {
    try {
      setLoading(true);
      const res = await fetchExerciseTypeById(exerciseTypeId);
      if (!res) return;
      setExerciseTypeName(res);
    } catch (error) {
      console.error("Error fetching exercise type:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateExerciseType = async () => {
    if (!exerciseTypeName?.exercisesTypeName) {
      toast.error("Please fill all fields", {
        style: { backgroundColor: "red", color: "white" },
      });
      return;
    }
    await updateExerciseType(
      exerciseTypeId,
      exerciseTypeName.exercisesTypeName
    );
    toast.success("Exercise Type updated successfully!", {
      style: { backgroundColor: "green", color: "white" },
    });
    window.location.reload();
  };

  useEffect(() => {
    if (open) fetchExerciseType();
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
          <DialogTitle>Edit Exercise Type</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="w-full flex justify-center">
            <div className="w-6 h-6 border-4 border-t-white border-gray-600 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="w-full flex flex-row gap-4">
            <Label htmlFor="name" className="w-fit">
              Exercise Type Name
            </Label>
            <Input
              id="name"
              value={exerciseTypeName?.exercisesTypeName}
              onChange={(e) =>
                setExerciseTypeName((prev) => ({
                  ...(prev || { id: exerciseTypeId }),
                  exercisesTypeName: e.target.value,
                }))
              }
              className="w-[300px]"
            />
          </div>
        )}

        <DialogFooter>
          <Button type="submit" onClick={handleUpdateExerciseType}>
            Edit Exercise Type
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExercisesTypeDetailsPopUp;
