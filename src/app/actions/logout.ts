"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
  const supabase = await createClient();

  await supabase.auth.signOut();

  (await cookies()).delete("sb-access-token");
  (await cookies()).delete("sb-refresh-token");

  redirect("/login");
}
