"use client";
import {
  fetchPackageTypeView,
  updatePackageType,
} from "@/app/actions/packageManagement";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PackageType } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const EditPackage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pkg = searchParams.get("pkg");

  const [isTimeRangeEnabled, setIsTimeRangeEnabled] = useState(false);
  const [packageDetailType, setPackageDetailType] = useState<PackageType>({
    id: Number(pkg),
    packageTypeName: "",
    price: 0,
    endTime: null,
    startTime: null,
    noOfMonths: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (
    field: keyof PackageType,
    value: string | number | null
  ) => {
    setPackageDetailType((prev) => ({ ...prev, [field]: value }));
  };

  const fetchPackageDetails = async () => {
    setLoading(true);
    try {
      const res = await fetchPackageTypeView(Number(pkg));
      if (res) {
        setPackageDetailType(res);
        if (res.startTime && res.endTime) {
          setIsTimeRangeEnabled(true);
        }
      }
    } catch (error) {
      console.error("Error fetching package details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackageDetails();
  }, []);

  const handleEditPackage = async () => {
    if (
      !packageDetailType.packageTypeName &&
      !packageDetailType.price &&
      !packageDetailType.noOfMonths
    ) {
      toast.error("Please fill all the fields", {
        style: { background: "red", color: "white" },
      });
      return;
    }
    if (isTimeRangeEnabled) {
      toast.error("Please select a time range", {
        style: { background: "red", color: "white" },
      });
      return;
    }
    setLoading(true);
    const { id, ...pkgDetailsType } = packageDetailType;
    await updatePackageType(id, pkgDetailsType);
    setLoading(false);
    toast.success("Package updated successfully", {
      style: { background: "green", color: "white" },
    });
    router.push("/dashboard/packages/package-type");
  };

  if (loading) return <Loader />;

  return (
    <div className="p-5 w-full flex justify-center">
      <div className="w-full">
        <p className="text-2xl font-semibold">Edit Package Type</p>
        <div className="flex flex-col gap-5 my-10">
          <div className="flex flex-col gap-2">
            <Label htmlFor="package-name">Package Type Name</Label>
            <Input
              id="package-name"
              type="text"
              placeholder="Annual Off-Peak"
              value={packageDetailType.packageTypeName}
              onChange={(e) => handleChange("packageTypeName", e.target.value)}
              required
              className="p-2 border rounded-md"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="price">Price (LKR)</Label>
            <Input
              id="price"
              type="number"
              placeholder="60000"
              value={packageDetailType.price}
              onChange={(e) => handleChange("price", e.target.value)}
              required
              className="p-2 border rounded-md"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="months">Number of Months</Label>
            <Input
              id="months"
              type="number"
              placeholder="12"
              min="1"
              value={packageDetailType.noOfMonths}
              onChange={(e) => handleChange("noOfMonths", e.target.value)}
              required
              className="p-2 border rounded-md"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="set-time-range"
              checked={isTimeRangeEnabled}
              onChange={() => {
                setIsTimeRangeEnabled((prev) => {
                  const newValue = !prev;
                  if (!newValue) {
                    setPackageDetailType((prevState) => ({
                      ...prevState,
                      startTime: null,
                      endTime: null,
                    }));
                  }
                  return newValue;
                });
              }}
            />
            <Label htmlFor="set-time-range" className="text-lg">
              Set Time Range
            </Label>
          </div>

          {isTimeRangeEnabled && (
            <div className="flex gap-4">
              <div className="flex flex-col">
                <Label htmlFor="start-date" className="text-sm text-gray-600">
                  Start Time
                </Label>
                <Input
                  id="startTime"
                  type="time"
                  value={
                    packageDetailType.startTime
                      ? typeof packageDetailType.startTime === "string"
                        ? packageDetailType.startTime
                        : packageDetailType.startTime
                            .toISOString()
                            .substring(11, 16)
                      : ""
                  }
                  onChange={(e) => handleChange("startTime", e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col">
                <Label htmlFor="end-date" className="text-sm text-gray-600">
                  End Time
                </Label>
                <Input
                  id="endTime"
                  type="time"
                  value={
                    packageDetailType.endTime
                      ? typeof packageDetailType.endTime === "string"
                        ? packageDetailType.endTime
                        : packageDetailType.endTime
                            .toISOString()
                            .substring(11, 16)
                      : ""
                  }
                  onChange={(e) => handleChange("endTime", e.target.value)}
                  required
                />
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end space-x-5">
          <Button
            variant={"outline"}
            className="w-2xs"
            onClick={() => {
              router.push("/dashboard/packages/package-type");
            }}
          >
            Cancel
          </Button>
          <Button className="w-2xs" onClick={handleEditPackage}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditPackage;
