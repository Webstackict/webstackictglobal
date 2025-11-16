"use client";
import { motion } from "framer-motion";
import { containerVarients, childVarients } from "@/lib/animations";

import { iconsConfig } from "@/lib/icons/iconsConfig";
import classes from "./success-stats-grid.module.css";

export default function SuccessStatsGrid({ data, label = null }) {
  return (
    <motion.div
      className={classes.statsGrid}
      variants={containerVarients}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {data.map((stat) => {
        const Icon = iconsConfig[stat.icon];
        return (
          <motion.div
            key={stat.id}
            className={classes.card}
            variants={childVarients}
          >
            <div className={`${classes.cardIcon} ${stat.theme.background}`}>
              <Icon />
            </div>
            {label !== "event-categories" && (
              <div className={`${classes.cardNumber} ${stat.theme.color}`}>
                {stat.number}
              </div>
            )}
            <h3 className={classes.cardTitle}>{stat.title || stat.name}</h3>
            {label !== "event-categories" && (
              <>
                <p className={classes.cardText}>{stat.description}</p>
              </>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
