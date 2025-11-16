"use client";
import Button from "../dashboard/button";
import BigEventCard from "./big-event-card";
import classes from "./events-grid.module.css";
import SmallEventCard from "./small-event-card";

export default function EventsGrid({
  label = null,
  upcomingEvents = [],
  smallEvents = [],
}) {
  if (upcomingEvents.length === 0 && !label)
    return (
      <p className="no-data">No Events available! Events will appear here.</p>
    );
  if (smallEvents.length === 0 && label === "events-attended")
    return (
      <div className="no-data-container">
        <p className="no-data">
          You have not participated in any Webstack events.
        </p>
        ;
      </div>
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
