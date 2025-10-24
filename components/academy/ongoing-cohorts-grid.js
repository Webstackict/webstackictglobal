import Badge from "../ui/badge";
import classes from "./ongoing-cohorts-grid.module.css";

export default function OngoingCohortsGrid({ ongoingCohorts }) {
  const calculateProgress = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();

    if (today < start)
      return {
        progressPercent: 0,
        totalWeeks: 0,
        currentWeek: 0,
        isFinalWeek: false,
      };
    if (today > end)
      return {
        progressPercent: 100,
        totalWeeks: 0,
        currentWeek: 0,
        isFinalWeek: false,
      };

    const totalDays = (end - start) / (1000 * 60 * 60 * 24);
    const elapsedDays = (today - start) / (1000 * 60 * 60 * 24);

    const totalWeeks = Math.ceil(totalDays / 7);
    const currentWeek = Math.ceil(elapsedDays / 7);

    const isFinalWeek = totalWeeks - currentWeek < 1;

    return {
      progressPercent: Math.round((elapsedDays / totalDays) * 100),
      totalWeeks,
      currentWeek,
      isFinalWeek,
    };
  };

  return (
    <div className={classes.grid}>
      {ongoingCohorts.map((cohort, i) => {
        const { progressPercent, totalWeeks, currentWeek, isFinalWeek } =
          calculateProgress(cohort.startDate, cohort.endDate);

        return (
          <div key={i} className={`${classes.card}`}>
            <div className={classes.header}>
              <h3 className={classes.title}>{cohort.name}</h3>
              <Badge
                title={isFinalWeek ? "final week" : "active"}
                icon={"circle"}
              />
            </div>

            <div className={classes.infoSection}>
              <div className={classes.infoRow}>
                <span className={classes.label}>Started:</span>
                <span>{cohort.started}</span>
              </div>
              <div className={classes.infoRow}>
                <span className={classes.label}>Students</span>
                <span>{cohort.numberOfStudents}</span>
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
