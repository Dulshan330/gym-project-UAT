"use client";
import { addNewRole } from "@/app/actions/rolesManagement";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { accessPages } from "@/types/roles";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

const RolesAddPage = () => {
  const router = useRouter();
  const [selectedPaths, setSelectedPaths] = useState<string[]>([]);
  const [roleName, setRoleName] = useState("");

  const MANDATORY_PATHS = ["/dashboard", "/profile"];

  const handleCheckboxChange = (path: string, isChecked: boolean) => {
    setSelectedPaths((prev) => {
      const updated = isChecked
        ? [...prev, path]
        : prev.filter((p) => p !== path);
      // Ensure at least one mandatory path is always present
      if (!MANDATORY_PATHS.some((p) => updated.includes(p))) {
        // If user tries to uncheck the last mandatory path, ignore
        return prev;
      }
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!MANDATORY_PATHS.some((p) => selectedPaths.includes(p))) {
      toast.error("You must select at least Dashboard or Profile access.", {
        style: { background: "red", color: "white" },
      });
      return;
    }
    try {
      const { data, error } = await addNewRole(roleName, selectedPaths);

      if (error) {
        toast.error(`${error}`, {
          style: { background: "red", color: "white" },
        });
        return;
      }

      if (data) {
        toast.error(`Role is added successfully!`, {
          style: { background: "green", color: "white" },
        });
        router.back();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-5">
      <div className="space-y-2">
        <p className="text-2xl font-semibold">Add Roles</p>
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
            <p className="text-sm text-red-400">
              It is mandatory to select Dasboard or Profile page
            </p>
            <Label>Page Access</Label>
            <div className="space-y-3">
              {accessPages.map((page, index) => (
                <div className="flex items-center space-x-1.5" key={index}>
                  <Checkbox
                    id={page.path}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(page.path, checked as boolean)
                    }
                    disabled={
                      MANDATORY_PATHS.includes(page.path) &&
                      MANDATORY_PATHS.filter((p) => selectedPaths.includes(p))
                        .length === 1 &&
                      selectedPaths.includes(page.path)
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

export default RolesAddPage;
