"use client";
import { motion } from "framer-motion";
import SeeMoreButton from "../ui/see-more-button";
import TestimonialCard from "./testimonial-card";
import classes from "./testimonial-grid.module.css";
import { useState } from "react";

const visibleItemsAtTtime = 3;

export default function TestimonialGrid({ testimonials }) {
  const [numberOfVisibleItems, setNumberOfVisibleItems] = useState(3);

  const visibleTestimonials = testimonials.slice(0, numberOfVisibleItems);

  return (
    <motion.div
      className={classes.testimonialGridContainer}

      transition={{ duration: 1 }}
    >
      <motion.div className={classes.grid}>
        {visibleTestimonials.map((item, index) => (
          <TestimonialCard
            key={index}
            content={item}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          />
        ))}
      </motion.div>
      {testimonials.length > visibleItemsAtTtime &&
      numberOfVisibleItems < testimonials.length ? (
        <SeeMoreButton
          onClick={() => {
            setNumberOfVisibleItems((prev) => prev + visibleItemsAtTtime);
          }}
        >
          Read More Success Stories
        </SeeMoreButton>
      ) : null}
    </motion.div>
  );
}
