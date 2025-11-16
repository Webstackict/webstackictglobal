"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import classes from "./side-nav.module.css";
import { iconsConfig } from "@/lib/icons/iconsConfig";
import LinkWithProgress from "../ui/Link-with-progress";
import logoImg from "@/assets/Webstack Logo white.png";
import Image from "next/image";
import { logout } from "@/actions/logout";
import { NotificationsContext } from "@/store/notifications-context";
import { use } from "react";

const {
  settings: Settings,
  hamburger: Menu,
  close: Close,
  logout: LogOut,
} = iconsConfig;

const links = [
  { name: "Dashboard", icon: "chart", href: "/dashboard" },
  // { name: "My Courses", icon: "school", href: "/dashboard/my-courses" },
  // { name: "Events", icon: "event", href: "/dashboard/events" },
  // {
  //   name: "Certificates",
  //   icon: "certificate",
  //   href: "/dashboard/certificates",
  // },
  // { name: "My Services", icon: "services", href: "/dashboard/my-services" },
  // { name: "Achievements", icon: "award", href: "/dashboard/achievements" },
  {
    name: "Notifications",
    icon: "notification",
    href: "/notifications",
  },
];

export default function SideNav() {
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

  return (
    <AnimatePresence mode="wait">
      <motion.aside className={classes.dashboardSideNav}>
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
