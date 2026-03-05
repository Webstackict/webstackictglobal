import { Suspense } from "react";
import MultiStepEnrollmentForm from "@/components/ui/MultiStepEnrollmentForm";
import classes from "./page.module.css";
import { getEnrollingCohorts } from "@/lib/db/get-active-cohorts";

export const metadata = {
    title: "Enroll in Next Tech Cohort | Webstack ICT Global",
    description: "Start your journey in tech with hands-on training and expert mentorship. Secure your seat in our upcoming cohort today.",
};

export const dynamic = 'force-dynamic';

export default async function EnrollmentPage() {
    const { data: cohorts, error } = await getEnrollingCohorts();

    return (
        <main className={classes.pageWrapper}>
            <div className={classes.container}>
                <header className={classes.header}>
                    <h1 className={classes.title}>
                        Portal to Your <span className="gradientText">Future in Tech</span>
                    </h1>
                    <p className={classes.subtitle}>
                        Complete our simplified enrollment process to join our elite training programs.
                    </p>
                </header>
                <Suspense fallback={<div style={{ textAlign: 'center', padding: '2rem' }}>Loading enrollment form...</div>}>
                    <MultiStepEnrollmentForm cohorts={cohorts || []} />
                </Suspense>
            </div>
        </main>
    );
}
