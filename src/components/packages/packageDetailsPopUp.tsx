"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { PopoverContent } from "../ui/popover";
import { Button } from "../ui/button";
import { Dialog, DialogTrigger } from "../ui/dialog";
import PackageDeletePopUp from "./packageDeletePopUp";

interface PackageDetailsPopUpProps {
  packageId: number;
}

const PackageDetailsPopUp: React.FC<PackageDetailsPopUpProps> = ({
  packageId,
}) => {
  const router = useRouter();

  const handleEditButton = () => {
    router.push(
      `/dashboard/packages/all-packages/edit-package?pkg=${packageId}`
    );
  };

  const handleViewButton = () => {
    router.push(
      `/dashboard/packages/all-packages/view-package?pkg=${packageId}`
    );
  };
  return (
    <PopoverContent className="w-fit flex flex-col gap-1 items-start">
      <Button
        className="bg-white hover:bg-white hover:cursor-pointer text-black shadow-none"
        onClick={handleViewButton}
      >
        View
      </Button>
      <Button
        onClick={handleEditButton}
        className="bg-white hover:bg-white hover:cursor-pointer text-black shadow-none"
      >
        Edit
      </Button>
      <Dialog>
        <DialogTrigger>
          <Button className="bg-white hover:bg-white hover:cursor-pointer text-black shadow-none">
            Delete
          </Button>
        </DialogTrigger>
        <PackageDeletePopUp packageId={packageId} />
      </Dialog>
    </PopoverContent>
  );
};

export default PackageDetailsPopUp;
