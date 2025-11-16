import React from "react";
import EventsGrid from "../events/events-grid";
import getUpcomingEvents from "@/lib/db/get-upcoming-events";

export default async function UpcomingEventsWrapper() {
  const { data: events, error } = await getUpcomingEvents();
  if (error) return <p className="data-fetching-error">Something went wrong</p>;

  const bigUpcomingEventCards = events.slice(0, 2)
  const smallUpcomingEventCards = events.slice(2)
  
  return (
    <EventsGrid
      upcomingEvents={bigUpcomingEventCards}
      smallEvents={smallUpcomingEventCards}
    />
  );
}
