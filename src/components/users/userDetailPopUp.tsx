import React from "react";
import { PopoverContent } from "../ui/popover";
import { Button } from "../ui/button";
import { Dialog, DialogTrigger } from "../ui/dialog";
import UserDeletePopUp from "./userDeletePopUp";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { isMemberEditModeAtom } from "@/store/atom";
import UserReActivatePopUp from "./userReActivatePopUp";
import { downloadMemberClearanceReport } from "@/utils/functions/member/downloadMemberClearanceReport";
import { downloadMemberInvoice } from "@/utils/functions/member/downloadMemberInvoice";

interface UserDetailPopUpProps {
  userId: number;
  userType: string;
  status: string;
}

const UserDetailPopUp: React.FC<UserDetailPopUpProps> = ({
  userId,
  userType,
  status,
}) => {
  const router = useRouter();
  const [, setIsMemberEditMode] = useAtom(isMemberEditModeAtom);

  const handleEditButton = () => {
    switch (userType) {
      case "Member":
        router.push(`/dashboard/members/edit?user=${userId}`);
        break;
      case "Staff":
        router.push(`/dashboard/users/edit/staff?user=${userId}`);
        break;
      case "Trainer":
        router.push(`/dashboard/users/edit/trainer?user=${userId}`);
        break;
    }

    setIsMemberEditMode(true);
  };

  const handleViewButton = () => {
    router.push(`/dashboard/users/viewuser?user=${userId}`);
  };

  const handleDownloadInvoice = async () => {
    try {
      await downloadMemberInvoice(userId)
    } catch (error) {
      console.error("Error on downloading invoice",error);
    }
  };

  const handleDownloadReport = async () => {
    try {
      await downloadMemberClearanceReport(userId);
    } catch (error) {
      console.error("Error on downloading report",error);
    }
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
      {status === "Active" ? (
        <Dialog>
          <DialogTrigger>
            <Button className="bg-white hover:bg-white hover:cursor-pointer text-black shadow-none">
              Make as Inactive
            </Button>
          </DialogTrigger>
          <UserDeletePopUp userId={userId} />
        </Dialog>
      ) : (
        <Dialog>
          <DialogTrigger>
            <Button className="bg-white hover:bg-white hover:cursor-pointer text-black shadow-none">
              Make as Active
            </Button>
          </DialogTrigger>
          <UserReActivatePopUp userId={userId} />
        </Dialog>
      )}
      {userType === "Member" && (
        <Button
          className="bg-white hover:bg-white hover:cursor-pointer text-black shadow-none"
          onClick={handleDownloadInvoice}
        >
          Download Invoice
        </Button>
      )}
      {userType === "Member" && (
        <Button
          className="bg-white hover:bg-white hover:cursor-pointer text-black shadow-none"
          onClick={handleDownloadReport}
        >
          Download Report
        </Button>
      )}
    </PopoverContent>
  );
};

export default UserDetailPopUp;
