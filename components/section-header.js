"use client";
import { motion } from "framer-motion";
import classes from "./section-header.module.css";

export default function SectionHeader({ title, subtitle }) {
  return (
    <motion.div
      className={classes.header}
      initial={{
        y: 20,
        opacity: 0,
      }}
      whileInView={{
        y: 0,
        opacity: 1,
        transition: { duration: 1, ease: "easeOut" },
      }}
      viewport={{ once: true, amount: 1 }}
    >
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </motion.div>
  );
}
