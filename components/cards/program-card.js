import IconRenderer from "../ui/icon-renderer";
import classes from "./program-card.module.css";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LinkWithProgress from "../ui/Link-with-progress";

export default function ProgramCard({ title, duration, description, icon }) {
    return (
        <div className={classes.card}>
            <div className={classes.iconWrapper}>
                <IconRenderer iconName={icon} />
            </div>
            <div className={classes.durationBadge}>{duration}</div>
            <h3 className={classes.title}>{title}</h3>
            <p className={classes.description}>{description}</p>
            <div className={classes.buttonContainer}>
                <LinkWithProgress href="/programs/academy" className={classes.curriculumBtn}>
                    View Curriculum <ArrowForwardIcon sx={{ fontSize: 16 }} />
                </LinkWithProgress>
            </div>
        </div>
    );
}
