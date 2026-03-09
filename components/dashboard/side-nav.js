"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import classes from "./side-nav.module.css";
import { iconsConfig } from "@/lib/icons/iconsConfig";
import LinkWithProgress from "../ui/Link-with-progress";
import Logo from "../ui/logo";
import { logout } from "@/actions/logout";
import { NotificationsContext } from "@/store/notifications-context";
import { useContext } from "react";
import { toast } from "sonner";
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

export default function SideNav() {
  const { setUser } = useContext(UserContext);
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

  return (
    <AnimatePresence mode="wait">
      <motion.aside className={classes.dashboardSideNav}>
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
                className={`${classes.navLink} ${pathname === link.href ? classes.active : ""
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
