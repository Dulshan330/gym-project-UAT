"use server";
import { MemberPaymentType } from "@/types";
import { createClient } from "@/utils/supabase/server";

export default async function addMemberPayment(formData: MemberPaymentType) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("Payment")
    .insert(formData)
    .select();
  return { data, error };
}
