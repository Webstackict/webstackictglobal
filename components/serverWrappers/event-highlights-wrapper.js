import { supabase } from "@/lib/db/supabaseClient";
import React from "react";
import ActivitiesGrid from "../about/activities-grid";

export default async function EventHighlightsWrapper({ eventId }) {
  const { data: highlights, error } = await supabase
    .from("event_highlights_view")
    .select("*")
    .eq("id", eventId);

  // console.log(highlights);

  if (error) return <p className="data-fetching-error">Something went wrong</p>;
  return <ActivitiesGrid activities={highlights} />;
  // return <div>EventHighlightsWrapper</div>;
}
