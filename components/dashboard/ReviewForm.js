"use client";

import { useState } from "react";
import { Star, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import classes from "./ReviewForm.module.css";

export default function ReviewForm({ userDetails, enrolledPrograms = [] }) {
    const [formData, setFormData] = useState({
        rating: 5,
        review_message: "",
        program: enrolledPrograms.length > 0 ? enrolledPrograms[0].name : "",
        avatar_url: "",
        video_url: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [hoveredRating, setHoveredRating] = useState(0);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleRatingClick = (rating) => {
        setFormData((prev) => ({ ...prev, rating }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.review_message.trim()) {
            toast.error("Please enter a review message.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/testimonials/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to submit review");
            }

            setIsSubmitted(true);
            toast.success("Review submitted for approval!");
        } catch (error) {
            console.error("Submission error:", error);
            toast.error(error.message || "Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className={classes.successState}>
                <div className={classes.successIcon}>✨</div>
                <h2>Review Submitted!</h2>
                <p>
                    Thank you for sharing your experience. Your review will be published after our team approves it.
                </p>
                <button
                    onClick={() => setIsSubmitted(false)}
                    className={classes.resetBtn}
                >
                    Submit Another Review
                </button>
            </div>
        );
    }

    return (
        <div className={classes.formContainer}>
            <div className={classes.header}>
                <h2>Share Your Experience</h2>
                <p>Your feedback helps us grow and helps others make the right choice.</p>
            </div>

            <form onSubmit={handleSubmit} className={classes.form}>
                <div className={classes.inputGroup}>
                    <label>Full Name</label>
                    <input
                        type="text"
                        className={classes.input}
                        value={userDetails?.fullName || ""}
                        disabled
                    />
                </div>

                <div className={classes.inputGroup}>
                    <label>Email Address</label>
                    <input
                        type="email"
                        className={classes.input}
                        value={userDetails?.email || ""}
                        disabled
                    />
                </div>

                <div className={classes.inputGroup}>
                    <label>Program Attended (Optional)</label>
                    <select
                        name="program"
                        className={classes.select}
                        value={formData.program}
                        onChange={handleChange}
                    >
                        <option value="">Select a program</option>
                        {enrolledPrograms.map((prog, idx) => (
                            <option key={idx} value={prog.name}>
                                {prog.name}
                            </option>
                        ))}
                        <option value="General">General / Not Listed</option>
                    </select>
                </div>

                <div className={classes.inputGroup}>
                    <label>Rating</label>
                    <div className={classes.ratingGroup}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className={`${classes.star} ${(hoveredRating || formData.rating) >= star ? classes.active : classes.inactive
                                    }`}
                                onClick={() => handleRatingClick(star)}
                                onMouseEnter={() => setHoveredRating(star)}
                                onMouseLeave={() => setHoveredRating(0)}
                            >
                                <Star size={24} fill={(hoveredRating || formData.rating) >= star ? "currentColor" : "none"} />
                            </button>
                        ))}
                    </div>
                </div>

                <div className={classes.inputGroup}>
                    <div className={classes.labelWithCount}>
                        <label>Your Testimonial</label>
                        <span className={`${classes.charCount} ${formData.review_message.length > 500 ? classes.limitReached : ''}`}>
                            {formData.review_message.length}/500
                        </span>
                    </div>
                    <textarea
                        name="review_message"
                        className={classes.textarea}
                        value={formData.review_message}
                        onChange={(e) => {
                            if (e.target.value.length <= 500) {
                                handleChange(e);
                            }
                        }}
                        placeholder="Tell us what you loved about our services and training..."
                        required
                        disabled={isLoading}
                    />
                </div>

                <div className={classes.inputGroup}>
                    <label>Avatar/Profile Image URL (Optional)</label>
                    <input
                        type="url"
                        name="avatar_url"
                        className={classes.input}
                        value={formData.avatar_url}
                        onChange={handleChange}
                        placeholder="https://example.com/photo.jpg"
                        disabled={isLoading}
                    />
                </div>

                <div className={classes.inputGroup}>
                    <label>Video Testimonial Link (Optional)</label>
                    <input
                        type="url"
                        name="video_url"
                        className={classes.input}
                        value={formData.video_url}
                        onChange={handleChange}
                        placeholder="YouTube or Vimeo link"
                        disabled={isLoading}
                    />
                </div>

                <button
                    type="submit"
                    className={classes.submitBtn}
                    disabled={isLoading}
                >
                    {isLoading ? <Loader2 className={classes.loader} /> : <Send size={18} />}
                    {isLoading ? "Submitting..." : "Submit Review"}
                </button>
            </form>
        </div>
    );
}
