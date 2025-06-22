"use client";
import {
  fetchPackageTypes,
  fetchSinglePackage,
  updatePackage,
} from "@/app/actions/packageManagement";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PackageType } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const EditPackage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pkg = searchParams.get("pkg");

  const [packageName, setPackageName] = useState<string>();
  const [packageTypes, setPackageTypes] = useState<PackageType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedPackageType, setSelectedPackageType] = useState<number | null>(
    null
  );

  const fetchPackageType = async () => {
    setLoading(true);
    try {
      const packageTypes = (await fetchPackageTypes()) as PackageType[];
      if (packageTypes) {
        setPackageTypes(packageTypes);
      }
    } catch (error) {
      console.error("Error fetching package types:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPackageDetails = async () => {
    setLoading(true);
    try {
      const res = await fetchSinglePackage(Number(pkg));
      if (res) {
        setPackageName(res.package_name);
        setSelectedPackageType(res.package_type_id);
      }
    } catch (error) {
      console.error("Error fetching package types:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackageType();
    fetchPackageDetails();
  }, []);

  const handleEditPackage = async () => {
    if (!packageName && !selectedPackageType) {
      toast.error("Please fill all the fields", {
        style: { background: "red", color: "white" },
      });
      return;
    }
    setLoading(true);
    await updatePackage(Number(pkg), {
      package_name: packageName as string,
      package_type_id: selectedPackageType as number,
    });
    setLoading(false);
    toast.success("Package updated successfully", {
      style: { background: "green", color: "white" },
    });
    router.push("/dashboard/packages/all-packages");
  };

  if (loading) return <Loader />;

  return (
    <div className="p-5 w-full flex justify-center">
      <div className="w-full">
        <p className="text-2xl font-semibold">Edit Package</p>
        <div className="grid grid-cols-2 gap-5 my-10">
          <div className="flex flex-col gap-1">
            <label className="pl-1">Package Name</label>
            <Input
              placeholder="Package Name .."
              className=""
              name="packageName"
              value={packageName}
              onChange={(e) => setPackageName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="pl-1">Package Type</label>
            <Select
              value={selectedPackageType?.toString()}
              onValueChange={(value) => setSelectedPackageType(Number(value))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                {packageTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id.toString()}>
                    {type.packageTypeName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end space-x-5">
          <Button
            variant={"outline"}
            className="w-2xs"
            onClick={() => {
              router.push("/dashboard/packages/all-packages");
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
