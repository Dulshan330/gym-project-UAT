"use client";
import { fetchSinglePackage } from "@/app/actions/packageManagement";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { InfoItemProps, PackagesData, SectionProps } from "@/types";
import { Calendar, Clock, DollarSign, LetterText, Users } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  package_name: LetterText,
  number_of_members: Users,
  packageTypeName: LetterText,
  price: DollarSign,
  noOfMonths: Calendar,
  startTime: Clock,
  endTime: Clock,
};

const ViewPackage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pkg = searchParams.get("pkg");

  const [loading, setLoading] = useState<boolean>(false);
  const [packageDetail, setPackageDetail] = useState<PackagesData>({
    id: Number(pkg),
    package_name: "",
    number_of_members: null,
    packageTypes: {
      packageTypeName: "",
      price: 0,
      noOfMonths: 0,
      startTime: null,
      endTime: null,
    },
  });

  const fetchPackageDetails = async () => {
    setLoading(true);
    try {
      const res = await fetchSinglePackage(Number(pkg));
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
        Package Details - {packageDetail.package_name}
      </h2>
      <div className="px-4 md:px-12">
        <Section title="Personal Information">
          <InfoItem
            icon={
              packageDetail.package_name ? iconMap["package_name"] : undefined
            }
            label={"package_name"}
            value={packageDetail.package_name}
          />
          <InfoItem
            icon={
              packageDetail.number_of_members
                ? iconMap["number_of_members"]
                : undefined
            }
            label={"number_of_members"}
            value={packageDetail.number_of_members}
          />
          <InfoItem
            icon={
              packageDetail.packageTypes.packageTypeName
                ? iconMap["packageTypeName"]
                : undefined
            }
            label={"package Type Name"}
            value={packageDetail.packageTypes.packageTypeName}
          />
          <InfoItem
            icon={
              packageDetail.packageTypes.price ? iconMap["price"] : undefined
            }
            label={"price"}
            value={packageDetail.packageTypes.price}
          />
          <InfoItem
            icon={
              packageDetail.packageTypes.noOfMonths
                ? iconMap["noOfMonths"]
                : undefined
            }
            label={"no Of Months"}
            value={packageDetail.packageTypes.noOfMonths}
          />
          {packageDetail.packageTypes.startTime && (
            <InfoItem
              icon={
                packageDetail.packageTypes.startTime
                  ? iconMap["startTime"]
                  : undefined
              }
              label={"start Time"}
              value={packageDetail.packageTypes.startTime}
            />
          )}
          {packageDetail.packageTypes.endTime && (
            <InfoItem
              icon={
                packageDetail.packageTypes.endTime
                  ? iconMap["endTime"]
                  : undefined
              }
              label={"endTime"}
              value={packageDetail.packageTypes.endTime}
            />
          )}
        </Section>
        <div className="mb-10 flex justify-end">
          <Button
            onClick={() => {
              router.push("/dashboard/packages/all-packages");
            }}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ViewPackage;

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
