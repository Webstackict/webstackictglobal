import { formatDate } from "@/util/util";
import Badge from "../ui/badge";
import classes from "./small-event-card.module.css";
import LinkWithProgress from "../ui/Link-with-progress";
import Image from "next/image";

export default function SmallEventCard({ event }) {
  const eventDate = formatDate(event.event_date);

  // console.log(event);

  return (
    <div className={classes.smallCard}>
      <div className={classes.smallHeader}>
        <Badge
          title={event.category_name}
          eventBagdeStyle={`${event.category_theme.background} ${classes.smallBadge} `}
        />
        <Badge title={eventDate} eventBagdeStyle={classes.date} />
      
      </div>
      <div className={classes.imageWrapper}>
        <Image
          src={event.image_url}
          alt="event-thumbnail"
          fill
          sizes="(min-width: 1024px) 50vh, 100vh"
        />
      </div>
      <h3 className={classes.smallTitle}>{event.name}</h3>
      <p className={classes.smallDesc}>{event.description}</p>

      <LinkWithProgress
        href={`/programs/events/${event.id}`}
        className={classes.smallButton}
      >
        Learn More
      </LinkWithProgress>
    </div>
  );
}
