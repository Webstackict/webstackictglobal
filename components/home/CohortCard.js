import LinkWithProgress from "../ui/Link-with-progress";
import classes from "./CohortCard.module.css";
import IconRenderer from "../ui/icon-renderer";
import Badge from "../ui/badge";

export default function CohortCard({ cohort }) {
    const {
        id,
        label,
        start_date,
        max_size,
        departments
    } = cohort;

    const departmentName = departments?.name || "General";

    const formattedDate = new Date(start_date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    return (
        <div className={classes.card}>
            <div className={classes.cardHeader}>
                <div className={`${classes.iconBox} blue`}>
                    <IconRenderer iconName="rocket" />
                </div>
                <Badge title="Enrolling" />
            </div>

            <div className={classes.category}>{departmentName}</div>
            <h3 className={classes.cardTitle}>{label}</h3>

            <div className={classes.details}>
                <div className={classes.detailItem}>
                    <span className={classes.detailLabel}>Start Date:</span>
                    <span className={classes.detailValue}>{formattedDate}</span>
                </div>
                <div className={classes.detailItem}>
                    <span className={classes.detailLabel}>Max Students:</span>
                    <span className={classes.detailValue}>{max_size} Seats</span>
                </div>
                <div className={classes.detailItem}>
                    <span className={classes.detailLabel}>Duration:</span>
                    <span className={classes.detailValue}>12 Weeks</span>
                </div>
            </div>

            <LinkWithProgress
                href={`/programs/${id}`}
                className={classes.btn}
            >
                Apply Now
            </LinkWithProgress>
        </div>
    );
}
