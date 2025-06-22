"use client";
import { format } from "date-fns";
import { fetchUser, updateUser } from "@/app/actions/userManagement";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UsersData } from "@/types";
import { CalendarIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const UserEditPage = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get("user");
  const router = useRouter();

  const [user, setUser] = useState<UsersData>({
    id: Number(userId),
    email: "",
    nic: "",
    username: "",
    status: "",
    user_type: "",
    phone_number: "",
    date_of_birth: null,
    joined_of_date: null,
    expire_date: null,
    gender: "",
    address: "",
    role: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleDateChange = (field: keyof UsersData, date: Date | undefined) => {
    setUser((prevData) => ({ ...prevData, [field]: date || null }));
  };

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const userData = await fetchUser(Number(userId));
      if (userData) {
        setUser({
          id: userData.id,
          email: userData.email || "",
          nic: userData.nic || "",
          username: userData.username || "",
          status: userData.status || "",
          user_type: userData.user_type || "",
          phone_number: userData.phone_number || "",
          date_of_birth: userData.date_of_birth || "",
          joined_of_date: userData.joined_of_date || "",
          expire_date: userData.expire_date || "",
          gender: userData.gender || "",
          address: userData.address || "",
          role: userData.roles.id,
        });
      }
    } catch (error) {
      console.error("Failed to load user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const handleEditUser = async () => {
    setLoading(true);
    const { error } = await updateUser(user);
    if (error) {
      console.error("Update failed:", error.message);
      return;
    }
    setLoading(false);
  };

  if (loading) return <Loader />;

  return (
    <div className="p-4 w-full flex justify-center">
      <div className="w-full">
        <p className="text-2xl font-semibold">Edit User</p>
        <div className="grid grid-cols-2 gap-5 my-10">
          <div className="flex flex-col gap-1">
            <label className="pl-1">Name</label>
            <Input
              placeholder="Name .."
              className=""
              name="username"
              value={user.username}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="pl-1">Phone Number</label>
            <Input
              placeholder="Phone Number .."
              className=""
              name="phone_number"
              value={user.phone_number}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="pl-1">Email</label>
            <Input
              placeholder="Email .."
              className=""
              name="email"
              value={user.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="pl-1">Date of Birth</label>
            {/* <Input
              placeholder="Date of Birth .."
              className=""
              type="date"
              name="date_of_birth"
              value={user.date_of_birth}
              onChange={handleInputChange}
            /> */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {user.date_of_birth ? (
                    format(user.date_of_birth, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={user.date_of_birth || undefined}
                  onSelect={(date) => handleDateChange("date_of_birth", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-col gap-1">
            <label className="pl-1">Joined Date</label>
            {/* <Input
              placeholder="Joined Date .."
              className=""
              name="joined_of_date"
              value={user.joined_of_date}
              onChange={handleInputChange}
            /> */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {user.joined_of_date ? (
                    format(user.joined_of_date, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={user.joined_of_date || undefined}
                  onSelect={(date) => handleDateChange("joined_of_date", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-col gap-1">
            <label className="pl-1">Expire Date</label>
            {/* <Input
              placeholder="Expire Date .."
              className=""
              name="expire_date"
              value={user.expire_date}
              onChange={handleInputChange}
            /> */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {user.expire_date ? (
                    format(user.expire_date, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={user.expire_date || undefined}
                  onSelect={(date) => handleDateChange("expire_date", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-col gap-1">
            <label className="pl-1">Status</label>
            <Select
              value={user.status}
              onValueChange={(value) => setUser({ ...user, status: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="pl-1">Gender</label>
            <Select
              value={user.gender}
              onValueChange={(value) => setUser({ ...user, gender: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="pl-1">User Type</label>
            <Select
              value={user.user_type}
              onValueChange={(value) => setUser({ ...user, user_type: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select User Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Member">Member</SelectItem>
                <SelectItem value="Trainer">Trainer</SelectItem>
                <SelectItem value="Staff">Staff</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1 col-span-2">
            <label className="pl-1">Address</label>
            <Input
              placeholder="Address .."
              className=""
              name="address"
              value={user.address}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="flex justify-end space-x-5">
          <Button
            variant={"outline"}
            className="w-2xs"
            onClick={() => {
              router.push("/dashboard/users");
            }}
          >
            Cancel
          </Button>
          <Button className="w-2xs" onClick={handleEditUser}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserEditPage;
