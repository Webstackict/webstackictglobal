"use client";
import { motion } from "framer-motion";
import CTACards from "../cards/cta-cards";
import classes from "./call-to-action.module.css";
import { useRouter } from "next/navigation";
import nProgress from "nprogress";
import { useTransition } from "react";

export default function CTASection({
  title,
  subtitle,
  ctaHighlights,
  label = null,
  primaryBtnText,
  primaryBtnRoute,
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handlePrimaryBtnClick() {
    if (label === "home") {
      nProgress.start();
      startTransition(() => router.push(primaryBtnRoute));
      return;
    }

    document.getElementById(primaryBtnRoute).scrollIntoView({
      behavior: "smooth",
    });
  }
  return (
    <motion.section
      className={classes.section}
      initial={{
        y: 20,
        opacity: 0,
      }}
      whileInView={{
        y: 0,
        opacity: 1,
        transition: { duration: 1, ease: "easeOut" },
      }}
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className={classes.container}>
        <h2 className={classes.heading}>{title}</h2>
        <p className={classes.subtext}>{subtitle}</p>

        <div className={classes.card}>
          <div className={classes.grid}>
            {ctaHighlights.map((item, index) => (
              <CTACards key={index} content={item} />
            ))}
          </div>

          <div className={classes.buttonWrapper}>
            <button
              className={classes.primaryButton}
              onClick={handlePrimaryBtnClick}
            >
              {primaryBtnText}
            </button>
            <p className={classes.smallText}>
              No commitment required • Free consultation included
            </p>
          </div>
        </div>

        <div className={classes.actions}>
          <button
            className={classes.secondaryButtonBlue}
            onClick={() => router.push("/contact#contact-form")}
          >
            Schedule a Free Consultation
          </button>
          <button
            className={classes.secondaryButtonGreen}
            onClick={() => router.push("/contact#contact-options")}
          >
            Ways to Reach Us
          </button>
        </div>
      </div>
    </motion.section>
  );
}
