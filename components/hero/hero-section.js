"use client";

import Image from "next/image";
import FloatingCard from "../ui/floating-card";
import classes from "./hero-section.module.css";
import LeftHero from "./left-hero";
import { use, useEffect } from "react";
import { MainSidebarContext } from "@/store/main-sidebar-context";

export default function HeroSection({
  label = null,
  taglineText,
  taglineIcon,
  heroImage,
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
  image = null,
}) {
  const { isMainSidebar, setIsMainSidebar } = use(MainSidebarContext);

  useEffect(() => {
    if (isMainSidebar) {
      setIsMainSidebar(false);
    }
  }, []);
  return (
    <section id="hero-section" className={classes.heroSection}>
      <div className={classes.heroBackground}>
        <Image
          className={classes.heroImage}
          src={heroImage}
          alt="futuristic tech workspace with coding screens and digital elements, dark blue gradient"
          fill
        />
        {!label && <div className={classes.heroOverlay}></div>}
      </div>

      <div className={classes.heroContent}>
        <div className={classes.heroGrid}>
          <LeftHero
            label={label}
            taglineText={taglineText}
            taglineIcon={taglineIcon}
            title={title}
            description={description}
            date={date}
            startTime={startTime}
            dismisalTime={dismisalTime}
            venue={venue}
            primaryBtnText={primaryBtnText}
            secondaryBtnText={secondaryBtnText}
            primaryBtnRoute={primaryBtnRoute}
            secondaryBtnRoute={secondaryBtnRoute}
          />

          {!label && <FloatingCard image={image} />}
        </div>
      </div>
    </section>
  );
}
