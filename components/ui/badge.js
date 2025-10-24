import { iconsConfig } from "@/lib/icons/iconsConfig";
import classes from "./badge.module.css";
export default function Badge({ title, icon = null }) {
  const string = title;
  const className = string.replace(" ", "-");

  let Icon;

  if (icon !== null) {
    Icon = iconsConfig[icon];
  }

  return (
    <span className={`${className} ${classes.badge}`}>
     {icon !== null && <Icon />}
      {title}
    </span>
  );
}
