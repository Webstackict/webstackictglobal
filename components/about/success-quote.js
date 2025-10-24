"use client";
import { motion } from "framer-motion";
import { containerVarients, childVarients } from "@/lib/animations";

import classes from "./success-quote.module.css";

import { successStories } from "@/lib/contents/testimonialData";

export default function SuccessQuote() {
  const stories = successStories.map((story, index) => {
    if (index <= 2) {
      return story;
    }
  });

  return (
    <motion.div
      className={classes.wrapper}
      variants={containerVarients}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <h3 className={classes.heading}>Success Stories That Inspire</h3>
      <div className={classes.grid}>
        {stories.map((story, index) => (
          <motion.div
            key={index}
            className={classes.story}
            style={{ borderLeftColor: story.theme }}
            variants={childVarients}
          >
            <p className={classes.quote}>"{story.text}"</p>
            <div className={classes.author} style={{ color: story.theme }}>
              - {story.name}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
