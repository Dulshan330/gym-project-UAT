"use client";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import * as z from "zod";
import { Card, CardContent } from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  CalendarIcon,
  Heart,
  IdCard,
  Mail,
  MapPin,
  Phone,
  User,
  Users,
} from "lucide-react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { personalInfoSchema } from "@/lib/z-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { validateEmailAndNIC } from "@/app/actions/memberManagement";
import { useAtom } from "jotai";
import {
  currentStepAtom,
  isMemberEditModeAtom,
  memberPersonalData,
} from "@/store/atom";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import {
  fetchUser,
  getSignedUrl,
  updateUser,
  uploadProfileImage,
} from "@/app/actions/userManagement";
import { Label } from "../ui/label";
import Image from "next/image";
import { getAllRoles } from "@/app/actions/rolesManagement";
import { Roles } from "@/types";

const PersonalInfoFormComponent = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get("user");
  const router = useRouter();

  const [, setCurrentStep] = useAtom(currentStepAtom);
  const [personalData, setPersonalData] = useAtom(memberPersonalData);
  const [isMemberEditMode] = useAtom(isMemberEditModeAtom);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrls, setImageUrls] = useState<string>("");
  const [roles, setRoles] = useState<Roles[]>([]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setImageUrls(URL.createObjectURL(file));
    }
  };

  const personalInfoForm = useForm<z.infer<typeof personalInfoSchema>>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      name: personalData?.name || "",
      identityType: "nic",
      nic: personalData?.nic || "",
      email: personalData?.email || "",
      dob: personalData?.dob || "",
      gender: personalData?.gender || "",
      address: personalData?.address || "",
      phone: personalData?.phone || "",
      role: personalData?.role || "",
    },
  });

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
  }, [isMemberEditMode, userId]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (isMemberEditMode && userId) {
        try {
          const userData = await fetchUser(Number(userId));
          personalInfoForm.reset({
            name: userData.username || "",
            nic: userData.nic || "",
            email: userData.email || "",
            dob: userData.date_of_birth || "",
            gender: userData.gender || "",
            address: userData.address || "",
            phone: userData.phone_number || "",
            role: String(userData.roles.id) || "",
          });
          const res = await getSignedUrl(userData.imagePath);
          if (res?.signedUrl) {
            setImageUrls(res.signedUrl);
          }
        } catch (error) {
          console.error("Failed to fetch user details:", error);
        }
      }
    };

    fetchUserDetails();
  }, [isMemberEditMode, userId]);

  const handleSaveAndExit = async (
    values: z.infer<typeof personalInfoSchema>
  ) => {
    try {
      const res = await uploadProfileImage(selectedFile);
      const updatedData = {
        id: Number(userId),
        nic: values.nic,
        username: values.name,
        user_type: "Member",
        phone_number: values.phone,
        email: values.email,
        date_of_birth: new Date(values.dob),
        status: "Active",
        gender: values.gender,
        address: values.address,
        imagePath: res,
        role: Number(values.role),
      };
      const response = await updateUser(updatedData);
      if (response.data) {
        toast.success("User details updated successfully!", {
          style: { background: "green", color: "white" },
        });
        router.back();
      }
      if (response.error) {
        toast.error(`${response.error}`, {
          style: { background: "red", color: "white" },
        });
      }
    } catch (error) {
      console.error("Error submitting personal info:", error);
    }
  };

  const handlePersonalInfoSubmit = async (
    values: z.infer<typeof personalInfoSchema>
  ) => {
    try {
      if (isMemberEditMode && userId) {
        const res = await uploadProfileImage(selectedFile);
        const updatedData = {
          id: Number(userId),
          nic: values.nic,
          username: values.name,
          user_type: "Member",
          phone_number: values.phone,
          email: values.email,
          date_of_birth: new Date(values.dob),
          status: "Active",
          gender: values.gender,
          address: values.address,
          imagePath: res,
          role: Number(values.role),
        };
        const response = await updateUser(updatedData);
        if (response.data) {
          toast.success("User details updated successfully!", {
            style: { background: "green", color: "white" },
          });
          setCurrentStep(2);
        }
        if (response.error) {
          toast.error(`${response.error}`, {
            style: { background: "red", color: "white" },
          });
        }
      } else {
        const response = await validateEmailAndNIC(values.email, values.nic);

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

        if (selectedFile && selectedFile?.size > 5 * 1024 * 1024) {
          toast.error("File size exceeds 5 MB limit!", {
            style: { background: "red", color: "white" },
          });
          return;
        }

        const res = await uploadProfileImage(selectedFile);

        setPersonalData({ ...values, imagePath: res });
        setCurrentStep(2);
      }
    } catch (error) {
      console.error("Error submitting personal info:", error);
    }
  };

  return (
    <Card className="bg-white mb-8 max-md:mx-3">
      <CardContent className="p-6 md:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-2xl font-medium text-gray-800">
            Personal Information
          </h1>
          <div className="mt-2 sm:mt-0">
            <p className="font-medium">
              Step 1{" "}
              <span className="text-gray-500">
                of {isMemberEditMode ? "2" : "4"}
              </span>
            </p>
          </div>
        </div>

        <div className="w-full bg-gray-200 h-2 rounded-full mb-8">
          <div
            className={`bg-gray-700 h-2 rounded-full  ${
              isMemberEditMode ? "w-1/2" : "w-1/4"
            }`}
          ></div>
        </div>

        <Form {...personalInfoForm}>
          <form
            onSubmit={personalInfoForm.handleSubmit(handlePersonalInfoSubmit)}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
              <FormField
                control={personalInfoForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Name</FormLabel>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-500">
                        <User size={20} />
                      </div>
                      <FormControl>
                        <Input
                          placeholder="Enter member's name"
                          className="pl-10 h-12"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={personalInfoForm.control}
                name="nic"
                render={({ field }) => (
                  <FormItem className="space-y-2 relative">
                    <FormLabel>NIC Number</FormLabel>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-500">
                        <IdCard size={20} />
                      </div>
                      <FormControl>
                        <Input
                          placeholder="Enter member's NIC number"
                          className="pl-10 h-12"
                          {...field}
                        />
                      </FormControl>
                      <FormField
                        control={personalInfoForm.control}
                        name="identityType"
                        render={({ field }) => (
                          <Select
                            {...field}
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="h-12 absolute right-0 bottom-1.5 border-none shadow-none focus:border-none">
                              <SelectValue placeholder="Select Identity Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="nic">NIC</SelectItem>
                              <SelectItem value="passport">Passport</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={personalInfoForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Email</FormLabel>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-500">
                        <Mail size={20} />
                      </div>
                      <FormControl>
                        <Input
                          placeholder="Enter member's email"
                          type="email"
                          className="pl-10 h-12"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={personalInfoForm.control}
                name="dob"
                render={({ field }) => {
                  const today = new Date();
                  const maxDate = today.toISOString().split("T")[0];
                  const minDate = "1960-01-01";

                  return (
                    <FormItem className="space-y-2">
                      <FormLabel>Date of Birth</FormLabel>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-500">
                          <CalendarIcon size={20} />
                        </div>
                        <FormControl>
                          <Input
                            type="date"
                            className="pl-10 h-12"
                            {...field}
                            max={maxDate}
                            min={minDate}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={personalInfoForm.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12">
                          <div className="flex items-center">
                            <Heart size={20} className="mr-2 text-gray-500" />
                            <SelectValue placeholder="Select gender" />
                          </div>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
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
                  <FormItem className="space-y-2">
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12">
                          <div className="flex items-center">
                            <Users size={20} className="mr-2 text-gray-500" />
                            <SelectValue placeholder="Select Role" />
                          </div>
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
            </div>

            <FormField
              control={personalInfoForm.control}
              name="address"
              render={({ field }) => (
                <FormItem className="mt-6 space-y-2">
                  <FormLabel>Address</FormLabel>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-500">
                      <MapPin size={20} />
                    </div>
                    <FormControl>
                      <Input
                        placeholder="Enter member's address"
                        className="pl-10 h-12"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={personalInfoForm.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="mt-6 space-y-2">
                  <FormLabel>Phone Number</FormLabel>
                  <div className="relative w-full md:w-1/2">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-500">
                      <Phone size={20} />
                    </div>
                    <FormControl>
                      <Input
                        placeholder="Enter member's phone number"
                        className="pl-10 h-12"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="my-6 space-y-4">
              <Label>Profile Photo</Label>
              <Input
                type="file"
                accept="image/*"
                multiple={false}
                ref={imageInputRef}
                hidden
                onChange={handleImageChange}
              />
              <Button
                type="button"
                variant={"outline"}
                onClick={() => imageInputRef.current?.click()}
              >
                Select Image
              </Button>
              {imageUrls && (
                <Image src={imageUrls} width={100} height={100} alt="url" />
              )}
            </div>

            <div className="mt-10 flex justify-end gap-2">
              {isMemberEditMode && (
                <Button
                  type="button"
                  variant={"outline"}
                  className="border border-black w-full sm:w-auto px-8 h-12 rounded-md"
                  onClick={() =>
                    handleSaveAndExit(personalInfoForm.getValues())
                  }
                >
                  Save and Exit
                </Button>
              )}
              <Button
                type="submit"
                className="bg-black hover:bg-gray-800 text-white w-full sm:w-auto px-8 h-12 rounded-md"
              >
                {isMemberEditMode ? "Save and Next" : "Next"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoFormComponent;
