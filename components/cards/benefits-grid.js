"use client";
import { motion } from "framer-motion";
import BenefitCard from "./benefit-card";
import classes from "./benefits-grid.module.css";
import { containerVarients, childVarients } from "@/lib/animations";

export default function BenefitsGrid({ items, className }) {
  const gridTemplate = `${className} ${classes.benefitsGrid}`;
 
  return (
    <motion.div
      className={gridTemplate}
      variants={containerVarients}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {items.map((item, index) => (
        <BenefitCard key={index} content={item} variants={childVarients} />
      ))}
    </motion.div>
  );
}
