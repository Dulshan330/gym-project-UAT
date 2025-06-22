"use client";

import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import {
  fetchWorkingHours,
  updateStaffInfo,
  updatingWorkingHours,
} from "@/app/actions/staffActions";
import { toast } from "sonner";
import { Roles, Schedule } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { employmentInfoSchema, personalInfoSchemaStaff } from "@/lib/z-schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  fetchSingleStaffDetails,
  fetchUser,
  updateUser,
} from "@/app/actions/userManagement";
import { getAllRoles } from "@/app/actions/rolesManagement";

export default function InformationForm() {
  const searchParams = useSearchParams();
  const searchUserId = searchParams.get("user");
  const router = useRouter();

  const [roles, setRoles] = useState<Roles[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(1);

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

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

  const [schedule, setSchedule] = useState<Schedule>(
    days.reduce((acc, day) => {
      const lowerDay = day.toLowerCase();
      return {
        ...acc,
        [lowerDay]: {
          enabled: false,
          startTime: "",
          endTime: "",
        },
      };
    }, {})
  );

  const handleCheckboxChange = (day: string, enabled: boolean) => {
    setSchedule((prev) => ({
      ...prev,
      [day.toLowerCase()]: {
        ...prev[day.toLowerCase()],
        enabled,
      },
    }));
  };

  const handleTimeChange = (
    day: string,
    field: "startTime" | "endTime",
    value: string
  ) => {
    setSchedule((prev) => ({
      ...prev,
      [day.toLowerCase()]: {
        ...prev[day.toLowerCase()],
        [field]: value,
      },
    }));
  };

  const personalInfoForm = useForm<z.infer<typeof personalInfoSchemaStaff>>({
    resolver: zodResolver(personalInfoSchemaStaff),
    defaultValues: {
      name: "",
      nic: "",
      email: "",
      dateOfBirth: "",
      gender: undefined,
      address: "",
      phone_number: "",
      role: "",
    },
  });

  const employmentInfoForm = useForm<z.infer<typeof employmentInfoSchema>>({
    resolver: zodResolver(employmentInfoSchema),
    defaultValues: {
      bankName: "",
      accountHolder: "",
      branchName: "",
      accountNumber: "",
    },
  });

  // fetch user info
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (searchUserId) {
        const userData = await fetchUser(Number(searchUserId));
        try {
          personalInfoForm.reset({
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

    const fetchStaffInfo = async () => {
      if (searchUserId) {
        const res = await fetchSingleStaffDetails(Number(searchUserId));
        try {
          employmentInfoForm.reset({
            bankName: res.bankName,
            accountHolder: res.accountHolder,
            branchName: res.branchName,
            accountNumber: res.accountNumber,
          });
        } catch (error) {
          console.error("Failed to fetch staff details:", error);
        }
      }
    };

    // Fetch working hours and set schedule
    const fetchAndSetWorkingHours = async () => {
      if (!searchUserId) return;
      const workingHours = await fetchWorkingHours(Number(searchUserId));
      console.log(workingHours);

      if (Array.isArray(workingHours)) {
        setSchedule((prev) => {
          // Reset all days to default first
          const updated = { ...prev };
          Object.keys(updated).forEach((day) => {
            updated[day] = { enabled: false, startTime: "", endTime: "" };
          });
          // Update with fetched data
          workingHours.forEach((item) => {
            const dayName = [
              "sunday",
              "monday",
              "tuesday",
              "wednesday",
              "thursday",
              "friday",
              "saturday",
            ][item.day_of_week];
            if (dayName && updated[dayName]) {
              updated[dayName] = {
                enabled: true,
                startTime: item.start_time,
                endTime: item.end_time,
              };
            }
          });
          return updated;
        });
      }
    };

    fetchUserDetails();
    fetchStaffInfo();
    // fetchRoles();
    fetchAndSetWorkingHours();
  }, [searchUserId]);

  // Personal Info update
  const handlePersonalInfoSubmit = async (
    values: z.infer<typeof personalInfoSchemaStaff>
  ) => {
    try {
      const updatedData = {
        id: Number(searchUserId),
        username: values.name,
        nic: values.nic,
        user_type: "Staff",
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
      }
    } catch (error) {
      console.error("Error submitting personal info:", error);
    }
  };

  // Employment Info update
  const handleEmploymentInfoSubmit = async (
    values: z.infer<typeof employmentInfoSchema>
  ) => {
    if (!searchUserId) {
      console.error("User ID is required to submit employment info.");
      return;
    }
    try {
      const res = await updateStaffInfo(Number(searchUserId), {
        user_id: searchUserId,
        bankName: values.bankName,
        accountHolder: values.accountHolder,
        branchName: values.branchName,
        accountNumber: values.accountNumber,
      });

      if (res.error) {
        toast.error("The staff information is not updated!", {
          style: { background: "red", color: "white" },
        });
        return;
      }

      await updatingWorkingHours(Number(searchUserId), schedule);

      console.log("Employment Info updated");

      toast.success("The personal information is updated!", {
        style: { background: "green", color: "white" },
      });
      router.push("/dashboard/users");
    } catch (error) {
      console.error("Error updatting employment info:", error);
    }
  };

  return (
    <div className="p-4">
      {currentStep === 1 ? (
        <div>
          <h2 className="text-2xl font-semibold mt-4 mb-4">
            Personal Information
          </h2>
          <Form {...personalInfoForm}>
            <form
              onSubmit={personalInfoForm.handleSubmit(handlePersonalInfoSubmit)}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormField
                  control={personalInfoForm.control}
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
                  control={personalInfoForm.control}
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
                  control={personalInfoForm.control}
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
                  control={personalInfoForm.control}
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
                  control={personalInfoForm.control}
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
                  control={personalInfoForm.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={personalInfoForm.control}
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
                  control={personalInfoForm.control}
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
        <div>
          <h2 className="text-2xl font-semibold mt-4 mb-4">
            Employment Information
          </h2>
          <Form {...employmentInfoForm}>
            <form
              onSubmit={employmentInfoForm.handleSubmit(
                handleEmploymentInfoSubmit
              )}
              className="space-y-6"
            >
              <div className="w-1/2 space-y-3">
                <FormLabel>Working Time</FormLabel>
                <Table className="border">
                  <TableHeader>
                    <TableRow className="flex">
                      <TableHead className="flex-1 flex justify-start items-center">
                        Day
                      </TableHead>
                      <TableHead className="flex-1 flex justify-start items-center">
                        Start Time
                      </TableHead>
                      <TableHead className="flex-1 flex justify-start items-center">
                        End Time
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {days.map((day) => {
                      const lowerDay = day.toLowerCase();
                      const daySchedule = schedule[lowerDay];

                      return (
                        <TableRow key={day} className="flex items-stretch">
                          <TableCell className="flex flex-1 justify-baseline items-center space-x-2">
                            <FormLabel htmlFor={lowerDay}>{day}</FormLabel>
                            <Checkbox
                              id={lowerDay}
                              checked={daySchedule.enabled}
                              onCheckedChange={(checked) =>
                                handleCheckboxChange(day, !!checked)
                              }
                            />
                          </TableCell>
                          <TableCell className="flex-1">
                            <Input
                              type="time"
                              id={`${lowerDay}Start`}
                              disabled={!daySchedule.enabled}
                              value={daySchedule.startTime}
                              onChange={(e) =>
                                handleTimeChange(
                                  day,
                                  "startTime",
                                  e.target.value
                                )
                              }
                            />
                          </TableCell>
                          <TableCell className="flex-1">
                            <Input
                              type="time"
                              id={`${lowerDay}End`}
                              disabled={!daySchedule.enabled}
                              value={daySchedule.endTime}
                              onChange={(e) =>
                                handleTimeChange(day, "endTime", e.target.value)
                              }
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              <h3 className="text-2xl font-xl font-light mt-6 mb-4">
                Bank Account Details
              </h3>

              <div className="space-y-4">
                {[
                  "bankName",
                  "accountHolder",
                  "branchName",
                  "accountNumber",
                ].map((fieldName) => (
                  <FormField
                    key={fieldName}
                    control={employmentInfoForm.control}
                    name={
                      fieldName as keyof z.infer<typeof employmentInfoSchema>
                    }
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {fieldName
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) => str.toUpperCase())}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={`Enter Your ${fieldName}`}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              <div className="flex flex-col sm:flex-row justify-center sm:justify-end mt-6 space-y-3 sm:space-y-0 sm:space-x-4 w-full">
                <Button
                  variant="outline"
                  className="border-black p-4 px-15 text-black hover:bg-gray-100 w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-black p-4 px-15 text-white hover:bg-gray-800 w-full sm:w-auto"
                >
                  Save
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
}
