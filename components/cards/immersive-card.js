"use client";
import { motion } from "framer-motion";
import classes from "./immersive-card.module.css";

export default function ImmersiveCard({ content, ...props }) {
  return (
    <motion.div key={content.num} className={classes.immersiveCard} {...props}>
      <div className={classes.cardContent}>
        <div className={`${classes.iconBox} ${content.theme.background}`}>
          <span className={classes.iconNumber}>{content.number}</span>
        </div>
        <div>
          <h3 className={classes.cardTitle}>{content.title}</h3>
          <p className={classes.cardText}>{content.text}</p>
        </div>
      </div>
    </motion.div>
  );
}
