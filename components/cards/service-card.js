import classes from "./service-card.module.css";
import CheckIcon from "@mui/icons-material/Check";

import SmallButton from "../ui/small-button";
import LinkWithProgress from "../ui/Link-with-progress";
import IconRenderer from "../ui/icon-rederer";

export default function ServiceCard({
  title,
  description,
  incentives,
  icon,
  theme,
}) {
  // const ServiceIcon = iconsConfig[icon];
  const isTitle = title.includes("training programs");

  return (
    <div className={classes.card}>
      <div className={`${classes.icon} ${theme.background}`}>
        <IconRenderer iconName={icon}/>
    
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      <ul>
        {incentives.map((incentive, index) => (
          <li key={index}>
            <CheckIcon className={`${theme.color}`} /> {incentive}
          </li>
        ))}
      </ul>
      <div className={classes.buttonContainer}>
        {isTitle ? (
          <LinkWithProgress
            href="/programs/academy"
            className={theme.background}
          >
            View Programs
          </LinkWithProgress>
        ) : (
          <LinkWithProgress className={theme.background} href="/contact#contact-form">
            Get Quote
          </LinkWithProgress>
        )}
      </div>
    </div>
  );
}
