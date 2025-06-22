"use server";
import { createClient } from "@/utils/supabase/server";

export async function signUp(email: string, password: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
}

export async function signIn(email: string, password: string) {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      return { data: null, error: error.message };
    }
    return { data, error: null };
  } catch (err) {
    console.error("Sign-in error:", err);
    // Convert error to string
    const errorMessage = err instanceof Error ? err.message : "Sign-in failed";
    return { data: null, error: errorMessage };
  }
}

export async function resetPassword(email: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: "http://localhost:3000/login/reset",
  });
  return { data, error };
}

export async function resetPasswordVerify(new_password: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.updateUser({
    password: new_password,
  });
  return { data, error };
}

export async function getUser() {
  const supabase = await createClient();
  const data = await supabase.auth.getUser();
  return data;
}

export async function updatePassword(password: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.updateUser({
    password: password,
  });
  if (error) {
    console.error("Error updating password:", error.message);
    return { data: null, error: error.message };
  }
  const { error: userError } = await supabase
    .from("users")
    .update({ isFirstLogin: false })
    .eq("authenticationId", data.user.id)
    .select();

  if (userError) {
    console.error("Error updating password:", userError.message);
    return { data: null, error: userError.message };
  }
  return { data, error: null };
}
