"use client";
import React from "react";
import classes from "./quick-actions.module.css";
import { iconsConfig } from "@/lib/icons/iconsConfig";
import LinkWithProgress from "../ui/Link-with-progress";

export default function QuickActions() {
  const actions = [
    { icon: "calendar", text: "Join A Cohort", href: "/programs/academy" },
    { icon: "services", text: "Book A Service", href: "/services" },
    { icon: "support", text: "Get Support", href: "/contact" },
  ];

  return (
    <div className={classes.quickActions}>
      <h3 className={classes.title}>Quick Actions</h3>
      <div className={classes.actionsGrid}>
        {actions.map((action, idx) => {
          const Icon = iconsConfig[action.icon];
          return (
            <LinkWithProgress
              key={idx}
              href={action.href}
              className={classes.actionButton}
            >
              <div className={classes.iconWrapper}>
                <Icon className={classes.icon} />
              </div>
              <p className={classes.actionText}>{action.text}</p>
            </LinkWithProgress>
          );
        })}
      </div>
    </div>
  );
}
