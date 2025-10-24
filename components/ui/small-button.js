"use client";
import { motion } from "framer-motion";
import classes from "./small-button.module.css";
export default function SmallButton({ children, className, ...props }) {
  const buttonStyle = `${className} ${classes.button}`;
  return (
    <motion.button
      {...props}
      className={buttonStyle}
      whileHover={{
        scale: 1.05,
      }}
    >
      {children}
    </motion.button>
  );
}
