"use client";
import { motion } from "framer-motion";
import classes from "./testimonial-card.module.css";
import Image from "next/image";

export default function TestimonialCard({ content, ...props }) {
  return (
    <motion.div className={`${classes.testimonialCard} `} {...props}>
      <div className={classes.header}>
        <div className={classes.imageContainer}>
          <Image src={content.image} alt={content.name} fill sizes="70px"/>
        </div>
        <div className={classes.info}>
          <h3>{content.name}</h3>
          <p className={`${content.theme}`}>{content.role}</p>
          {/* <div className={classes.stars}>
            {[...Array(5)].map((_, i) => (
              <i key={i} className="fa-solid fa-star"></i>
            ))}
          </div> */}
        </div>
      </div>

      <p className={classes.text}>&quot;{content.text}&quot;</p>

      <div className={classes.footer}>
        <span>{content.location}</span>
        <span>{content.cohort}</span>
      </div>
    </motion.div>
  );
}
