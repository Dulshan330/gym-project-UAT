import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { fetchTrainers } from "@/app/actions/memberManagement";
import { toast } from "sonner";
import { Trainer } from "@/types";
import {
  assignTrainerToMember,
  isTrainerAssigned,
} from "@/app/actions/trainerMemberAction";
import { Plus } from "lucide-react";

export default function AssignTrainerPopUp({ memberId }: { memberId: number }) {
  const [open, setOpen] = useState<boolean>(false);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [selectedTrainer, setSelectedTrainer] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    async function loadTrainers() {
      setIsLoading(true);
      try {
        const response = await fetchTrainers();
        if (Array.isArray(response)) {
          setTrainers(response);
        } else if (response.error) {
          console.error("Error fetching trainers:", response.error);
        }
        // Fetch assigned trainer
        const assigned = await isTrainerAssigned(memberId);
        if (assigned && assigned.trainerId) {
          setSelectedTrainer(String(assigned.trainerId));
        } else {
          setSelectedTrainer("");
        }
      } catch (error) {
        console.error("Error loading trainers:", error);
      } finally {
        setIsLoading(false);
      }
    }
    if (open) loadTrainers();
  }, [open]);

  const handleAssign = async () => {
    if (!selectedTrainer) return;
    const res = await assignTrainerToMember(
      Number(memberId),
      Number(selectedTrainer)
    );
    if (res.data) {
      toast.success("Trainer assigned successfully!", {
        style: { background: "green", color: "white" },
      });
      setOpen(false);
    }
    if (res.error) {
      toast.error("Trainer assigned failed!", {
        style: { background: "red", color: "white" },
      });
      return;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-fit">
          <Plus /> Assign Trainer
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Trainer</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex w-full justify-center">
            <div className="w-6 h-6 border-4 border-t-white border-gray-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <Select value={selectedTrainer} onValueChange={setSelectedTrainer}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a trainer" />
            </SelectTrigger>
            <SelectContent>
              {trainers.map((trainer: Trainer) => (
                <SelectItem key={trainer.id} value={String(trainer.id)}>
                  {trainer.username}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <DialogFooter>
          <Button onClick={handleAssign} disabled={!selectedTrainer}>
            Assign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
