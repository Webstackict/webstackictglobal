"use client";

import { motion } from "framer-motion";
import { statsData } from "@/lib/contents/statsData";
import AnimatedCounter from "@/components/ui/animated-counter";
import classes from "./stats-section.module.css";
import { containerVarients, childVarients } from "@/lib/animations";

export default function StatsSection() {
    return (
        <motion.div
            className={classes.statsGrid}
            variants={containerVarients}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
        >
            {statsData.map((stat) => (
                <motion.div
                    key={stat.id}
                    className={classes.statItem}
                    variants={childVarients}
                >
                    <span className={`${classes.number} ${classes[stat.color]}`}>
                        <AnimatedCounter value={stat.number} suffix={stat.suffix} />
                    </span>
                    <span className={classes.label}>{stat.label}</span>
                </motion.div>
            ))}
        </motion.div>
    );
}
