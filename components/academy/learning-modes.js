"use client";
import { motion } from "framer-motion";
import { containerVarients, childVarients } from "@/lib/animations";
import { iconsConfig } from "@/lib/icons/iconsConfig";
import classes from "./learning-modes.module.css";
import { learningModes } from "@/lib/contents/learnin-modesData";

const CheckIcon = iconsConfig["check"];

export default function LearningModesGrid() {
  return (
    <motion.div
      className={classes.grid}
      variants={containerVarients}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {learningModes.map((mode, idx) => {
        const ModeIcon = iconsConfig[mode.icon];
        return (
          <motion.div
            key={idx}
            className={classes.card}
            variants={childVarients}
          >
            <div className={classes.header}>
              <div className={`${mode.theme.background} ${classes.iconBox}`}>
                <ModeIcon className={classes.icon} />
              </div>
              <div>
                <h3 className={classes.title}>{mode.title}</h3>
                <p className={classes.subtitle}>{mode.location}</p>
              </div>
            </div>

            <div className={classes.sectionList}>
              {mode.sections.map((section, i) => (
                <div
                  key={i}
                  className={classes.section}
                  style={{ borderLeftColor: section.border }}
                >
                  <h4 className={classes.sectionTitle}>{section.title}</h4>
                  <p className={classes.sectionDesc}>{section.desc}</p>
                  <div className={classes.badges}>
                    {section.badges.map((badge, j) => {
                      const BadgeIcon = iconsConfig[badge.icon];
                      return (
                        <span
                          key={j}
                          className={`${badge.theme} ${classes.badge}`}
                        >
                          <BadgeIcon className={classes.badgeIcon} />
                          {badge.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div
              className={classes.benefits}
              style={{ backgroundColor: mode.benefitBg }}
            >
              <h5 className={classes.benefitTitle}>{mode.benefitTitle}</h5>
              <ul className={classes.benefitList}>
                {mode.benefits.map((item, k) => {
                  return (
                    <li key={k}>
                      <CheckIcon
                        style={{ color: mode.theme.color, marginRight: "8px" }}
                      />
                      {item}
                    </li>
                  );
                })}
              </ul>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
