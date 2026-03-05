'use client'

import { iconsConfig } from "@/lib/icons/iconsConfig";
import classes from "./badge.module.css";
export default function Badge({ title, icon = null, eventBagdeStyle = null, ...props }) {
  const className = title?.replace(/\s+/g, "-") || "";

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
