import React from "react";
import { toast } from "sonner";
import { DialogClose, DialogContent } from "../ui/dialog";
import Image from "next/image";
import { Button } from "../ui/button";
import { deleteExercise } from "@/app/actions/exercisesManagement";

interface ExercisesDeletePopUpProps {
  exerciseId: number;
}

const ExercisesDeletePopUp: React.FC<ExercisesDeletePopUpProps> = ({
  exerciseId,
}) => {
  const handleDeleteButton = async () => {
    await deleteExercise(exerciseId);
    window.location.reload();
    toast.success("Package deleted successfully!", {
      style: { backgroundColor: "green", color: "white" },
    });
  };

  return (
    <DialogContent className="max-w-2xl w-full space-y-3">
      <div className="flex justify-center">
        <Image
          src={"/profileImg.png"}
          alt="profile image"
          width={80}
          height={80}
        />
      </div>
      <div className="space-y-2">
        <p className="capitalize text-center text-2xl">Delete Exercise</p>
        <p className="text-sm text-center">
          Deleting this exercise will remove all of exercise information from
          our database.
        </p>
      </div>
      <div className="space-x-3 flex">
        <DialogClose asChild>
          <Button className="w-1/2" variant={"outline"}>
            Cancel
          </Button>
        </DialogClose>
        <DialogClose asChild>
          <Button className="bg-[#FE925E] w-1/2" onClick={handleDeleteButton}>
            Delete
          </Button>
        </DialogClose>
      </div>
    </DialogContent>
  );
};

export default ExercisesDeletePopUp;
