"use client";
import { motion } from "framer-motion";
import SeeMoreButton from "../ui/see-more-button";
import TestimonialCard from "./testimonial-card";
import classes from "./testimonial-grid.module.css";
import { containerVarients, childVarients } from "@/lib/animations";

export default function TestimonialGrid({ testimonials }) {

  return (
    <motion.div
      className={classes.testimonialGridContainer}
      variants={containerVarients}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <motion.div className={classes.grid}>
        {testimonials.map((item, index) => (
          <TestimonialCard
            key={index}
            content={item}
            variants={childVarients}
          />
        ))}
      </motion.div>

      <SeeMoreButton>Read More Success Stories</SeeMoreButton>
    </motion.div>
  );
}
