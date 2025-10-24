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
    document.getElementById(primaryBtnRoute).scrollIntoView({
      behavior: "smooth",
    });
  }
  function handleSecondaryButtonClick() {
    if (secondaryBtnText === "Explore Programs") {
      nProgress.start();

      startTransition(() => {
        router.push("/programs/academy");
      });
      return;
    }
    document.getElementById(secondaryBtnRoute).scrollIntoView({
      behavior: "smooth",
    });
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
      >
        {primaryBtnText}
      </motion.button>
      <motion.button
        className={`${classes.secondaryBtn} glassmorphism`}
        onClick={handleSecondaryButtonClick}
        variants={buttonVariants}
        disabled={primaryBtnRoute === "/"}
      >
        {secondaryBtnText}
      </motion.button>
    </motion.div>
  );
}
