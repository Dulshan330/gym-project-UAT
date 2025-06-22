"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useAtom } from "jotai";
import {
  currentStepAtom,
  discountAmountAtom,
  isMultipleMemberPackageAtom,
  memberCompleteDataAtom,
  memberPackageTimeDurationAtom,
  memberPersonalData,
  transactionIdAtom,
} from "@/store/atom";
import { MedicalDataType, PackagesData, Transaction } from "@/types";
import { fetchSinglePackage } from "@/app/actions/packageManagement";
import Loader from "../loader";
import addMemberPersonalInfo, {
  addMedicalInfo,
  addPrimaryUser,
} from "@/app/actions/memberManagement";
import { assignPackageToMember } from "@/app/actions/packageMemberAction";
import { formatShortDate, getExpireDate } from "@/lib/dates";
import { addNewTransaction } from "@/app/actions/transactionManagement";

const PaymentSummaryComponent = () => {
  const [memberData, setMemberData] = useAtom(memberCompleteDataAtom);
  const [discountAmount, setDiscountAmount] = useAtom(discountAmountAtom);
  const [, setCurrentStep] = useAtom(currentStepAtom);
  const [personalData] = useAtom(memberPersonalData);
  const [isMultipleMemberPackage] = useAtom(isMultipleMemberPackageAtom);
  const [, setMemberPackageTimeDuration] = useAtom(
    memberPackageTimeDurationAtom
  );
  const [, setTransactionId] = useAtom(transactionIdAtom);

  const [discount, setDiscount] = useState<string>("0");
  const [customDiscount, setCustomDiscount] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [planStartDate, setPlanStartDate] = useState<Date>(new Date());
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

  const today = new Date();
  const minDate = new Date(today);
  minDate.setDate(today.getDate() - 14); // 2 weeks ago
  const maxDate = new Date(today);
  maxDate.setMonth(today.getMonth() + 6); // 6 months ahead
  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const getSelectedPlanInfo = async () => {
    try {
      setIsLoading(true);
      const data = await fetchSinglePackage(Number(memberData?.plan_id));
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

  const { total } = useMemo(() => {
    let discountValue = 0;

    if (discount === "custom" && customDiscount) {
      discountValue = parseFloat(customDiscount) || 0;
    } else {
      discountValue = parseInt(discount) || 0;
    }

    const calculatedDiscount =
      selectedPlan.packageTypes.price * (discountValue / 100);
    const calculatedTotal =
      selectedPlan.packageTypes.price - calculatedDiscount;
    setDiscountAmount(calculatedDiscount);

    return {
      total: calculatedTotal,
      discountAmount: calculatedDiscount,
    };
  }, [discount, customDiscount, selectedPlan.packageTypes.price]);

  const handleFinalSubmit = async () => {
    try {
      setIsProcessing(true);
      if (!memberData) {
        console.log("Member data is missing.");
        return;
      }

      setMemberData((prev) => ({
        ...prev,
        payment_method: paymentMethod,
      }));

      const response = await addMemberPersonalInfo({
        username: personalData?.name,
        nic: personalData?.nic || "",
        email: personalData?.email || "",
        date_of_birth: personalData?.dob,
        gender: personalData?.gender || "",
        address: personalData?.address,
        phone_number: personalData?.phone,
        user_type: "Member",
        status: "Active",
        joined_of_date: new Date().toISOString(),
        imagePath: personalData?.imagePath,
        role:Number(personalData?.role)
      });

      if (
        !response ||
        !response.data ||
        !Array.isArray(response.data) ||
        !response.data[0]?.id
      ) {
        console.log("Error: No valid user ID returned.");
        return;
      }

      const completeData: MedicalDataType = {
        user_id: response.data[0]?.id || "",
        trainer_id: memberData.trainer_id,
        weight: memberData.weight || "",
        height: memberData.height || "",
        occupation: memberData.occupation || "",
        physical_activities: memberData.physical_activities || "",
        health_conditions: memberData.health_conditions || "",
        medications: memberData.medications || "",
        emergency_name: memberData.emergency_name || "",
        emergency_contact: memberData.emergency_contact || "",
        emergency_relationship: memberData.emergency_relationship || "",
        fitness_goals: memberData.fitness_goals || [],
        allergies: memberData.allergies || "",
        exercise_history: memberData.exercise_history || "",
        recent_injuries: memberData.recent_injuries || "",
        heart_condition: memberData.heart_condition || false,
        blood_pressure: memberData.blood_pressure || false,
        diabetes: memberData.diabetes || false,
        asthma: memberData.asthma || false,
        pregnancy_status: memberData.pregnancy_status || "",
        consent_to_exercise: memberData.consent_to_exercise || false,
        liability_waiver: memberData.liability_waiver || false,
      };

      const { error } = await addMedicalInfo(completeData);

      const endDate = getExpireDate(
        planStartDate.toISOString().split("T")[0],
        Number(selectedPlan.packageTypes.noOfMonths)
      );

      setMemberPackageTimeDuration(
        `Start date: ${formatShortDate(
          planStartDate
        )} | End date: ${formatShortDate(new Date(endDate))}`
      );

      await assignPackageToMember(
        response.data[0]?.id,
        Number(memberData.plan_id),
        planStartDate,
        new Date(endDate)
      );

      const transactionData: Transaction = {
        memberId: response.data[0]?.id,
        amount: selectedPlan.packageTypes.price,
        paymentMethod: paymentMethod,
        transactionTypeId: 1,
        discountAmount: Number(discountAmount) || 0,
        discountPercentage:
          (discount === "custom" ? Number(customDiscount) : Number(discount)) ||
          0,
        finalAmount: total,
        rowOperation: "I",
      };
      const res = await addNewTransaction(transactionData);

      if (res && Array.isArray(res) && res[0]?.id) {
        setTransactionId(res[0].id);
      } else {
        setTransactionId(undefined);
      }

      if (isMultipleMemberPackage) {
        await addPrimaryUser(Number(response.data[0]?.id));
      }

      if (error) {
        console.error("Error submitting medical info:", error);
      } else {
        console.log("Medical info submitted successfully.");
        setCurrentStep(5);
      }
    } catch (error) {
      console.error("Error submitting medical info:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Card className="w-full max-w-5xl mx-auto bg-white max-md:mx-3">
      <CardContent className="p-6 md:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-2xl font-medium text-gray-800">
            Payment Summary
          </h1>
          <div className="mt-2 sm:mt-0">
            <p className="font-medium">
              Final Step <span className="text-gray-500">of 4</span>
            </p>
          </div>
        </div>

        <div className="w-full bg-gray-200 h-2 rounded-full mb-8">
          <div className="bg-gray-700 h-2 rounded-full w-full"></div>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              {selectedPlan.package_name}
            </h2>
            <p className="text-2xl font-bold">
              LKR {selectedPlan.packageTypes.price.toFixed(2)}
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-normal">
              Select package start date
            </Label>
            <Input
              type="date"
              value={planStartDate.toISOString().split("T")[0]}
              onChange={(e) => setPlanStartDate(new Date(e.target.value))}
              min={formatDate(minDate)}
              max={formatDate(maxDate)}
              className="w-fit"
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">Select discount</h3>
            <RadioGroup
              value={discount}
              onValueChange={setDiscount}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="0" id="none" />
                <Label htmlFor="none">None</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="5" id="5" />
                <Label htmlFor="5">5%</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="10" id="10" />
                <Label htmlFor="10">10%</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="custom" />
                <Label htmlFor="custom">Custom</Label>
              </div>
            </RadioGroup>

            {discount === "custom" && (
              <div className="mt-3 flex items-center">
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none"></div>
                  <Input
                    type="number"
                    value={customDiscount}
                    onChange={(e) => setCustomDiscount(e.target.value)}
                    className="pl-12 h-10 w-32"
                    placeholder="0"
                    min="0"
                    max="100"
                  />
                </div>
                <span className="ml-2">%</span>
              </div>
            )}

            {discount !== "0" && (
              <p className="mt-2 text-sm text-green-600">
                You&apos;ve got{" "}
                {discount === "custom"
                  ? `${customDiscount || "0"}%`
                  : `${discount}%`}{" "}
                discount from the GYM!
              </p>
            )}
          </div>

          <div className="border-t pt-4">
            <h3 className="text-lg font-medium mb-2">Total to Pay</h3>
            <p className="text-2xl font-bold">LKR {total.toFixed(2)}</p>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">Payment Method</h3>
            <RadioGroup
              value={paymentMethod}
              onValueChange={setPaymentMethod}
              className="flex flex-col gap-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card">Card</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cash" id="cash" />
                <Label htmlFor="cash">Cash</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bank-transfer" id="bank-transfer" />
                <Label htmlFor="bank-transfer">Bank Transfer</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="mt-6 pt-4 border-t">
            <p className="font-medium">{personalData?.name}</p>
            <p className="text-gray-600">{personalData?.email}</p>
          </div>

          <div className="flex justify-between mt-10">
            <Button
              type="button"
              variant="outline"
              className="border-black text-black hover:bg-gray-100"
              onClick={() => {
                setCurrentStep(3);
              }}
              disabled={isProcessing}
            >
              Back
            </Button>
            <Button
              type="button"
              className="bg-black hover:bg-gray-800 text-white px-8 h-12"
              onClick={handleFinalSubmit}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Complete Payment"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentSummaryComponent;
