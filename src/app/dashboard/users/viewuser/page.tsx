"use client";

import { useEffect, useState } from "react";
import {
  Mail,
  Home,
  Calendar,
  Ruler,
  Weight,
  Briefcase,
  Activity,
  Stethoscope,
  Venus,
  UserCircle2Icon,
  PhoneIcon,
  User,
  HeartPulse,
  Cross,
  Dumbbell,
  History,
  Droplet,
  Wind,
  UsersRound,
} from "lucide-react";
import {
  MemberFitnessProfile,
  MemberPackage,
  StaffProfile,
  TrainerProfile,
  UsersData,
} from "@/types";
import {
  fetchSingleMemberDetails,
  fetchSingleStaffDetails,
  fetchSingleTrainerDetails,
  fetchUser,
} from "@/app/actions/userManagement";
import { useRouter, useSearchParams } from "next/navigation";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Accordion } from "@/components/ui/accordion";
import InfoAccordionItem from "@/components/users/infoAccordionItem";
import { getAssignedPackage } from "@/app/actions/packageMemberAction";

export default function UserDetails() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("user");

  const [user, setUser] = useState<UsersData>({
    id: Number(userId),
    email: "",
    nic: "",
    username: "",
    status: "",
    user_type: "",
    phone_number: "",
    date_of_birth: null,
    joined_of_date: null,
    expire_date: null,
    gender: "",
    address: "",
    role: 0,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [viewAll, setViewAll] = useState(false);
  const [memberFitnessData, setMemberFitnessData] =
    useState<MemberFitnessProfile>();
  const [trainerProfile, setTrainerProfile] = useState<TrainerProfile>();
  const [, setStaffProfile] = useState<StaffProfile>();
  const [memberPackage, setMemberPackage] = useState<MemberPackage[]>();

  const allAccordionValues = [
    "personal-info",
    "physical-attributes",
    "user-type",
    "work-schedule",
    "lifestyle",
    "fitness",
    "medical-history",
    "injuries-treatments",
    "mental-wellbeing",
    "family-history",
    "specific-conditions",
    "emergency-contact-information",
    "member-package-details",
    "schedule",
    "payment-details",
    "gym-details",
  ];

  const toggleViewAll = () => {
    if (viewAll) {
      setExpandedItems([]);
    } else {
      setExpandedItems(allAccordionValues);
    }
    setViewAll(!viewAll);
  };

  const handleAccordionChange = (values: string[]) => {
    setExpandedItems(values);
    if (values.length !== allAccordionValues.length && values.length !== 0) {
      setViewAll(false);
    }
  };

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const userData = await fetchUser(Number(userId));
      if (userData) {
        setUser({
          id: userData.id,
          email: userData.email || "",
          nic: userData.nic || "",
          username: userData.username || "",
          status: userData.status || "",
          user_type: userData.user_type || "",
          phone_number: userData.phone_number || "",
          date_of_birth: userData.date_of_birth || "",
          joined_of_date: userData.joined_of_date || "",
          expire_date: userData.expire_date || "",
          gender: userData.gender || "",
          address: userData.address || "",
          role: userData.roles.id,
        });
      }
      const fitnessData = await fetchSingleMemberDetails(Number(userId));
      if (fitnessData) {
        setMemberFitnessData(fitnessData);
      }
      const trainerData = await fetchSingleTrainerDetails(Number(userId));
      if (trainerData) {
        setTrainerProfile(trainerData);
      }
      const staffData = await fetchSingleStaffDetails(Number(userId));
      if (staffData) {
        setStaffProfile(staffData);
      }
      const memberPackageData = await getAssignedPackage(Number(userId));
      if (memberPackageData) {
        setMemberPackage(memberPackageData as MemberPackage[]);
      }
    } catch (error) {
      console.error("Failed to load user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (!userId) {
    router.push("/dashboard/users/");
    return null;
  }

  if (loading) return <Loader />;

  return (
    <>
      <div className="flex justify-between m-12 items-center">
        <h2 className="text-2xl font-semibold m-4 md:m-8">
          {user.user_type} Details - {user.username || "Loading..."}
        </h2>
        <Button
          variant={"ghost"}
          className="m-4 bg-[#FE925E]  md:m-8"
          onClick={toggleViewAll}
        >
          {viewAll ? "Collapse All" : "View All"}
        </Button>
      </div>

      <div className="px-4 md:px-8 space-y-3">
        <Accordion
          type="multiple"
          className="space-y-3 w-full max-w-7xl mx-auto"
          value={expandedItems}
          onValueChange={handleAccordionChange}
        >
          <InfoAccordionItem
            value="personal-info"
            title="Personal Information"
            items={[
              {
                icon: <Mail />,
                label: "email",
                value: user.email,
              },
              {
                icon: <UserCircle2Icon />,
                label: "Name",
                value: user.username,
              },
              {
                icon: <PhoneIcon />,
                label: "phone number",
                value: user.phone_number,
              },
              {
                icon: <Calendar />,
                label: "date of birth",
                value: user.date_of_birth,
              },
              {
                icon: <Venus />,
                label: "gender",
                value: user.gender,
              },
              {
                icon: <Home />,
                label: "address",
                value: user.address,
              },
            ]}
          />

          <InfoAccordionItem
            value="user-type"
            title="User Type"
            items={[
              {
                icon: <User />,
                label: "User type",
                value: user.user_type,
              },
            ]}
          />

          {(memberFitnessData?.weight || trainerProfile?.weight) && (
            <InfoAccordionItem
              value="physical-attributes"
              title="Physical Attributes"
              items={[
                {
                  icon: <Ruler />,
                  label: "Height",
                  value: `${
                    memberFitnessData?.height || trainerProfile?.height
                  } cm`,
                },
                {
                  icon: <Weight />,
                  label: "Weight",
                  value: `${
                    memberFitnessData?.weight || trainerProfile?.weight
                  } kg`,
                },
              ]}
            />
          )}

          {(memberFitnessData?.occupation || trainerProfile?.occupation) && (
            <InfoAccordionItem
              value="work-schedule"
              title="Occupation & Work Schedule"
              items={[
                {
                  icon: <Briefcase />,
                  label: "What do you do for a living?",
                  value:
                    memberFitnessData?.occupation || trainerProfile?.occupation,
                },
              ]}
            />
          )}

          {(memberFitnessData?.physical_activities ||
            trainerProfile?.physical_activities) && (
            <InfoAccordionItem
              value="lifestyle"
              title="Lifestyle & Activities"
              items={[
                {
                  icon: <Activity />,
                  label: "Physical activities outside of the gym and work",
                  value:
                    memberFitnessData?.physical_activities ||
                    trainerProfile?.physical_activities,
                },
              ]}
            />
          )}

          {(memberFitnessData?.health_conditions ||
            trainerProfile?.health_problems) && (
            <InfoAccordionItem
              value="medical-history"
              title="Medical History"
              items={[
                {
                  icon: <Stethoscope />,
                  label: "Diagnosed health conditions",
                  value:
                    memberFitnessData?.physical_activities ||
                    trainerProfile?.physical_activities,
                },
                {
                  icon: <Cross />,
                  label: "Madications for diagnosed health conditions",
                  value:
                    memberFitnessData?.medications ||
                    trainerProfile?.medications ||
                    "N/A",
                },
              ]}
            />
          )}

          {(memberFitnessData?.recent_injuries || trainerProfile?.injuries) && (
            <InfoAccordionItem
              value="injuries-treatments"
              title="Injuries & Treatments"
              items={[
                {
                  icon: <Stethoscope />,
                  label: "Past injuries related to physical activity",
                  value:
                    memberFitnessData?.recent_injuries ||
                    trainerProfile?.injuries,
                },
              ]}
            />
          )}

          {(memberFitnessData?.fitness_goals ||
            memberFitnessData?.exercise_history) && (
            <InfoAccordionItem
              value="fitness"
              title="Fitness"
              items={[
                {
                  icon: <Dumbbell />,
                  label: "Fitness Goals",
                  value: memberFitnessData?.fitness_goals,
                },
                {
                  icon: <History />,
                  label: "Exercise History",
                  value: memberFitnessData?.exercise_history,
                },
              ]}
            />
          )}

          {(memberFitnessData?.heart_condition ||
            memberFitnessData?.diabetes ||
            memberFitnessData?.blood_pressure ||
            memberFitnessData?.asthma) && (
            <InfoAccordionItem
              value="specific-conditions"
              title="Specific Health Conditions"
              items={[
                {
                  icon: <HeartPulse />,
                  label: "Heart Condition",
                  value: memberFitnessData?.heart_condition ? "Yes" : "No",
                },
                {
                  icon: <Droplet />,
                  label: "Diabetes",
                  value: memberFitnessData?.diabetes ? "Yes" : "No",
                },
                {
                  icon: <Activity />,
                  label: "Blood Pressure",
                  value: memberFitnessData?.blood_pressure ? "Yes" : "No",
                },
                {
                  icon: <Wind />,
                  label: "Asthma",
                  value: memberFitnessData?.asthma ? "Yes" : "No",
                },
              ]}
            />
          )}

          {(memberFitnessData?.emergency_name ||
            memberFitnessData?.emergency_contact ||
            memberFitnessData?.emergency_relationship) && (
            <InfoAccordionItem
              value="emergency-contact-information"
              title="Emergency Contact Information"
              items={[
                {
                  icon: <UserCircle2Icon />,
                  label: "Name",
                  value: memberFitnessData?.emergency_name,
                },
                {
                  icon: <PhoneIcon />,
                  label: "Contact Number",
                  value: memberFitnessData?.emergency_contact,
                },
                {
                  icon: <UsersRound />,
                  label: "Relationship",
                  value: memberFitnessData?.emergency_relationship,
                },
              ]}
            />
          )}

          {memberPackage && (
            <InfoAccordionItem
              value="member-package-details"
              title="Member Package Details"
              componet={
                <div className="flex flex-col gap-2">
                  {memberPackage?.map((item, index) => (
                    <div key={index}>
                      <div
                        key={index}
                        className="flex justify-between items-center bg-gray-100 py-3 px-6 rounded-lg"
                      >
                        <p className="text-base md:text-lg">
                          {item.packages?.package_name}
                        </p>
                        <div
                          className={`w-28 md:w-36 flex justify-center py-1 md:py-2 rounded-md font-semibold text-xs md:text-sm text-white ${
                            index === 0 ? "bg-[#FE925E]" : "bg-gray-400"
                          }`}
                        >
                          {index === 0 ? "Now" : "Previous"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              }
            />
          )}

          {/* {data.schedules.length > 0 && (
            <InfoAccordionSection
              value="schedule"
              title="Schedule"
              component={
                <div className="flex flex-col gap-2">
                  {data.schedules.map((schedule, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center bg-gray-100 py-3 px-6 rounded-lg"
                    >
                      <p className="text-base md:text-lg">{schedule.name}</p>
                      <div
                        className={`w-28 md:w-36 flex justify-center py-1 md:py-2 rounded-md font-semibold text-xs md:text-sm text-white ${
                          schedule.status === "Now"
                            ? "bg-[#FE925E]"
                            : "bg-gray-400"
                        }`}
                      >
                        {schedule.status}
                      </div>
                    </div>
                  ))}
                </div>
              }
            />
          )} */}

          {/* {data.paymentDetails.length > 0 && (
            <InfoAccordionSection
              value="payment-details"
              title="Payment Details"
              component={
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="px-4 py-2">
                          Package Name
                        </TableHead>
                        <TableHead className="px-4 py-2">
                          Package Type
                        </TableHead>
                        <TableHead className="px-4 py-2">
                          Payment Date
                        </TableHead>
                        <TableHead className="px-4 py-2 text-right">
                          Price (Rs)
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.paymentDetails.map((payment, index) => (
                        <TableRow key={index}>
                          <TableCell className="px-4 py-2">
                            {payment.packageName}
                          </TableCell>
                          <TableCell className="px-4 py-2">
                            {payment.packageType}
                          </TableCell>
                          <TableCell className="px-4 py-2">
                            {payment.paymentDate}
                          </TableCell>
                          <TableCell className="px-4 py-2 text-right">
                            {payment.price}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              }
            />
          )} */}

          {/* <InfoAccordionSection
            value="gym-details"
            title="Gym Details"
            component={
              <div className="space-y-2">
                <InfoItem
                  label="Member Id"
                  value={data.gymDetails.memberId || "N/A"}
                />
                <InfoItem
                  label="Trainer Name"
                  value={data.gymDetails.trainerName || "N/A"}
                />
                <InfoItem
                  label="Join Date"
                  value={data.gymDetails.joinDate || "N/A"}
                />
              </div>
            }
          /> */}
        </Accordion>

        <div className="mb-8 flex justify-end">
          <Button
            className="w-32 md:w-36"
            onClick={() => {
              router.push("/dashboard/users");
            }}
          >
            Ok
          </Button>
        </div>
      </div>
    </>
  );
}
