"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import generatePDF from "@/utils/pdf-generate";
import { useAtom } from "jotai";
import {
  currentStepAtom,
  discountAmountAtom,
  memberCompleteDataAtom,
  memberPackageTimeDurationAtom,
  memberPersonalData,
  transactionIdAtom,
} from "@/store/atom";
import {
  DownloadMemberPDFType,
  MedicalDataType,
  PackagesData,
  PersonalData,
} from "@/types";
import { fetchSinglePackage } from "@/app/actions/packageManagement";
import Loader from "../loader";
import { generateInvoice } from "@/utils/invoice-generate";
import { getFormattedPrice } from "@/lib/price";
import { addInvoiceNumber } from "@/app/actions/transactionManagement";

const SuccessComponent = () => {
  const router = useRouter();

  const [personalData, setPersonalData] = useAtom(memberPersonalData);
  const [memberCompleteData, setMemberCompleteData] = useAtom(
    memberCompleteDataAtom
  );
  const [discountAmount] = useAtom(discountAmountAtom);
  const [, setCurrentStep] = useAtom(currentStepAtom);
  const [memberPackageTimeDuration] = useAtom(memberPackageTimeDurationAtom);
  const [transactionId] = useAtom(transactionIdAtom);

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
  const [invoiceNumber, setInvoiceNumber] = useState<string>("");

  useEffect(() => {
    const generated = `INV-${new Date().getFullYear()}-${Math.floor(
      Math.random() * 10000
    )
      .toString()
      .padStart(4, "0")}`;
    setInvoiceNumber(generated);
  }, []);

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

  const addInvoiceNumberToTransaction = async () => {
    try {
      if (!transactionId) return;
      await addInvoiceNumber(transactionId, invoiceNumber);
    } catch (error) {
      console.error("Error adding invoice number:", error);
    }
  };

  useEffect(() => {
    getSelectedPlanInfo();
    if (invoiceNumber) {
      addInvoiceNumberToTransaction();
    }
  }, [invoiceNumber]);

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

  const handleInvoiceDownload = async () => {
    const paymentMethodType = ():
      | "Cash"
      | "Bank Transfer"
      | "Credit/Debit Card" => {
      switch (memberCompleteData?.payment_method) {
        case "cash":
          return "Cash";
        case "card":
          return "Credit/Debit Card";
        case "bank-transfer":
          return "Bank Transfer";
        default:
          return "Cash";
      }
    };

    const invoiceData = {
      invoiceNumber: invoiceNumber,
      invoiceDate: new Date().toISOString().split("T")[0],
      customerName: personalData?.name || "",
      customerPhone: personalData?.phone || "",
      serviceName: selectedPlan.package_name || "Gym Membership",
      serviceDetails: `${
        selectedPlan.packageTypes.packageTypeName || "Standard"
      } `,
      serviceTime: memberPackageTimeDuration || "",
      amount: getFormattedPrice(selectedPlan?.packageTypes.price) || "",
      paymentMethod: paymentMethodType(),
      paymentAmount: getFormattedPrice(selectedPlan.packageTypes.price) || "",
      discountAmount: getFormattedPrice(discountAmount) || "-",
    };

    await generateInvoice(invoiceData);
  };

  const handleDoneButton = () => {
    setPersonalData({
      name: "",
      address: "",
      dob: "",
      email: "",
      gender: "",
      nic: "",
      phone: "",
    });
    setMemberCompleteData(undefined);
    router.push("/dashboard/members");
    setCurrentStep(1);
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
            onClick={handleInvoiceDownload}
          >
            Email Invoice
          </Button>
          <Button
            type="button"
            className="mt-6 bg-black hover:bg-gray-800 text-white px-8 h-12 w-fit"
            onClick={handleDoneButton}
          >
            Done
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SuccessComponent;
