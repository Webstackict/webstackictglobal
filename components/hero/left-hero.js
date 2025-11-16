"use client";

import Tagline from "@/components/ui/tagline";
import classes from "./left-hero.module.css";
import Stats from "@/components/ui/stats";
import HeroButtons from "./hero-buttons";
import { motion } from "framer-motion";
import { ReactTyped } from "react-typed";
import EventDetailPill from "./event-detail-pills";
import { childVarients, containerVarients } from "@/lib/animations";

function LeftHero({
  label,
  taglineText,
  taglineIcon,
  title,
  description,
  date,
  startTime,
  dismisalTime,
  venue,
  primaryBtnText,
  secondaryBtnText,
  primaryBtnRoute,
  secondaryBtnRoute,
}) {
  return (
    <motion.div
      className={classes.left}
      style={label ? { gridColumn: "span 2" } : undefined}
      layout
      transition={{ duration: 1 }}
    >
      <Tagline text={taglineText} icon={taglineIcon} />

      <motion.h1
        className={classes.heroTitle}
        initial={{
          x: -20,
          opacity: 0,
        }}
        animate={{
          x: 0,
          opacity: 1,
          transition: { duration: 0.4, ease: "easeOut" },
        }}
      >
        {title}
      </motion.h1>

      {label && (
        <motion.div
          className={classes.detailsContainer}
          variants={containerVarients}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 1 }}
          layout
          transition={{ duration: 1 }}
        >
          <EventDetailPill
            text={date}
            icon="calendar"
            variants={childVarients}
          />
          <EventDetailPill
            text={`${startTime} - ${dismisalTime}`}
            icon="clock"
            variants={childVarients}
          />
          <EventDetailPill
            text={venue}
            icon="location"
            variants={childVarients}
          />
        </motion.div>
      )}

      <motion.p
        className={classes.heroDescription}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.8,
            ease: "easeOut",
          },
        }}
        viewport={{ once: true }}
        layout
        transition={{ duration: 1 }}
      >
        {!label ? (
          <ReactTyped
            strings={[description]}
            typeSpeed={5}
            backSpeed={0}
            startDelay={300}
            showCursor={true}
            cursorChar="|"
            loop={false}
          />
        ) : (
          description
        )}
      </motion.p>

      <HeroButtons
        primaryBtnText={primaryBtnText}
        secondaryBtnText={secondaryBtnText}
        primaryBtnRoute={primaryBtnRoute}
        secondaryBtnRoute={secondaryBtnRoute}
      />

      {!label && <Stats />}
    </motion.div>
  );
}

export default LeftHero;
