import Cohortscard from "./cohorts-card";
import classes from "./card-grid.module.css";

export default function CardGrid({ items, className = undefined, label = null }) {
  const gridTemplate = `${className} ${classes.grid}`;
  return (
    <div className={gridTemplate}>
      {items.map((item, index) => (
        <Cohortscard
          key={index}
          label={label}
          slug={item.slug}
          departmentName={item.name}
          departmentDescription={item.description}
          nextCohort={item.nextCohort}
          duration={item.duration}
          fee={item.fee}
          spotsLeft={item.spotsLeft}
          maxSize={item.maxSize}
          status={item.status}
          departmentIcon={item.icon}
          departmentTheme={item.theme}
        />
      ))}
    </div>
  );
}
