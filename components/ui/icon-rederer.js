"use client";
import { AnimatePresence, motion } from "framer-motion";
import { iconsConfig } from "@/lib/icons/iconsConfig";

export default function IconRenderer({ label, iconName }) {
  const Icon = iconsConfig[iconName];

  if (label === "verified-email") {
    const MotionIcon = motion.create(Icon);

    return (
      <AnimatePresence mode="wait">
        <MotionIcon
          key={iconName}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        />
      </AnimatePresence>
    );
  }

  return <Icon />;
}
