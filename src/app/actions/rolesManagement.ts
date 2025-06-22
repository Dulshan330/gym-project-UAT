"use server";
import { createClient } from "@/utils/supabase/server";

export async function getAllRoles() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("roles").select("*");

  if (error) {
    console.error(error.message);
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

export async function getSingleRole(id: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("roles")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error.message);
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

export async function addNewRole(name: string, paths: string[]) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("roles")
    .insert([
      {
        name: name,
        type: name.replace(/ /g, "_").toLowerCase(),
        accessPages: paths,
      },
    ])
    .select();

  if (error) {
    console.error(error.message);
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

export async function updateRole(id: number, name: string, paths: string[]) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("roles")
    .update({
      name: name,
      type: name.replace(/ /g, "_").toLowerCase(),
      accessPages: paths,
    })
    .eq("id", id)
    .select();

  if (error) {
    console.error(error.message);
    return { data: null, error: error.message };
  }

  return { data, error: null };
}
