import classes from "./cta-cards.module.css";

import { iconsConfig } from "@/lib/icons/iconsConfig";

export default function CTACards({ content }) {
  const Icon = iconsConfig[content.icon];
  return (
    <div className={classes.highlight}>
      <div className={`${classes.iconWrapper} ${content.theme}`}>
        <Icon />
      </div>
      <h3>{content.title}</h3>
      <p className={classes.gradientText}>{content.value}</p>
    </div>
  );
}
