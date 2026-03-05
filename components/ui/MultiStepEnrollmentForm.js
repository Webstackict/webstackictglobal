"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { enrollStudent } from "@/lib/actions/enroll-student";
import { programs } from "@/lib/contents/programs-data";
import classes from "./multi-step-enrollment-form.module.css";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CodeIcon from '@mui/icons-material/Code';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Link from 'next/link';
const COHORT_MONTHS = ["March", "April", "May", "June"];

export default function MultiStepEnrollmentForm({ cohorts = [] }) {
    const searchParams = useSearchParams();
    const [step, setStep] = useState(1);
    const [selectedMonth, setSelectedMonth] = useState(searchParams.get("label")?.split(' ')[0] || "");
    const [selectedProgram, setSelectedProgram] = useState(searchParams.get("program") || "");
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        phone: ""
    });

    // Derived data
    const filteredCohorts = useMemo(() => {
        return cohorts.filter(c => c.label.startsWith(selectedMonth));
    }, [cohorts, selectedMonth]);

    const urlCohortId = searchParams.get("cohortId");
    const activeCohortId = urlCohortId || filteredCohorts[0]?.id;

    const [isPending, setIsPending] = useState(false);

    const programInfo = useMemo(() => {
        return programs.find(p => p.title === selectedProgram);
    }, [selectedProgram]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsPending(true);

        try {
            const currentFormData = new FormData(e.target);
            const response = await enrollStudent(null, currentFormData);

            if (response?.success) {
                toast.success("Registration successful!");
                setTimeout(() => {
                    setStep(4);
                }, 500);
            } else if (response?.success === false) {
                toast.error(response.message || "Registration failed. Please check your details.");
            }
        } catch (error) {
            toast.error("An unexpected error occurred. Please try again.");
            console.error(error);
        } finally {
            setIsPending(false);
        }
    };

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

    const isStep1Valid = selectedMonth !== "";
    const isStep2Valid = selectedProgram !== "";
    const isStep3Valid = formData.full_name && formData.email && formData.phone && activeCohortId;

    return (
        <div className={classes.container}>
            {/* Progress Header */}
            <div className={classes.progressHeader}>
                {[1, 2, 3, 4].map((s) => (
                    <div key={s} className={`${classes.progressStep} ${step >= s ? classes.active : ""} ${step > s ? classes.completed : ""}`}>
                        <div className={classes.stepNumber}>
                            {step > s ? <CheckCircleOutlineIcon fontSize="small" /> : s}
                        </div>
                        <span className={classes.stepLabel}>
                            {s === 1 && "Choose Cohort"}
                            {s === 2 && "Choose Program"}
                            {s === 3 && "Your Details"}
                            {s === 4 && "Payment"}
                        </span>
                    </div>
                ))}
            </div>

            <div className={classes.formCard}>
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, scale: 0.98, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, y: -10 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                            <div className={classes.stepContent}>
                                <h2>Enroll in the Next Cohort</h2>
                                <p>Choose your program and begin your journey into tech with Webstack ICT Global.</p>

                                <div className={classes.inputGroup}>
                                    <label>Cohort Selection</label>
                                    <select
                                        className={classes.selectInput}
                                        value={selectedMonth}
                                        onChange={(e) => setSelectedMonth(e.target.value)}
                                    >
                                        <option value="" disabled>Select cohort intake...</option>
                                        {COHORT_MONTHS.map(month => (
                                            <option key={month} value={month}>{month} Cohort</option>
                                        ))}
                                    </select>
                                </div>

                                <div className={classes.actionsColumn}>
                                    <button
                                        type="button"
                                        className={classes.primaryBtn}
                                        disabled={!isStep1Valid}
                                        onClick={nextStep}
                                    >
                                        Continue <ArrowForwardIcon fontSize="small" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, scale: 0.98, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, y: -10 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                            <div className={classes.stepContent}>
                                <h2>Select Your Program</h2>
                                <p>Choose an intensive specialization for the <strong>{selectedMonth} Cohort</strong>.</p>

                                <div className={classes.inputGroup}>
                                    <label>Program Selection</label>
                                    <select
                                        className={classes.selectInput}
                                        value={selectedProgram}
                                        onChange={(e) => setSelectedProgram(e.target.value)}
                                    >
                                        <option value="" disabled>Select a program...</option>
                                        {programs.map(p => (
                                            <option key={p.title} value={p.title}>{p.title}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className={classes.actionsRow}>
                                    <button type="button" className={classes.backBtn} onClick={prevStep}>
                                        <ArrowBackIcon fontSize="small" /> Back
                                    </button>
                                    <button
                                        type="button"
                                        className={classes.primaryBtn}
                                        disabled={!isStep2Valid}
                                        onClick={nextStep}
                                        style={{ flex: 2 }}
                                    >
                                        Continue <ArrowForwardIcon fontSize="small" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, scale: 0.98, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, y: -10 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                            <div className={classes.stepContent}>
                                <h2>Your Details</h2>
                                <p>Provide your contact information for the <strong>{selectedProgram}</strong> enrollment.</p>

                                <form onSubmit={handleSubmit} className={classes.form}>
                                    <input type="hidden" name="cohort_id" value={activeCohortId || ""} />
                                    <input type="hidden" name="program" value={selectedProgram} />

                                    <div className={classes.inputGroup}>
                                        <label htmlFor="full_name">Legal Full Name</label>
                                        <div className={classes.inputWrapper}>
                                            <PersonOutlineIcon className={classes.inputIcon} fontSize="small" />
                                            <input
                                                id="full_name"
                                                type="text"
                                                name="full_name"
                                                placeholder="As it appears on your ID"
                                                required
                                                value={formData.full_name}
                                                onChange={handleInputChange}
                                                className={classes.iconInput}
                                            />
                                        </div>
                                    </div>
                                    <div className={classes.inputGroup}>
                                        <label htmlFor="email">Email Address</label>
                                        <div className={classes.inputWrapper}>
                                            <EmailOutlinedIcon className={classes.inputIcon} fontSize="small" />
                                            <input
                                                id="email"
                                                type="email"
                                                name="email"
                                                placeholder="Professional email preferred"
                                                required
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className={classes.iconInput}
                                            />
                                        </div>
                                    </div>
                                    <div className={classes.inputGroup}>
                                        <label htmlFor="phone">Mobile Number</label>
                                        <div className={classes.inputWrapper}>
                                            <PhoneOutlinedIcon className={classes.inputIcon} fontSize="small" />
                                            <input
                                                id="phone"
                                                type="tel"
                                                name="phone"
                                                placeholder="e.g. +234 800 000 0000"
                                                required
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className={classes.iconInput}
                                            />
                                        </div>
                                    </div>

                                    <div className={classes.actionsRow}>
                                        <button type="button" className={classes.backBtn} onClick={prevStep} disabled={isPending}>
                                            <ArrowBackIcon fontSize="small" /> Back
                                        </button>
                                        <button type="submit" className={classes.primaryBtn} style={{ flex: 2 }} disabled={isPending || !(formData.full_name && formData.email && formData.phone)}>
                                            {isPending ? (
                                                <span className={classes.loadingDots}>Submitting</span>
                                            ) : (
                                                <>Continue to Program Details</>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    )}

                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, scale: 0.98, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, y: -10 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                            <div className={classes.stepContent}>
                                <div className={classes.successHeader}>
                                    <div className={classes.successIconWrapper}>
                                        <CheckCircleOutlineIcon color="success" fontSize="large" className={classes.successIcon} />
                                    </div>
                                    <h2>Registration Complete</h2>
                                    <p className={classes.successSubtext}>Your application for the <strong>{selectedMonth} Cohort</strong> is confirmed.</p>
                                </div>

                                <div className={classes.summaryCard}>
                                    <div className={classes.summaryHeader}>
                                        <div className={classes.summaryHeaderLeft}>
                                            <span className={classes.summaryLabel}>Program Outline</span>
                                            <h3 className={classes.summaryTitle}>{selectedProgram}</h3>
                                        </div>
                                        <div className={classes.summaryPrice}>
                                            ₦250,000
                                        </div>
                                    </div>

                                    <div className={classes.summaryBody}>
                                        <div className={classes.summaryDetailGrid}>
                                            <div className={classes.detailItem}>
                                                <AccessTimeIcon fontSize="small" className={classes.detailIcon} />
                                                <div className={classes.detailTextGroup}>
                                                    <span className={classes.detailLabel}>Duration</span>
                                                    <span className={classes.detailValue}>3 Months Intensive</span>
                                                </div>
                                            </div>
                                            <div className={classes.detailItem}>
                                                <CalendarTodayIcon fontSize="small" className={classes.detailIcon} />
                                                <div className={classes.detailTextGroup}>
                                                    <span className={classes.detailLabel}>Intake</span>
                                                    <span className={classes.detailValue}>{selectedMonth} 2026</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={classes.curriculumSection}>
                                            <div className={classes.listColumn}>
                                                <h4 className={classes.listHeading}><MenuBookIcon fontSize="small" className={classes.listIcon} /> Modules</h4>
                                                <ul className={classes.cleanList}>
                                                    {programInfo?.curriculum?.slice(0, 4).map(item => <li key={item}><CheckCircleIcon fontSize="inherit" className={classes.checkIcon} /> <span>{item}</span></li>) || <li><CheckCircleIcon fontSize="inherit" className={classes.checkIcon} /> <span>Intensive project modules.</span></li>}
                                                </ul>
                                            </div>
                                            <div className={classes.listColumn}>
                                                <h4 className={classes.listHeading}><CodeIcon fontSize="small" className={classes.listIcon} /> Skills</h4>
                                                <ul className={classes.cleanList}>
                                                    {programInfo?.skills?.slice(0, 4).map(skill => <li key={skill}><CheckCircleIcon fontSize="inherit" className={classes.checkIcon} /> <span>{skill}</span></li>) || <li><CheckCircleIcon fontSize="inherit" className={classes.checkIcon} /> <span>Core fundamentals.</span></li>}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className={classes.paymentFooter}>
                                    <p className={classes.secureText}><LockOutlinedIcon fontSize="small" /> Secure Paystack Processing</p>
                                    <Link
                                        href="/dashboard"
                                        className={classes.payBtn}
                                        style={{ textDecoration: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                                    >
                                        Proceed to Dashboard for Full Payment <ArrowForwardIcon fontSize="small" />
                                    </Link>

                                    <Link
                                        href={`/programs/academy/${selectedProgram.toLowerCase().replace(/[^a-z0-9]+/gi, '-')}`}
                                        className={classes.readMoreLink}
                                        target="_blank"
                                    >
                                        Read full program details <OpenInNewIcon fontSize="inherit" />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
