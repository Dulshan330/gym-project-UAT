import { ReactNode } from "react";

export type StatValues = {
  activeUsers: number;
  expireSoon: number;
  expiredUser: number;
};

export type UsersData = {
  id: number;
  username: string;
  nic: string;
  user_type: string;
  phone_number: string;
  email: string;
  date_of_birth?: Date | null;
  joined_of_date?: Date | null;
  expire_date?: Date | null;
  status: string;
  gender?: string;
  address?: string;
  imagePath?: string;
  role: number;
};

export type UserWithRole = {
  id: number;
  username: string;
  nic: string;
  user_type: string;
  phone_number: string;
  email: string;
  date_of_birth?: Date | null;
  joined_of_date?: Date | null;
  expire_date?: Date | null;
  status: string;
  gender?: string;
  address?: string;
  authenticationId: string;
  imagePath: string;
  roles?: {
    id: number;
    name: string;
    type: string;
    accessPages: string[];
  };
};

export type PackagesData = {
  id: number;
  package_name: string;
  number_of_members: number | null;
  startDate?: Date | null;
  endDate?: Date | null;
  packageTypes: {
    packageTypeName: string;
    price: number;
    noOfMonths?: number;
    endTime?: Date | null;
    startTime?: Date | null;
  };
};

export type PackageType = {
  id: number;
  packageTypeName: string;
  price: number;
  noOfMonths?: number;
  endTime?: Date | null;
  startTime?: Date | null;
};

export type UpdatePackageType = {
  packageTypeName: string;
  price: number;
  noOfMonths?: number;
  endTime?: Date | null;
  startTime?: Date | null;
};

export type AddNewPackage = {
  package_name: string;
  package_type_id: number;
};

export type SectionProps = {
  title: string;
  children: ReactNode;
};

export type InfoItemProps = {
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number | Date | React.ReactNode;
};

export type ExerciseType = {
  id: number;
  exercisesTypeName: string;
};

export type Exercise = {
  id: number;
  exerciseName: string;
  targetMuscleGroup: string;
  exercisesTypeId: number;
  exercisesType: {
    exercisesTypeName: string;
    id: number;
  };
};

export type ExerciseRowType = {
  id: number;
  exerciseType: string;
  exercise: string;
  reps: string;
  sets: string;
  rest: string;
};

export type WorkoutType = {
  id: number;
  targetMuscleGroup: string;
  exercises: string;
};

export type SheduleType = {
  id: number;
  name: string;
  number_of_exercise: "1";
  create_date: Date;
};

export type MemberPaymentType = {
  member_id?: number;
  amount?: number;
  payment_method?: string;
};

export type StaffMemberType = {
  user_id: string;
  employmentType?: string;
  workSchedule?: string;
  workHour?: string;
  bankName: string;
  accountHolder: string;
  branchName: string;
  accountNumber: string;
};

export type TrainerDataType = {
  user_id: string;
  weight: string;
  height: string;
  occupation: string;
  workSchedule: string;
  physical_activities: string;
  health_problems: string;
  medications: string;
  therapies: string;
  injuries: string;
  injuryTheraphy: string;
  familyHeartDisease: string;
  familyDisease: string;
  healthConditionHistory: string;
  smokingDetails: string;
};

export type MemberPersonalInfoType = {
  nic: string;
  id?: number;
  username?: string;
  email: string;
  date_of_birth?: string;
  gender: string;
  address?: string;
  phone_number?: string;
  user_type?: string;
  status?: string;
  joined_of_date?: string;
  name?: string;
  dob?: string;
  phone?: string;
  imagePath?: string;
  role: number;
};

export type MedicalDataType = {
  user_id?: string | null;
  trainer_id?: string;
  planTime?: string;
  plan_id?: string;
  weight: string;
  height: string;
  occupation: string;
  trainer?: string;
  work_schedule?: string;
  payment_method?: string;
  physical_activities: string;
  health_conditions: string;
  medications: string;
  emergency_name: string;
  emergency_contact: string;
  emergency_relationship: string;
  fitness_goals: string[];
  allergies: string;
  exercise_history: string;
  recent_injuries: string;
  heart_condition: boolean;
  blood_pressure: boolean;
  diabetes: boolean;
  asthma: boolean;
  pregnancy_status: string;
  consent_to_exercise: boolean;
  liability_waiver: boolean;
};

