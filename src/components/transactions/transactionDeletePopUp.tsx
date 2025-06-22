import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { Input } from "../ui/input";
import { DeleteTransaction } from "@/types";
import { deleteTransaction } from "@/app/actions/transactionManagement";
import { toast } from "sonner";

interface TransactionDeletePopUpProps {
  transactionId: number | undefined;
}

const TransactionDeletePopUp: React.FC<TransactionDeletePopUpProps> = ({
  transactionId,
}) => {
  const [reason, setReason] = useState<string>("");

  const handleDelete = async () => {
    if (!reason) {
      toast.error("Please provide a reason for deletion.", {
        style: { backgroundColor: "red", color: "white" },
      });
      return;
    }

    const deleteData: DeleteTransaction = {
      rowOperation: "D",
      lastModified_at: new Date().toISOString(),
      remark: reason,
    };

    const { data, error } = await deleteTransaction(
      Number(transactionId),
      deleteData
    );

    if (error) {
      console.error("Error deleting transaction:", error);
      return;
    }
    if (data) {
      toast.success("Transaction deleted successfully!", {
        style: { backgroundColor: "green", color: "white" },
      });
      setReason("");
      window.location.reload();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"}>
          <Trash2 />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <div className="flex flex-col items-center justify-center space-y-4">
          <h2 className="text-lg font-semibold">Delete Transaction</h2>
          <p>Are you sure you want to delete this transaction?</p>
          <div className="flex space-x-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="bg-[#FE925E] hover:bg-[#FE925E]"
                >
                  Delete
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <h2 className="text-lg font-semibold">Type the Reason</h2>
                  <p>Why do you want to delete this transaction?</p>
                  <Input
                    className="w-[400px]"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    maxLength={60}
                    placeholder="Enter reason for deletion"
                  />
                  <div className="flex space-x-4">
                    <Button
                      variant="destructive"
                      className="bg-[#FE925E] hover:bg-[#FE925E]"
                      onClick={handleDelete}
                    >
                      Delete Transaction
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <DialogClose>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDeletePopUp;
