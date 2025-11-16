import React from "react";
import ActivitiesGrid from "../about/activities-grid";
import { supabase } from "@/lib/db/supabaseClient";

export default async function PastEventsWrapper() {
  const todaysDate = new Date().toISOString().split("T")[0];

  const { data: events, error } = await supabase
    .from("events")
    .select(
      `
    id,
    name,
    description,
    event_date,
    event_thumbnails (
      image_url,
      image_public_id
    )
  `
    )
    .lte("event_date", todaysDate)
    .order("event_date", { ascending: false })
    .limit(10);

  if (error) return <p className="data-fetching-error">Something went wrong</p>;
  return <ActivitiesGrid activities={events} href="event-gallery" />;
}
