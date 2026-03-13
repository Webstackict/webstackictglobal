"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
    CheckCircle2, ArrowRight, ArrowLeft, User, Mail,
    Phone, Clock, Calendar, BookOpen, Lock,
    ChevronRight, AlertCircle, LogIn, Sparkles
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import classes from "./multi-step-enrollment-form.module.css";
import Link from 'next/link';

export default function MultiStepEnrollmentForm({ cohorts = [], programs = [] }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const supabase = createClient();

    const [step, setStep] = useState(1);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [selectedCohortId, setSelectedCohortId] = useState("");
    const [selectedProgramId, setSelectedProgramId] = useState("");
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        phone: ""
    });

    // Check auth session
    useEffect(() => {
        const getSession = async () => {
            setIsLoading(true);
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                setUser(session.user);
                // Fetch profile to auto-fill
                const { data: profile } = await supabase
                    .from('user_profile')
                    .select('full_name, phone')
                    .eq('user_id', session.user.id)
                    .maybeSingle();

                setFormData({
                    full_name: profile?.full_name || session.user.user_metadata?.full_name || "",
                    email: session.user.email || "",
                    phone: profile?.phone || ""
                });
            }
            setIsLoading(false);
        };
        getSession();
    }, []);

    // Derived Selection Info
    const selectedCohort = useMemo(() => cohorts.find(c => c.id === selectedCohortId), [cohorts, selectedCohortId]);
    const selectedProgram = useMemo(() => programs.find(p => p.id === selectedProgramId), [programs, selectedProgramId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const nextStep = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setStep(prev => prev + 1);
    };

    const prevStep = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setStep(prev => prev - 1);
    };

    const handleSubmitEnrollment = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // 1. Create Enrollment
            const enrollRes = await fetch('/api/enrollments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: user?.id,
                    cohort_id: selectedCohortId,
                    program_id: selectedProgramId,
                    full_name: formData.full_name,
                    email: formData.email,
                    phone: formData.phone
                })
            });

            const enrollData = await enrollRes.json();

            if (!enrollRes.ok) {
                throw new Error(enrollData.error || "Failed to process enrollment");
            }

            toast.success("Registration successful! Redirecting to payment...");

            // 2. Initialize Paystack
            const payRes = await fetch('/api/paystack/init', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ enrollmentId: enrollData.id })
            });

            const payData = await payRes.json();

            if (payRes.ok && payData.url) {
                window.location.href = payData.url;
            } else {
                toast.error("Enrollment saved, but payment initiation failed. Please check your dashboard.");
                router.push('/dashboard');
            }

        } catch (error) {
            console.error(error);
            toast.error(error.message || "An error occurred during enrollment");
        } finally {
            setIsSubmitting(false);
        }
    };

    const isStep1Valid = !!selectedCohortId;
    const isStep2Valid = !!selectedProgramId;
    const isStep3Valid = !!(formData.full_name && formData.email && formData.phone);

    if (isLoading) {
        return (
            <div className={classes.loaderContainer}>
                <div className={classes.spinner}></div>
                <p>Establishing secure session...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className={classes.authGuardContainer}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={classes.authCard}
                >
                    <div className={classes.lockCircle}>
                        <Lock className="w-8 h-8 text-blue-500" />
                    </div>
                    <h2>Secure Enrollment</h2>
                    <p>A Webstack account is required to officialize your enrollment. Please sign in or create an account to proceed.</p>

                    <div className={classes.authActions}>
                        <Link href="/auth?redirect=/enroll" className={classes.primaryBtn}>
                            <LogIn className="w-4 h-4 mr-2" /> Sign In
                        </Link>
                        <Link href="/auth?view=signup&redirect=/enroll" className={classes.secondaryBtn}>
                            Create Free Account
                        </Link>
                    </div>

                    <div className={classes.authFooter}>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>Encrypted Session</span>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className={classes.container}>
            {/* Progress Stepper */}
            <div className={classes.progressHeader}>
                {[1, 2, 3, 4].map((s) => (
                    <div key={s} className={`${classes.progressStep} ${step >= s ? classes.active : ""} ${step > s ? classes.completed : ""}`}>
                        <div className={classes.stepNumber}>
                            {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
                        </div>
                        <span className={classes.stepLabel}>
                            {s === 1 && "Intake"}
                            {s === 2 && "Program"}
                            {s === 3 && "Details"}
                            {s === 4 && "Payment"}
                        </span>
                    </div>
                ))}
            </div>

            <div className={classes.formCard}>
                <AnimatePresence mode="wait">
                    {/* STEP 1: COHORT SELECTION */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className={classes.stepContent}
                        >
                            <div className={classes.headerIcon}><Sparkles className="w-8 h-8 text-blue-500" /></div>
                            <h2>Choose Your Intake Period</h2>
                            <p>Select an upcoming cohort to begin your transformational journey.</p>

                            <div className={classes.cardGrid}>
                                {cohorts.length === 0 ? (
                                    <div className={classes.emptyState}>No active cohorts available for enrollment at this time.</div>
                                ) : (
                                    cohorts.map(cohort => (
                                        <div
                                            key={cohort.id}
                                            onClick={() => setSelectedCohortId(cohort.id)}
                                            className={`${classes.selectionCard} ${selectedCohortId === cohort.id ? classes.cardActive : ""}`}
                                        >
                                            <div className={classes.cardHeader}>
                                                <span className={classes.cohortBadge}>{cohort.label || "Academy Intake"}</span>
                                                {selectedCohortId === cohort.id && <CheckCircle2 className="w-5 h-5 text-blue-500" />}
                                            </div>
                                            <h3 className={classes.cardTitle}>{cohort.name}</h3>
                                            <div className={classes.cardMeta}>
                                                <div className={classes.metaItem}><Calendar className="w-3.5 h-3.5" /> Starts: {new Date(cohort.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                                                <div className={classes.metaItem}><Clock className="w-3.5 h-3.5" /> Deadline: {new Date(cohort.enrollment_deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className={classes.actionFooter}>
                                <button
                                    disabled={!isStep1Valid}
                                    onClick={nextStep}
                                    className={classes.primaryBtn}
                                >
                                    Select Intake <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: PROGRAM SELECTION */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className={classes.stepContent}
                        >
                            <div className={classes.headerIcon}><BookOpen className="w-8 h-8 text-purple-500" /></div>
                            <h2>Select Your Specialization</h2>
                            <p>Pick a high-demand tech path for the <strong>{selectedCohort?.name}</strong>.</p>

                            <div className={classes.cardGrid}>
                                {programs.map(prog => (
                                    <div
                                        key={prog.id}
                                        onClick={() => setSelectedProgramId(prog.id)}
                                        className={`${classes.selectionCard} ${selectedProgramId === prog.id ? classes.cardActive : ""}`}
                                    >
                                        <div className={classes.cardHeader}>
                                            <span className={classes.progBadge}>{prog.duration}</span>
                                            {selectedProgramId === prog.id && <CheckCircle2 className="w-5 h-5 text-purple-500" />}
                                        </div>
                                        <h3 className={classes.cardTitle}>{prog.name}</h3>
                                        <p className={classes.cardDesc}>{prog.short_description}</p>
                                        <div className={classes.cardPrice}>
                                            {prog.discount_price ? (
                                                <>
                                                    <span className={classes.amount}>₦{Number(prog.discount_price).toLocaleString()}</span>
                                                    <span className={classes.oldAmount}>₦{Number(prog.price).toLocaleString()}</span>
                                                </>
                                            ) : (
                                                <span className={classes.amount}>₦{Number(prog.price).toLocaleString()}</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className={classes.actionFooterRow}>
                                <button onClick={prevStep} className={classes.backBtn}><ArrowLeft className="w-4 h-4" /> Back</button>
                                <button
                                    disabled={!isStep2Valid}
                                    onClick={nextStep}
                                    className={classes.primaryBtn}
                                >
                                    {user ? "Continue" : "Login to Enroll"} <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: USER DETAILS */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className={classes.stepContent}
                        >
                            <div className={classes.headerIcon}><User className="w-8 h-8 text-emerald-500" /></div>
                            <h2>Confirm Your Information</h2>
                            <p>Verify your details for <strong>{selectedProgram?.name}</strong> registration.</p>

                            <form onSubmit={handleSubmitEnrollment} className={classes.form}>
                                <div className={classes.inputField}>
                                    <label><User className="w-3.5 h-3.5" /> Full Name</label>
                                    <input
                                        type="text"
                                        name="full_name"
                                        value={formData.full_name}
                                        onChange={handleInputChange}
                                        placeholder="Your legal name"
                                        required
                                    />
                                </div>
                                <div className={classes.inputField}>
                                    <label><Mail className="w-3.5 h-3.5" /> Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        readOnly={!!user}
                                        className={user ? classes.readOnly : ""}
                                        placeholder="Your professional email"
                                        required
                                    />
                                </div>
                                <div className={classes.inputField}>
                                    <label><Phone className="w-3.5 h-3.5" /> Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="e.g. +234 810 000 0000"
                                        required
                                    />
                                </div>

                                <div className={classes.trustBadge}>
                                    <AlertCircle className="w-4 h-4" />
                                    <span>By proceeding, you agree to secure seat reservation.</span>
                                </div>

                                <div className={classes.actionFooterRow}>
                                    <button type="button" onClick={prevStep} className={classes.backBtn} disabled={isSubmitting}><ArrowLeft className="w-4 h-4" /> Back</button>
                                    <button
                                        type="submit"
                                        disabled={!isStep3Valid || isSubmitting}
                                        className={classes.submitBtn}
                                    >
                                        {isSubmitting ? "Processing..." : "Complete & Pay"} <Lock className="w-4 h-4 ml-2" />
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Context/Summary Footer */}
            {selectedCohort && step < 3 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={classes.selectionSummary}
                >
                    <div className={classes.summaryItem}>
                        <span className={classes.sLabel}>Selected Intake</span>
                        <span className={classes.sValue}>{selectedCohort.name}</span>
                    </div>
                    {selectedProgram && (
                        <div className={classes.summaryItem}>
                            <span className={classes.sLabel}>Selected Path</span>
                            <span className={classes.sValue}>{selectedProgram.name}</span>
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
}
