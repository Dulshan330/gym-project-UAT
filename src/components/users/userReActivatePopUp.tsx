import { reActivateUser } from "@/app/actions/userManagement";
import React from "react";
import { DialogClose, DialogContent } from "../ui/dialog";
import Image from "next/image";
import { Button } from "../ui/button";

interface UserReActivatePopUpProps {
  userId: number;
}

const UserReActivatePopUp: React.FC<UserReActivatePopUpProps> = ({
  userId,
}) => {
  const handleReActivateButton = async () => {
    await reActivateUser(userId);
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
          Make as Active Profile
        </p>
        <p className="text-sm text-center">
          This will restore full access to the account. All existing user data
          will remain unchanged, and the member can use the system normally
          again.
        </p>
      </div>
      <div className="space-x-3 flex">
        <DialogClose asChild>
          <Button className="w-1/2" variant={"outline"}>
            Cancel
          </Button>
        </DialogClose>
        <DialogClose asChild>
          <Button
            className="bg-[#FE925E] w-1/2"
            onClick={handleReActivateButton}
          >
            Make as Inactive
          </Button>
        </DialogClose>
      </div>
    </DialogContent>
  );
};

export default UserReActivatePopUp;
