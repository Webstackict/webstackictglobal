"use client";
import Button from "../dashboard/button";
import BigEventCard from "./big-event-card";
import classes from "./events-grid.module.css";
import SmallEventCard from "./small-event-card";

import EmptyState from "../dashboard/empty-state";

export default function EventsGrid({
  label = null,
  upcomingEvents = [],
  smallEvents = [],
}) {
  if (upcomingEvents.length === 0 && !label)
    return (
      <EmptyState
        icon="calendar"
        title="No Events Available"
        description="Check back later for upcoming tech workshops and networking events."
      />
    );
  if (smallEvents.length === 0 && label === "events-attended")
    return (
      <EmptyState
        icon="calendar"
        title="No Event Activity"
        description="You haven't participated in any Webstack events yet. Join our upcoming community sessions!"
        buttonText="Explore Events"
        buttonIcon="rightArrow"
        href="/programs/events"
      />
    );
  return (
    <>
      {!label && (
        <div className={classes.bigEventsGrid}>
          {upcomingEvents.map((event) => (
            <BigEventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      <div className={classes.smallEventsGrid}>
        {smallEvents.map((event) => (
          <SmallEventCard key={event.id} event={event} />
        ))}
      </div>
    </>
  );
}
