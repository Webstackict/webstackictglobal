import { supabase } from "./supabaseClient";

export async function GetDepartments() {
  try {
    const { data, error } = await supabase
      .from("departments_with_enrolling")
      .select("*");

    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error("Supabase error:", err);
    return { data: null, error: err };
  }
}
