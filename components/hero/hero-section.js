"use client";

import Image from "next/image";
import FloatingCard from "../ui/floating-card";
import classes from "./hero-section.module.css";
import LeftHero from "./left-hero";
import { use, useEffect } from "react";
import { MainSidebarContext } from "@/store/main-sidebar-context";

export default function HeroSection() {
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
          src="https://storage.googleapis.com/uxpilot-auth.appspot.com/098a301275-17fc37a3ca371ad63e71.png"
          alt="futuristic tech workspace with coding screens and digital elements, dark blue gradient"
          fill
        />
        <div className={classes.heroOverlay}></div>
      </div>

      <div className={classes.heroContent}>
        <div className={classes.heroGrid}>
          <LeftHero />
          <FloatingCard />
        </div>
      </div>
    </section>
  );
}
