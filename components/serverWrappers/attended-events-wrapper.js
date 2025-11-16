import React from "react";

import EventsGrid from "../events/events-grid";
import getPastEvents from "@/lib/db/get-past-events";

export default async function AttendedEventsWrapper({ userId }) {
  // const userId = "dc084708-190c-4418-8711-fce5dd2a6848";

  const { data: events, error } = await getPastEvents(userId);
  if (error) return <p className="data-fetching-error">Something went wrong</p>;

  return <EventsGrid label="events-attended" smallEvents={events}  />;
}
