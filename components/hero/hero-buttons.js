"use client";
import { useRouter } from "next/navigation";
import classes from "./hero-buttons.module.css";
import nProgress from "nprogress";
import { useTransition } from "react";
import { motion } from "framer-motion";

export default function HeroButtons({
  label = null,
  primaryBtnText,
  secondaryBtnText,
  primaryBtnRoute,
  secondaryBtnRoute,
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  let buttonStyle = `${classes.buttonGroup}`;

  if (label === "page banner") {
    buttonStyle = `${classes.pageBannerButtons} ${classes.buttonGroup}`;
  }

  function handlePrimaryButtonClick() {
    if (primaryBtnRoute?.startsWith("/")) {
      nProgress.start();
      startTransition(() => {
        router.push(primaryBtnRoute);
      });
      return;
    }

    const element = document.getElementById(primaryBtnRoute);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
      });
    }
  }

  function handleSecondaryButtonClick() {
    if (secondaryBtnRoute?.startsWith("/")) {
      nProgress.start();
      startTransition(() => {
        router.push(secondaryBtnRoute);
      });
      return;
    }

    const element = document.getElementById(secondaryBtnRoute);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
      });
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.3,
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      className={buttonStyle}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.button
        className={classes.primaryBtn}
        onClick={handlePrimaryButtonClick}
        variants={buttonVariants}
        disabled={primaryBtnRoute === "/"}
        aria-label={`${primaryBtnText} - Scroll to section`}
      >
        {primaryBtnText}
      </motion.button>
      <motion.button
        className={`${classes.secondaryBtn} glassmorphism`}
        onClick={handleSecondaryButtonClick}
        variants={buttonVariants}
        disabled={primaryBtnRoute === "/"}
        aria-label={`${secondaryBtnText} - Go to programs`}
      >
        {secondaryBtnText}
      </motion.button>
    </motion.div>
  );
}
