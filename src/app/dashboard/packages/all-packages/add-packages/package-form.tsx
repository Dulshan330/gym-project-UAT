"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../../../../utils/supabase/client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type PackageType = {
  id: number;
  packageTypeName: string;
};

// Validation schema using Zod
const formSchema = z.object({
  packageName: z.string().min(1, "Package name is required."),
  packageTypeId: z.string().min(1, "Package type is required."),
  numberOfMembers: z.coerce.number().min(1, "At least one member required."),
  // startDate: z.string().optional(),
  // endDate: z.string().optional(),
  // isTimeRangeEnabled: z.boolean().optional(),
});

export default function CreatePackage() {
  const router = useRouter();
  const [packageTypes, setPackageTypes] = useState<PackageType[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      packageName: "",
      packageTypeId: "",
      numberOfMembers: 1,
      // startDate: "",
      // endDate: "",
      // isTimeRangeEnabled: false,
    },
  });

  const supabase = createClient();

  useEffect(() => {
    const fetchPackageTypes = async () => {
      const { data, error } = await supabase
        .from("packageTypes")
        .select("id, packageTypeName");

      if (error) {
        console.error("Failed to fetch package types:", error.message);
      } else {
        setPackageTypes(data || []);
      }
    };

    fetchPackageTypes();
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);

    // Check if package name exists
    const { data: existingPackages, error: fetchError } = await supabase
      .from("packages")
      .select("id")
      .eq("package_name", values.packageName.trim());

    if (fetchError) {
      console.error("Error checking package name:", fetchError.message);
      setLoading(false);
      return;
    }

    if (existingPackages && existingPackages.length > 0) {
      form.setError("packageName", {
        message: "A package with this name already exists.",
      });
      setLoading(false);
      return;
    }

    // Insert new package
    const { error } = await supabase.from("packages").insert([
      {
        package_name: values.packageName.trim(),
        number_of_members: values.numberOfMembers,
        package_type_id: parseInt(values.packageTypeId),
        // startDate: values.isTimeRangeEnabled ? values.startDate : null,
        // endDate: values.isTimeRangeEnabled ? values.endDate : null,
      },
    ]);

    setLoading(false);

    if (error) {
      console.error("Error creating package:", error.message);
    } else {
      console.log("Package created successfully!");
      router.push("/dashboard/packages/all-packages");
    }
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg">
      <h2 className="text-2xl sm:text-3xl font-semibold mb-6 mt-12">
        Create New Package
      </h2>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          {/* Package Name */}
          <FormField
            control={form.control}
            name="packageName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Package Name</FormLabel>
                <FormControl>
                  <Input placeholder="Ladies Membership" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Package Type */}
          <FormField
            control={form.control}
            name="packageTypeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Package Type</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a package type" />
                    </SelectTrigger>
                    <SelectContent>
                      {packageTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.packageTypeName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Number of Members */}
          <FormField
            control={form.control}
            name="numberOfMembers"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Members</FormLabel>
                <FormControl>
                  <Input type="number" min={1} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Checkbox for Time Range */}
          {/* <FormField
            control={form.control}
            name="isTimeRangeEnabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked)}
                  />
                </FormControl>
                <FormLabel>Set Date Period</FormLabel>
              </FormItem>
            )}
          /> */}

          {/* Date Inputs if checkbox checked */}
          {/* {form.watch("isTimeRangeEnabled") && (
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )} */}

          {/* Buttons */}
          <div className="flex flex-col gap-2 md:flex-row md:justify-end mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/packages/all-packages")}
              className="border-black text-black hover:bg-gray-100 w-full md:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-black text-white hover:bg-gray-800 w-full md:w-auto"
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
