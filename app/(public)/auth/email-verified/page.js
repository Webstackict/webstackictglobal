"use client";
import classes from "../page.module.css";

import LinkWithProgress from "@/components/ui/Link-with-progress";
import { iconsConfig } from "@/lib/icons/iconsConfig";
import { motion, AnimatePresence } from "framer-motion";

const MotionIcon = motion.create(iconsConfig["badgeCheck"]);
export default async function VerifyEmail() {
  return (
    <section id="login-main" className={classes.authSection}>
      <div className={classes.wrapper}>
        <div id="login-card" className={classes.card}>
          <div className={classes.glowBar}></div>

          <div id="login-header" className={classes.header}>
            <AnimatePresence mode="wait">
              <MotionIcon
                key="check"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: "spring",
                  duration: 1,
                }}
              />
            </AnimatePresence>
            <h1>Email Verified Successfully</h1>
            <p>
              Your email has been verified, proceed to login and kickstart your
              journey!
            </p>

            <div className={classes.verifyButtonsContainer}>
              <LinkWithProgress href="/auth" className={classes.proceedButton}>
                Proceed to Login
              </LinkWithProgress>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
