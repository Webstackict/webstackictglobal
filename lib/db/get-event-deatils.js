import { supabaseAdmin as supabase } from "./supabaseAdmin";

export async function getEventDetails(eventId) {
  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", eventId)
      .maybeSingle();

    if (error) {
      console.error("Supabase query error in getEventDetails:", {
        message: error.message,
        code: error.code,
        details: error.details,
      });
      return { data: null, error };
    }

    if (!data) {
      console.warn(`Event with ID "${eventId}" not found.`);
    }

    return { data, error: null };
  } catch (err) {
    console.error("Supabase catch error in getEventDetails:", err);
    return { data: null, error: err };
  }
}
