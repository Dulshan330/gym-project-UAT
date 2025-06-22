"use server";
import { UsersData } from "@/types";
import { createClient } from "@/utils/supabase/server";

export async function fetchUserDetails(status: string) {
  const supabase = await createClient();
  let query = supabase.from("users").select("*");

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

export async function fetchUser(id: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .select("*, roles:roles!users_role_fkey(id, name)")
    .eq("id", id)
    .single();
  if (error) {
    console.error("Error fetching user details:", error);
    return { data: null, error };
  }
  return data;
}

export async function fetchUserWithAuthenticationID(authenticationId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .select(`*, roles:roles!users_role_fkey(id, name, type, accessPages)`)
    .eq("authenticationId", authenticationId)
    .single();
  if (error) {
    console.error("Error fetching user details:", error);
    return { data: null, error };
  }
  return { data, error: null };
}

export async function updateUser(userData: UsersData) {
  const supabase = await createClient();
  const { id, ...updateData } = userData;
  const { data, error } = await supabase
    .from("users")
    .update(updateData)
    .eq("id", id)
    .select();
  if (error) {
    console.error("Error updating user details:", error);
    return { data: null, error };
  }
  return { data, error: null };
}

export async function deleteUser(id: number) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("users")
    .update({ isDeleted: true, status: "In-Active" })
    .eq("id", id)
    .select();
  if (error) {
    console.error("Error updating user details:", error);
    return { data: null, error };
  }
}

export async function reActivateUser(id: number) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("users")
    .update({ isDeleted: false, status: "Active" })
    .eq("id", id)
    .select();
  if (error) {
    console.error("Error updating user details:", error);
    return { data: null, error };
  }
}

export async function fetchSingleStaffDetails(userId: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("staff")
    .select("*")
    .eq("user_id", userId)
    .single();
  if (error) {
    console.error("Error fetching staff details:", error);
    return { data: null, error };
  }
  return data;
}

export async function fetchSingleTrainerDetails(userId: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trainer")
    .select("*")
    .eq("user_id", userId)
    .single();
  if (error) {
    console.error("Error fetching trainer details:", error);
    return { data: null, error };
  }
  return data;
}

export async function fetchSingleMemberDetails(userId: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .eq("user_id", userId)
    .single();
  if (error) {
    console.error("Error fetching members details:", error);
    return { data: null, error };
  }
  return data;
}

export async function uploadProfileImage(selectedFile: File | null) {
  const supabase = await createClient();

  if (!selectedFile) return;
  // Generate unique filename
  const fileExt = selectedFile.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `ProfileImages/${fileName}`;

  const { error } = await supabase.storage
    .from("profileimages")
    .upload(filePath, selectedFile);

  if (error) throw error;

  return filePath;
}

export async function getSignedUrl(path: string) {
  const supabase = await createClient();

  const { data } = await supabase.storage
    .from("profileimages")
    .createSignedUrl(path, 3600);

  return data;
}
