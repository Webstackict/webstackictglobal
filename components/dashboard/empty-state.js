"use client";
import React from "react";
import classes from "./empty-state.module.css";
import Button from "./button";
import { iconsConfig } from "@/lib/icons/iconsConfig";
import { motion } from "framer-motion";

export default function EmptyState({
    icon = "info",
    title = "No data available",
    description = "There is nothing to show here at the moment.",
    buttonText,
    buttonIcon,
    href,
}) {
    const Icon = iconsConfig[icon] || iconsConfig["info"];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`${classes.emptyStateContainer} premium-card`}
        >
            <div className={classes.iconWrapper}>
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <Icon className={classes.icon} />
                </motion.div>
            </div>
            <div className={classes.content}>
                <h4>{title}</h4>
                <p>{description}</p>
            </div>
            {buttonText && (
                <div className={classes.actions}>
                    <Button text={buttonText} icon={buttonIcon} href={href} />
                </div>
            )}
        </motion.div>
    );
}
