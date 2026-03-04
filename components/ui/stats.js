"use client";

import classes from "./stats.module.css";
import { motion } from "framer-motion";
import AnimatedCounter from "./animated-counter";
import { statsData } from "@/lib/contents/statsData";

function Stats() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 10 },
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
      viewport={{ once: true, amount: 0.2 }}
    >
      {statsData.map((stat) => (
        <motion.div key={stat.id} className={classes.statItem} variants={childVariants}>
          <div className={`${classes.statNumber} ${classes[stat.color]}`}>
            <AnimatedCounter value={stat.number} suffix={stat.suffix} />
          </div>
          <div className={classes.statLabel}>{stat.label}</div>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default Stats;
