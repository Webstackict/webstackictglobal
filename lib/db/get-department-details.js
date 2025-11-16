import { supabase } from "./supabaseClient";

export async function getDepartmentDetails(deptSlug) {
  try {
    const { data, error } = await supabase
      .from("department_details")
      .select("*")
      .eq("slug", deptSlug)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error("Supabase error:", err);
    return { data: null, error: err };
  }
}
