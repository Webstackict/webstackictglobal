"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import classes from "./faq.module.css";

import { iconsConfig } from "@/lib/icons/iconsConfig";

const RightAngle = iconsConfig["angleDown"];

export default function FaqSection({ faqData }) {
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  const containerVarients = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };
  const childVarients = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };
  return (
    <motion.div
      className={classes.faqContainer}
      variants={containerVarients}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {faqData.map((faq) => (
        <motion.div
          key={faq.id}
          className={`${classes.faqItem} ${classes.glassEffect} ${classes.glowBorder}`}
          variants={childVarients}
        >
          <div className={classes.faqHeader} onClick={() => toggleFAQ(faq.id)}>
            <h3>{faq.question}</h3>
            <RightAngle
              className={`${classes.icon} ${
                openFAQ === faq.id ? classes.iconActive : ""
              }`}
            />
          </div>

          <AnimatePresence>
            {openFAQ === faq.id && (
              <motion.div
                className={classes.faqContent}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <p>{faq.answer}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </motion.div>
  );
}
