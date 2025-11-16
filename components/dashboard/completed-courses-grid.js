"use client";
import { toast } from "sonner";
import classes from "./completed-couses-grid.module.css";
import React from "react";
import { iconsConfig } from "@/lib/icons/iconsConfig";
import Badge from "../ui/badge";
import { formatDate } from "@/util/util";
import Button from "./button";

const DownloadIcon = iconsConfig["download"];
const CertificateIcon = iconsConfig["certificate"];
const CalendarIcon = iconsConfig["calendar"];

export default function CompletedCoursesGrid({ enrollments = [] }) {
  if (enrollments.length < 1) {
    return (
      <div className="no-data-container">
        <p className="no-data">You have not completed any courses</p>;
       
      </div>
    );
  }

  return (
    <div className={classes.completedCourses}>
      {enrollments.map((enrollment, idx) => {
        const Icon = iconsConfig[enrollment.icon];
        return (
          <div
            key={enrollment.id}
            className={classes.courseCard}
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            <div className={classes.courseHeader}>
              <div className={classes.courseIcon}>
                <Icon />
              </div>
              <div className={classes.courseInfo}>
                <div className={classes.courseTitleWrapper}>
                  <h4>{enrollment.department_name}</h4>
                  <Badge title="completed" eventBagdeStyle="green-badge" />
                </div>
                <p className={classes.courseDesc}>
                  Completed on {formatDate(enrollment.graduation_date)}
                </p>

                <div className={classes.courseMeta}>
                  <div className={classes.metaItem}>
                    <CalendarIcon />
                    <span>{enrollment.duration} months duration</span>
                  </div>
                </div>

                <div className={classes.courseFooter}>
                  <div className={classes.certificateInfo}>
                    <div className={classes.certificateIcon}>
                      <CertificateIcon />
                    </div>
                    <span>Certificate Available</span>
                  </div>
                  <button
                    className={classes.downloadButton}
                    onClick={() => toast.error("This feature is coming soon!")}
                  >
                    <DownloadIcon /> Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
