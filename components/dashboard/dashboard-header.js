"use client";
import { use, useEffect } from "react";
import classes from "./dashboard-header.module.css";
import { UserContext } from "@/store/user-context";
import { DashboardSidebarContext } from "@/store/dashboard-sidebar-context";
import { motion, AnimatePresence } from "framer-motion";
import { iconsConfig } from "@/lib/icons/iconsConfig";
import ProgressBar from "../ui/progress-bar";
import { supabase } from "@/lib/db/supabaseClient";
import { NotificationsContext } from "@/store/notifications-context";

const Menu = motion.create(iconsConfig["hamburger"]);
const Close = motion.create(iconsConfig["close"]);

export default function DashboardHeader({
  title = null,
  subtitle = null,
  userId,
}) {
  const {
    notifications,
    setNotifications,
    unreadNotifications,
    setUnreadNotifications,
  } = use(NotificationsContext);
  const { isDashboardSidebar, setIsDashboardSidebar } = use(
    DashboardSidebarContext
  );

  const { user } = use(UserContext);
  const { displayName, fullName, email } = user;

  const firsrName = fullName.split(" ")[0];
  const emailDisplay = email.split("@")[0];

  useEffect(() => {
    const channel = supabase
      .channel("notifications-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log("New notification:", payload);
          setUnreadNotifications(true);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return (
    <>
      <ProgressBar />
      <header className={classes.header}>
        <div>
          <h2>
            {title ||
              `👋 Welcome, ${displayName || firsrName || emailDisplay}!`}
          </h2>
          <p>{subtitle}</p>
        </div>
        {!isDashboardSidebar ? (
          <Menu
            className={classes.dashboardHamburgerMenu}
            onClick={() => setIsDashboardSidebar(true)}
            whileHover={{
              scale: 1.1,
              transition: {
                type: "spring",
                duration: 0.3,
              },
            }}
            whileTap={{
              scale: 1,
              rotate: 180,
            }}
          />
        ) : (
          <Close
            className={classes.closeIcon}
            onClick={() => setIsDashboardSidebar(false)}
            whileHover={{
              scale: 1.1,
              transition: {
                type: "spring",
                duration: 0.3,
              },
            }}
          />
        )}
      </header>
    </>
  );
}
