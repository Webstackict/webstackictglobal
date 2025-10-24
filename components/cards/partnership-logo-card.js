"use client";
import { motion } from "framer-motion";
import { svgConfig } from "@/lib/icons/SVG/svgConfig";

import classes from "./partnership-logo-card.module.css";
import Image from "next/image";
export default function PartnershipLogoCard({ logo, label, ...props }) {
  let content = (
    <motion.div className={classes.logoCard} {...props}>
      <div className={classes.imageContainer}>
        <Image src={logo.src} alt={logo.alt} fill sizes="50px" />
      </div>
    </motion.div>
  );
  if (label === "tech-stack") {
    const icon = svgConfig[logo.icon];
    content = (
      <motion.div className={classes.logoCard} {...props}>
        <div className={`${classes.iconContainer} ${logo.theme.background}`}>
          {icon}
        </div>
        <p>{logo.name}</p>
      </motion.div>
    );
  }

  return <>{content}</>;
}
