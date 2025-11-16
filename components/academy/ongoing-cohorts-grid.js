import { calculateProgress } from "@/util/util";
import Badge from "../ui/badge";
import classes from "./ongoing-cohorts-grid.module.css";

export default function OngoingCohortsGrid({ ongoingCohorts = [] }) {
  if (ongoingCohorts.length === 0)
    return (
      <p className="no-data">
        No active cohorts! Active cohorts will appear here as soon as
        registration ends.
      </p>
    );

  return (
    <div className={classes.grid}>
      {ongoingCohorts.map((cohort, i) => {
        const { progressPercent, totalWeeks, currentWeek, isFinalWeek } =
          calculateProgress(cohort.start_date, cohort.graduation_date);
        const cohortName = `${cohort.department_name} Cohort ${cohort.cohort_number}`;

        return (
          <div key={i} className={`${classes.card}`}>
            <div className={classes.header}>
              <h3 className={classes.title}>{cohortName}</h3>
              <Badge
                title={isFinalWeek ? "final week" : "active"}
                icon={"circle"}
              />
            </div>

            <div className={classes.infoSection}>
              <div className={classes.infoRow}>
                <span className={classes.label}>Started:</span>
                <span>{cohort.start_date}</span>
              </div>
              <div className={classes.infoRow}>
                <span className={classes.label}>Students</span>
                <span>
                  {cohort.number_enrolled} / {cohort.max_size}
                </span>
              </div>
              <div className={classes.infoRow}>
                <span className={classes.label}>Progress</span>
                <span>
                  Week {currentWeek} of {totalWeeks}
                </span>
              </div>
            </div>

            <div className={classes.progressBarWrapper}>
              <div className={classes.progressBarBg}>
                <div
                  className={`${classes.progressBarFill} ${cohort.theme}`}
                  style={{
                    width: `${progressPercent}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className={classes.footerText}>{cohort.footer}</div>
          </div>
        );
      })}
    </div>
  );
}
