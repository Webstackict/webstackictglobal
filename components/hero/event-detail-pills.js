"use client";
import { motion } from "framer-motion";

import classes from "./event-detail-pills.module.css";
import { iconsConfig } from "@/lib/icons/iconsConfig";

export default function EventDetailPill({ text, icon, ...props }) {
  const Icon = iconsConfig[icon];
  return (
    <motion.div
      className={`${classes.eventDetailPill} glassmorphism`}
      {...props}
    >
      <Icon />
      <span>{text}</span>
    </motion.div>
  );
}
