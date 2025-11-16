"use server";

import { supabase } from "../supabaseClient";

export async function getUserEnrolledCohorts(userId, status) {
  try {
    const { data, error } = await supabase
      .from("user_enrolled_cohorts")
      .select("*")
      .eq("user_id", userId)
      .in("status", [status, "enrolling"])
      .order("enrollment_date", { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error("Supabase error", err);
    return { data: null, error: err };
  }
}
export async function getUserCompletedCohorts(userId, status) {
  try {
    const { data, error } = await supabase
      .from("user_enrolled_cohorts")
      .select("*")
      .eq("user_id", userId)
      .eq("status", status)
      .order("enrollment_date", { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error("Supabase error", err);
    return { data: null, error: err };
  }
}
