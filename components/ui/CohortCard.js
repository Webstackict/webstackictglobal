"use client";

import classes from "./cohort-card.module.css";
import { formatDate } from "@/util/util";

export default function CohortCard({ cohort }) {
    const { label, start_date, duration, fee, onsite_seats, online_seats, department } = cohort;

    return (
        <div className={classes.card}>
            <div className={classes.badge}>{label}</div>
            <h3 className={classes.programName}>{department?.name || "Webstack Program"}</h3>
            <div className={classes.details}>
                <div className={classes.detail}>
                    <span className={classes.label}>Start Date:</span>
                    <span className={classes.value}>{formatDate(start_date)}</span>
                </div>
                <div className={classes.detail}>
                    <span className={classes.label}>Duration:</span>
                    <span className={classes.value}>{duration} Months</span>
                </div>
                <div className={classes.detail}>
                    <span className={classes.label}>Fee:</span>
                    <span className={classes.value}>₦{fee.toLocaleString()}</span>
                </div>
                <div className={classes.seats}>
                    <span className={classes.label}>Seats:</span>
                    <span className={classes.value}>
                        {onsite_seats} Onsite / {online_seats} Online
                    </span>
                </div>
            </div>
        </div>
    );
}
