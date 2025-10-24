"use client";
import { motion } from "framer-motion";
import { iconsConfig } from "@/lib/icons/iconsConfig";
import classes from "./see-more-button.module.css";
import { useRouter } from "next/navigation";
import nProgress from "nprogress";
import { useTransition } from "react";

const RightArrow = motion.create(iconsConfig["rightArrow"]);

export default function SeeMoreButton({ children, href }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const buttonVariants = {
    rest: { color: "var(--blue-500)", transition: { duration: 0.2 } },
    hover: { color: "var(--white)", transition: { duration: 0.3 } },
  };

  const arrowVariants = {
    rest: { x: 0, transition: { duration: 0.2 } },
    hover: { x: 5, transition: { duration: 0.3 } },
  };

  function handleButtonClick() {
    if (href) {
      nProgress.start();

      startTransition(() => router.push(href));
    }
  }

  return (
    <motion.div className={classes.buttonWrapper}>
      <motion.button
        className={classes.readMoreBtn}
        variants={buttonVariants}
        initial="rest"
        whileHover="hover"
        animate="rest"
        onClick={handleButtonClick}
      >
        {children}
        <RightArrow
          variants={arrowVariants}
          transition={{ type: "spring", stiffness: 300 }}
        />
      </motion.button>
    </motion.div>
  );
}
