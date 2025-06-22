"use server";
import { createClient } from "@/utils/supabase/server";

export async function getSectionCardInformation() {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];
  console.log("Today's date:", today);

  // Active users: endDate is in the future (memberships that haven't expired)
  const { count: activeUsers, error: activeErr } = await supabase
    .from("memberPackageRelations")
    .select("memberId", { count: "exact", head: true })
    .gt("endDate", today); // endDate is greater than today (active)

  // Expired users: endDate is before today (memberships that have expired)
  const { count: expiredUser, error: expiredErr } = await supabase
    .from("memberPackageRelations")
    .select("memberId", { count: "exact", head: true })
    .lt("endDate", today); // endDate is less than today (expired)

  // Expiring soon: endDate is within the next 5 days (memberships about to expire)
  // First create a date object for 5 days from now
  const soonDate = new Date();
  soonDate.setDate(soonDate.getDate() + 3);
  const soonDateString = soonDate.toISOString().split("T")[0];

  const { count: expireSoon, error: expireSoonErr } = await supabase
    .from("memberPackageRelations")
    .select("memberId", { count: "exact", head: true })
    .gt("endDate", today) // endDate is after today
    .lt("endDate", soonDateString); // but before 5 days from now

  if (activeErr || expiredErr || expireSoonErr) {
    console.error("Detailed errors:", {
      activeErr: activeErr?.message,
      expiredErr: expiredErr?.message,
      expireSoonErr: expireSoonErr?.message,
      today,
      soonDateString,
    });
    return null;
  }

  console.log("Results:", { activeUsers, expireSoon, expiredUser });
  return {
    activeUsers: activeUsers || 0,
    expireSoon: expireSoon || 0,
    expiredUser: expiredUser || 0,
  };
}
