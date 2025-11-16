"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { use, useEffect, useState } from "react";
import classes from "./sideNavMobile.module.css";
import { iconsConfig } from "@/lib/icons/iconsConfig";
import LinkWithProgress from "../ui/Link-with-progress";
import logoImg from "@/assets/Webstack Logo white.png";
import Image from "next/image";
import { DashboardSidebarContext } from "@/store/dashboard-sidebar-context";
import { logout } from "@/actions/logout";
import { NotificationsContext } from "@/store/notifications-context";

const {
  settings: Settings,
  hamburger: Menu,
  close: Close,
  logout: LogOut,
} = iconsConfig;

const links = [
  { name: "Dashboard", icon: "chart", href: "/dashboard" },
  {
    name: "Notifications",
    icon: "notification",
    href: "/notifications",
  },
];

export default function SideNavMobile() {
  const { isDashboardSidebar, setIsDashboardSidebar } = use(
    DashboardSidebarContext
  );
  const pathname = usePathname();
  const router = useRouter();

  const {
    notifications,
    setNotifications,
    unreadNotifications,
    setUnreadNotifications,
  } = use(NotificationsContext);
  // const isPendingNotification = notifications.some(
  //   (n) => n.status === "pending"
  // );

  async function handleLogoutClick() {
    const res = await logout();

    router.replace("/auth");
  }

  useEffect(() => {
    function handleClick(event) {
      if (
        isDashboardSidebar &&
        !event.target.closest(`.${classes.dashboardSideNavMobile}`)
      ) {
        setIsDashboardSidebar(false);
      }
    }
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [isDashboardSidebar]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsDashboardSidebar(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.aside
        className={classes.dashboardSideNavMobile}
        initial={{ x: -20, opacity: 0 }}
        animate={
          isDashboardSidebar
            ? { x: 0, opacity: 1, display: "flex" }
            : { x: -20, opacity: 0, display: "none" }
        }
        transition={{
          type: "spring",
          duration: 0.5,
        }}
      >
        <div className={classes.sidebarHeader}>
          <LinkWithProgress href="/">
            <div>
              <Image src={logoImg} alt="logo" fill sizes="200px" priority />
            </div>
          </LinkWithProgress>
        </div>

        <nav>
          {links.map((link, index) => {
            const Icon = iconsConfig[link.icon];
            return (
              <LinkWithProgress
                key={index}
                href={link.href}
                className={`${classes.navLink} ${
                  pathname.includes(link.name.toLowerCase())
                    ? classes.active
                    : null
                }`}
              >
                <span className={classes.iconBox}>
                  {link.name === "Notifications" && unreadNotifications && (
                    <div className="notify-banner"></div>
                  )}
                  <Icon />
                </span>
                {link.name}
              </LinkWithProgress>
            );
          })}

          {/* <hr /> */}

          <LinkWithProgress
            href="/account-settings"
            className={`${classes.navLink} ${
              pathname.includes("account-settings") && classes.active
            }`}
          >
            <Settings />
            Account Settings
          </LinkWithProgress>
          <button className={`${classes.navLink}`} onClick={handleLogoutClick}>
            <LogOut />
            Logout
          </button>
        </nav>
      </motion.aside>
    </AnimatePresence>
  );
}
