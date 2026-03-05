import IconRenderer from "../ui/icon-renderer";
import classes from "./authority-card.module.css";

export default function AuthorityCard({ title, description, icon }) {
    return (
        <div className={classes.card}>
            <div className={classes.iconWrapper}>
                <IconRenderer iconName={icon} />
            </div>
            <h3 className={classes.title}>{title}</h3>
            <p className={classes.description}>{description}</p>
        </div>
    );
}
