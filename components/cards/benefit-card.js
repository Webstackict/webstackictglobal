"use client";
import { motion } from "framer-motion";
import classes from "./benefit-card.module.css";

import { iconsConfig } from "@/lib/icons/iconsConfig";

export default function BenefitCard({ content, ...props }) {
  const Icon = iconsConfig[content.icon] || iconsConfig["code"];
  let borders = content.theme.color && content.theme.color;
  return (
    <motion.div className={`${classes.benefitCard} ${borders}`} {...props}>
      <div className={`${classes.iconBox} ${content.theme.background}`}>
        {content.icon ? <Icon /> : content.number}
      </div>
      <h4>{content.title}</h4>
      <p>{content.text}</p>

      {content.detail && (
        <p className={classes.contactDetail}>{content.detail}</p>
      )}
    </motion.div>
  );
}
