"use client";
import { formatTimeAgo } from "@/util/util";
import classes from "./notifications.module.css";
import { use, useEffect } from "react";
import { NotificationsContext } from "@/store/notifications-context";

export default function Notifications({ items = [] }) {
  const {
    notifications,
    setNotifications,
    unreadNotifications,
    setUnreadNotifications,
  } = use(NotificationsContext);

  useEffect(() => {
    setNotifications(items);
    setUnreadNotifications(false);
  }, [items, setNotifications, setUnreadNotifications]);

  return (
    <div className={classes.notifications}>
      {items?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-50">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <div>
            <p className="text-white font-medium">No notifications yet</p>
            <p className="text-xs text-gray-500">We&apos;ll notify you when something important happens.</p>
          </div>
        </div>
      ) : (
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
      )}
    </div>
  );
}
