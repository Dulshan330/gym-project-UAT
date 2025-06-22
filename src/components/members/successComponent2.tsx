"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { Button } from "../ui/button";
import { useAtom } from "jotai";
import {
  currentStepAtom,
  memberCompleteDataAtom,
  memberPersonalData,
} from "@/store/atom";
import { useRouter } from "next/navigation";
import generatePDF from "@/utils/pdf-generate";
import {
  DownloadMemberPDFType,
  MedicalDataType,
  PackagesData,
  PersonalData,
} from "@/types";
import { fetchSinglePackage } from "@/app/actions/packageManagement";
import Loader from "../loader";

const SuccessComponent2 = () => {
  const router = useRouter();
  const [, setCurrentStep] = useAtom(currentStepAtom);
  const [personalData] = useAtom(memberPersonalData);
  const [memberCompleteData] = useAtom(memberCompleteDataAtom);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = useState<PackagesData>({
    id: 0,
    package_name: "",
    number_of_members: null,
    startDate: null,
    endDate: null,
    packageTypes: {
      packageTypeName: "",
      price: 0,
      noOfMonths: 0,
      endTime: null,
      startTime: null,
    },
  });

  const getSelectedPlanInfo = async () => {
    try {
      setIsLoading(true);
      const data = await fetchSinglePackage(
        Number(memberCompleteData?.plan_id)
      );
      setSelectedPlan(data);
    } catch (error) {
      console.error("Error fetching selected plan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getSelectedPlanInfo();
  }, []);

  const handleDownloadPDF = async () => {
    const normalizedPersonalData: PersonalData = {
      name: personalData?.name || "",
      nic: personalData?.nic || "",
      email: personalData?.email || "",
      dob: personalData?.dob || "",
      gender: personalData?.gender || "",
      address: personalData?.address || "",
      phone: personalData?.phone || "",
    };

    const normalizedMedicalData = {
      plan_id: selectedPlan.package_name || "",
      planTime: selectedPlan.packageTypes.startTime
        ? `${selectedPlan.packageTypes.startTime} - ${
            selectedPlan.packageTypes.endTime || "-"
          }`
        : "-",
      weight: memberCompleteData?.weight || "",
      height: memberCompleteData?.height || "",
      occupation: memberCompleteData?.occupation || "",
      physical_activities: memberCompleteData?.physical_activities || "",
      health_conditions: memberCompleteData?.health_conditions || "",
      medications: memberCompleteData?.medications || "",
      emergency_name: memberCompleteData?.emergency_name || "",
      emergency_contact: memberCompleteData?.emergency_contact || "",
      emergency_relationship: memberCompleteData?.emergency_relationship || "",
      fitness_goals: memberCompleteData?.fitness_goals || "",
      allergies: memberCompleteData?.allergies || "",
      exercise_history: memberCompleteData?.exercise_history || "",
      recent_injuries: memberCompleteData?.recent_injuries || "",
      heart_condition:
        typeof memberCompleteData?.heart_condition !== "undefined"
          ? memberCompleteData.heart_condition
          : "",
      blood_pressure:
        typeof memberCompleteData?.blood_pressure !== "undefined"
          ? memberCompleteData.blood_pressure
          : "",
      diabetes:
        typeof memberCompleteData?.diabetes !== "undefined"
          ? memberCompleteData.diabetes
          : "",
      asthma:
        typeof memberCompleteData?.asthma !== "undefined"
          ? memberCompleteData.asthma
          : "",
      pregnancy_status: memberCompleteData?.pregnancy_status || "",
      consent_to_exercise:
        typeof memberCompleteData?.consent_to_exercise !== "undefined"
          ? memberCompleteData.consent_to_exercise
          : "",
      liability_waiver:
        typeof memberCompleteData?.liability_waiver !== "undefined"
          ? memberCompleteData.liability_waiver
          : "",
      trainer_id: memberCompleteData?.trainer_id || "",
    };

    const submissionData: DownloadMemberPDFType = {
      personalData: normalizedPersonalData,
      medicalData: normalizedMedicalData as MedicalDataType & {
        trainer_id: string;
      },
      planId: normalizedMedicalData.plan_id,
    };

    await generatePDF(submissionData);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Card className="w-full max-w-5xl min-h-[90vh] mx-auto bg-white max-md:mx-3">
      <CardContent className="flex-1 flex flex-col justify-center space-y-5">
        <div className="h-2" />
        <Card className="w-2xl py-20 mx-auto border-none shadow-none">
          <CardContent className="space-y-5">
            <div className="flex justify-center">
              <Image
                src={"/check-mark.png"}
                alt="Image"
                width={80}
                height={80}
              />
            </div>
            <div className="flex justify-center">
              <p className="text-2xl font-semibold">Successful!</p>
            </div>
            <div className="flex justify-center">
              <p className="text-base">Member successfully registered!</p>
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-around">
          <Button
            type="button"
            className="mt-6 bg-black hover:bg-gray-800 text-white px-8 h-12 w-fit"
            onClick={handleDownloadPDF}
          >
            Email Report
          </Button>
          <Button
            type="button"
            className="mt-6 bg-black hover:bg-gray-800 text-white px-8 h-12 w-fit"
            onClick={() => {
              router.push("/dashboard/members");
              setCurrentStep(1);
            }}
          >
            Done
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SuccessComponent2;
