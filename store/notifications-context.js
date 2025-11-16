"use client";

import { createContext, useState } from "react";

export const NotificationsContext = createContext();

export default function NotificationsContextProvider({
  items = [],
  isUnread,
  children,
}) {
  const [notifications, setNotifications] = useState(items);
  const [unreadNotifications, setUnreadNotifications] = useState(isUnread);

  const value = {
    notifications,
    unreadNotifications,
    setNotifications,
    setUnreadNotifications,
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}
