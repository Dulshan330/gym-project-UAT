"use client";
import MedicalInfoFormComponent from "@/components/members/medicalInfoFormComponent";
import PaymentSummaryComponent from "@/components/members/paymentSummaryComponent";
import PersonalInfoFormComponent from "@/components/members/personalInfoFormComponent";
import SelectMembershipPlanComponent from "@/components/members/selectMembershipPlanComponent";
import SuccessComponent from "@/components/members/successComponent";
import SuccessComponent2 from "@/components/members/successComponent2";
import { currentStepAtom } from "@/store/atom";
import { useAtom } from "jotai";
import React from "react";

const MedicalClearanceForm = () => {
  const [currentStep] = useAtom(currentStepAtom);

  return (
    <div className="w-full max-w-5xl mx-auto my-5">
      {currentStep === 1 && <PersonalInfoFormComponent />}
      {currentStep === 2 && <MedicalInfoFormComponent />}
      {currentStep === 3 && <SelectMembershipPlanComponent />}
      {currentStep === 4 && <PaymentSummaryComponent />}
      {currentStep === 5 && <SuccessComponent />}
      {currentStep === 6 && <SuccessComponent2 />}
    </div>
  );
};

export default MedicalClearanceForm;
