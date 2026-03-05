"use client";

import { motion } from "framer-motion";
import EnrollmentForm from "@/components/ui/EnrollmentForm";
import CohortCard from "@/components/ui/CohortCard";
import classes from "@/app/(public)/enroll/page.module.css";

export default function EnrollmentContent({ cohorts }) {
    return (
        <div className={classes.container}>
            <motion.header
                className={classes.header}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h1 className={classes.title}>
                    Enroll in the <span className="gradientText">Next Tech Cohort</span>
                </h1>
                <p className={classes.subtitle}>
                    Start your journey in tech with hands-on training and expert mentorship.
                    Secure your seat in our upcoming cohort today.
                </p>
            </motion.header>

            {cohorts && cohorts.length > 0 && (
                <motion.div
                    className={classes.cohortsGrid}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    {cohorts.map((cohort) => (
                        <CohortCard key={cohort.id} cohort={cohort} />
                    ))}
                </motion.div>
            )}

            <motion.div
                className={classes.formContainer}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
            >
                <EnrollmentForm cohorts={cohorts} />
            </motion.div>
        </div>
    );
}
