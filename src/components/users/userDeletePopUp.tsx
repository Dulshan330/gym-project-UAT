import React from "react";
import { DialogClose, DialogContent } from "../ui/dialog";
import { Button } from "../ui/button";
import { deleteUser } from "@/app/actions/userManagement";
import Image from "next/image";

interface UserDeletePopUpProps {
  userId: number;
}

const UserDeletePopUp: React.FC<UserDeletePopUpProps> = ({ userId }) => {
  const handleDeleteButton = async () => {
    await deleteUser(userId);
    window.location.reload();
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
        <p className="capitalize text-center text-2xl">
          Make as Inactive Profile
        </p>
        <p className="text-sm text-center">
          This will disable the account temporarily. The user&apos;s data will
          be preserved, but they won&apos;t be able to access the system. You
          can reactivate the profile later if needed.
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
            Make as Inactive
          </Button>
        </DialogClose>
      </div>
    </DialogContent>
  );
};

export default UserDeletePopUp;
