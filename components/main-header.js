"use client";

import Image from "next/image";
import { useEffect, useState, use } from "react";
import nProgress from "nprogress";
import { motion, AnimatePresence } from "framer-motion";

import logoImg from '../assets/Webstack Logo white.png';

import classes from "./main-header.module.css";

import ProgressBar from "./ui/progress-bar";
import LinkWithProgress from "./ui/Link-with-progress";

import { iconsConfig } from "@/lib/icons/iconsConfig";
import MainSidebar from "./main-sidebar";
import { MainSidebarContext } from "@/store/main-sidebar-context";
import { usePathname } from "next/navigation";


const AngleDown = motion.create(iconsConfig["angleDown"]);
const Menu = motion.create(iconsConfig["hamburger"]);

function MainHeader() {
  const path = usePathname();

  const [isDropdown, setIsDropdown] = useState(false);

  const { isMainSidebar, setIsMainSidebar } = use(MainSidebarContext);

  function handleDropdownClick() {
    if (isDropdown) {
      setIsDropdown(false);
    } else {
      setIsDropdown(true);
    }
  }

  useEffect(() => {
    function handleClick(event) {
      if (
        !event.target.closest(`.${classes.dropdown}`) &&
        !event.target.closest(`.${classes.dropdownBtn}`)
      )
        setIsDropdown(false);
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
                <LinkWithProgress href="/"> 
              <div className={classes.logo}>
                <Image src={logoImg} alt="logo" fill sizes="165px" priority/>
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
                  onHoverStart={handleDropdownClick}
                  onHoverEnd={handleDropdownClick}
                  transition={{
                    type: "spring",
                    duration: 0.5,
                  }}
                >
                  {/* Button */}
                  <motion.button
                    className={classes.dropdownBtn}
                    onClick={handleDropdownClick}
                    style={
                      path.includes("/programs")
                        ? { color: "var(--teal-400)" }
                        : null
                    }
                  >
                    <motion.span transition={{ duration: 1 }}>
                      Programs
                    </motion.span>
                    <AngleDown animate={isDropdown ? { rotate: 180 } : null} />
                  </motion.button>

                  {/* Dropdown */}

                  <AnimatePresence>
                    {isDropdown && (
                      <motion.ul
                        className={classes.dropdown}
                        initial={{ y: -10, opacity: 0 }}
                        animate={
                          isDropdown
                            ? { y: 0, opacity: 1 }
                            : { y: -10, opacity: 0 }
                        }
                        transition={{
                          type: "spring",
                          duration: 0.5,
                        }}
                        exit={{ y: -10, opacity: 0 }}
                      >
                        <li>
                          <LinkWithProgress
                            href="/programs/academy"
                            style={
                              path.includes("/academy")
                                ? {
                                    color: "var(--white)",
                                    background: "var(--charcoal-blue-500)",
                                  }
                                : null
                            }
                          >
                            Academy
                          </LinkWithProgress>
                        </li>

                        <li>
                          <LinkWithProgress
                            href="/programs/events"
                            style={
                              path.includes("/events")
                                ? {
                                    color: "var(--white)",
                                    background: "var(--charcoal-blue-500)",
                                  }
                                : null
                            }
                          >
                            Events
                          </LinkWithProgress>
                        </li>
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </motion.div>

                <LinkWithProgress
                  href="/services"
                  className={classes.link}
                  style={
                    path.includes("/services")
                      ? { color: "var(--teal-400)" }
                      : null
                  }
                >
                  Services
                </LinkWithProgress>

                <LinkWithProgress
                  href="/about"
                  className={classes.link}
                  style={
                    path.includes("/about")
                      ? { color: "var(--teal-400)" }
                      : null
                  }
                >
                  About
                </LinkWithProgress>
                <LinkWithProgress
                  href="/contact"
                  className={classes.link}
                  style={
                    path.includes("/contact")
                      ? { color: "var(--teal-400)" }
                      : null
                  }
                >
                  Contact
                </LinkWithProgress>
              </div>
            </div>

            {/* Right Side */}
            {/* <div className={classes.right}>
              <Link href="#" className={classes.link}>
                Sign In
              </Link>
              <SmallButton className={classes.getStarted}>
                Get Started
              </SmallButton>
            </div> */}

            <Menu
              onClick={() => setIsMainSidebar(true)}
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
          </div>
        </nav>
      </header>
    </>
  );
}

export default MainHeader;
