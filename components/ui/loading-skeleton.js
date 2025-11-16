import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import classes from "./loading-skeleton.module.css";

export function ProductCardSkeleton() {
  return (
    <div className={classes.cardImageContainer}>
      <Skeleton></Skeleton>
    </div>
  );
}

export function DepartmentsGridSkeleton({ count = 12, label }) {
  let className = classes.homeGrid;

  //   if (label && label === "product-grid") className = classes.productGrid;
  return (
    <div className={className}>
      {[...Array(count)].map((_, index) => (
        <div className={classes.card} key={index}>
          <div className={classes.header}>
            <Skeleton className={classes.iconBox} />
            <Skeleton className={classes.badge} />
          </div>

          <Skeleton className={classes.title} />
          <Skeleton className={classes.description} />

          <div className={classes.cohortDetailes}>
            <div className={classes.detail}>
              <Skeleton className={classes.left} />
              <Skeleton className={classes.right} />
            </div>
            <div className={classes.detail}>
              <Skeleton className={classes.leftt} />
              <Skeleton className={classes.right} />
            </div>
            <div className={classes.detail}>
              <Skeleton className={classes.left} />
              <Skeleton className={classes.right} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
