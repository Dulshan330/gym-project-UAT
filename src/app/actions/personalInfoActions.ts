"use server";
import { textSplitAndGetFirstWord } from "@/lib/textSplitAndGetFirstWord";
import { PersonalInfoType } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { sendLoginCredentials } from "./sendGridEmailService";

export default async function addPersonalInfo(formData: PersonalInfoType) {
  const supabase = await createClient();
  const { data: existingUserByEmail } = await supabase
    .from("users")
    .select("*")
    .eq("email", formData.email)
    .single();
  if (existingUserByEmail) {
    return { data: null, error: "User email found" };
  }

  const { data: existingUserByNIC } = await supabase
    .from("users")
    .select("*")
    .eq("nic", formData.nic)
    .single();

  if (existingUserByNIC) {
    return { data: null, error: "User NIC found" };
  }

  const temporyPassword = textSplitAndGetFirstWord(formData.username || "");

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: formData.email,
    password: temporyPassword,
    options: {
      data: {
        name: formData.username,
      },
    },
  });

  sendLoginCredentials(formData.email, temporyPassword);

  if (!signUpData.user?.id || signUpError) {
    console.error("User's login is not created!");
    return { data: null, error: "User's login is not created!" };
  }

  const { data, error } = await supabase
    .from("users")
    .insert({ ...formData, authenticationId: signUpData.user?.id })
    .select();
  return { data, error };
}
