"use client";

import { useState } from "react";
import { toast } from "sonner";
import classes from "./ProgramApplicationForm.module.css";

export default function ProgramApplicationForm({ cohortId, cohortLabel }) {
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        phone: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch("/api/enrollments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    cohort_id: cohortId,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to submit application");
            }

            setIsSubmitted(true);
            toast.success("Application submitted successfully!");
        } catch (error) {
            console.error("Submission error:", error);
            toast.error(error.message || "Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className={classes.successContainer}>
                <div className={classes.successIcon}>🎉</div>
                <h2>Application Received!</h2>
                <p>
                    Thank you for applying to the <strong>{cohortLabel}</strong>.
                    Our admissions team will review your application and contact you via email shortly.
                </p>
                <button
                    onClick={() => setIsSubmitted(false)}
                    className={classes.resetBtn}
                >
                    Submit Another Application
                </button>
            </div>
        );
    }

    return (
        <div className={classes.formContainer}>
            <div className={classes.formHeader}>
                <h2>Apply for this Program</h2>
                <p>Take the first step towards your tech career. Fill out the form below to get started.</p>
            </div>

            <form onSubmit={handleSubmit} className={classes.form}>
                <div className={classes.inputGroup}>
                    <label htmlFor="full_name">Full Name</label>
                    <input
                        type="text"
                        id="full_name"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                        disabled={isLoading}
                    />
                </div>

                <div className={classes.inputGroup}>
                    <label htmlFor="email">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        required
                        disabled={isLoading}
                    />
                </div>

                <div className={classes.inputGroup}>
                    <label htmlFor="phone">Phone Number</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+234 800 000 0000"
                        required
                        disabled={isLoading}
                    />
                </div>

                <button
                    type="submit"
                    className={classes.submitBtn}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <span className={classes.loaderContainer}>
                            <span className={classes.loader}></span>
                            Processing...
                        </span>
                    ) : (
                        "Submit Application"
                    )}
                </button>
            </form>

            <p className={classes.formFooter}>
                By submitting this form, you agree to our terms and conditions.
            </p>
        </div>
    );
}
