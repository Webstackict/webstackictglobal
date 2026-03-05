
import { currencyFormatter } from "@/util/util";
import Badge from "../ui/badge";
import LinkWithProgress from "../ui/Link-with-progress";
import classes from "./cohorts-card.module.css";
import IconRenderer from "../ui/icon-renderer";

export default function Cohortscard({
  id,
  label, // This is the 'home' or 'departments' label
  cohortLabel, // This is the "March Cohort" label
  slug,
  departmentName,
  departmentDescription,
  nextCohort,
  duration,
  fee,
  spotsLeft,
  maxSize,
  status,
  departmentIcon,
  departmentTheme,
}) {
  const isStatus = spotsLeft === 0;
  const isDeparmentsPage = label === "departments";

  const computedLabel = nextCohort
    ? new Date(nextCohort).toLocaleString("default", { month: "long" }) + " Cohort"
    : "Upcoming Cohort";

  // Use the computed label (e.g., "March Cohort") as title fallback, or department name
  const displayTitle = cohortLabel || computedLabel || departmentName;

  return (
    <div className={classes.card}>
      <div className={classes.cardHeader}>
        <div className={`${classes.iconBox} ${departmentTheme || "blue"}`}>
          <IconRenderer iconName={departmentIcon || "rocket"} />
        </div>
        <Badge title={status} />
      </div>
      <h3 className={classes.cardTitle}>{displayTitle}</h3>

      <div className={classes.details}>
        <div className={classes.detailItem}>
          <span className={classes.detailLabel}>Start Date:</span>
          <span className={classes.detailValue}>{nextCohort}</span>
        </div>
        <div className={classes.detailItem}>
          <span className={classes.detailLabel}>Duration:</span>
          <span className={classes.detailValue}>3 Months</span>
        </div>
        <div className={classes.detailItem}>
          <span className={classes.detailLabel}>Program Fee:</span>
          <span className={`${classes.detailValue} ${classes.fee}`}>
            ₦250,000
          </span>
        </div>
      </div>

      <div className={classes.seatsGrid}>
        <div className={classes.seatItem}>
          <span className={classes.seatCount}>30</span>
          <span className={classes.seatType}>Onsite Seats</span>
        </div>
        <div className={classes.seatItem}>
          <span className={classes.seatCount}>100</span>
          <span className={classes.seatType}>Online Seats</span>
        </div>
      </div>

      <LinkWithProgress
        href={`/enroll?cohortId=${id}&label=${encodeURIComponent(computedLabel)}`}
        className={`${!isStatus ? classes.btn : classes.disabledBtn} ${departmentTheme || "blue"}`}
      >
        {!isStatus ? "Enroll Now" : "Cohort Full"}
      </LinkWithProgress>
    </div>
  );
}
