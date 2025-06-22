"use client";
import MedicalInfoFormComponent from "@/components/members/medicalInfoFormComponent";
import PersonalInfoFormComponent from "@/components/members/personalInfoFormComponent";
import { currentStepAtom } from "@/store/atom";
import { useAtom } from "jotai";
import React from "react";

const MemberEditPage = () => {
  const [currentStep] = useAtom(currentStepAtom);

  return (
    <div className="w-full max-w-5xl mx-auto my-5">
      {currentStep === 1 && <PersonalInfoFormComponent />}
      {currentStep === 2 && <MedicalInfoFormComponent />}
    </div>
  );
};

export default MemberEditPage;
