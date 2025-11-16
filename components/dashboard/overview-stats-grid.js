"use client";
import { iconsConfig } from "@/lib/icons/iconsConfig";
import classes from "./overview-stats-grid.module.css";
// const {
//   school: School,
//   event: Event,
//   certificate: Certificate,
//   book: Book,
// } = iconsConfig;

export default function OverviewStatsGrid({ userStats = {} }) {
  const overviewStats = [
    {
      id: 1,
      title: "Events",
      value: userStats.attendedEvents,
      subtitle: "Total Events Attended",
      icon: "event",
    },
    {
      id: 2,
      title: "Departments",
      value: userStats.completedDepts,
      subtitle: "Departments Completed",
      icon: "school",
    },
    {
      id: 3,
      title: "Active",
      value: userStats.ongoingEnrollments,
      subtitle: "Ongoing Enrollment",
      icon: "book",
    },
    {
      id: 4,
      title: "Certificates",
      value: userStats.completedDepts,
      subtitle: "Certificates Earned",
      icon: "certificate",
    },
  ];
  return (
    <div
      className={classes.statsGrid}
      style={{
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      }}
    >
      {overviewStats.map((stat, index) => {
        const Icon = iconsConfig[stat.icon];
        return (
          <div
            key={stat.id}
            className={classes.statCard}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className={classes.statHeader}>
              <div className={classes.statIcon}>
                <Icon />
              </div>
              <div className={classes.statContent}>
                <p className={classes.title}>{stat.title}</p>
                <p className={classes.value}>{stat.value}</p>
              </div>
            </div>
            <p className={classes.subTitle}>{stat.subtitle}</p>
          </div>
        );
      })}
    </div>
  );
}
