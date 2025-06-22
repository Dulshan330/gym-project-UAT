import { fetchSinglePackage } from "@/app/actions/packageManagement";
import { isPackageAssigned } from "@/app/actions/packageMemberAction";
import {
  fetchSingleMemberDetails,
  fetchUser,
} from "@/app/actions/userManagement";
import {
  DownloadMemberPDFType,
  MedicalDataType,
  MemberFitnessProfile,
  PackagesData,
  PersonalData,
  UsersData,
} from "@/types";
import generatePDF from "@/utils/pdf-generate";

export const downloadMemberClearanceReport = async (userId: number) => {
  try {
    // Fetch all required data sequentially
    const personalData: UsersData | undefined = await fetchUser(userId);
    const memberFitnessData: MemberFitnessProfile | undefined =
      await fetchSingleMemberDetails(Number(userId));
    const latestPackage = await isPackageAssigned(userId);

    let selectedPlan: PackagesData | undefined = undefined;
    if (latestPackage) {
      selectedPlan = await fetchSinglePackage(latestPackage.planId);
    }

    // Normalize personal data
    const normalizedPersonalData: PersonalData = {
      name: personalData?.username || "",
      nic: personalData?.nic || "",
      email: personalData?.email || "",
      dob: personalData?.date_of_birth
        ? typeof personalData.date_of_birth === "string"
          ? personalData.date_of_birth
          : personalData.date_of_birth.toISOString().split("T")[0]
        : "",
      gender: personalData?.gender || "",
      address: personalData?.address || "",
      phone: personalData?.phone_number || "",
    };

    // Normalize medical data
    const normalizedMedicalData = {
      plan_id: selectedPlan?.package_name || "",
      planTime: selectedPlan?.packageTypes.startTime
        ? `${selectedPlan.packageTypes.startTime} - ${
            selectedPlan.packageTypes.endTime || "-"
          }`
        : "-",
      weight: memberFitnessData?.weight || "",
      height: memberFitnessData?.height || "",
      occupation: memberFitnessData?.occupation || "",
      physical_activities: memberFitnessData?.physical_activities || "",
      health_conditions: memberFitnessData?.health_conditions || "",
      medications: memberFitnessData?.medications || "",
      emergency_name: memberFitnessData?.emergency_name || "",
      emergency_contact: memberFitnessData?.emergency_contact || "",
      emergency_relationship: memberFitnessData?.emergency_relationship || "",
      fitness_goals: memberFitnessData?.fitness_goals || "",
      allergies: memberFitnessData?.allergies || "",
      exercise_history: memberFitnessData?.exercise_history || "",
      recent_injuries: memberFitnessData?.recent_injuries || "",
      heart_condition:
        typeof memberFitnessData?.heart_condition !== "undefined"
          ? memberFitnessData.heart_condition
          : "",
      blood_pressure:
        typeof memberFitnessData?.blood_pressure !== "undefined"
          ? memberFitnessData.blood_pressure
          : "",
      diabetes:
        typeof memberFitnessData?.diabetes !== "undefined"
          ? memberFitnessData.diabetes
          : "",
      asthma:
        typeof memberFitnessData?.asthma !== "undefined"
          ? memberFitnessData.asthma
          : "",
      consent_to_exercise: true,
      liability_waiver: true,
      pregnancy_status: memberFitnessData?.pregnancy_status || "",
      trainer_id: memberFitnessData?.trainer_id || "",
    };

    const submissionData: DownloadMemberPDFType = {
      personalData: normalizedPersonalData,
      medicalData: normalizedMedicalData as MedicalDataType & {
        trainer_id: string;
      },
      planId: normalizedMedicalData.plan_id,
    };

    await generatePDF(submissionData);
  } catch (error) {
    console.error("Something went wrong", error);
  }
};
