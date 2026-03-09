"use client";

import { useActionState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { enrollStudent } from "@/lib/actions/enroll-student";
import classes from "./enrollment-form.module.css";
import { toast } from "sonner";

const programs = [
    "Software Engineering",
    "Web Development",
    "Cybersecurity",
    "Data Analytics",
    "UI/UX Design",
    "AI Automation",
    "Digital Marketing",
    "Forex Trading",
    "Mobile App Development",
    "DevOps",
    "Cloud Computing",
];

export default function EnrollmentForm({ cohorts = [] }) {
    const [state, action, isPending] = useActionState(enrollStudent, null);
    const searchParams = useSearchParams();

    const preSelectedCohort = searchParams.get("cohortId");
    const preSelectedProgram = searchParams.get("program");

    useEffect(() => {
        if (state?.success) {
            toast.success(state.message);
        } else if (state?.success === false) {
            toast.error(state.message);
        }
    }, [state]);

    return (
        <div className={classes.formCard}>
            <form action={action} className={classes.form}>
                <div className={classes.inputGroup}>
                    <label htmlFor="full_name">Full Name</label>
                    <input
                        type="text"
                        id="full_name"
                        name="full_name"
                        placeholder="John Doe"
                        required
                        disabled={isPending}
                    />
                </div>

                <div className={classes.inputGroup}>
                    <label htmlFor="email">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="john@example.com"
                        required
                        disabled={isPending}
                    />
                </div>

                <div className={classes.inputGroup}>
                    <label htmlFor="phone">Phone Number</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        placeholder="+234 000 000 0000"
                        required
                        disabled={isPending}
                    />
                </div>

                <div className={classes.selectGroup}>
                    <label htmlFor="program">Select Program</label>
                    <select id="program" name="program" required disabled={isPending} defaultValue={preSelectedProgram || ""}>
                        <option value="">Choose a program</option>
                        {programs.map((program) => (
                            <option key={program} value={program}>
                                {program}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={classes.selectGroup}>
                    <label htmlFor="cohort_id">Select Cohort</label>
                    <select id="cohort_id" name="cohort_id" required disabled={isPending} defaultValue={preSelectedCohort || ""}>
                        <option value="">Choose a cohort</option>
                        {cohorts.map((cohort) => (
                            <option key={cohort.id} value={cohort.id}>
                                {cohort.department?.name || "Premium Program"} - {cohort.label} - Starts {cohort.start_date}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={classes.inputGroup}>
                    <label htmlFor="referral_code">Referral Code (Optional)</label>
                    <input
                        type="text"
                        id="referral_code"
                        name="referral_code"
                        placeholder="ABC123XYZ"
                        disabled={isPending}
                        defaultValue={typeof document !== 'undefined' ? document.cookie.split('; ').find(row => row.startsWith('webstack_referral_code='))?.split('=')[1] : ""}
                    />
                </div>

                <button type="submit" className={classes.submitBtn} disabled={isPending}>
                    {isPending ? "Securing Your Seat..." : "Secure My Seat"}
                </button>
            </form>
        </div>
    );
}
