"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { MemberPersonalInfoType, PackagesData, Transaction } from "@/types";
import {
  fetchAllPackages,
  getUsersWithMultiMemberPackages,
} from "@/app/actions/packageManagement";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { cn } from "@/lib/utils";
import {
  assignPackageToMember,
  isPackageAssigned,
} from "@/app/actions/packageMemberAction";
import { toast } from "sonner";
import {
  addPrimaryUser,
  addRelationUser,
} from "@/app/actions/memberManagement";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { getExpireDate } from "@/lib/dates";
import { addNewTransaction } from "@/app/actions/transactionManagement";

interface AssignPackagePopUpProps {
  memberId: number;
}

const AssignPackagePopUp: React.FC<AssignPackagePopUpProps> = ({
  memberId,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [openSubDialog, setOpenSubDialog] = useState<boolean>(false);
  const [packagesLoading, setPackagesLoading] = useState<boolean>(false);
  const [packages, setPackages] = useState<PackagesData[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [pendingPlanId, setPendingPlanId] = useState<number | null>(null);
  const [dependMember, setDependMember] = useState<boolean>(false);
  const [showMemberSelect, setShowMemberSelect] = useState<boolean>(false);
  const [openCombo, setOpenCombo] = useState<boolean>(false);
  const [value, setValue] = useState("");
  const [members, setMembers] = useState<MemberPersonalInfoType[]>();
  const [isPrimaryMember, setIsPrimaryMember] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [planStartDate, setPlanStartDate] = useState<Date>(new Date());
  const [discount, setDiscount] = useState<string>("0");
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [customDiscount, setCustomDiscount] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const selectedPackage = packages.find((pkg) => pkg.id === selectedPlan);

  const today = new Date();
  const minDate = new Date(today);
  minDate.setDate(today.getDate() - 14); // 2 weeks ago
  const maxDate = new Date(today);
  maxDate.setMonth(today.getMonth() + 6); // 6 months ahead
  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const handleMulitipleMemeberForPackage = (
    value: number,
    noOfMember: number
  ) => {
    try {
      if (noOfMember > 1) {
        setPendingPlanId(value);
        setOpenSubDialog(true);
      } else {
        setSelectedPlan(value);
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  const handleOwnerConfirm = () => {
    setSelectedPlan(pendingPlanId);
    setOpenSubDialog(false);
    setPendingPlanId(null);
    setDependMember(false);
    setIsPrimaryMember(true);
  };

  const handleOwnerDeny = () => {
    setShowMemberSelect(true);
    setIsPrimaryMember(false);
  };

  const handleFetchingMembers = async () => {
    try {
      const response = await getUsersWithMultiMemberPackages();
      console.log("members ", response);

      setMembers(response as MemberPersonalInfoType[]);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  useEffect(() => {
    if (openSubDialog) handleFetchingMembers();
  }, [openSubDialog]);

  useEffect(() => {
    const getPackages = async () => {
      setPackagesLoading(true);
      try {
        const response = await fetchAllPackages();
        if (Array.isArray(response)) {
          setPackages(response);
        } else {
          console.error("Unexpected response format:", response);
        }
        const assigned = await isPackageAssigned(memberId);
        if (assigned && assigned.planId) {
          setSelectedPlan(assigned.planId);
        } else {
          setSelectedPlan(null);
        }
      } catch (error) {
        console.error("Error fetching packages:", error);
      } finally {
        setPackagesLoading(false);
      }
    };

    if (open) getPackages();
  }, [open]);

  const { total } = useMemo(() => {
    let discountValue = 0;

    if (discount === "custom" && customDiscount) {
      discountValue = parseFloat(customDiscount) || 0;
    } else {
      discountValue = parseInt(discount) || 0;
    }
    const price = selectedPackage?.packageTypes.price ?? 0;
    const calculatedDiscount = price * (discountValue / 100);
    const calculatedTotal = price - calculatedDiscount;
    setDiscountAmount(calculatedDiscount);

    return {
      total: calculatedTotal,
      discountAmount: calculatedDiscount,
    };
  }, [discount, customDiscount, selectedPackage?.packageTypes.price]);

  const handleSubmit = async () => {
    if (!selectedPlan) return;
    setIsProcessing(true);
    try {
      const endDate = getExpireDate(
        planStartDate.toISOString().split("T")[0],
        Number(selectedPackage?.packageTypes.noOfMonths)
      );
      const res = await assignPackageToMember(
        memberId,
        selectedPlan,
        planStartDate,
        new Date(endDate)
      );

      const transactionData: Transaction = {
        memberId: memberId,
        amount: selectedPackage?.packageTypes.price,
        paymentMethod: paymentMethod,
        transactionTypeId: 1,
        discountAmount: Number(discountAmount) || 0,
        discountPercentage:
          (discount === "custom" ? Number(customDiscount) : Number(discount)) ||
          0,
        finalAmount: total,
        rowOperation: "I",
      };
      await addNewTransaction(transactionData);

      if (isPrimaryMember) {
        await addPrimaryUser(memberId);
      }
      if (dependMember) {
        await addRelationUser(Number(value), memberId);
      }

      if (res.data) {
        toast.success("Package assigned successfully!", {
          style: { background: "green", color: "white" },
        });
        setOpen(false);
        window.location.reload();
      }
      if (res.error) {
        toast.error("Package assigned failed!", {
          style: { background: "red", color: "white" },
        });
        return;
      }
    } catch (error) {
      console.error("Error assigning package:", error);
      toast.error("An error occurred while assigning the package.", {
        style: { background: "red", color: "white" },
      });
    } finally {
      setIsProcessing(false);
      setCurrentStep(1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-fit">
          <Plus /> Assign Package
        </Button>
      </DialogTrigger>

      {currentStep === 1 ? (
        <div>
          <DialogContent className="sm:max-w-[750px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Assign Package</DialogTitle>
            </DialogHeader>
            <div className="overflow-y-auto py-2">
              {packagesLoading ? (
                <div className="flex justify-center items-center h-40">
                  <p>Loading packages...</p>
                </div>
              ) : packages.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {packages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className={`border rounded-lg p-6 cursor-pointer transition-all ${
                        selectedPlan === pkg.id
                          ? "border-black bg-gray-50 shadow-md"
                          : "border-gray-200 hover:shadow-sm"
                      }`}
                      onClick={() =>
                        handleMulitipleMemeberForPackage(
                          pkg.id,
                          pkg.number_of_members ?? 1
                        )
                      }
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="text-xl font-semibold">
                            {pkg.package_name}
                          </h2>
                          <p className="text-sm text-gray-500 mt-1">
                            {pkg.packageTypes?.packageTypeName ||
                              "Standard Package"}
                          </p>
                        </div>
                        {(selectedPlan === pkg.id ||
                          pendingPlanId === pkg.id) && (
                          <div className="bg-black text-white rounded-full p-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </div>

                      <div className="mt-4">
                        <span className="text-2xl font-bold">
                          ${pkg.packageTypes?.price.toFixed(2) || "0.00"}
                        </span>
                      </div>

                      <div className="mt-4 text-sm">
                        <p>Members: {pkg.number_of_members || "Unlimited"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500">
                    No packages available. Please add packages first.
                  </p>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                onClick={() => {
                  setCurrentStep(2);
                }}
                disabled={!selectedPlan}
              >
                Next
              </Button>
            </DialogFooter>
          </DialogContent>
          <Dialog
            open={openSubDialog}
            onOpenChange={(val) => {
              setOpenSubDialog(val);
              if (!val) {
                setShowMemberSelect(false);
                setPendingPlanId(null);
              }
            }}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Package Owner</DialogTitle>
                <DialogDescription>Are you package owner?</DialogDescription>
              </DialogHeader>
              {!showMemberSelect ? (
                <div className="flex justify-around">
                  <Button className="w-1/3" onClick={handleOwnerConfirm}>
                    Yes
                  </Button>
                  <Button className="w-1/3" onClick={handleOwnerDeny}>
                    No
                  </Button>
                </div>
              ) : (
                <div className="space-y-4 mt-4">
                  <Label>Select existing member:</Label>
                  <Popover open={openCombo} onOpenChange={setOpenCombo}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openCombo}
                        className="w-[350px] justify-between"
                      >
                        {value
                          ? members?.find(
                              (member) => member.id?.toString() === value
                            )?.username
                          : "Select Member..."}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[350px] p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search Member..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No Members found.</CommandEmpty>
                          <CommandGroup>
                            {(members || []).map((member) => (
                              <CommandItem
                                key={member.id}
                                value={member.id?.toString()}
                                keywords={[member.username || ""]}
                                onSelect={(currentValue) => {
                                  setValue(
                                    currentValue === value ? "" : currentValue
                                  );
                                  setOpenSubDialog(false);
                                  setShowMemberSelect(false);
                                  setSelectedPlan(pendingPlanId);
                                  setOpenSubDialog(false);
                                  setPendingPlanId(null);
                                  setDependMember(true);
                                }}
                              >
                                {member.username}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    value === member.id?.toString()
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <DialogContent className="sm:max-w-[750px] max-h-[80vh] overflow-y-auto">
          <Card className="w-full border-none shadow-none">
            <CardContent className="px-6">
              <div className="mb-6">
                <h1 className="text-2xl font-medium text-gray-800">
                  Payment Summary
                </h1>
                <hr />
              </div>

              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">
                    {selectedPackage?.package_name}
                  </h2>
                  <p className="text-2xl font-bold">
                    LKR {selectedPackage?.packageTypes.price.toFixed(2)}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-normal">
                    Select package start date
                  </Label>
                  <Input
                    type="date"
                    value={planStartDate.toISOString().split("T")[0]}
                    onChange={(e) => setPlanStartDate(new Date(e.target.value))}
                    min={formatDate(minDate)}
                    max={formatDate(maxDate)}
                    className="w-fit"
                  />
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Select discount</h3>
                  <RadioGroup
                    value={discount}
                    onValueChange={setDiscount}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="0" id="none" />
                      <Label htmlFor="none">None</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="5" id="5" />
                      <Label htmlFor="5">5%</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="10" id="10" />
                      <Label htmlFor="10">10%</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="custom" id="custom" />
                      <Label htmlFor="custom">Custom</Label>
                    </div>
                  </RadioGroup>

                  {discount === "custom" && (
                    <div className="mt-3 flex items-center">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none"></div>
                        <Input
                          type="number"
                          value={customDiscount}
                          onChange={(e) => setCustomDiscount(e.target.value)}
                          className="pl-12 h-10 w-32"
                          placeholder="0"
                          min="0"
                          max="100"
                        />
                      </div>
                      <span className="ml-2">%</span>
                    </div>
                  )}

                  {discount !== "0" && (
                    <p className="mt-2 text-sm text-green-600">
                      You&apos;ve got{" "}
                      {discount === "custom"
                        ? `${customDiscount || "0"}%`
                        : `${discount}%`}{" "}
                      discount from the GYM!
                    </p>
                  )}
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-lg font-medium mb-2">Total to Pay</h3>
                  <p className="text-2xl font-bold">LKR {total.toFixed(2)}</p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Payment Method</h3>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className="flex flex-col gap-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card">Card</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cash" id="cash" />
                      <Label htmlFor="cash">Cash</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="bank-transfer"
                        id="bank-transfer"
                      />
                      <Label htmlFor="bank-transfer">Bank Transfer</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* <div className="mt-6 pt-4 border-t">
                  <p className="font-medium">{personalData?.name}</p>
                  <p className="text-gray-600">{personalData?.email}</p>
                </div> */}

                <div className="flex justify-between mt-10">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-black text-black hover:bg-gray-100"
                    onClick={() => {
                      setCurrentStep(1);
                    }}
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    className="bg-black hover:bg-gray-800 text-white px-8 h-12"
                    onClick={handleSubmit}
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processing..." : "Complete Payment"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default AssignPackagePopUp;
