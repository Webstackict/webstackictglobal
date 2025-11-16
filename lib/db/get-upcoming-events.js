import { supabase } from "./supabaseClient";

export default async function getUpcomingEvents() {
  const todaysDate = new Date().toISOString().split("T")[0];
  try {
    const { data, error } = await supabase
      .from("upcoming_events")
      .select("*")
      .gte("event_date", todaysDate);

    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error("Supabase error:", err);
    return { data: null, error: err };
  }
}
