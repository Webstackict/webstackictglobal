import { supabase } from "@/lib/db/supabaseClient";
import Timeline from "../about/timeline";

export default async function EventTimelineWrapper({ eventId }) {
  const { data: schedule, error } = await supabase
    .from("event_schedule")
    .select("*")
    .eq("event_id", eventId);
  
  if (error) return <p className="data-fetching-error">Something went wrong</p>;

  return <Timeline timeline={schedule} />;
}
