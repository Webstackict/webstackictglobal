"use client";
import { motion } from "framer-motion";
import classes from "./tagline.module.css";

import { iconsConfig } from "@/lib/icons/iconsConfig";

function Tagline({ text, icon }) {
  const Icon = iconsConfig[icon];
  return (
    <motion.div
      className={`${classes.tagline} glassmorphism`}
      initial={{
        y: 20,
        opacity: 0,
      }}
      animate={{
        y: 0,
        opacity: 1,
        transition: { duration: 0.4, ease: "easeOut" },
      }}
    >
      <Icon />
      <span>{text}</span>
    </motion.div>
  );
}

export default Tagline;
