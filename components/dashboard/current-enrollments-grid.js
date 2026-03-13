"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { iconsConfig } from "@/lib/icons/iconsConfig";
import Badge from "../ui/badge";
import classes from "./current-enrollments-grid.module.css";
import { calculateProgress, formatDate } from "@/util/util";
import Button from "./button";
import EmptyState from "./empty-state";

export default function CurrentEnrollmentsGrid({ enrollments = [] }) {
  if (enrollments.length < 1) {
    return (
      <EmptyState
        icon="laptop-code"
        title="No Active Programs"
        description="You haven't enrolled in any learning paths yet. Explore our programs to start your tech journey."
        buttonText="Enroll in a Program"
        buttonIcon="add"
        href="/programs/academy"
      />
    );
  }
  return (
    <div className={classes.departmentsGrid}>
      {enrollments.map((enrollment) => {
        const Icon = iconsConfig[enrollment.icon] || iconsConfig['laptop-code'];
        const cohortYear = new Date(enrollment.start_date).getFullYear();
        const { progressPercent, totalWeeks, currentWeek, isFinalWeek } =
          calculateProgress(enrollment.start_date, enrollment.graduation_date);
        const badgeText =
          enrollment.status === "enrolling" ? "Enrolling" : "Active";
        return (
          <div key={enrollment.id} className={`${classes.departmentCard} premium-card`}>
            <div className={classes.departmentHeader}>
              <div className={classes.departmentInfo}>
                <div className={classes.departmentIcon}>
                  <Icon />
                </div>
                <div className={classes.contents}>
                  <div className={classes.departmentTitle}>
                    <h4>{enrollment.program_name}</h4>
                    <Badge
                      title={badgeText}
                      eventBagdeStyle="blue-badge"
                      style={
                        badgeText === "Enrolling"
                          ? { background: "orange", color: "white" }
                          : null
                      }
                    />
                  </div>
                  <p className={classes.departmentDesc}>
                    {enrollment.description}
                  </p>

                  <div className={classes.departmentStats}>
                    <div className={classes.statCard}>
                      <p>Progress</p>
                      <p>{progressPercent}%</p>
                    </div>
                    <div className={classes.statCard}>
                      <p>Cohort</p>
                      <p>
                        {enrollment.cohort_code}
                      </p>
                    </div>
                    <div className={classes.statCard}>
                      <p>Start Date</p>
                      <p>{formatDate(enrollment.start_date)}</p>
                    </div>
                    <div className={classes.statCard}>
                      <p>End Date</p>
                      <p>{formatDate(enrollment.graduation_date)}</p>
                    </div>
                  </div>

                  <div className={classes.progressContainer}>
                    <div className={classes.progressHeader}>
                      <span>Course Progress</span>
                    </div>
                    <div className={classes.progressBar}>
                      <div
                        className={classes.progressBarInner}
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className={classes.departmentFooter}>
                    <Link
                      href={`/dashboard/courses/${enrollment.id}`}
                      className={classes.viewDetailsButton}
                    >
                      Access Resources <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
