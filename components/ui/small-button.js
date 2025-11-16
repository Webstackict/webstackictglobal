"use client";
import { motion } from "framer-motion";
import classes from "./small-button.module.css";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import nProgress from "nprogress";
export default function SmallButton({ children, className, href, ...props }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const buttonStyle = `${className} ${classes.button}`;
  function handleClick() {
    nProgress.start();
    startTransition(() => router.push(href));
  }
  return (
    <motion.button
      {...props}
      className={buttonStyle}
      whileHover={{
        scale: 1.05,
      }}
      onClick={handleClick}
    >
      {children}
    </motion.button>
  );
}
