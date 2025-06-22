"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "../../../../utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  packageName: z
    .string()
    .min(1, "Package name is required")
    .max(40, "Maximum 40 characters allowed"),
  price: z.string().min(1, "Price is required"),
  months: z.string().min(1, "Number of months is required"),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  isTimeRangeEnabled: z.boolean(),
});

export default function CreatePackageType() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      packageName: "",
      price: "",
      months: "",
      startTime: "",
      endTime: "",
      isTimeRangeEnabled: false,
    },
  });

  const supabase = createClient();
  const isTimeRangeEnabled = watch("isTimeRangeEnabled");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const {
      packageName,
      price,
      months,
      startTime,
      endTime,
      isTimeRangeEnabled,
    } = values;

    const { error } = await supabase.from("packageTypes").insert([
      {
        packageTypeName: packageName,
        price: parseFloat(price),
        noOfMonths: parseInt(months),
        startTime: isTimeRangeEnabled ? startTime : null,
        endTime: isTimeRangeEnabled ? endTime : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error("Failed to create package type:", error.message);
    } else {
      console.log("Package Type Created Successfully!");
      reset();
    }
  };

  const handleCancel = () => {
    reset();
  };

  return (
    <div className="w-full mx-auto mt-12 bg-white p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4 md:text-2xl">
        Create New Package Type
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="package-name">Package Type Name</Label>
          <Input
            id="package-name"
            type="text"
            placeholder="Annual Off-Peak"
            {...register("packageName")}
          />
          {errors.packageName && (
            <p className="text-red-500 text-sm">{errors.packageName.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="price">Price (LKR)</Label>
          <Input
            id="price"
            type="number"
            placeholder="60000"
            {...register("price")}
          />
          {errors.price && (
            <p className="text-red-500 text-sm">{errors.price.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="months">Number of Months</Label>
          <Input
            id="months"
            type="number"
            placeholder="12"
            min="1"
            {...register("months")}
          />
          {errors.months && (
            <p className="text-red-500 text-sm">{errors.months.message}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="set-time-range"
            {...register("isTimeRangeEnabled")}
          />
          <Label htmlFor="set-time-range" className="text-lg">
            Set Time Range
          </Label>
        </div>

        {isTimeRangeEnabled && (
          <div className="flex gap-4">
            <div className="flex flex-col">
              <Label htmlFor="startTime" className="text-sm text-gray-600">
                Start Time
              </Label>
              <Input
                id="startTime"
                type="time"
                {...register("startTime", { required: isTimeRangeEnabled })}
              />
              {errors.startTime && (
                <p className="text-red-500 text-sm">
                  {errors.startTime.message}
                </p>
              )}
            </div>
            <div className="flex flex-col">
              <Label htmlFor="endTime" className="text-sm text-gray-600">
                End Time
              </Label>
              <Input
                id="endTime"
                type="time"
                {...register("endTime", { required: isTimeRangeEnabled })}
              />
              {errors.endTime && (
                <p className="text-red-500 text-sm">{errors.endTime.message}</p>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2 md:flex-row md:justify-end md:gap-4 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="border-black p-3 text-black hover:bg-gray-100 w-full md:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-black p-3 px-6 text-white hover:bg-gray-800 w-full md:w-auto"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
}
