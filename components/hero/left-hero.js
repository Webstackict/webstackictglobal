"use client";

import Tagline from "@/components/ui/tagline";
import classes from "./left-hero.module.css";
import Stats from "@/components/ui/stats";
import HeroButtons from "./hero-buttons";
import { motion } from "framer-motion";
import { ReactTyped } from "react-typed";

function LeftHero() {
  return (
    <div className={classes.left}>
      <Tagline text="Africa's Premier Tech Training Hub" icon="rocket" />

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
        Build Your <span className={classes.gradientText}>Tech Future</span> in
        Africa
      </motion.h1>

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
      >
        <ReactTyped
          strings={[
            "Join WEBSTACK's premium training programs and transform your career with hands-on experience in web development, data science, cybersecurity, and emerging technologies.",
          ]}
          typeSpeed={5}
          backSpeed={0}
          startDelay={300}
          showCursor={true}
          cursorChar="|"
          loop={false}
        />
      </motion.p>

      <HeroButtons
        primaryBtnText="Join Our Next Cohort"
        secondaryBtnText="Explore Programs"
        primaryBtnRoute="ongoing-cohorts-registration"
        secondaryBtnRoute="contact-options"
      />

      <Stats />
    </div>
  );
}

export default LeftHero;
