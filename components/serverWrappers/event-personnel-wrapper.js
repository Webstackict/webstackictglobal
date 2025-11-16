import { supabase } from "@/lib/db/supabaseClient";
import TeamGrid from "../cards/team-grid";

export default async function EventPersonnelWrapper({ eventId, label = null }) {
  let personnelRole = "host";
  if (label === "event-speakers") {
    personnelRole = "speaker";
  }
  const { data: personnel, error } = await supabase
    .from("event_personnel")
    .select("*")
    .eq("role", personnelRole)
    .eq("event_id", eventId);

  if (error) return <p className="data-fetching-error">Something went wrong</p>;

  return <TeamGrid team={personnel} label="event-personnel" />;
}
