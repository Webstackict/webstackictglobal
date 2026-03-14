import React from "react";
import ActivitiesGrid from "../about/activities-grid";
import { supabase } from "@/lib/db/supabaseClient";
import { pastEventsGallery as fallbackEvents } from "@/lib/contents/eventsData";

export default async function PastEventsWrapper() {
  const todaysDate = new Date().toISOString().split("T")[0];

  try {
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

    if (error || !events || events.length === 0) {
      console.warn("PastEventsWrapper: Falling back to static data.", error);
      const mappedFallback = fallbackEvents.map((item, index) => ({
        id: `static-${index}`,
        name: item.title,
        description: item.alt,
        event_date: item.date,
        event_thumbnails: {
          image_url: item.image,
          image_public_id: `static-img-${index}`
        }
      }));
      return <ActivitiesGrid activities={mappedFallback} href="event-gallery" />;
    }

    return <ActivitiesGrid activities={events} href="event-gallery" />;
  } catch (err) {
    console.error("PastEventsWrapper: Critical failure, using fallback.", err);
    const mappedFallback = fallbackEvents.map((item, index) => ({
      id: `static-${index}`,
      name: item.title,
      description: item.alt,
      event_date: item.date,
      event_thumbnails: {
        image_url: item.image,
        image_public_id: `static-img-${index}`
      }
    }));
    return <ActivitiesGrid activities={mappedFallback} href="event-gallery" />;
  }
}
