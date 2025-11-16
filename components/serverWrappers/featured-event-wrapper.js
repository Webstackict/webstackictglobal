import { supabase } from "@/lib/db/supabaseClient";
import React from "react";
import FeaturedEvent from "../gallery/featured-event-card";

export default async function FeaturedEventWrapper() {
  const { data: [featuredEvent], error } = await supabase
    .from("highest_attended_event")
    .select("*")
    .limit(1);
//   console.log(featuredEvent);

  if (error) return <p className="data-fetching-error">Something went wrong</p>;
  //   return <div>FeaturedEventWrapper</div>;
  return <FeaturedEvent featuredEvent={featuredEvent} />;
}
