'use client'

import { iconsConfig } from "@/lib/icons/iconsConfig";
import classes from "./badge.module.css";
export default function Badge({ title, icon = null, eventBagdeStyle=null, ...props }) {
  const string = title;
  const className = string.replace(" ", "-");

  let Icon;

  if (icon !== null) {
    Icon = iconsConfig[icon];
  }

  return (
    <span className={` ${eventBagdeStyle} ${className} ${classes.badge}`} {...props}>
      {icon !== null && <Icon />}
      {title}
    </span>
  );
}
