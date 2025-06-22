"use client";
import React, { useEffect } from "react";
import * as z from "zod";
import { Card, CardContent } from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Button } from "../ui/button";
import { medicalInfoSchema } from "@/lib/z-schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import {
  currentStepAtom,
  isMemberEditModeAtom,
  memberCompleteDataAtom,
} from "@/store/atom";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchSingleMemberDetails } from "@/app/actions/userManagement";
import { updateMedicalInfo } from "@/app/actions/memberManagement";
import { toast } from "sonner";

const MedicalInfoFormComponent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchUserId = searchParams.get("user");

  const [, setCurrentStep] = useAtom(currentStepAtom);
  const [memberCompleteData, setMemberCompleteData] = useAtom(
    memberCompleteDataAtom
  );
  const [isMemberEditMode, setIsMemberEditMode] = useAtom(isMemberEditModeAtom);

  const medicalInfoForm = useForm<z.infer<typeof medicalInfoSchema>>({
    resolver: zodResolver(medicalInfoSchema),
    defaultValues: {
      weight: memberCompleteData?.weight || "",
      height: memberCompleteData?.height || "",
      occupation: memberCompleteData?.occupation || "",
      physical_activities: memberCompleteData?.physical_activities || "",
      health_conditions: memberCompleteData?.health_conditions || "",
      medications: memberCompleteData?.medications || "",
      emergency_name: memberCompleteData?.emergency_name || "",
      emergency_contact: memberCompleteData?.emergency_contact || "",
      emergency_relationship: memberCompleteData?.emergency_relationship || "",
      fitness_goals: memberCompleteData?.fitness_goals || [],
      allergies: memberCompleteData?.allergies || "",
      exercise_history: memberCompleteData?.exercise_history || "",
      recent_injuries: memberCompleteData?.recent_injuries || "",
      heart_condition: memberCompleteData?.heart_condition || false,
      blood_pressure: memberCompleteData?.blood_pressure || false,
      diabetes: memberCompleteData?.diabetes || false,
      asthma: memberCompleteData?.asthma || false,
      pregnancy_status: memberCompleteData?.pregnancy_status || "",
      consent_to_exercise: memberCompleteData?.consent_to_exercise || false,
      liability_waiver: memberCompleteData?.liability_waiver || false,
    },
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (isMemberEditMode && searchUserId) {
        try {
          const res = await fetchSingleMemberDetails(Number(searchUserId));
          medicalInfoForm.reset({
            weight: res.weight,
            height: res.height,
            occupation: res.occupation,
            physical_activities: res.physical_activities,
            health_conditions: res.health_conditions,
            medications: res.medications,
            emergency_name: res.emergency_name,
            emergency_contact: res.emergency_contact,
            emergency_relationship: res.emergency_relationship,
            fitness_goals: res.fitness_goals,
            allergies: res.allergies,
            exercise_history: res.exercise_history,
            recent_injuries: res.recent_injuries,
            heart_condition: res.heart_condition,
            blood_pressure: res.blood_pressure,
            diabetes: res.diabetes,
            asthma: res.asthma,
            pregnancy_status: res.pregnancy_status,
            consent_to_exercise: res.consent_to_exercise,
            liability_waiver: res.liability_waiver,
          });
        } catch (error) {
          console.error("Failed to fetch user details:", error);
        }
      }
    };

    fetchUserDetails();
  }, [isMemberEditMode, searchUserId]);

  const handleMedicalInfoSubmit = async (
    values: z.infer<typeof medicalInfoSchema>
  ) => {
    try {
      if (isMemberEditMode && searchUserId) {
        const res = await updateMedicalInfo(Number(searchUserId), values);
        if (res.data) {
          toast.success("User details updated successfully!", {
            style: { background: "green", color: "white" },
          });
          setCurrentStep(1);
          setIsMemberEditMode(false);
          router.push("/dashboard/members");
        }
        if (res.error) {
          toast.error(`Something went wrong!`, {
            style: { background: "red", color: "white" },
          });
        }
      } else {
        setMemberCompleteData((prev) => ({
          ...prev,
          ...values,
        }));
        setCurrentStep(3);
      }
    } catch (error) {
      console.error("Error submitting medical info:", error);
    }
  };

  return (
    <Card className="w-full max-w-5xl mx-auto bg-white max-md:mx-3">
      <CardContent className="p-6 md:p-8">
        <Form {...medicalInfoForm}>
          <form
            onSubmit={medicalInfoForm.handleSubmit(handleMedicalInfoSubmit)}
          >
            <h1 className="text-2xl font-semibold mb-8">
              Member Medical Clearance
            </h1>
            <div className="mt-2 sm:mt-0">
              <p className="font-medium text-right">
                Step 2{" "}
                <span className="text-gray-500">
                  of {isMemberEditMode ? "2" : "4"}
                </span>
              </p>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full mb-8">
              <div
                className={`bg-gray-700 h-2 rounded-full  ${
                  isMemberEditMode ? "w-full" : "w-2/4"
                }`}
              ></div>
            </div>

            <div className="mb-8 flex flex-row gap-2">
              <FormField
                control={medicalInfoForm.control}
                name="weight"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Weight (kgs)</FormLabel>
                    <FormControl>
                      <Input className="h-12" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={medicalInfoForm.control}
                name="height"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Height (cm)</FormLabel>
                    <FormControl>
                      <Input className="h-12" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mb-8">
              <FormField
                control={medicalInfoForm.control}
                name="occupation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Occupation</FormLabel>
                    <FormControl>
                      <Input className="h-12" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mb-8">
              <FormField
                control={medicalInfoForm.control}
                name="physical_activities"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Please list the physical activities that you participate
                      in outside of the gym and outside of work:
                    </FormLabel>
                    <FormControl>
                      <Textarea className="min-h-24" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mb-8">
              <FormField
                control={medicalInfoForm.control}
                name="health_conditions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      If you have any diagnosed health problems list the
                      condition(s).
                    </FormLabel>
                    <FormControl>
                      <Textarea className="min-h-24" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mb-8">
              <FormField
                control={medicalInfoForm.control}
                name="medications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      If you are on any medications, please list them.
                    </FormLabel>
                    <FormControl>
                      <Textarea className="min-h-24" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <h2 className="text-xl font-semibold mb-4">
              Emergency Contact Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <FormField
                control={medicalInfoForm.control}
                name="emergency_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emergency Contact Name</FormLabel>
                    <FormControl>
                      <Input className="h-12" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={medicalInfoForm.control}
                name="emergency_contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emergency Contact Number</FormLabel>
                    <FormControl>
                      <Input className="h-12" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={medicalInfoForm.control}
                name="emergency_relationship"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Relationship</FormLabel>
                    <FormControl>
                      <Input className="h-12" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mb-8">
              <FormField
                control={medicalInfoForm.control}
                name="fitness_goals"
                render={() => (
                  <FormItem>
                    <FormLabel>Fitness Goals (Select all that apply)</FormLabel>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { id: "weight-loss", label: "Weight Loss" },
                        { id: "muscle-gain", label: "Muscle Gain" },
                        {
                          id: "cardiovascular-fitness",
                          label: "Cardiovascular Fitness",
                        },
                        { id: "flexibility", label: "Flexibility" },
                        {
                          id: "sports-performance",
                          label: "Sports Performance",
                        },
                        { id: "general-health", label: "General Health" },
                      ].map((goal) => (
                        <FormField
                          key={goal.id}
                          control={medicalInfoForm.control}
                          name="fitness_goals"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={goal.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(goal.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([
                                            ...field.value,
                                            goal.id,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== goal.id
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {goal.label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mb-8">
              <FormField
                control={medicalInfoForm.control}
                name="allergies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Do you have any allergies? If yes, please specify:
                    </FormLabel>
                    <FormControl>
                      <Textarea className="min-h-16" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mb-8">
              <FormField
                control={medicalInfoForm.control}
                name="exercise_history"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Exercise History</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Beginner" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Beginner (Little to no exercise experience)
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Intermediate" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Intermediate (Moderate exercise experience)
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Advanced" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Advanced (Regular exercise for over a year)
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mb-8">
              <FormField
                control={medicalInfoForm.control}
                name="recent_injuries"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Have you had any recent injuries or surgeries in the past
                      12 months? If yes, please describe:
                    </FormLabel>
                    <FormControl>
                      <Textarea className="min-h-16" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mb-8 space-y-4">
              <FormField
                control={medicalInfoForm.control}
                name="heart_condition"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Heart Condition</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={medicalInfoForm.control}
                name="blood_pressure"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>High/Low Blood Pressure</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={medicalInfoForm.control}
                name="diabetes"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Diabetes</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={medicalInfoForm.control}
                name="asthma"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Asthma</FormLabel>
                  </FormItem>
                )}
              />
            </div>

            <div className="mb-8">
              <FormField
                control={medicalInfoForm.control}
                name="pregnancy_status"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Pregnancy Status (For female members)</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Not Applicable" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Not Applicable
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Currently Pregnant" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Currently Pregnant
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Recently Given Birth" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Recently Given Birth (within last 6 months)
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mb-8">
              <FormField
                control={medicalInfoForm.control}
                name="consent_to_exercise"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm">
                      I hereby consent to voluntary participation in an exercise
                      program. I understand that I may withdraw from the program
                      at any time.
                    </FormLabel>
                  </FormItem>
                )}
              />
              <FormMessage />
            </div>

            <div className="mb-8">
              <FormField
                control={medicalInfoForm.control}
                name="liability_waiver"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm">
                      I acknowledge that I have read this form in its entirety
                      and understand that there are inherent risks associated
                      with any physical activity. I assume responsibility for my
                      own health and safety.
                    </FormLabel>
                  </FormItem>
                )}
              />
              <FormMessage />
            </div>

            <div className="flex justify-between mt-10">
              <Button
                type="button"
                className="bg-white border border-black text-black px-8 h-12 hover:bg-white"
                onClick={() => {
                  setCurrentStep(1);
                }}
              >
                Back
              </Button>
              <Button
                type="submit"
                className="bg-black hover:bg-gray-800 text-white px-8 h-12"
              >
                {isMemberEditMode ? "Save and Exit" : "Next"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default MedicalInfoFormComponent;
