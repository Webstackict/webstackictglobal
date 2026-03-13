"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import classes from "./TestimonialCarousel.module.css";

export default function TestimonialCarousel({ testimonials = [] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0); // -1 for left, 1 for right

    const nextSlide = useCallback(() => {
        if (testimonials.length <= 1) return;
        setDirection(1);
        setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    }, [testimonials.length]);

    const prevSlide = useCallback(() => {
        if (testimonials.length <= 1) return;
        setDirection(-1);
        setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    }, [testimonials.length]);

    // Auto-slide effect
    useEffect(() => {
        if (testimonials.length <= 1) return;
        const interval = setInterval(nextSlide, 8000); // 8 seconds per slide
        return () => clearInterval(interval);
    }, [nextSlide, testimonials.length]);

    if (!testimonials || testimonials.length === 0) {
        return (
            <div className={classes.emptyState}>
                <p>No testimonials available yet. Be the first to share your experience!</p>
            </div>
        );
    }

    const variants = {
        enter: (direction) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0,
            scale: 0.95
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1] // Custom quintic ease
            }
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? 300 : -300,
            opacity: 0,
            scale: 0.95,
            transition: {
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1]
            }
        })
    };

    const currentTestimonial = testimonials[currentIndex];

    return (
        <div className={classes.carouselContainer}>
            {/* Navigation Arrows */}
            {testimonials.length > 1 && (
                <>
                    <button
                        className={`${classes.navButton} ${classes.prev}`}
                        onClick={prevSlide}
                        aria-label="Previous testimonial"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        className={`${classes.navButton} ${classes.next}`}
                        onClick={nextSlide}
                        aria-label="Next testimonial"
                    >
                        <ChevronRight size={24} />
                    </button>
                </>
            )}

            {/* Slider Window */}
            <div className={classes.sliderWindow}>
                <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div
                        key={currentIndex}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className={classes.slide}
                    >
                        {/* Avatar */}
                        <div className={classes.avatarContainer}>
                            {currentTestimonial.avatar_url ? (
                                <img
                                    src={currentTestimonial.avatar_url}
                                    alt={currentTestimonial.name}
                                    className={classes.avatar}
                                />
                            ) : (
                                <div className={classes.avatar}>
                                    {currentTestimonial.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <h3 className={classes.reviewerName}>{currentTestimonial.name}</h3>
                        {currentTestimonial.program && (
                            <p className={classes.program}>{currentTestimonial.program}</p>
                        )}

                        {/* Rating */}
                        <div className={classes.rating}>
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={18}
                                    fill={i < currentTestimonial.rating ? "currentColor" : "none"}
                                />
                            ))}
                        </div>

                        {/* Quote */}
                        <blockquote className={classes.message}>
                            {currentTestimonial.review_message}
                        </blockquote>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Indicators */}
            {testimonials.length > 1 && (
                <div className={classes.indicators}>
                    {testimonials.map((_, index) => (
                        <button
                            key={index}
                            className={`${classes.indicator} ${index === currentIndex ? classes.active : ""}`}
                            onClick={() => {
                                setDirection(index > currentIndex ? 1 : -1);
                                setCurrentIndex(index);
                            }}
                            aria-label={`Go to testimonial ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
