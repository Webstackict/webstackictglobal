import { authorityData } from "@/lib/contents/authorityData";
import AuthorityCard from "./authority-card";
import classes from "./authority-grid.module.css";

export default function AuthorityGrid() {
    return (
        <div className={classes.grid}>
            {authorityData.map((item, index) => (
                <AuthorityCard
                    key={index}
                    title={item.title}
                    description={item.description}
                    icon={item.icon}
                />
            ))}
        </div>
    );
}
