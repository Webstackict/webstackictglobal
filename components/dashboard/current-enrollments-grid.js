"use client";
import { iconsConfig } from "@/lib/icons/iconsConfig";
import Badge from "../ui/badge";
import classes from "./current-enrollments-grid.module.css";
import { calculateProgress, formatDate } from "@/util/util";
import Button from "./button";

export default function CurrentEnrollmentsGrid({ enrollments = [] }) {
  // console.log(enrollments);

  if (enrollments.length < 1) {
    return (
      <div className="no-data-container">
        <p className="no-data">You have no ongoing enrollments</p>;
        <Button
          text="Enroll in a Department"
          icon="add"
          href="/programs/academy"
        />
      </div>
    );
  }
  return (
    <div className={classes.departmentsGrid}>
      {enrollments.map((enrollment) => {
        const Icon = iconsConfig[enrollment.icon];
        const cohortYear = new Date(enrollment.start_date).getFullYear();
        const { progressPercent, totalWeeks, currentWeek, isFinalWeek } =
          calculateProgress(enrollment.start_date, enrollment.graduation_date);
        const badgeText =
          enrollment.status === "enrolling" ? "Enrolling" : "Active";
        return (
          <div key={enrollment.id} className={classes.departmentCard}>
            <div className={classes.departmentHeader}>
              <div className={classes.departmentInfo}>
                <div className={classes.departmentIcon}>
                  <Icon />
                </div>
                <div className={classes.contents}>
                  <div className={classes.departmentTitle}>
                    <h4>{enrollment.department_name}</h4>
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
                      <p>Start Date</p>
                      <p>
                        C - {enrollment.cohort_number} - {cohortYear}
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

                  {/* <div className={classes.departmentFooter}>
                    <div className={classes.mentorInfo}>
                      <img
                        src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg"
                        alt="Mentor"
                        className={classes.mentorAvatar}
                      />
                      <div>
                        <p style={{ color: "#fff", fontWeight: 600 }}>
                          Dr. Emmanuel Chibueze
                        </p>
                        <p style={{ color: "#aaa", fontSize: "0.75rem" }}>
                          Lead Instructor
                        </p>
                      </div>
                    </div>
                    <button className={classes.viewDetailsButton}>
                      View Details <ArrowRight />
                    </button>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
