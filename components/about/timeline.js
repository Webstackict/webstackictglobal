"use client";
import { motion } from "framer-motion";
import classes from "./timeline.module.css";
import { timelineData } from "@/lib/contents/aboutData";

export default function Timeline() {
  return (
    <div className={classes.timelineWrapper}>
      <motion.div
        className={classes.verticalLine}
        initial={{ opacity: 0, y: -20 }}
        whileInView={{
          opacity: 1,
          y: 0,
          transition: { duration: 0.4, type: "spring" },
        }}
        viewport={{ once: true, amount: 0.1 }}
      ></motion.div>

      <div className={classes.timelineContainer}>
        {timelineData.map((item, index) => (
          <div
            key={index}
            className={`${classes.timelineItem} ${
              index % 2 === 0 ? classes.left : classes.right
            }`}
          >
            {index % 2 === 0 && (
              <div className={classes.textBlock}>
                <motion.div
                  className={classes.card}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.4, type: "spring" },
                  }}
                  viewport={{ once: true, amount: 0.5 }}
                >
                  <div className={classes.year}>{item.year}</div>
                  <h3 className={classes.title}>{item.title}</h3>
                  <p className={classes.description}>{item.description}</p>
                </motion.div>
              </div>
            )}

            <motion.div
              className={`${classes.circle} ${
                item.glow ? classes.glowBlue : ""
              }`}
              initial={{ opacity: 0 }}
              whileInView={{
                opacity: 1,

                transition: { duration: 1, type: "spring", delay: 0.6 },
              }}
              viewport={{ once: true, amount: 1 }}
            ></motion.div>

            {index % 2 !== 0 && (
              <div className={classes.textBlock}>
                <motion.div
                  className={classes.card}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.4, type: "spring" },
                  }}
                  viewport={{ once: true, amount: 0.5 }}
                >
                  <div className={classes.year}>{item.year}</div>
                  <h3 className={classes.title}>{item.title}</h3>
                  <p className={classes.description}>{item.description}</p>
                </motion.div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
