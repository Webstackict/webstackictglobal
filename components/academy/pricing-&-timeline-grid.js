"use client";
import { motion } from "framer-motion";
import { containerVarients, childVarients } from "@/lib/animations";
import { useEffect } from "react";
import AcademyPricingCard from "./academy-pricing-card";
import CohortTimelineCard from "./cohort-timeline-card";
import classes from "./pricing-&-timeline-grid.module.css";
import { pricingData, cohortDetails } from "@/lib/contents/academy-pricingData";
import SmallButton from "../ui/small-button";
import LinkWithProgress from "../ui/Link-with-progress";

export default function PricingAndTimelineGrid({ department }) {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        element.classList.add("highlight-section");
        setTimeout(() => element.classList.remove("highlight-section"), 5000);
      }
    }
  });
  return (
    <motion.div
      className={classes.container}
      variants={containerVarients}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {/* Pricing Card */}
      <AcademyPricingCard
        pricingData={pricingData}
        department={department}
        variants={childVarients}
      />

      {/* Cohort Timeline */}
      <CohortTimelineCard
        cohortDetails={cohortDetails}
        department={department}
        variants={childVarients}
      />

      <div className={classes.buttonWrapper}>
        <LinkWithProgress href="/contact#contact-form">Enroll Now</LinkWithProgress>
      </div>
    </motion.div>
  );
}
