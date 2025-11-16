import { supabase } from "@/lib/db/supabaseClient";
import SuccessStatsGrid from "../cards/success-stats-grid";

export default async function EventCategoriesWrapper() {
  const { data: eventCategories, error } = await supabase
    .from("event_categories")
    .select("*");
  if (error) return <p className="data-fetching-error">Something went wrong</p>;
  return <SuccessStatsGrid data={eventCategories} label="event-categories" />;
}
