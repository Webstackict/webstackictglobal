import IconRenderer from "../ui/icon-renderer";
import classes from "./program-card.module.css";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LinkWithProgress from "../ui/Link-with-progress";

export default function ProgramCard({ title, slug, duration, description, icon, price, discountPrice }) {
    return (
        <div className={classes.card}>
            <div className={classes.iconWrapper}>
                <IconRenderer iconName={icon} />
            </div>
            <div className={classes.durationBadge}>{duration}</div>
            <h3 className={classes.title}>{title}</h3>
            <p className={classes.description}>{description}</p>

            {(price || discountPrice) && (
                <div className={classes.priceContainer}>
                    {discountPrice ? (
                        <>
                            <span className={classes.discountPrice}>₦{discountPrice.toLocaleString()}</span>
                            <span className={classes.originalPrice}>₦{price.toLocaleString()}</span>
                        </>
                    ) : (
                        <span className={classes.price}>₦{price.toLocaleString()}</span>
                    )}
                </div>
            )}

            <div className={classes.buttonContainer}>
                <LinkWithProgress href={`/programs/academy/${slug}`} className={classes.curriculumBtn}>
                    View Curriculum <ArrowForwardIcon sx={{ fontSize: 16 }} />
                </LinkWithProgress>
            </div>
        </div>
    );
}
