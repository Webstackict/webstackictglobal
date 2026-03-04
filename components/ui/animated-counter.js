"use client";

import { useMotionValue, useTransform, animate, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function AnimatedCounter({ value, suffix = "" }) {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => Math.round(latest));
    const [displayValue, setDisplayValue] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        const unsubscribe = rounded.on("change", (latest) => {
            setDisplayValue(latest);
        });
        return unsubscribe;
    }, [rounded]);

    useEffect(() => {
        if (isInView) {
            const controls = animate(count, value, {
                duration: 2,
                ease: "easeOut",
            });
            return controls.stop;
        }
    }, [isInView, value, count]);

    return (
        <motion.span ref={ref}>
            {displayValue}
            {suffix}
        </motion.span>
    );
}
