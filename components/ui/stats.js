"use client";

import classes from "./stats.module.css";
import { motion } from "framer-motion";

function Stats() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.3,
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };
  return (
    <motion.div
      className={classes.stats}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <motion.div className={classes.statItem} variants={childVariants}>
        <div className={classes.statNumber}>5,000+</div>
        <div className={classes.statLabel}>Students Trained</div>
      </motion.div>
      <motion.div className={classes.statItem} variants={childVariants}>
        <div className={classes.statNumber}>95%</div>
        <div className={classes.statLabel}>Job Placement Rate</div>
      </motion.div>
      <motion.div className={classes.statItem} variants={childVariants}>
        <div className={classes.statNumber}>50+</div>
        <div className={classes.statLabel}>Partner Companies</div>
      </motion.div>
    </motion.div>
  );
}

export default Stats;
