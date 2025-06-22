"use client";
import {
  getSingleRole,
  updateRole,
} from "@/app/actions/rolesManagement";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { accessPages } from "@/types/roles";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const RolesEditPage = () => {
  const searchParams = useSearchParams();
  const searchRole = searchParams.get("role");
  const router = useRouter();

  const [selectedPaths, setSelectedPaths] = useState<string[]>([]);
  const [roleName, setRoleName] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleCheckboxChange = (path: string, isChecked: boolean) => {
    setSelectedPaths((prev) =>
      isChecked ? [...prev, path] : prev.filter((p) => p !== path)
    );
  };

  const retrieveRole = async () => {
    try {
      setLoading(true);
      const { data } = await getSingleRole(Number(searchRole));
      console.log(data);
      setRoleName(data.name);
      setSelectedPaths(JSON.parse(data.accessPages));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    retrieveRole();
  }, [searchRole]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await updateRole(
        Number(searchRole),
        roleName,
        selectedPaths
      );

      if (error) {
        toast.error(`${error}`, {
          style: { background: "red", color: "white" },
        });
        return;
      }

      if (data) {
        toast.error(`Role is updated successfully!`, {
          style: { background: "green", color: "white" },
        });
        router.push("/dashboard/roles");
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="w-full max-w-5xl mx-auto my-5">
      <div className="space-y-2">
        <p className="text-2xl font-semibold">Edit Roles</p>
      </div>
      <div className="my-2">
        <form className="mt-5 space-y-8" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label>Role Name</Label>
            <Input
              className="w-96"
              placeholder="Admin.."
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
            />
          </div>
          <div className="space-y-4">
            <Label>Page Access</Label>
            <div className="space-y-3">
              {accessPages.map((page, index) => (
                <div className="flex items-center space-x-1.5" key={index}>
                  <Checkbox
                    id={page.path}
                    checked={selectedPaths.includes(page.path)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(page.path, checked as boolean)
                    }
                  />
                  <Label htmlFor={page.path}>{page.pageName}</Label>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end my-3">
            <Button type="submit" className="px-10">
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RolesEditPage;
