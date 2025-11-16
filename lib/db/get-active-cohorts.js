import { supabase } from "./supabaseClient";

export async function getActiveCohorts() {
  try {
    const { data, error } = await supabase
      .from("cohorts_with_enrollment")
      .select("*")
      .eq("status", "in_progress");
    if (error) throw error;
    return { data, error };
  } catch (err) {
    console.error("Supabase error:", err);
    return { data: null, error: err };
  }
}
export async function getEnrollingCohorts() {
  try {
    const { data, error } = await supabase
      .from("cohorts_with_enrollment")
      .select("*")
      .eq("status", "enrolling")
      .limit(4);
    if (error) throw error;
    return { data, error };
  } catch (err) {
    console.error("Supabase error:", err);
    return { data: null, error: err };
  }
}
