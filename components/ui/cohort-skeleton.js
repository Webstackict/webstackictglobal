import classes from "./cohort-skeleton.module.css";

export default function CohortSkeleton() {
    return (
        <div className={classes.skeletonGrid}>
            {[...Array(3)].map((_, i) => (
                <div key={i} className={classes.skeletonCard}>
                    <div className={classes.skeletonImage}></div>
                    <div className={classes.skeletonContent}>
                        <div className={classes.skeletonTitle}></div>
                        <div className={classes.skeletonDescription}></div>
                        <div className={classes.skeletonFooter}></div>
                    </div>
                </div>
            ))}
        </div>
    );
}
