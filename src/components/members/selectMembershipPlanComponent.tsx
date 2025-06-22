"use client";
import * as z from "zod";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { MedicalDataType, MemberPersonalInfoType, PackagesData } from "@/types";
import addMemberPersonalInfo, {
  addMedicalInfo,
  addRelationUser,
} from "@/app/actions/memberManagement";
import {
  fetchAllPackages,
  getUsersWithMultiMemberPackages,
} from "@/app/actions/packageManagement";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { membershipPlanSchema } from "@/lib/z-schema";
import { Form } from "../ui/form";
import { useAtom } from "jotai";
import {
  currentStepAtom,
  isMultipleMemberPackageAtom,
  memberCompleteDataAtom,
  memberPersonalData,
} from "@/store/atom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { cn } from "@/lib/utils";

const SelectMembershipPlanComponent = () => {
  const [, setCurrentStep] = useAtom(currentStepAtom);
  const [personalData] = useAtom(memberPersonalData);
  const [memberCompleteData, setMemberCompleteData] = useAtom(
    memberCompleteDataAtom
  );
  const [, setIsMultipleMemberPackage] = useAtom(isMultipleMemberPackageAtom);

  // const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [packagesLoading, setPackagesLoading] = useState(false);
  const [packages, setPackages] = useState<PackagesData[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [pendingPlanId, setPendingPlanId] = useState<number | null>(null);
  const [showMemberSelect, setShowMemberSelect] = useState<boolean>(false);
  const [openCombo, setOpenCombo] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [members, setMembers] = useState<MemberPersonalInfoType[]>();
  const [dependMember, setDependMember] = useState<boolean>(false);

  const membershipPlanInfo = useForm<z.infer<typeof membershipPlanSchema>>({
    resolver: zodResolver(membershipPlanSchema),
    defaultValues: {
      trainer: memberCompleteData?.trainer || undefined,
    },
  });

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
    handleFetchingMembers();
  }, []);

  const handleMulitipleMemeberForPackage = (
    value: number,
    noOfMember: number
  ) => {
    try {
      if (noOfMember > 1) {
        setPendingPlanId(value);
        setOpen(true);
      } else {
        setSelectedPlan(value);
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  const handleOwnerConfirm = () => {
    setSelectedPlan(pendingPlanId);
    setOpen(false);
    setPendingPlanId(null);
    setDependMember(false);
    setIsMultipleMemberPackage(true);
  };

  const handleOwnerDeny = () => {
    setShowMemberSelect(true);
    setIsMultipleMemberPackage(true);
  };

  // useEffect(() => {
  //   const getTrainers = async () => {
  //     try {
  //       const response = await fetchTrainers();
  //       if (Array.isArray(response)) {
  //         setTrainers(response);
  //       } else if (response.error) {
  //         console.error("Error fetching trainers:", response.error);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching trainers:", error);
  //     }
  //   };

  //   getTrainers();
  // }, []);

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
      } catch (error) {
        console.error("Error fetching packages:", error);
      } finally {
        setPackagesLoading(false);
      }
    };

    getPackages();
  }, []);

  const onSubmit = async (values: z.infer<typeof membershipPlanSchema>) => {
    setMemberCompleteData((prev) => ({
      ...(prev || {}),
      trainer_id: values.trainer,
      plan_id: selectedPlan?.toString(),
    }));

    if (dependMember) {
      const response = await addMemberPersonalInfo({
        username: personalData?.name,
        nic: personalData?.nic || "",
        email: personalData?.email || "",
        date_of_birth: personalData?.dob,
        gender: personalData?.gender || "",
        address: personalData?.address,
        phone_number: personalData?.phone,
        user_type: "Member",
        status: "Active",
        joined_of_date: new Date().toISOString(),
        role:Number(personalData?.role) || 0
      });
      if (
        !response ||
        !response.data ||
        !Array.isArray(response.data) ||
        !response.data[0]?.id
      ) {
        console.log("Error: No valid user ID returned.");
        return;
      }

      const memberData: MedicalDataType = {
        user_id: response.data[0]?.id || "",
        trainer_id: values.trainer || "",
        plan_id: selectedPlan?.toString() || "",
        weight: memberCompleteData?.weight || "",
        height: memberCompleteData?.height || "",
        occupation: memberCompleteData?.occupation || "",
        physical_activities: memberCompleteData?.physical_activities || "",
        health_conditions: memberCompleteData?.health_conditions || "",
        medications: memberCompleteData?.medications || "",
        emergency_name: memberCompleteData?.emergency_name || "",
        emergency_contact: memberCompleteData?.emergency_contact || "",
        emergency_relationship:
          memberCompleteData?.emergency_relationship || "",
        fitness_goals: memberCompleteData?.fitness_goals || [],
        allergies: memberCompleteData?.allergies || "",
        exercise_history: memberCompleteData?.exercise_history || "",
        recent_injuries: memberCompleteData?.recent_injuries || "",
        heart_condition: memberCompleteData?.heart_condition || false,
        blood_pressure: memberCompleteData?.blood_pressure || false,
        diabetes: memberCompleteData?.diabetes || false,
        asthma: memberCompleteData?.asthma || false,
        pregnancy_status: memberCompleteData?.pregnancy_status || "",
        consent_to_exercise: memberCompleteData?.consent_to_exercise || false,
        liability_waiver: memberCompleteData?.liability_waiver || false,
      };

      await addMedicalInfo(memberData);
      await addRelationUser(Number(value), Number(response.data[0]?.id));

      setCurrentStep(6);
    } else {
      setMemberCompleteData((prev) => ({
        ...(prev || {}),
        trainer_id: values.trainer,
        plan_id: selectedPlan?.toString(),
      }));
      setCurrentStep(4);
    }
  };

  return (
    <Card className="w-full max-w-5xl mx-auto bg-white max-md:mx-3">
      <CardContent className="p-6 md:p-8">
        <Form {...membershipPlanInfo}>
          <form onSubmit={membershipPlanInfo.handleSubmit(onSubmit)}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <h1 className="text-2xl font-medium text-gray-800">
                Select Membership Plan
              </h1>
              <div className="mt-2 sm:mt-0">
                <p className="font-medium">
                  Step 3 <span className="text-gray-500">of 4</span>
                </p>
              </div>
            </div>

            <div className="w-full bg-gray-200 h-2 rounded-full mb-8">
              <div className={`bg-gray-700 h-2 rounded-full w-3/4`}></div>
            </div>
            {/* <div className="mt-6 space-y-2 flex p-4">
              <FormField
                control={membershipPlanInfo.control}
                name="trainer"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <Label htmlFor="trainer">Select Trainer:</Label>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                    >
                      <SelectTrigger className="h-4 ml-2 mb-2">
                        <SelectValue placeholder="Select trainer" />
                      </SelectTrigger>
                      <SelectContent>
                        {trainers.map((trainer) => (
                          <SelectItem key={trainer.id} value={trainer.id}>
                            {trainer.username}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div> */}

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
                      {selectedPlan === pkg.id && (
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

            <div className="flex justify-between mt-10">
              <Button
                type="button"
                className="bg-white border border-black text-black px-8 h-12 hover:bg-white"
                onClick={() => {
                  setCurrentStep(2);
                }}
              >
                Back
              </Button>
              <Button
                type="submit"
                className="bg-black hover:bg-gray-800 text-white px-8 h-12"
                disabled={!selectedPlan || packagesLoading}
              >
                {packagesLoading
                  ? "Loading..."
                  : dependMember
                  ? "Done"
                  : "Proceed to Payment"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <Dialog
        open={open}
        onOpenChange={(val) => {
          setOpen(val);
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
                              setOpen(false);
                              setShowMemberSelect(false);
                              handleOwnerConfirm();
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
    </Card>
  );
};

export default SelectMembershipPlanComponent;
