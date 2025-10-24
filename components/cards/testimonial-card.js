"use client";
import { motion } from "framer-motion";
import classes from "./testimonial-card.module.css";

export default function TestimonialCard({ content, ...props}) {
  return (
    <motion.div className={`${classes.testimonialCard} `} {...props}>
      <div className={classes.header}>
        <img src={content.image} alt={content.name} />
        <div className={classes.info}>
          <h3>{content.name}</h3>
          <p className={`${content.theme}`}>{content.role}</p>
          <div className={classes.stars}>
            {[...Array(5)].map((_, i) => (
              <i key={i} className="fa-solid fa-star"></i>
            ))}
          </div>
        </div>
      </div>

      <p className={classes.text}>{content.text}</p>

      <div className={classes.footer}>
        <span>{content.location}</span>
        <span>{content.cohort}</span>
      </div>
    </motion.div>
  );
}
