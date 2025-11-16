"use client";
import { motion } from "framer-motion";
import classes from "./gallery-stats.module.css";
import { galleryStats } from "@/lib/contents/galleryData";
import { iconsConfig } from "@/lib/icons/iconsConfig";
import { containerVarients, childVarients } from "@/lib/animations";

export default function GallerStats() {
  return (
    <motion.div
      className={classes.galleryStats}
      variants={containerVarients}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 1 }}
    >
      {galleryStats.map((item, index) => {
        const Icon = iconsConfig[item.icon];
        return (
          <motion.div key={index} variants={childVarients}>
            <div className={classes.stat}>
              <Icon className={classes.icon} />
              <span className={classes.text}>{item.text}</span>
            </div>
            {index < galleryStats.length - 1 && (
              <div className={classes.divider}></div>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
