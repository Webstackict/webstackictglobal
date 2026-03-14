import { supabase } from "@/lib/db/supabaseClient";
import React from "react";
import FeaturedEvent from "../gallery/featured-event-card";
import { featuredEvent as fallbackEvent } from "@/lib/contents/galleryData";

export default async function FeaturedEventWrapper() {
  try {
    const { data, error } = await supabase
      .from("highest_attended_event")
      .select("*")
      .limit(1);

    if (error || !data || data.length === 0) {
      console.warn("FeaturedEventWrapper: Falling back to static data due to DB error or empty result.", error);
      return <FeaturedEvent featuredEvent={fallbackEvent} />;
    }

    return <FeaturedEvent featuredEvent={data[0]} />;
  } catch (err) {
    console.error("FeaturedEventWrapper: Critical failure, using fallback.", err);
    return <FeaturedEvent featuredEvent={fallbackEvent} />;
  }
}
