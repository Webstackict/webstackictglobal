import { prisma } from "@/lib/prisma";
import PageBanner from "@/components/hero/page-banner";
import Section from "@/components/section";
import Tagline from "@/components/ui/tagline";
import { formatDate } from "@/util/util";
import { notFound } from "next/navigation";
import ProgramApplicationForm from "@/components/home/ProgramApplicationForm";
import classes from "./page.module.css";

export async function generateMetadata({ params }) {
    const { id } = await params;

    try {
        const cohort = await prisma.cohorts.findUnique({
            where: { id },
            include: { departments: true },
        });

        if (!cohort) {
            return {
                title: "Program Not Found | Webstack",
            };
        }

        return {
            title: `${cohort.label || cohort.departments.name} - Cohort ${cohort.cohort_number} | Webstack ICT Global`,
            description: `Enroll in our ${cohort.label || cohort.departments.name} program (Cohort ${cohort.cohort_number}). Starting ${formatDate(cohort.start_date)}. Secure your spot today!`,
        };
    } catch (error) {
        return {
            title: "Program | Webstack",
        };
    }
}

export default async function ProgramDetailPage({ params }) {
    const { id } = await params;

    let cohort;
    try {
        cohort = await prisma.cohorts.findUnique({
            where: { id },
            include: { departments: true },
        });
    } catch (error) {
        console.error("Error fetching cohort detail:", error);
        throw new Error("Failed to load program details");
    }

    if (!cohort) {
        notFound();
    }

    const {
        label,
        cohort_number,
        start_date,
        graduation_date,
        enrollment_deadline,
        max_size,
        departments,
    } = cohort;

    return (
        <>
            <PageBanner
                title={
                    <>
                        {label || `${departments.name} Program`} <span className="gradientText">Cohort {cohort_number}</span>
                    </>
                }
                subtitle={`${departments.description || `Master ${departments.name} with our hands-on industry-led training program. Join a community of tech excellence.`}`}
                tagline={<Tagline text={departments.name} icon="school" />}
                primaryBtnText="Enroll Now"
                primaryBtnRoute="#apply-form"
            />

            <Section
                label="program-details"
                title={
                    <>
                        Cohort <span className="gradientText">Specifications</span>
                    </>
                }
                subtitle="All the essential information you need to know about this upcoming training session."
            >
                <div className={classes.detailsGrid}>
                    <div className={classes.detailCard}>
                        <div className={classes.detailIcon}>📅</div>
                        <h3>Start Date</h3>
                        <p>{formatDate(start_date)}</p>
                    </div>
                    <div className={classes.detailCard}>
                        <div className={classes.detailIcon}>🎓</div>
                        <h3>Graduation Date</h3>
                        <p>{formatDate(graduation_date)}</p>
                    </div>
                    <div className={classes.detailCard}>
                        <div className={classes.detailIcon}>⏰</div>
                        <h3>Enrollment Deadline</h3>
                        <p>{formatDate(enrollment_deadline)}</p>
                    </div>
                    <div className={classes.detailCard}>
                        <div className={classes.detailIcon}>🔢</div>
                        <h3>Cohort Number</h3>
                        <p>#{cohort_number}</p>
                    </div>
                    <div className={classes.detailCard}>
                        <div className={classes.detailIcon}>👥</div>
                        <h3>Maximum Capacity</h3>
                        <p>{max_size} Students</p>
                    </div>
                    <div className={classes.detailCard}>
                        <div className={classes.detailIcon}>⚡</div>
                        <h3>Current Status</h3>
                        <p className={`${classes.statusBadge} ${classes[cohort.status] || ''}`}>{cohort.status}</p>
                    </div>
                </div>

                <div id="apply-form">
                    <ProgramApplicationForm
                        cohortId={id}
                        cohortLabel={label || `${departments.name} Program`}
                    />
                </div>
            </Section>
        </>
    );
}
