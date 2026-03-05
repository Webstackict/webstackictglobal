import { supabase } from "@/lib/db/supabaseClient";
import React from "react";
import FeaturedEvent from "../gallery/featured-event-card";

export default async function FeaturedEventWrapper() {
  const { data, error } = await supabase
    .from("highest_attended_event")
    .select("*")
    .limit(1);

  if (error) return <p className="data-fetching-error">Something went wrong</p>;

  const featuredEvent = data?.[0] || null;

  return <FeaturedEvent featuredEvent={featuredEvent} />;
}
