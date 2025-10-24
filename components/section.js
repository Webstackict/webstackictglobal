import SectionHeader from "@/components/section-header";
import classes from "./section.module.css";

export default function Section({
  label,
  title,
  subtitle,
  sectionBgColor = null,
  children,
}) {
  return (
    <section id={label} className={`${classes.section} ${sectionBgColor}`}>
      <div className={classes.container}>
        {title && <SectionHeader title={title} subtitle={subtitle} />}
        {children}
      </div>
    </section>
  );
}
