"use client";
import { motion } from "framer-motion";
import CodePreviewBox from "@/components/code-preview-box";
import classes from "./immersive-hero.module.css";

export default function ImmersiveHero() {
  return (
    <motion.div
      className={`${classes.immersiveHero} ${classes.glowBorder}`}
      initial={{ opacity: 0, x: 20 }}
      whileInView={{
        opacity: 1,
        x: 0,
        transition: { duration: 0.4, ease: "easeOut" },
      }}
      viewport={{ once: true, amount: 0.5 }}
    >
      <h3 className={classes.previewTitle}>Live Classroom Preview</h3>

      <CodePreviewBox />
    </motion.div>
  );
}
