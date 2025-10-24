"use client";
import { motion } from "framer-motion";
import classes from "./stats-big.module.css";
import { statsData } from "@/lib/contents/statsData";
import { containerVarients, childVarients } from "@/lib/animations";

export default function StatsBig() {
  return (
    <motion.div
      className={classes.statsSection}
      variants={containerVarients}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {statsData.map((stat) => (
        <motion.div
          key={stat.id}
          className={classes.stat}
          variants={childVarients}
        >
          <div className={`${classes.number} ${classes[stat.color]}`}>
            {stat.number}
          </div>
          <div className={classes.label}>{stat.label}</div>
        </motion.div>
      ))}
    </motion.div>
  );
}
