"use server";
import { AddNewPackage, UpdatePackageType } from "@/types";
import { createClient } from "@/utils/supabase/server";

export async function fetchAllPackages() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("packages").select(
    `*,packageTypes (
        packageTypeName,
        startTime,
        endTime,
        price,
        noOfMonths
      )`
  );
  if (error) {
    console.error("Error fetching user details:", error);
    return { data: null, error };
  }
  return data;
}

export async function fetchPackageTypes() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("packageTypes").select("*");
  if (error) {
    console.error("Error fetching user details:", error);
    return { data: null, error };
  }
  return data;
}

export async function addNewPackage(addNewPackage: AddNewPackage) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("packages")
    .insert(addNewPackage)
    .select();
  if (error) {
    console.error("Error adding new package:", error);
    return { data: null, error };
  }
  return { data, error: null };
}

export async function deletePackage(packageId: number) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("packages")
    .delete()
    .eq("id", packageId);
  if (error) {
    console.error("Error updating user details:", error);
    return { data: null, error };
  }
}

export async function fetchSinglePackage(packageId: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("packages")
    .select(
      `*,packageTypes (
        packageTypeName,
        startTime,
        endTime,
        price,
        noOfMonths
      )`
    )
    .eq("id", packageId)
    .single();
  if (error) {
    console.error("Error fetching user details:", error);
    return { data: null, error };
  }
  return data;
}

export async function updatePackage(id: number, packageData: AddNewPackage) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("packages")
    .update(packageData)
    .eq("id", id)
    .select();
  if (error) {
    console.error("Error updating user details:", error);
    return { data: null, error };
  }
  return { data, error: null };
}
export async function fetchPackageTypeView(packageId: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("packageTypes")
    .select(`*`)
    .eq("id", packageId)
    .single();
  if (error) {
    console.error("Error fetching user details:", error);
    return { data: null, error };
  }
  return data;
}

export async function packageTypedelete(packageId: number) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("packageTypes")
    .delete()
    .eq("id", packageId);
  if (error) {
    console.error("Error updating user details:", error);
    return { data: null, error };
  }
}

export async function updatePackageType(
  id: number,
  packageData: UpdatePackageType
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("packageTypes")
    .update(packageData)
    .eq("id", id)
    .select();
  if (error) {
    console.error("Error updating user details:", error);
    return { data: null, error };
  }
  return { data, error: null };
}
export async function sheduleTypedelete(name: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("AllShedules")
    .delete()
    .eq("name", name);
  if (error) {
    console.error("Error updating user details:", error);
    return { data: null, error };
  }
}

export async function updateScheduleItems(
  name: string,
  exerciseString: string
) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("AllShedules")
      .update({ number_of_exercise: exerciseString })
      .eq("name", name);

    if (error) {
      console.error("Failed to update schedule:", error.message);
      return { success: false, error: "Update failed" };
    }
    return { success: true, data };
  } catch (error) {
    console.error("Failed to update schedule:", error);
    return { success: false, error: "Update failed" };
  }
}

export async function getUsersWithMultiMemberPackages() {
  const supabase = await createClient();
  try {
    // Step 1: Get all unique user IDs from packageMemberRelations
    const { data: relations, error: relationsError } = await supabase
      .from("packageMemberRelations")
      .select("primaryUserId")
      .is("relationUserId", null);

    if (relationsError) throw relationsError;
    if (!relations || relations.length === 0) {
      console.log("No package member relations found");
      return [];
    }

    // Combine and deduplicate user IDs
    const allUserIds = new Set<number>();
    relations.forEach((relation) => {
      allUserIds.add(relation.primaryUserId);
    });

    // Convert Set to array
    const userIds = Array.from(allUserIds);

    // Step 2: Get user details for these IDs
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("id, username")
      .in("id", userIds);

    if (usersError) throw usersError;

    return users || [];
  } catch (error) {
    console.error("Error fetching users in package relations:", error);
    return [];
  }
}
