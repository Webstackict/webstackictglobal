import Badge from "../ui/badge";
import classes from "./big-event-card.module.css";
import IconRenderer from "../ui/icon-rederer";
import { formatDate } from "@/util/util";
import LinkWithProgress from "../ui/Link-with-progress";
import Image from "next/image";

export default function BigEventCard({ event }) {
  const formattedEventDate = formatDate(event.event_date);
  const todaysDate = new Date();
  const eventDate = new Date(event.event_date);

  const isLive =
    eventDate.getFullYear() === todaysDate.getFullYear() &&
    eventDate.getMonth() === todaysDate.getMonth() &&
    eventDate.getDate() === todaysDate.getDate();

  return (
    <div className={`${classes.bigEventCard}`}>
      <div className={classes.imageWrapper}>
        <Image src={event.image_url} alt="event-thumbnail" fill sizes="(min-width: 1024px) 50vh, 100vh"/>
        <Badge
          title={!isLive ? event.category_name : "Live Event"}
          eventBagdeStyle={`${classes.badge} ${event.category_theme.background}`}
          style={isLive ? { background: "var(--red-400)" } : undefined}
        />
        <Badge title={formattedEventDate} eventBagdeStyle={classes.date} />
      </div>
      <div className={classes.eventContent}>
        <div className={classes.eventHeader}>
          <div className={`${classes.icon} ${event.category_theme.background}`}>
            <IconRenderer iconName={event.category_icon} />
          </div>
          <div>
            <h3 className={classes.eventTitle}>{event.name}</h3>
            <p className={classes.eventTime}>
              {event.start_time} - {event.dismisal_time}
            </p>
          </div>
        </div>
        <p className={classes.eventDescription}>{event.description}</p>
        <div className={classes.eventDetails}>
          <div>
            <IconRenderer iconName="location" />
            <span>{event.venue}</span>
          </div>
          <div>
            <IconRenderer iconName="group" />
            {!isLive ? (
              <span>Expecting {event.attendees_capacity}+</span>
            ) : (
              <span>Attendees {event.number_of_attendants}+</span>
            )}
          </div>
        </div>
        <div className={classes.buttons}>
          <LinkWithProgress
            href={`/programs/events/${event.id}#secure-spot`}
            className={`${classes.primaryGradient} ${event.category_theme.background}`}
          >
            Register Now
          </LinkWithProgress>

          <LinkWithProgress
            href={`/programs/events/${event.id}`}
            className={`${classes.outlineAccent} ${event.category_theme.border} `}
          >
            Learn More
          </LinkWithProgress>
        </div>
      </div>
    </div>
  );
}
