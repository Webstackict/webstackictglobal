"use client";
import { motion } from "framer-motion";
import HeroButtons from "./hero-buttons";
import classes from "./page-banner.module.css";
import QuickNav from "../ui/quick-nav";
import GallerStats from "../gallery/gallery-stats";

export default function PageBanner({
  label = null,
  title,
  subtitle,
  tagline,
  primaryBtnText,
  secondaryBtnText,
  primaryBtnRoute,
  secondaryBtnRoute,
}) {
  return (
    <section className={classes.pageBannerSection}>
      <div className={classes.bgDecor}>
        <div className={classes.circle1}></div>
        <div className={classes.circle2}></div>
      </div>

      <div className={classes.container}>
        {tagline}

        <motion.h1
          initial={{
            opacity: 0,
            y: -20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.4, ease: "easeOut" },
          }}
          viewport={{ once: true, amount: 0.5 }}
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.4, ease: "easeOut" },
          }}
          viewport={{ once: true, amount: 0.5 }}
        >
          {subtitle}
        </motion.p>

        <HeroButtons
          label="page banner"
          primaryBtnText={primaryBtnText}
          secondaryBtnText={secondaryBtnText}
          primaryBtnRoute={primaryBtnRoute}
          secondaryBtnRoute={secondaryBtnRoute}
        />

        {label === "gallery" && <GallerStats />}
      </div>
    </section>
  );
}
