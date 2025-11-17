"use client";
import classes from "../page.module.css";

import LinkWithProgress from "@/components/ui/Link-with-progress";
import { iconsConfig } from "@/lib/icons/iconsConfig";
import { motion, AnimatePresence } from "framer-motion";
import checkIcon from "@/assets/successfull-check.svg";


export default async function VerifyEmail() {
  return (
    <section id="login-main" className={classes.authSection}>
      <div className={classes.wrapper}>
        <div id="login-card" className={classes.card}>
          <div className={classes.glowBar}></div>

          <div id="login-header" className={classes.header}>
            <motion.img
              src={checkIcon.src}
              alt="check-icon"
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 5, type: "spring", bounce: 0.6 }}
              viewport={{ once: true }}
            />

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
