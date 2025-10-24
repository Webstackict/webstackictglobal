"use client";
import { motion } from "framer-motion";
import ImmersiveCard from "./immersive-card";
import classes from "./immersive-card-grid.module.css";
import { stepsData } from "@/lib/contents/learningData";
import ImmersiveHero from "./immersive-hero";

export default function ImmersiveCardGrid() {
  const containerVarients = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
       
      },
    },
  };
  const childVarients = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };
  return (
    <div className={classes.gridContainer}>
      <motion.div
        className={classes.leftColumn}
        variants={containerVarients}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      >
        {stepsData.map((step, index) => (
          <ImmersiveCard key={index} content={step} variants={childVarients} />
        ))}
      </motion.div>

      <div className={classes.rightColumn}>
        <ImmersiveHero />
      </div>
    </div>
  );
}
