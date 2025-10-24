"use client";
import { motion } from "framer-motion";
import PartnershipLogoCard from "./partnership-logo-card";
import classes from "./partnerships-grid.module.css";
import { containerVarients, childVarients } from "@/lib/animations";

export default function PartnershipsGrid({ label = null, items }) {
    
  return (
    <div className={classes.partnershipsGridWrapper}>
      <motion.div
        className={classes.logoGrid}
        variants={containerVarients}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {items.map((logo, index) => (
          <PartnershipLogoCard key={index} logo={logo} label={label} variants={childVarients}/>
        ))}
      </motion.div>
    </div>
  );
}
