import { programs } from "@/lib/contents/programs-data";
import ProgramCard from "./program-card";
import classes from "./programs-grid.module.css";

export default function ProgramsGrid({ featuredTitles = [] }) {
    const displayedPrograms = featuredTitles.length > 0
        ? programs.filter(p => featuredTitles.includes(p.title))
        : programs;

    return (
        <div className={classes.grid}>
            {displayedPrograms.map((program) => (
                <ProgramCard
                    key={program.title}
                    title={program.title}
                    slug={program.slug}
                    duration={program.duration}
                    description={program.description}
                    icon={program.icon}
                    price={program.price}
                    discountPrice={program.discount_price}
                />
            ))}
        </div>
    );
}
