"use client";
import { formatTimeAgo } from "@/util/util";
import classes from "./notifications.module.css";
import { use, useEffect } from "react";
import { NotificationsContext } from "@/store/notifications-context";

export default function Notifications({ items }) {
  const {
    notifications,
    setNotifications,
    unreadNotifications,
    setUnreadNotifications,
  } = use(NotificationsContext);

  useEffect(() => {
    setNotifications(items);
    setUnreadNotifications(false);
  }, []);

  return (
    <div className={classes.notifications}>
      <ul>
        {items.map((item, i) => (
          <li key={i} className={classes.notification}>
            <div className={classes.header}>
              <strong>{item.title}</strong>
              <span>{formatTimeAgo(item.created_at)}</span>
            </div>
            <div className={classes.message}>{item.message}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