export type PersonalInfoType = {
  username: string;
  nic: string;
  email: string;
  date_of_birth: string;
  gender: string;
  address: string;
  user_type: string;
  phone_number: string;
  status: string;
  role: number;
};

export type PersonalData = {
  name: string;
  nic: string;
  email: string;
  dob: string;
  gender: string;
  address: string;
  phone: string;
  imagePath?: string;
  role?: string;
};

export type DownloadMemberPDFType = {
  personalData: PersonalData;
  medicalData: MedicalDataType & {
    trainer_id: string;
  };
  planId: string | null;
};

export type FetchAllExercisesType = {
  id: number;
  exerciseName: string;
};

export interface Trainer {
  id: string;
  username: string;
}

export interface PackageData {
  id: string;
  package_name: string;
  packageTypes?: {
    packageTypeName: string;
    price: number;
  };
  number_of_members?: number;
}

export interface PersonalInfoData {
  name: string;
  email: string;
  dob: string;
  gender: string;
  address: string;
  phone: string;
}

export type MemberFitnessProfile = {
  weight: string;
  height: string;
  occupation: string;
  trainer: string;
  work_schedule?: string;
  payment_method?: string;
  physical_activities?: string;
  health_conditions?: string;
  medications?: string;
  emergency_name: string;
  emergency_contact: string;
  emergency_relationship: string;
  fitness_goals?: string[];
  allergies?: string;
  exercise_history?: string;
  recent_injuries?: string;
  heart_condition?: boolean;
  blood_pressure?: boolean;
  diabetes?: boolean;
  asthma?: boolean;
  pregnancy_status?: string;
  user_id: number;
  relationship?: string;
  trainer_id: number;
  plan_id: number;
};

export type TrainerProfile = {
  weight: string;
  height: string;
  occupation: string;
  workSchedule: string;
  physical_activities: string;
  health_problems: string;
  medications: string;
  therapies: string;
  injuries: string;
  familyHeartDisease: string;
  familyDisease: string;
  healthConditionHistory: string;
  smokingDetails: string;
  injuryTheraphy: string;
  user_id: number;
};

export type StaffProfile = {
  employmentType: string;
  workSchedule: string;
  bankName: string;
  accountHolder: string;
  branchName: string;
  accountNumber: string;
  workHour: string;
};

export type Role = {
  id: number;
  name: string;
  type: string;
  description?: string;
};

export type Schedule = {
  [day: string]: {
    enabled: boolean;
    startTime: string;
    endTime: string;
  };
};

export type WorkingHours = {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}[];

export type Transaction = {
  id?: number;
  memberId: number;
  transactionTypeId: number;
  amount: number | undefined;
  discountAmount: number;
  discountPercentage: number;
  finalAmount: number;
  paymentMethod: string;
  rowOperation: string;
  created_at?: Date | string;
  transactionType?: {
    id: number;
    name: string;
    description: string;
  };
  users?: {
    id: number;
    username: string;
  };
};

export type DeleteTransaction = {
  rowOperation: string;
  lastModified_at: Date | string;
  remark: string;
};

export type UpdateTransaction = {
  amount: number;
  discountAmount: number;
  discountPercentage: number;
  finalAmount: number;
  paymentMethod: string;
  remark: string;
  rowOperation: string;
  lastModified_at: Date | string;
};

export type MemberPackage = {
  id: number;
  memberId: number;
  planId: number;
  startDate: Date;
  endDate: Date;
  packages?: {
    id: number;
    package_name: string;
  };
};

export type MemberScheduleType = {
  id: number;
  userId: number;
  scheduleUniqueID: string;
  startDate: Date;
  endDate: Date;
  users?: {
    username: string;
    gender: string;
  };
};

export type ScheduleType = {
  id: number;
  exerciseTypeId: number;
  exerciseId: number;
  reps: string;
  sets: string;
  rest: string;
  scheduleUniqueID: string;
  workoutDay: string;
  exercises?: {
    exerciseName: string;
    targetMuscleGroup: string;
    exercisesTypeId: number;
  };
  exercisesType?: {
    exercisesTypeName: string;
    id: number;
  };
};

export interface WorkoutDayGroup {
  day: string;
  exercises: ScheduleType[];
}

export type Roles = {
  id: number;
  name: string;
  type: string;
  accessPages: string[];
};
