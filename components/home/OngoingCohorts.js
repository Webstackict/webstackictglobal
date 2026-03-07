"use client";

import { useState, useEffect } from "react";
import CohortCard from "./CohortCard";
import CohortSkeleton from "../ui/cohort-skeleton";
import classes from "./OngoingCohorts.module.css";
import cardClasses from "../cards/card-grid.module.css";
import SeeMoreButtonServer from "../ui/see-more-button server";

export default function OngoingCohorts() {
    const [cohorts, setCohorts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchCohorts() {
            try {
                const response = await fetch("/api/cohorts");
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.details || data.error || "Failed to fetch cohorts");
                }
                setCohorts(data);
            } catch (err) {
                console.error("Error fetching cohorts:", err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }

        fetchCohorts();
    }, []);

    if (isLoading) {
        return (
            <div className={classes.container}>
                <CohortSkeleton />
            </div>
        );
    }

    if (error) {
        return (
            <div className={classes.errorContainer}>
                <p className={classes.errorText}>
                    {error}
                </p>
                <p style={{ color: 'var(--gray-text-500)', fontSize: '0.875rem', marginTop: '-1rem', marginBottom: '1.5rem' }}>
                    Please verify your DATABASE_URL in .env and ensure your database is accessible.
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className={classes.retryBtn}
                >
                    Retry
                </button>
            </div>
        );
    }

    if (cohorts.length === 0) {
        return (
            <div className={classes.emptyContainer}>
                <p className={classes.emptyText}>
                    No ongoing cohort registrations! New cohorts will appear here as soon
                    as registration begins.
                </p>
            </div>
        );
    }

    return (
        <div className={classes.container}>
            <div className={`${cardClasses.grid} ${classes.grid}`}>
                {cohorts.map((cohort) => (
                    <CohortCard key={cohort.id} cohort={cohort} />
                ))}
            </div>
            <div style={{ marginTop: '3rem' }}>
                <SeeMoreButtonServer href="/programs/academy">
                    View all Departments
                </SeeMoreButtonServer>
            </div>
        </div>
    );
}
