import { supabase } from "./supabaseClient";

export default async function getPastEvents(userId) {
  const todaysDate = new Date().toISOString().split("T")[0];
  try {
    const { data, error } = await supabase
      .from("get_user_attended_events")
      .select("*")
      .eq("user_id", userId);
      // .lte("event_date", todaysDate);

      console.log(data);
      

    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error("Supabase error:", err);
    return { data: null, error: err };
  }
}
