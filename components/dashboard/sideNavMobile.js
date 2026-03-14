"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import classes from "./sideNavMobile.module.css";
import { iconsConfig } from "@/lib/icons/iconsConfig";
import LinkWithProgress from "../ui/Link-with-progress";
import Logo from "../ui/logo";
import { DashboardSidebarContext } from "@/store/dashboard-sidebar-context";
import { logout } from "@/actions/logout";
import { NotificationsContext } from "@/store/notifications-context";
import { UserContext } from "@/store/user-context";

const {
  settings: Settings,
  hamburger: Menu,
  close: Close,
  logout: LogOut,
} = iconsConfig;

const links = [
  { name: "Dashboard Overview", icon: "chart", href: "/dashboard" },
  { name: "My Profile", icon: "person", href: "/dashboard/profile" },
  {
    name: "Affiliate / Referral Program",
    icon: "share",
    href: "/dashboard/referrals",
  },
  {
    name: "Referral History",
    icon: "clock",
    href: "/dashboard/referrals/history",
  },
  {
    name: "Earnings",
    icon: "dollarCoin",
    href: "/dashboard/referrals/earnings",
  },
  {
    name: "Notifications",
    icon: "notification",
    href: "/notifications",
  },
];

export default function SideNavMobile() {
  const { setUser } = useContext(UserContext);
  const { isDashboardSidebar, setIsDashboardSidebar } = useContext(
    DashboardSidebarContext
  );
  const pathname = usePathname();
  const router = useRouter();

  const {
    notifications,
    setNotifications,
    unreadNotifications,
    setUnreadNotifications,
  } = useContext(NotificationsContext);
  // const isPendingNotification = notifications.some(
  //   (n) => n.status === "pending"
  // );


  async function handleLogoutClick() {
    try {
      const res = await logout();
      setUser({
        id: "",
        email: "",
        fullName: "",
        displayName: "",
        phone: "",
        authProviders: "",
      });
    } catch (error) {
      console.error(error.message);
      toast.error("Something went wrong, please try again");
    }

    router.replace("/auth");
  }

  useEffect(() => {
    function handleClick(event) {
      if (isDashboardSidebar && classes.dashboardSideNavMobile) {
        if (!event.target.closest(`.${classes.dashboardSideNavMobile}`)) {
          setIsDashboardSidebar(false);
        }
      }
    }
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [isDashboardSidebar, setIsDashboardSidebar]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsDashboardSidebar(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsDashboardSidebar]);

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
            <Logo />
          </LinkWithProgress>
        </div>

        <nav>
          {links.map((link, index) => {
            const Icon = iconsConfig[link.icon];
            return (
              <LinkWithProgress
                key={index}
                href={link.href}
                className={`${classes.navLink} ${pathname.includes(link.name.toLowerCase())
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
            href="/dashboard/settings"
            className={`${classes.navLink} ${pathname.includes("settings") && classes.active
              }`}
          >
            <Settings />
            Settings
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
