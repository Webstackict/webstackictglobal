import { iconsConfig } from "@/lib/icons/iconsConfig";
import classes from "./cohort-timeline-item.module.css";

export default function CohortTimelineItem({ title, date, info, icon, theme }) {
  const isDeadline = title.toLowerCase().includes("deadline");
 
  const TimelineIcon = iconsConfig[icon];
  return (
    <div className={classes.cohortItem}>
      <div className={`${theme} ${classes.iconBox}`}>
        <TimelineIcon />
      </div>
      <div className={classes.details}>
        <h4 className={classes.cohortTitle}>{title}</h4>
        <p className={isDeadline ? `${classes.date} red` : classes.date}>
          {date}
        </p>
        <p className={classes.info}>{info}</p>
      </div>
    </div>
  );
}
