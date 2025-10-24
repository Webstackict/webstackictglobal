import Badge from "../ui/badge";
import LinkWithProgress from "../ui/Link-with-progress";
import classes from "./cohorts-card.module.css";

import { iconsConfig } from "@/lib/icons/iconsConfig";

export default function Cohortscard({
  label,
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
  const isStatus = status === "open";
  const isDeparmentsPage = label === "departments";

  const DepartmentIcon = iconsConfig[departmentIcon];

  let spotsLeftColor = "green";

  if (isDeparmentsPage && spotsLeft > 10 && spotsLeft < 20) {
    spotsLeftColor = "orange";
  } else if (spotsLeft < 10) {
    spotsLeftColor = "red";
  }

  return (
    <div className={classes.card}>
      <div className={classes.cardHeader}>
        <div className={`${classes.iconBox} ${departmentTheme}`}>
          <DepartmentIcon />
        </div>
        <Badge title={status} />
      </div>
      <h3 className={classes.cardTitle}>{departmentName}</h3>
      <p className={classes.cardText}>{departmentDescription}</p>

      <div className={classes.details}>
        <div>
          <span>{!isDeparmentsPage ? " Start Date:" : "Next Cohort:"}</span>
          <span>{nextCohort}</span>
        </div>
        <div>
          <span>Duration:</span>
          <span>{duration} months</span>
        </div>
        <div>
          <span>Fee:</span>
          <span className={classes.fee}>{fee}</span>
        </div>
        {!isDeparmentsPage && (
          <div>
            <span>Spots Left:</span>
            <span className={spotsLeftColor}>
              {spotsLeft}/{maxSize}
            </span>
          </div>
        )}
      </div>

      {!isDeparmentsPage ? (
        <LinkWithProgress
          href={`/programs/academy/${slug}#pricing-and-timeline`}
          className={`${
            isStatus ? classes.btn : classes.disabledBtn
          }  ${departmentTheme}`}
        >
          {isStatus ? "Enroll Now" : "Cohort Full"}
        </LinkWithProgress>
      ) : (
        <LinkWithProgress
          href={`/programs/academy/${slug}`}
          className={`${classes.btn} ${departmentTheme}`}
        >
          View Details
        </LinkWithProgress>
      )}
    </div>
  );
}
