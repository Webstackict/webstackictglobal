import Cohortscard from "./cohorts-card";
import classes from "./card-grid.module.css";

export default function CardGrid({
  items = [],
  className = undefined,
  label = null,
}) {
  if (items.length === 0) {
    if (label !== "departments") {
      return (
        <p className="no-data">
          No ongoing cohort registration! New cohorts will appear here as soon
          as registration begins.
        </p>
      );
    }

    return <p className="no-data">No departments available!</p>;
  }
  const gridTemplate = `${className} ${classes.grid}`;
  return (
    <div className={gridTemplate}>
      {items.map((item, index) => {
        const spotsLeft = item.max_size - item.number_enrolled;
        return (
          <Cohortscard
            key={index}
            label={label}
            slug={item.slug}
            departmentName={item.name || item.department_name}
            departmentDescription={item.description}
            nextCohort={item.next_cohort || item.start_date}
            duration={item.duration}
            fee={item.fee}
            spotsLeft={spotsLeft}
            maxSize={item.max_size}
            status={item.status}
            departmentIcon={item.icon}
            departmentTheme={item.theme}
          />
        );
      })}
    </div>
  );
}
