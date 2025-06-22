"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
import { updateTrainerInfo } from "@/app/actions/staffActions";
import { Roles, TrainerDataType } from "@/types";
import { toast } from "sonner";
import {
  medicalInfoSchemaTrainer,
  personalInfoSchemaTrainer,
} from "@/lib/z-schema";
import { useRouter, useSearchParams } from "next/navigation";
import {
  fetchSingleTrainerDetails,
  fetchUser,
  updateUser,
} from "@/app/actions/userManagement";
import { getAllRoles } from "@/app/actions/rolesManagement";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type PersonalInfoFormValues = {
  name: string;
  nic: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  phone_number: string;
  role: string;
};

type MedicalFormValues = z.infer<typeof medicalInfoSchemaTrainer>;

export default function TrainerMedicalClearance() {
  const searchParams = useSearchParams();
  const searchUserId = searchParams.get("user");
  const router = useRouter();

  const [roles, setRoles] = useState<Roles[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(1);

  useEffect(() => {
    const retrieveRoles = async () => {
      try {
        const { data } = await getAllRoles();
        if (data) {
          setRoles(data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    retrieveRoles();
  }, []);

  const personalForm = useForm({
    resolver: zodResolver(personalInfoSchemaTrainer),
    defaultValues: {
      name: "",
      nic: "",
      email: "",
      dateOfBirth: "",
      gender: "",
      address: "",
      phone_number: "",
      role: "",
    },
  });

  const medicalForm = useForm({
    resolver: zodResolver(medicalInfoSchemaTrainer),
    defaultValues: {
      weight: "",
      height: "",
      occupation: "",
      workSchedule: "",
      physicalActivities: "",
      healthConditions: "",
      medications: "",
      therapies: "",
      injuries: "",
      injuryTheraphy: "",
      familyHeartDisease: "",
      familyDisease: "",
      healthConditionHistory: "",
      smokingDetails: "",
    },
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (searchUserId) {
        const userData = await fetchUser(Number(searchUserId));
        try {
          personalForm.reset({
            name: userData.username,
            nic: userData.nic,
            email: userData.email,
            dateOfBirth: userData.date_of_birth,
            gender: userData.gender,
            address: userData.address,
            phone_number: userData.phone_number,
            role: String(userData.roles.id),
          });
        } catch (error) {
          console.error("Failed to fetch user details:", error);
        }
      }
    };

    fetchUserDetails();
  }, [searchUserId]);

  const fetchTrainerInfo = async () => {
    if (searchUserId) {
      const res = await fetchSingleTrainerDetails(Number(searchUserId));
      try {
        medicalForm.reset({
          weight: res.weight,
          height: res.height,
          occupation: res.occupation,
          workSchedule: res.workSchedule,
          physicalActivities: res.physical_activities,
          healthConditions: res.health_problems,
          medications: res.medications,
          therapies: res.therapies,
          injuries: res.injuries,
          injuryTheraphy: res.injuryTheraphy,
          familyHeartDisease: res.familyHeartDisease,
          familyDisease: res.familyDisease,
          healthConditionHistory: res.healthConditionHistory,
          smokingDetails: res.smokingDetails,
        });
      } catch (error) {
        console.error("Failed to fetch trainer details:", error);
      }
    }
  };

  // update personal info
  const handlePersonalInfoSubmit = async (values: PersonalInfoFormValues) => {
    try {
      const updatedData = {
        id: Number(searchUserId),
        username: values.name,
        nic: values.nic,
        user_type: "Trainer",
        phone_number: values.phone_number,
        email: values.email,
        date_of_birth: new Date(values.dateOfBirth),
        status: "Active",
        gender: values.gender,
        address: values.address,
        role: Number(values.role),
      };

      const response = await updateUser(updatedData);

      if (response.error) {
        toast.error("The personal information is not updated!", {
          style: { background: "red", color: "white" },
        });
      } else {
        toast.error("The personal information is updated!", {
          style: { background: "green", color: "white" },
        });
        setCurrentStep(2);
        await fetchTrainerInfo();
        // await fetchRolesForTrainer();
      }
    } catch (error) {
      console.error("Error submitting personal info:", error);
    }
  };

  const handleMedicalFormSubmit = async (values: MedicalFormValues) => {
    if (!searchUserId) {
      console.error("User ID is required to submit medical information.");
      return;
    }
    try {

      const trainerData: TrainerDataType = {
        user_id: searchUserId,
        weight: values.weight,
        height: values.height,
        occupation: values.occupation,
        workSchedule: values.workSchedule,
        physical_activities: values.physicalActivities,
        health_problems: values.healthConditions,
        medications: values.medications,
        therapies: values.therapies,
        injuries: values.injuries,
        injuryTheraphy: values.injuryTheraphy,
        familyHeartDisease: values.familyHeartDisease,
        familyDisease: values.familyDisease,
        healthConditionHistory: values.healthConditionHistory,
        smokingDetails: values.smokingDetails,
      };
      const res = await updateTrainerInfo(Number(searchUserId), trainerData);

      if (res.error) {
        toast.error("The staff information is not updated!", {
          style: { background: "red", color: "white" },
        });
        return;
      }

      toast.success("Trainer updated successfully", {
        style: { background: "green", color: "white" },
      });
      router.push("/dashboard/users");
    } catch (error) {
      console.error("Error submitting trainer info:", error);
    }
  };

  return (
    <>
      {currentStep === 1 ? (
        <div className="p-4">
          <h2 className="text-2xl font-semibold mt-4 mb-4">
            Personal Information
          </h2>
          <Form {...personalForm}>
            <form
              onSubmit={personalForm.handleSubmit(handlePersonalInfoSubmit)}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormField
                  control={personalForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Your Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={personalForm.control}
                  name="nic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>NIC Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Your NIC Number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={personalForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Your Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={personalForm.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Your Phone Number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={personalForm.control}
                  name="dateOfBirth"
                  render={({ field }) => {
                    const today = new Date();
                    const maxDate = today.toISOString().split("T")[0];
                    const minDate = "1960-01-01";
                    return (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            max={maxDate}
                            min={minDate}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={personalForm.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={personalForm.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {roles.map((role, index) => (
                            <SelectItem key={index} value={role.id.toString()}>
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={personalForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Your Address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                type="submit"
                className="bg-black p-4 px-15 text-white hover:bg-gray-800 w-full sm:w-auto"
              >
                Save and Next
              </Button>
            </form>
          </Form>
        </div>
      ) : (
        <div className="p-4">
          <h2 className="text-2xl font-semibold mt-10 mb-4">
            Trainer Medical Clearance
          </h2>
          <Form {...medicalForm}>
            <form
              onSubmit={medicalForm.handleSubmit(handleMedicalFormSubmit)}
              className="space-y-10"
            >
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormField
                  control={medicalForm.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight (Kg)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter weight"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={medicalForm.control}
                  name="height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Height (cm)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter height"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={medicalForm.control}
                name="occupation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What do you do for a living?</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter occupation" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={medicalForm.control}
                name="workSchedule"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Do you follow a regular working schedule, do you work
                      days, afternoon or nights?
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Yes/No or shift details" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={medicalForm.control}
                name="physicalActivities"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Physical activities outside work and gym
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Swimming, Running" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Textareas for Health Conditions, Medications, Therapies, etc. */}
              {[
                {
                  name: "healthConditions",
                  label: "Diagnosed Health Problems",
                },
                { name: "medications", label: "Medications" },
                {
                  name: "therapies",
                  label: "Additional Therapies for Health Problems",
                },
                { name: "injuries", label: "Injuries" },
                { name: "injuryTheraphy", label: "Therapies for Injuries" },
                {
                  name: "familyHeartDisease",
                  label:
                    "Has anyone in your immediate family developed heart disease before the age of 60?",
                  type: "radio",
                },
                {
                  name: "familyDisease",
                  label: "Do any diseases run in your family?",
                  type: "radio",
                },
                {
                  name: "healthConditionHistory",
                  label:
                    "Do you suffer from diabetes, asthma, high or low blood pressure?",
                  type: "radio",
                },
                {
                  name: "smokingDetails",
                  label: "Are you a current cigarette smoker?",
                  type: "radio",
                },
              ].map((item) => (
                <FormField
                  key={item.name}
                  control={medicalForm.control}
                  name={item.name as keyof MedicalFormValues}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{item.label}</FormLabel>
                      <FormControl>
                        {item.type === "radio" ? (
                          <div className="flex gap-4">
                            <label className="flex items-center gap-2">
                              <input
                                type="radio"
                                value="Yes"
                                checked={field.value === "Yes"}
                                onChange={() => field.onChange("Yes")}
                              />
                              Yes
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="radio"
                                value="No"
                                checked={field.value === "No"}
                                onChange={() => field.onChange("No")}
                              />
                              No
                            </label>
                          </div>
                        ) : (
                          <Textarea placeholder={item.label} {...field} />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              <Button
                type="submit"
                className="bg-black p-4 px-15 text-white hover:bg-gray-800 w-full sm:w-auto"
              >
                Save
              </Button>
            </form>
          </Form>
        </div>
      )}
    </>
  );
}
