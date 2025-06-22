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
import { addStaffMember, saveWorkingHours } from "@/app/actions/staffActions";
import addPersonalInfo from "@/app/actions/personalInfoActions";
import { toast } from "sonner";
import { Roles, Schedule } from "@/types";
import { useRouter } from "next/navigation";
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
import { getAllRoles } from "@/app/actions/rolesManagement";

export default function InformationForm() {
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);
  const [roles, setRoles] = useState<Roles[]>([]);

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

  // Personal Info Submit
  const handlePersonalInfoSubmit = async (
    values: z.infer<typeof personalInfoSchemaStaff>
  ) => {
    try {
      const response = await addPersonalInfo({
        username: values.name,
        nic: values.nic,
        email: values.email,
        date_of_birth: values.dateOfBirth,
        gender: values.gender,
        address: values.address,
        user_type: "Staff",
        phone_number: values.phone_number,
        status: "Active",
        role: Number(values.role),
      });

      if (response.error) {
        switch (response.error) {
          case "User email found":
            toast.error(
              "This email is already registered. Please use a different email.",
              { style: { background: "red", color: "white" } }
            );
            break;
          case "User NIC found":
            toast.error(
              "This NIC number is already registered. Please use a different NIC.",
              { style: { background: "red", color: "white" } }
            );
            break;
          default:
            console.log("Error submitting personal info:", response.error);
        }
        return;
      }

      if (response.data && response.data[0]?.id) {
        setUserId(response.data[0].id);
      } else {
        console.error("Failed to retrieve user ID from response:", response);
      }
      console.log("Personal Info Submitted:", response);
    } catch (error) {
      console.error("Error submitting personal info:", error);
    }
  };

  // Employment Info Submit
  const handleEmploymentInfoSubmit = async (
    values: z.infer<typeof employmentInfoSchema>
  ) => {
    if (!userId) {
      console.error("User ID is required to submit employment info.");
      return;
    }
    try {
      await saveWorkingHours(Number(userId), schedule);

      await addStaffMember({
        user_id: userId,
        bankName: values.bankName,
        accountHolder: values.accountHolder,
        branchName: values.branchName,
        accountNumber: values.accountNumber,
      });

      console.log("Employment Info Submitted");

      toast.success("Staff added successfully", {
        style: { background: "green", color: "white" },
      });
      router.push("/dashboard/users");
    } catch (error) {
      console.error("Error submitting employment info:", error);
    }
  };

  return (
    <div className="p-4">
      {!userId ? (
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
                        defaultValue={field.value}
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
                Submit Personal Info
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
                  Finished
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
}
