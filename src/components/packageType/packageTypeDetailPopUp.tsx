"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { PopoverContent } from "../ui/popover";
import { Button } from "../ui/button";
import { Dialog, DialogTrigger } from "../ui/dialog";
import PackageTypeDeletePopUp from "./packageTypeDeletePopUp"

interface PackageTypeDetailPopUpProps {
  packageId: number;
}

const PackageTypeDetailPopUp: React.FC<PackageTypeDetailPopUpProps> = ({
  packageId,
}) => {
  const router = useRouter();

  const handleEditButton = () => {
    router.push(
      `/dashboard/packages/package-type/edit-package-type?pkg=${packageId}`
    );
  };

  const handleViewButton = () => {
    router.push(
      `/dashboard/packages/package-type/view-package-type?pkg=${packageId}`
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
        <PackageTypeDeletePopUp packageId={packageId} />
      </Dialog>
    </PopoverContent>
  );
};

export default PackageTypeDetailPopUp;
