"use server";
import { createClient } from "@/utils/supabase/server";
import { MedicalDataType, MemberPersonalInfoType } from "@/types";
import { textSplitAndGetFirstWord } from "@/lib/textSplitAndGetFirstWord";
import { sendLoginCredentials } from "./sendGridEmailService";

export async function fetchMemberDetails(status: string) {
  const supabase = await createClient();
  let query = supabase.from("users").select("*").eq("user_type", "Member");

  switch (status) {
    case "All":
      query = query;
      break;
    case "Active":
      query = query.eq("status", "Active");
      break;
    case "In-Active":
      query = query.eq("status", "In-Active");
      break;
    default:
      break;
  }

  const { data, error } = await query;
  if (error) {
    console.error("Error fetching user details:", error);
    return { data: null, error };
  }
  return data;
}

export async function fetchMemberWithSchedule() {
  const supabase = await createClient();
  const { data: members, error: memError } = await supabase
    .from("memberSchedule")
    .select("userId");

  if (memError) {
    console.error("Error fetching member schedule:", memError);
    return { data: null, error: memError };
  }
  const memberIds = members?.map((m) => m.userId).filter(Boolean) ?? [];

  if (memberIds.length === 0) {
    return { data: [], error: null };
  }

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .in("id", memberIds);

  if (error) {
    console.error("Error fetching users:", error);
    return { data: null, error };
  }
  return { data, error: null };
}

export async function validateEmailAndNIC(email: string, nic: string) {
  const supabase = await createClient();
  const { data: existingUserByEmail } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();
  if (existingUserByEmail) {
    return { data: null, error: "User email found" };
  }
  const { data: existingUserByNIC } = await supabase
    .from("users")
    .select("*")
    .eq("nic", nic)
    .single();

  if (existingUserByNIC) {
    return { data: null, error: "User NIC found" };
  }
  return { data: "success" };
}

export default async function addMemberPersonalInfo(
  formData: MemberPersonalInfoType
) {
  const supabase = await createClient();

  const temporyPassword = textSplitAndGetFirstWord(formData.username || "");

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: formData.email,
    password: temporyPassword,
    options: {
      data: {
        name: formData.username,
        role: "member",
      },
    },
  });

  sendLoginCredentials(formData.email, temporyPassword);

  if (!signUpData.user?.id || signUpError) {
    console.error("User's login is not created!");
    return;
  }

  const { data, error } = await supabase
    .from("users")
    .insert({
      ...formData,
      authenticationId: signUpData.user?.id,
    })
    .select();
  return { data, error };
}

export async function addMedicalInfo(formData: MedicalDataType) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("members")
    .insert(formData)
    .select();
  console.log("Medical Info Submitted:", data, error);
  return { data, error };
}

export async function updateMedicalInfo(
  userId: number,
  formData: MedicalDataType
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("members")
    .update(formData)
    .eq("user_id", userId)
    .select();
  console.log("Medical Info Updated:", data, error);
  return { data, error };
}

export async function updatePlanAndTrainer(
  userId: number,
  planId: number,
  trinerId: number
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("members")
    .update({ plan_id: planId, trainer_id: trinerId })
    .eq("user_id", userId)
    .select();
  console.log("Medical Info Submitted:", data, error);
  return { data, error };
}

export async function fetchTrainers() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("user_type", "Trainer");
  if (error) {
    console.error("Error fetching user details:", error);
    return { data: null, error };
  }
  return data;
}

export async function fetchPackages() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("packages").select("*");
  if (error) {
    console.error("Error fetching user details:", error);
    return { data: null, error };
  }
  return data;
}

export async function verifyUserEmail(token: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .update({ isVerified: true, verifyToken: null })
    .eq("verifyToken", token)
    .select()
    .single();
  if (error) {
    console.error("Error verifying email:", error);
    return { data: null, error };
  }
  return { data, error: null };
}

export async function isVerifiedMember(userId: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .select("isVerified")
    .eq("id", userId)
    .single();
  if (error) {
    console.error("Error geting user:", error);
    return { data: null, error };
  }
  if (data?.isVerified) {
    return { isVerified: true };
  }
  return { isVerified: false };
}

export async function addPrimaryUser(userId: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("packageMemberRelations")
    .insert([{ primaryUserId: userId }])
    .select();
  if (error) {
    console.error("Error updating user details:", error);
    return { data: null, error };
  }
  return { data, error: null };
}

export async function addRelationUser(primaryUserId: number, userId: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("packageMemberRelations")
    .update({ relationUserId: userId })
    .eq("primaryUserId", primaryUserId)
    .single();
  if (error) {
    console.error("Error updating user details:", error);
    return { data: null, error };
  }
  return { data, error: null };
}

export async function getUsersForPackageAssign() {
  const supabase = await createClient();
  const currentDate = new Date().toISOString();

  const { data: relations, error: relError } = await supabase
    .from("memberPackageRelations")
    .select("memberId")
    .or(`endDate.is.null,endDate.gt.${currentDate}`);

  if (relError) {
    console.error("Error fetching memberPackageRelations:", relError);
    return { data: null, error: relError };
  }

  const assignedIds = relations?.map((r) => r.memberId).filter(Boolean) ?? [];

  const assignedIdsStr = assignedIds.length > 0 ? assignedIds.join(",") : "0";

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .not("id", "in", `(${assignedIdsStr})`); // wrap in parentheses

  if (error) {
    console.error("Error fetching users for package assignment:", error);
    return { data: null, error };
  }
  return data;
}
