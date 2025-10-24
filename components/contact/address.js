"use client";
import { motion } from "framer-motion";
import { containerVarients, childVarients } from "@/lib/animations";
import { iconsConfig } from "@/lib/icons/iconsConfig";
import classes from "./address.module.css";
import { contactInfo } from "@/lib/contents/addressData";

const DirectionIcon = iconsConfig["direction"];

export default function AddressGrid() {
  return (
    <motion.div
      className={classes.grid}
      variants={containerVarients}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {contactInfo.map((item, index) => {
        const CardIcon = iconsConfig[item.icon];
        return (
          <motion.div
            key={index}
            className={classes.card}
            variants={childVarients}
          >
            <div className={classes.iconWrapper}>
              <CardIcon className={classes.icon} />
            </div>

            <h3 className={classes.title}>{item.title}</h3>

            {item.type === "text" && (
              <>
                <p className={classes.text}>{item.content}</p>
                {item.button && (
                  <button className={classes.button}>
                    <DirectionIcon /> {item.button}
                  </button>
                )}
              </>
            )}

            {item.type === "hours" && (
              <>
                <div className={classes.hours}>
                  {item.hours.map((hour, i) => (
                    <div key={i} className={classes.hourRow}>
                      <span>{hour.day}</span>
                      <span>{hour.time}</span>
                    </div>
                  ))}
                </div>
                <div className={classes.status}>
                  <div className={classes.dot}></div>
                  <span>Currently Open</span>
                </div>
              </>
            )}

            {item.type === "support" && (
              <div className={classes.supportList}>
                {item.channels.map((ch, i) => {
                  const Icon = iconsConfig[ch.icon];
                  return (
                    <div key={i} className={classes.supportItem}>
                      <Icon className={classes.channelIcon} />
                      <span>{ch.text}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
