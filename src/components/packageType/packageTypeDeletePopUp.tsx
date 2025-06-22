import React from "react";
import { DialogClose, DialogContent } from "../ui/dialog";
import { Button } from "../ui/button";
import {packageTypedelete } from "@/app/actions/packageManagement";
import { toast } from "sonner";
import Image from "next/image";

interface PackageTypeDeletePopUpProps {
  packageId: number;
}

const PackageTypeDeletePopUp: React.FC<PackageTypeDeletePopUpProps> = ({
  packageId,
}) => {
  const handleDeleteButton = async () => {
    await packageTypedelete(packageId);
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
        <p className="capitalize text-center text-2xl">Delete Package</p>
        <p className="text-sm text-center">
          Deleting this package type will remove all of package information from our
          database. This cannot be undone.
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

export default PackageTypeDeletePopUp;
