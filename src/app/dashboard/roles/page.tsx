"use client";
import { getAllRoles } from "@/app/actions/rolesManagement";
import Loader from "@/components/loader";
import ProtectedLink from "@/components/protected-link/protectedLink";
import { Button } from "@/components/ui/button";
import { Roles } from "@/types";
import { Pencil, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const RolesPage = () => {
  const router = useRouter();

  const [roles, setRoles] = useState<Roles[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const retreiveAllRoles = async () => {
    try {
      setLoading(true);
      const { data } = await getAllRoles();
      if (data) {
        const normalizedData = data.map((role) => ({
          ...role,
          accessPages: role.accessPages
            ? typeof role.accessPages === "string"
              ? JSON.parse(role.accessPages)
              : role.accessPages
            : [],
        }));
        setRoles(normalizedData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    retreiveAllRoles();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <p className="text-2xl font-semibold">Roles Management</p>
        </div>
        <div className="flex gap-4">
          <ProtectedLink href={"/dashboard/roles/add"}>
            <Button className="text-green-700 bg-green-300 border border-green-600 hover:text-green-700 hover:bg-green-300  hover:border-green-600 capitalize hover:cursor-pointer">
              <Plus />
              Add
            </Button>
          </ProtectedLink>
        </div>
      </div>
      <div className="my-8 space-y-2">
        {roles.map((role, index) => (
          <div
            key={index}
            className="border flex justify-between items-center px-4 py-2 rounded-lg"
          >
            <div className="space-y-2">
              <p className="text-lg font-semibold">{role.name}</p>
              <div className="flex gap-2 items-center text-xs">
                {role.accessPages.slice(0, 4).map((path, index) => (
                  <p
                    key={index}
                    className="w-fit bg-gray-200 py-1 px-2 rounded-md whitespace-nowrap"
                  >
                    {path}
                  </p>
                ))}
                {role.accessPages.length > 4 && (
                  <span className="bg-gray-200 py-1 px-2  rounded-md whitespace-nowrap">
                    {role.accessPages.length - 4} more..
                  </span>
                )}
              </div>
            </div>

            <Button
              variant={"outline"}
              onClick={() =>
                router.push(`/dashboard/roles/edit?role=${role.id}`)
              }
            >
              <Pencil />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RolesPage;
