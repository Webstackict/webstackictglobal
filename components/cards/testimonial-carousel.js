"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import classes from "./testimonial-carousel.module.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function TestimonialCarousel({ testimonials }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted) return;
        const timer = setInterval(() => {
            handleNext();
        }, 8000);
        return () => clearInterval(timer);
    }, [currentIndex, isMounted]);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    if (!isMounted || !testimonials || testimonials.length === 0) return null;

    const current = testimonials[currentIndex];

    return (
        <div className={classes.carouselContainer}>
            <div className={classes.carouselContent}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className={classes.slide}
                    >
                        <div className={classes.testimonialBox}>
                            <div className={classes.quoteIcon}>"</div>
                            <p className={classes.text}>{current.text}</p>

                            <div className={classes.profile}>
                                <div className={classes.imageWrapper}>
                                    <Image
                                        src={current.image || "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg"}
                                        alt={current.name}
                                        width={80}
                                        height={80}
                                        className={classes.avatar}
                                        unoptimized={true}
                                    />
                                </div>
                                <div className={classes.info}>
                                    <h4 className={classes.name}>{current.name}</h4>
                                    <p className={classes.role}>{current.role}</p>
                                    <p className={classes.program}>{current.program}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                <button className={classes.navBtnPrev} onClick={handlePrev}>
                    <ChevronLeft size={24} />
                </button>
                <button className={classes.navBtnNext} onClick={handleNext}>
                    <ChevronRight size={24} />
                </button>

                <div className={classes.dots}>
                    {testimonials.map((_, index) => (
                        <div
                            key={index}
                            className={`${classes.dot} ${index === currentIndex ? classes.activeDot : ""}`}
                            onClick={() => setCurrentIndex(index)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
