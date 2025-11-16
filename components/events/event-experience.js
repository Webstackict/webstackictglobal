"use client";
import { motion } from "framer-motion";
import { iconsConfig } from "@/lib/icons/iconsConfig";
import classes from "./event-experience.module.css";
import {
  checkChildVarients,
  childVarients,
  containerVarients,
} from "@/lib/animations";
const CheckIcon = motion.create(iconsConfig["check"]);

export default function EventExperience({ experiences,  quickInfo }) {
  return (
    <div className={classes.container}>
      {/* Experience Section */}
      <motion.div
        className={classes.experienceSection}
        variants={containerVarients}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <h3 className={classes.title}>What You'll Experience</h3>
        <div className={classes.experienceList}>
          {experiences.map((item, index) => (
            <div key={index} className={classes.experienceItem}>
              <motion.div
                className={`${classes.iconWrapper} bluePurple-bg`}
                variants={checkChildVarients}
              >
                <CheckIcon />
              </motion.div>
              <p className={classes.text}>{item}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Quick Info Card */}
      <motion.div
        className={classes.infoCard}
        variants={containerVarients}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <h3 className={classes.infoTitle}>Quick Info</h3>
        <div className={classes.infoGrid}>
          {quickInfo.map((item, index) => {
            const Icon = iconsConfig[item.icon];
            return (
              <motion.div
                key={index}
                className={classes.infoItem}
                variants={childVarients}
              >
                <div className={`${classes.infoIcon} bluePurple-bg`}>
                  <Icon />
                </div>
                <p className={classes.infoLabel}>{item.label}</p>
                <p className={classes.infoValue}>{item.value}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
