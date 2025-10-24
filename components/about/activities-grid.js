"use client";
import { motion } from "framer-motion";
import classes from "./activities-grid.module.css";
import { activities } from "@/lib/contents/activitiesData";
import { containerVarients, childVarients } from "@/lib/animations";
export default function ActivitiesGrid() {
  return (
    <motion.div
      className={classes.activitiesGrid}
      variants={containerVarients}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {activities.map((activity, index) => (
        <motion.div
          key={index}
          className={classes.card}
          variants={childVarients}
        >
          <img src={activity.image} alt={activity.alt} />
          <div className={classes.cardContent}>
            <h3>{activity.title}</h3>
            <p>{activity.description}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
