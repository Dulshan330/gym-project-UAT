"use client";
import { fetchPackageTypeView } from "@/app/actions/packageManagement";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import {
  InfoItemProps,
  PackageType,
  SectionProps,
} from "@/types";
import { Calendar, Clock, DollarSign, LetterText, Users } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  packageTypeName: LetterText,
  number_of_members: Users,
  price: DollarSign,
  noOfMonths: Calendar,
  startTime: Clock,
  endTime: Clock,
};

const ViewPackageType = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pkg = searchParams.get("pkg");

  const [loading, setLoading] = useState<boolean>(false);
  const [packageDetail, setPackageDetail] = useState<PackageType>({
    id: Number(pkg),
    packageTypeName: "",
    price: 0,
    endTime: null,
    startTime: null,
    noOfMonths: 0,
  });

  const fetchPackageDetails = async () => {
    setLoading(true);
    try {
      const res = await fetchPackageTypeView(Number(pkg));
      if (res) {
        setPackageDetail(res);
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

  if (loading) return <Loader />;

  return (
    <div>
      <h2 className="text-2xl font-semibold m-4 md:m-12 capitalize">
        Package Details - {packageDetail.packageTypeName}
      </h2>
      <div className="px-4 md:px-12">
        <Section title="Personal Information">
          <InfoItem
            icon={
              packageDetail.packageTypeName
                ? iconMap["packageTypeName"]
                : undefined
            }
            label={"package Type Name"}
            value={packageDetail.packageTypeName}
          />

          <InfoItem
            icon={packageDetail.price ? iconMap["price"] : undefined}
            label={"price"}
            value={packageDetail.price}
          />
          <InfoItem
            icon={packageDetail.noOfMonths ? iconMap["noOfMonths"] : undefined}
            label={"no Of Months"}
            value={packageDetail.noOfMonths}
          />
          {packageDetail.startTime && (
            <InfoItem
              icon={packageDetail.startTime ? iconMap["startTime"] : undefined}
              label={"start Time"}
              value={packageDetail.startTime ? packageDetail.startTime.toLocaleString() : ""}
            />
          )}
          {packageDetail.endTime && (
            <InfoItem
              icon={packageDetail.endTime ? iconMap["endTime"] : undefined}
              label={"end Time"}
              value={packageDetail.endTime ? packageDetail.endTime.toLocaleString() : ""}
            />
          )}
        </Section>
        <div className="mb-10 flex justify-end">
          <Button
            onClick={() => {
              router.push("/dashboard/packages/package-type");
            }}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ViewPackageType;

function Section({ title, children }: SectionProps) {
  return (
    <div className="bg-gray-50 p-4 md:p-8 rounded-lg shadow-sm mb-6 md:mb-10">
      <div className="border-b mb-4">
        <h3 className="font-semibold text-lg md:text-xl text-gray-700 mb-2">
          {title}
        </h3>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }: InfoItemProps) {
  const formattedValue =
    value instanceof Date ? value.toLocaleString() : value;
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center space-y-1 md:space-y-0 md:space-x-3 text-gray-600">
      <div className="flex flex-row items-center space-x-2">
        {Icon ? <Icon className="w-5 h-5 text-gray-500" /> : null}
        <span className="font-medium capitalize">
          {label.replace(/_/g, " ")}:
        </span>
      </div>
      <span>{formattedValue}</span>
    </div>
  );
}
