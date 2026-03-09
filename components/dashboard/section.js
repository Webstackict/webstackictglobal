"use client";

import classes from "./section.module.css";
import Button from "./button";

export default function Section({
  label,
  title,
  description,
  buttonText = null,
  buttonIcon = null,
  href = null,
  children,
}) {
  return (
    <section id={label} className={classes.dashboardSection}>
      {title && (
        <div className={classes.sectionHeader}>
          <div>
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
          {buttonText && (
            <Button text={buttonText} icon={buttonIcon} href={href} />
          )}
        </div>
      )}

      {children}
    </section>
  );
}
