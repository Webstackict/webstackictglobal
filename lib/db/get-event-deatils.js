import { supabase } from "./supabaseClient";

export async function getEventDetails(eventId) {
  try {
    const { data, error } = await supabase
      .from("event_details")
      .select("*")
      .eq("id", eventId)
      .single();
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error("Supabase error:", err);
    return { data: null, error: err };
  }
}
