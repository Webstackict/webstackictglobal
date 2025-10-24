"use client";
import { motion } from "framer-motion";
import { iconsConfig } from "@/lib/icons/iconsConfig";
import classes from "./cohort-timeline-card.module.css";
import CohortTimelineItem from "./cohort-timeline-item";

const FireIcon = iconsConfig["fire"];

export default function CohortTimelineCard({
  cohortDetails,
  department,
  ...props
}) {
  return (
    <motion.div className="card" {...props}>
      <h3 className={classes.cohortTimelineTitle}>Next Cohort Details</h3>
      <div className={classes.cohortList}>
        <CohortTimelineItem
          title="Start Date"
          date={department.nextCohort}
          info={`${department.duration} months intensive program`}
          icon="calendar"
          theme="greenTeal-bg"
        />
        <CohortTimelineItem
          title="Enrollment Deadline"
          date={department.enrollmentDeadline}
          info={`Limited to ${department.maxSize} students`}
          icon="clock"
          theme="orangeRed-bg"
        />
        <CohortTimelineItem
          title="Graduation"
          date={department.graduationDate}
          info="Portfolio & job placement"
          icon="school"
          theme="greenTeal-bg"
        />

        <div className={classes.earlyBird}>
          <div className={classes.earlyBirdHeader}>
            <FireIcon />
            <span>Registeration is Ongoing</span>
          </div>
          <p className={classes.earlyBirdText}>
            Enroll before {department.enrollmentDeadline}!
          </p>

          {/* <button></button> */}

          {/* <div className={classes.earlyBirdPrice}>
            <span className={classes.discountPrice}>$2,200</span>
            <span className={classes.oldPrice}>$2,500</span>
          </div> */}
        </div>
      </div>
    </motion.div>
  );
}
