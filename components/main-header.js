"use client";

import Image from "next/image";
import { useEffect, useState, use } from "react";
import nProgress from "nprogress";
import { motion, AnimatePresence } from "framer-motion";

import classes from "./main-header.module.css";
import Logo from "./ui/logo";
import ProgressBar from "./ui/progress-bar";
import LinkWithProgress from "./ui/Link-with-progress";

import { iconsConfig } from "@/lib/icons/iconsConfig";
import MainSidebar from "./main-sidebar";
import { MainSidebarContext } from "@/store/main-sidebar-context";
import { usePathname } from "next/navigation";
import SmallButton from "./ui/small-button";
import { NotificationsContext } from "@/store/notifications-context";
import { supabase } from "@/lib/db/supabaseClient";

const AngleDown = motion.create(iconsConfig["angleDown"]);
const Menu = motion.create(iconsConfig["hamburger"]);
const NotificationIcon = motion.create(iconsConfig["notification"]);
const Dashboard = motion.create(iconsConfig["chart"]);
const Settings = motion.create(iconsConfig["settings"]);

function MainHeader({ user }) {
  const isLoggedIn = user !== null;
  const userId = user?.id || "";
  const path = usePathname();

  const [isDropdown, setIsDropdown] = useState(false);
  const [isDashboardDropdown, setIsDashboardDropdown] = useState(false);

  const { isMainSidebar, setIsMainSidebar } = use(MainSidebarContext);
  const {
    notifications,
    setNotifications,
    unreadNotifications,
    setUnreadNotifications,
  } = use(NotificationsContext);

  function handleDropdownClick() {
    setIsDropdown((prev) => !prev);
  }

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
          setNotifications((prev) => [payload.new, ...prev]);
          setUnreadNotifications(true);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, setNotifications, setUnreadNotifications]);

  useEffect(() => {
    function handleClick(event) {
      const isDropdownClick = classes.dropdown && event.target.closest(`.${classes.dropdown}`);
      const isDropdownBtnClick = classes.dropdownBtn && event.target.closest(`.${classes.dropdownBtn}`);

      if (!isDropdownClick && !isDropdownBtnClick) {
        setIsDropdown(false);
      }
    }
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  useEffect(() => {
    nProgress.done();
  }, []);

  return (
    <>
      <ProgressBar />

      <AnimatePresence> {isMainSidebar && <MainSidebar />} </AnimatePresence>

      <header id="header" className={classes.header}>
        <nav>
          <div>
            <div className={classes.left}>
              <LinkWithProgress href="/" className={classes.logoLink}>
                <div className={classes.logo}>
                  <Logo height={190} variant="white" style={{ aspectRatio: '1/1' }} />
                </div>
              </LinkWithProgress>

              <div className={classes.links}>
                <LinkWithProgress
                  href="/"
                  className={classes.link}
                  style={path === "/" ? { color: "var(--teal-400)" } : null}
                >
                  Home
                </LinkWithProgress>

                <motion.div
                  className={classes.dropdownWrapper}
                  onHoverStart={() => setIsDropdown(true)}
                  onHoverEnd={() => setIsDropdown(false)}
                >
                  <button
                    className={classes.dropdownBtn}
                    onClick={handleDropdownClick}
                    aria-expanded={isDropdown}
                    aria-haspopup="true"
                    aria-label="Toggle programs menu"
                    style={
                      path.includes("/programs")
                        ? { color: "var(--teal-400)" }
                        : null
                    }
                  >
                    <span>Programs</span>
                    <AngleDown animate={isDropdown ? { rotate: 180 } : null} />
                  </button>

                  <AnimatePresence>
                    {isDropdown && (
                      <motion.ul
                        className={classes.dropdown}
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -10, opacity: 0 }}
                        transition={{ type: "spring", duration: 0.5 }}
                      >
                        <li>
                          <LinkWithProgress
                            href="/programs/academy"
                            style={path.includes("/academy") ? { color: "var(--white)", background: "var(--charcoal-blue-500)" } : null}
                          >
                            Academy
                          </LinkWithProgress>
                        </li>
                        <li>
                          <LinkWithProgress
                            href="/programs/events"
                            style={path.includes("/events") ? { color: "var(--white)", background: "var(--charcoal-blue-500)" } : null}
                          >
                            Events
                          </LinkWithProgress>
                        </li>
                        <li>
                          <LinkWithProgress
                            href="/enroll"
                            style={path.includes("/enroll") ? { color: "var(--white)", background: "var(--charcoal-blue-500)" } : null}
                          >
                            Enroll
                          </LinkWithProgress>
                        </li>
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </motion.div>

                <LinkWithProgress
                  href="/scholarships"
                  className={classes.link}
                  style={path.includes("/scholarships") ? { color: "var(--teal-400)" } : null}
                >
                  Scholarships
                </LinkWithProgress>

                <LinkWithProgress
                  href="/services"
                  className={classes.link}
                  style={path.includes("/services") ? { color: "var(--teal-400)" } : null}
                >
                  Services
                </LinkWithProgress>

                <LinkWithProgress
                  href="/about"
                  className={classes.link}
                  style={path.includes("/about") ? { color: "var(--teal-400)" } : null}
                >
                  About
                </LinkWithProgress>

                <LinkWithProgress
                  href="/contact"
                  className={classes.link}
                  style={path.includes("/contact") ? { color: "var(--teal-400)" } : null}
                >
                  Contact
                </LinkWithProgress>

                <LinkWithProgress
                  href="/gallery"
                  className={classes.link}
                  style={path.includes("/gallery") ? { color: "var(--teal-400)" } : null}
                >
                  Gallery
                </LinkWithProgress>

                <LinkWithProgress
                  href="/verify-student"
                  className={classes.link}
                  style={path.includes("/verify-student") ? { color: "var(--teal-400)" } : null}
                >
                  Verify
                </LinkWithProgress>


              </div>
            </div>

            <div className={classes.right}>
              {!isLoggedIn ? (
                <>
                  {!path.includes("auth") && (
                    <LinkWithProgress href="/auth" className={classes.link}>
                      Sign In
                    </LinkWithProgress>
                  )}
                  {path.includes("auth") && (
                    <SmallButton className={classes.getStarted} href="/">
                      Get Started
                    </SmallButton>
                  )}
                </>
              ) : (
                <>
                  <motion.div
                    className={classes.dropdownWrapper}
                    onHoverStart={() => setIsDashboardDropdown(true)}
                    onHoverEnd={() => setIsDashboardDropdown(false)}
                  >
                    <LinkWithProgress href="/dashboard">
                      <div className={classes.avatarContainer}>
                        <Image
                          src={user.user_metadata?.avatar_url || "/avatar.png"}
                          alt="avatar"
                          fill
                          sizes="50px"
                        />
                      </div>
                    </LinkWithProgress>

                    <AnimatePresence>
                      {isDashboardDropdown && (
                        <motion.ul
                          className={classes.dropdown}
                          initial={{ y: -10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -10, opacity: 0 }}
                          transition={{ type: "spring", duration: 0.5 }}
                        >
                          <li>
                            <LinkWithProgress href="/dashboard">
                              <Dashboard /> Dashboard
                            </LinkWithProgress>
                          </li>
                          <li>
                            <LinkWithProgress href="/account-settings">
                              <Settings /> Account Settings
                            </LinkWithProgress>
                          </li>
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <LinkWithProgress
                    href="/notifications"
                    className={classes.notificationContainer}
                    aria-label={`View notifications${unreadNotifications ? " - You have unread messages" : ""}`}
                  >
                    {unreadNotifications && <div className="notify-banner"></div>}
                    <NotificationIcon className={classes.notificationIcon} />
                  </LinkWithProgress>
                </>
              )}

              <button
                className={classes.hamburgerMenuButton}
                onClick={() => setIsMainSidebar(true)}
                aria-label="Open navigation menu"
              >
                <Menu
                  className={classes.hamburgerMenu}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9, rotate: 180 }}
                />
              </button>
            </div>
          </div>
        </nav>
      </header >
    </>
  );
}

export default MainHeader;
