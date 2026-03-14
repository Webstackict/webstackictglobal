"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
    CheckCircle2, ArrowRight, ArrowLeft, User, Mail,
    Phone, Clock, Calendar, BookOpen, Lock,
    ChevronRight, AlertCircle, LogIn, Sparkles,
    ShieldCheck, Globe, MapPin, Ticket, CreditCard, Landmark
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getRegistrationCountdown } from "@/lib/util/cohort-dates";
import classes from "./multi-step-enrollment-form.module.css";
import Link from 'next/link';

export default function MultiStepEnrollmentForm({ cohorts = [] }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const supabase = createClient();

    const [step, setStep] = useState(1);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [selectedIntakeKey, setSelectedIntakeKey] = useState("");
    const [selectedCohortId, setSelectedCohortId] = useState("");
    const [selectedProgramId, setSelectedProgramId] = useState("");
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        phone: "",
        country: "Nigeria",
        city: "",
        referral_code: searchParams.get('ref') || ""
    });
    const [paymentMethod, setPaymentMethod] = useState("card"); // card or bank

    // Check auth session
    useEffect(() => {
        const getSession = async () => {
            setIsLoading(true);
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                setUser(session.user);
                const { data: profile } = await supabase
                    .from('user_profile')
                    .select('full_name, phone, country, city')
                    .eq('user_id', session.user.id)
                    .maybeSingle();

                setFormData({
                    full_name: profile?.full_name || session.user.user_metadata?.full_name || "",
                    email: session.user.email || "",
                    phone: profile?.phone || "",
                    country: profile?.country || "Nigeria",
                    city: profile?.city || "",
                    referral_code: searchParams.get('ref') || ""
                });
            }
            setIsLoading(false);
        };
        getSession();
    }, [searchParams]);

    // Grouping Cohorts by Month/Year
    const groupedIntakes = useMemo(() => {
        const groups = {};
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        cohorts.forEach(c => {
            const key = (c.month && c.year) ? `${c.month}-${c.year}` : c.id;
            if (!groups[key]) {
                groups[key] = {
                    key,
                    name: (c.month && c.year) ? `${monthNames[c.month - 1]} ${c.year} Cohort` : (c.name || "Special Cohort"),
                    label: (c.month && c.year) ? `${monthNames[c.month - 1].toUpperCase()} COHORT` : (c.label || "COHORT"),
                    start_date: c.start_date,
                    deadline: c.enrollment_deadline,
                    cohorts: []
                };
            }
            groups[key].cohorts.push(c);
            // Use earliest dates
            if (new Date(c.start_date) < new Date(groups[key].start_date)) groups[key].start_date = c.start_date;
            if (new Date(c.enrollment_deadline) < new Date(groups[key].deadline)) groups[key].deadline = c.enrollment_deadline;
        });
        return Object.values(groups);
    }, [cohorts]);

    const selectedIntake = useMemo(() => groupedIntakes.find(i => i.key === selectedIntakeKey), [groupedIntakes, selectedIntakeKey]);

    const availablePrograms = useMemo(() => {
        if (!selectedIntake) return [];
        // Flatten programs from all cohorts in this intake
        const allProgs = selectedIntake.cohorts.flatMap(c => c.cohort_programs);

        // Deduplicate by program_id - if same program exists in multiple cohorts for same month, 
        // merge them or pick the best one.
        const uniqueProgs = {};
        allProgs.forEach(item => {
            if (!uniqueProgs[item.program_id] || (item.seat_limit - item.enrolled_count) > (uniqueProgs[item.program_id].seat_limit - uniqueProgs[item.program_id].enrolled_count)) {
                uniqueProgs[item.program_id] = item;
            }
        });

        return Object.values(uniqueProgs);
    }, [selectedIntake]);

    const selectedProgramData = useMemo(() => {
        if (!availablePrograms.length || !selectedProgramId) return null;
        return availablePrograms.find(p => p.program_id === selectedProgramId);
    }, [availablePrograms, selectedProgramId]);

    const [countdown, setCountdown] = useState(null);

    useEffect(() => {
        if (selectedIntake?.deadline) {
            const timer = setInterval(() => {
                setCountdown(getRegistrationCountdown(selectedIntake.deadline));
            }, 60000);
            setCountdown(getRegistrationCountdown(selectedIntake.deadline));
            return () => clearInterval(timer);
        }
    }, [selectedIntake]);

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
            const enrollRes = await fetch('/api/enrollments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: user?.id,
                    cohort_id: selectedCohortId,
                    program_id: selectedProgramId,
                    payment_method: paymentMethod,
                    ...formData
                })
            });

            const enrollData = await enrollRes.json();
            if (!enrollRes.ok) throw new Error(enrollData.error || "Failed to process enrollment");

            // Redirect to the unified payment summary page
            router.push(`/enroll/payment/${enrollData.id}`);

        } catch (error) {
            toast.error(error.message || "An error occurred during enrollment");
        } finally {
            setIsSubmitting(false);
        }
    };

    const isStep1Valid = !!selectedCohortId;
    const isStep2Valid = !!selectedProgramId && (selectedProgramData?.enrolled_count < selectedProgramData?.seat_limit);
    const isStep3Valid = !!(formData.full_name && formData.email && formData.phone && formData.country && formData.city);
    const isStep4Valid = !!paymentMethod;

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
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={classes.authCard}>
                    <div className={classes.lockCircle}><Lock className="w-8 h-8 text-blue-500" /></div>
                    <h2>Secure Enrollment</h2>
                    <p>A Webstack account is required to proceed. Please sign in or create an account.</p>
                    <div className={classes.authActions}>
                        <Link href="/auth?redirect=/enroll" className={classes.primaryBtn}><LogIn className="w-4 h-4 mr-2" /> Sign In</Link>
                        <Link href="/auth?view=signup&redirect=/enroll" className={classes.secondaryBtn}>Create Free Account</Link>
                    </div>
                    <div className={classes.authFooter}><CheckCircle2 className="w-4 h-4 text-emerald-500" /><span>Encrypted Session</span></div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className={classes.container}>
            <div className={classes.progressHeader}>
                {[1, 2, 3, 4].map((s) => (
                    <div key={s} className={`${classes.progressStep} ${step >= s ? classes.active : ""} ${step > s ? classes.completed : ""}`}>
                        <div className={classes.stepNumber}>{step > s ? <CheckCircle2 className="w-4 h-4" /> : s}</div>
                        <span className={classes.stepLabel}>
                            {s === 1 && "Cohort"}
                            {s === 2 && "Program"}
                            {s === 3 && "Details"}
                            {s === 4 && "Payment"}
                        </span>
                    </div>
                ))}
            </div>

            <div className={classes.formCard}>
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className={classes.stepContent}>
                            <div className={classes.headerIcon}><Sparkles className="w-8 h-8 text-blue-500" /></div>
                            <h2>STEP 1 — Select Cohort</h2>
                            <p>Choose your preferred intake month from our monthly cohort system.</p>

                            <div className={classes.cardGrid}>
                                {groupedIntakes.map(intake => (
                                    <div key={intake.key} onClick={() => setSelectedIntakeKey(intake.key)} className={`${classes.selectionCard} ${selectedIntakeKey === intake.key ? classes.cardActive : ""}`}>
                                        <div className={classes.cardHeader}>
                                            <span className={classes.cohortBadge}>{intake.label}</span>
                                            {selectedIntakeKey === intake.key && <CheckCircle2 className="w-5 h-5 text-blue-500" />}
                                        </div>
                                        <h3 className={classes.cardTitle}>{intake.name}</h3>
                                        <div className={classes.cardMeta}>
                                            <div className={classes.metaItem}><Calendar className="w-3.5 h-3.5" /> Starts: {new Date(intake.start_date).toLocaleDateString()}</div>
                                            <div className={classes.metaItem}><Clock className="w-3.5 h-3.5" /> Deadline: {new Date(intake.deadline).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                ))}
                                {groupedIntakes.length === 0 && (
                                    <div className={classes.emptyState}>No active cohorts found. Please check back later.</div>
                                )}
                            </div>

                            <div className={classes.actionFooter}>
                                <button disabled={!selectedIntakeKey} onClick={nextStep} className={classes.primaryBtn}>Next: Select Program <ArrowRight className="w-4 h-4" /></button>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className={classes.stepContent}>
                            <div className={classes.headerIcon}><BookOpen className="w-8 h-8 text-purple-500" /></div>
                            <h2>STEP 2 — Select Program</h2>
                            <p>Programs available in <strong>{selectedIntake?.name}</strong>.</p>

                            <div className={classes.cardGrid}>
                                {availablePrograms.map(item => (
                                    <div key={item.program.id} onClick={() => {
                                        setSelectedProgramId(item.program.id);
                                        setSelectedCohortId(item.cohort_id);
                                    }} className={`${classes.selectionCard} ${selectedProgramId === item.program.id ? classes.cardActive : ""}`}>
                                        <div className={classes.cardHeader}>
                                            <span className={classes.progBadge}>{item.program.duration}</span>
                                            {selectedProgramId === item.program.id && <CheckCircle2 className="w-5 h-5 text-purple-500" />}
                                        </div>
                                        <h3 className={classes.cardTitle}>{item.program.name}</h3>
                                        <p className={classes.cardDesc}>{item.program.short_description}</p>

                                        <div className={classes.pricingSection}>
                                            {item.pricing.isEarlyBirdActive ? (
                                                <>
                                                    <div className={classes.priceRow}>
                                                        <span className={classes.priceLabel}>Early Bird Price:</span>
                                                        <span className={classes.priceValue}>₦{Number(item.pricing.earlyBirdPrice).toLocaleString()}</span>
                                                    </div>
                                                    <div className={classes.priceRow}>
                                                        <span className={classes.priceLabel}>Regular Price:</span>
                                                        <span className={classes.oldPriceValue}>₦{Number(item.pricing.regularPrice).toLocaleString()}</span>
                                                    </div>
                                                    <div className={classes.earlyBirdAlert}>
                                                        <Sparkles className="w-3 h-3" />
                                                        <span>Early Bird Slots Remaining: {item.pricing.earlyBirdSlotsRemaining} out of {item.pricing.totalEarlyBirdSlots}</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className={classes.priceRow}>
                                                        <span className={classes.priceLabel}>Current Price:</span>
                                                        <span className={classes.priceValue}>₦{Number(item.pricing.regularPrice).toLocaleString()}</span>
                                                    </div>
                                                    <span className={classes.offerClosed}>Early Bird Offer Closed</span>
                                                </>
                                            )}
                                        </div>

                                        <div className={classes.cardMeta}>
                                            <div className={`${classes.metaItem} ${item.enrolled_count >= item.seat_limit ? 'text-red-400' : 'text-blue-400'}`}>
                                                <User className="w-3.5 h-3.5" />
                                                Seats Remaining: {Math.max(0, item.seat_limit - item.enrolled_count)} / {item.seat_limit}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {availablePrograms.length === 0 && (
                                    <div className={classes.emptyState}>No program available for this cohort yet.</div>
                                )}
                            </div>

                            <div className={classes.actionFooterRow}>
                                <button onClick={prevStep} className={classes.backBtn}><ArrowLeft className="w-4 h-4" /> Back</button>
                                <button disabled={!isStep2Valid} onClick={nextStep} className={classes.primaryBtn}>Next: Fill Details <ChevronRight className="w-4 h-4" /></button>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className={classes.stepContent}>
                            <div className={classes.headerIcon}><User className="w-8 h-8 text-emerald-500" /></div>
                            <h2>STEP 3 — Enrollment Details</h2>
                            <p>Finalize your profile information for enrollment.</p>

                            <div className={classes.form}>
                                <div className={classes.inputField}>
                                    <label><User className="w-3.5 h-3.5" /> Full Name</label>
                                    <input type="text" name="full_name" value={formData.full_name} onChange={handleInputChange} placeholder="Your legal name" required />
                                </div>
                                <div className={classes.inputField}>
                                    <label><Globe className="w-3.5 h-3.5" /> Country</label>
                                    <input type="text" name="country" value={formData.country} onChange={handleInputChange} placeholder="e.g. Nigeria" required />
                                </div>
                                <div className={classes.inputField}>
                                    <label><MapPin className="w-3.5 h-3.5" /> State / City</label>
                                    <input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="e.g. Lagos" required />
                                </div>
                                <div className={classes.inputField}>
                                    <label><Phone className="w-3.5 h-3.5" /> Phone Number</label>
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+234..." required />
                                </div>
                                <div className={classes.inputField}>
                                    <label><Ticket className="w-3.5 h-3.5" /> Referral Code (Optional)</label>
                                    <input type="text" name="referral_code" value={formData.referral_code} onChange={handleInputChange} placeholder="Code" />
                                </div>

                                <div className={classes.actionFooterRow}>
                                    <button onClick={prevStep} className={classes.backBtn}><ArrowLeft className="w-4 h-4" /> Back</button>
                                    <button disabled={!isStep3Valid} onClick={nextStep} className={classes.primaryBtn}>Next: Payment <ChevronRight className="w-4 h-4" /></button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 4 && (
                        <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className={classes.stepContent}>
                            <div className={classes.headerIcon}><CreditCard className="w-8 h-8 text-amber-500" /></div>
                            <h2>STEP 4 — Payment</h2>
                            <p>Summary for <strong>{selectedProgramData?.program.name}</strong></p>

                            <div className={classes.summaryBox}>
                                <div className={classes.summaryRow}><span>Cohort:</span> <span>{selectedIntake?.name}</span></div>
                                <div className={classes.summaryRow}><span>Program:</span> <span>{selectedProgramData?.program.name}</span></div>
                                <div className={classes.summaryRow}><span>Total Due:</span> <span className={classes.amount}>₦{Number(selectedProgramData?.pricing.currentPrice).toLocaleString()}</span></div>
                            </div>

                            <div className={classes.cardGrid} style={{ marginTop: '2rem' }}>
                                <div onClick={() => setPaymentMethod("card")} className={`${classes.selectionCard} ${paymentMethod === "card" ? classes.cardActive : ""}`}>
                                    <CreditCard className="w-6 h-6 mb-2" />
                                    <h3>Pay Online (Secure)</h3>
                                    <p className={classes.cardDesc}>Instant activation via Paystack (Card, Transfer, USSD)</p>
                                </div>
                                <div onClick={() => setPaymentMethod("bank")} className={`${classes.selectionCard} ${paymentMethod === "bank" ? classes.cardActive : ""}`}>
                                    <Landmark className="w-6 h-6 mb-2" />
                                    <h3>Bank Transfer</h3>
                                    <p className={classes.cardDesc}>Manual verification (Upload proof after transfer)</p>
                                </div>
                            </div>

                            <div className={classes.actionFooterRow}>
                                <button onClick={prevStep} className={classes.backBtn} disabled={isSubmitting}><ArrowLeft className="w-4 h-4" /> Back</button>
                                <button onClick={handleSubmitEnrollment} disabled={!isStep4Valid || isSubmitting} className={classes.submitBtn}>
                                    {isSubmitting ? "Processing..." : "Complete Enrollment"} <ShieldCheck className="w-4 h-4 ml-2" />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {selectedIntake && step < 4 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={classes.selectionSummary}>
                    <div className={classes.summaryItem}><span className={classes.sLabel}>Intake</span><span className={classes.sValue}>{selectedIntake.name}</span></div>
                    {countdown && !countdown.closed && (
                        <div className={classes.summaryItem}>
                            <span className={classes.sLabel}>Closes In</span>
                            <span className={classes.sValue} style={{ color: '#f87171' }}>{countdown.days}d {countdown.hours}h {countdown.minutes}m</span>
                        </div>
                    )}
                    {selectedProgramData && <div className={classes.summaryItem}><span className={classes.sLabel}>Path</span><span className={classes.sValue}>{selectedProgramData.program.name}</span></div>}
                </motion.div>
            )}
        </div>
    );
}
