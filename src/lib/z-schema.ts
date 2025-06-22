import * as z from "zod";

export const personalInfoSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    identityType: z.enum(["nic", "passport", "other"]),
    nic: z.string().min(1, "NIC is required"),
    email: z.string().email("Invalid email address"),
    dob: z.string().min(1, "Date of birth is required"),
    gender: z.string().min(1, "Gender is required"),
    address: z.string().min(1, "Address is required"),
    role: z.string().min(1, "Role is required"),
    phone: z
      .string()
      .min(1, "Phone number is required")
      .regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  })
  .superRefine((data, ctx) => {
    if (data.identityType === "nic") {
      // NIC: 9 digits + 1 char (e.g., 123456789V) OR 12 digits (new format)
      if (
        !/^\d{9}[vVxX]$/.test(data.nic) && // old format
        !/^\d{12}$/.test(data.nic) // new format
      ) {
        ctx.addIssue({
          path: ["nic"],
          code: z.ZodIssueCode.custom,
          message:
            "NIC must be 9 digits followed by a letter (V/v/X/x) or 12 digits",
        });
      }
    }
    if (data.identityType === "passport") {
      // Example: Passport format (adjust regex as needed)
      if (!/^[A-Z0-9]{6,9}$/.test(data.nic)) {
        ctx.addIssue({
          path: ["nic"],
          code: z.ZodIssueCode.custom,
          message: "Invalid passport format",
        });
      }
    }
  });

export const medicalInfoSchema = z.object({
  weight: z.string().min(1, "Weight is required"),
  height: z.string().min(1, "Height is required"),
  occupation: z.string(),
  physical_activities: z.string(),
  health_conditions: z.string(),
  medications: z.string(),
  emergency_name: z.string().min(1, "Emergency contact name is required"),
  emergency_contact: z
    .string()
    .min(1, "Emergency contact number is required")
    .regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  emergency_relationship: z.string().min(1, "Relationship is required"),
  fitness_goals: z
    .array(z.string())
    .min(1, "Please select at least one fitness goal"),
  allergies: z.string(),
  exercise_history: z.string().min(1, "Exercise history is required"),
  recent_injuries: z.string(),
  heart_condition: z.boolean(),
  blood_pressure: z.boolean(),
  diabetes: z.boolean(),
  asthma: z.boolean(),
  pregnancy_status: z.string(),
  consent_to_exercise: z
    .boolean()
    .refine((val) => val, "You must consent to exercise"),
  liability_waiver: z
    .boolean()
    .refine((val) => val, "You must accept the liability waiver"),
});

export const membershipPlanSchema = z.object({
  trainer: z.string().optional(),
});

export const employmentInfoSchema = z.object({
  bankName: z.string().min(1, "Bank Name is required"),
  accountHolder: z.string().min(1, "Account Holder Name is required"),
  branchName: z.string().min(1, "Branch Name is required"),
  accountNumber: z.string().min(1, "Account Number is required"),
});

export const personalInfoSchemaStaff = z.object({
  name: z.string().min(1, "Name is required"),
  nic: z.string().min(1, "NIC is required"),
  email: z.string().email("Invalid email address"),
  dateOfBirth: z.string().min(1, "Date of Birth is required"),
  gender: z.enum(["Female", "Male", "Other"], {
    required_error: "Gender is required",
  }),
  address: z.string().min(1, "Address is required"),
  phone_number: z.string().min(1, "Phone number is required"),
  role: z.string().min(1, "Role is required"),
});

export const personalInfoSchemaTrainer = z.object({
  name: z.string().min(1, "Name is required"),
  nic: z.string().min(1, "NIC is required"),
  email: z.string().email("Invalid email address"),
  dateOfBirth: z.string().min(1, "Date of Birth is required"),
  gender: z.string().min(1, "Gender is required"),
  address: z.string().min(1, "Address is required"),
  phone_number: z.string().min(1, "Phone number is required"),
  role: z.string().min(1, "Role is required"),
});

export const medicalInfoSchemaTrainer = z.object({
  weight: z.string().min(1, "Weight is required"),
  height: z.string().min(1, "Height is required"),
  occupation: z.string().min(1, "Occupation is required"),
  workSchedule: z.string().min(1, "Work Schedule is required"),
  physicalActivities: z.string(),
  healthConditions: z.string(),
  medications: z.string(),
  therapies: z.string(),
  injuries: z.string(),
  injuryTheraphy: z.string(),
  familyHeartDisease: z.string(),
  familyDisease: z.string(),
  healthConditionHistory: z.string(),
  smokingDetails: z.string(),
});

export const transactionSchema = z.object({
  amount: z.number({ required_error: "Amount is required" }),
  discountAmount: z.number({ required_error: "Discount Amount is required" }),
  discountPercentage: z.number({
    required_error: "Discount Percentage is required",
  }),
  finalAmount: z.number({ required_error: "Final Amount is required" }),
  paymentMethod: z.string().min(1, "Payment Method is required"),
  remark: z.string().min(1, "Remark is required"),
});
