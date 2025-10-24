"use client";
import { motion } from "framer-motion";

import classes from "./value-quote.module.css";

export default function ValueQuote({ title, text }) {
  return (
    <motion.div
      className={classes.ValueQuoteContainer}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" },
      }}
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className={classes.glassBox}>
        <h3 className={classes.heading}>{title}</h3>
        <p className={classes.paragraph}>{text}</p>
      </div>
    </motion.div>
  );
}
