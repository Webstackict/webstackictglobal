"use client";
import { use, useEffect } from "react";
import classes from "./main-sidebar.module.css";
import { motion, AnimatePresence } from "framer-motion";

import { iconsConfig } from "@/lib/icons/iconsConfig";
import LinkWithProgress from "./ui/Link-with-progress";
import { useState } from "react";
import SmallButton from "./ui/small-button";
import Link from "next/link";
import { MainSidebarContext } from "@/store/main-sidebar-context";
import Backdrop from "./ui/backdrop";

import Logo from "./ui/logo";

const AngleDown = motion.create(iconsConfig["angleDown"]);
const CloseIcon = motion.create(iconsConfig["close"]);

export default function MainSidebar() {
  const [isDropdown, setIsDropdown] = useState(false);
  const { setIsMainSidebar } = use(MainSidebarContext);

  function handleDropdownClick() {
    if (isDropdown) {
      setIsDropdown(false);
    } else {
      setIsDropdown(true);
    }
  }

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  useEffect(() => {
    function handleClick(event) {
      if (classes.sidebar && !event.target.closest(`.${classes.sidebar}`)) {
        setIsMainSidebar(false);
      }
    }
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [setIsMainSidebar]);

  return (
    <>
      <Backdrop />
      <motion.div
        className={classes.sidebar}
        initial={{
          x: "100%",
          opacity: 0.5,
        }}
        animate={{
          x: 0,
          opacity: 1,
        }}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 200,
        }}
        exit={{
          x: "100%",
          opacity: 0.5,
        }}
      >
        <div className={classes.sidebarHeader}>
          <Link href="/" className={classes.logoLink} onClick={() => setIsMainSidebar(false)}>
            <Logo height={60} variant="white" />
          </Link>

          <button
            className={classes.closeButton}
            onClick={() => setIsMainSidebar(false)}
            aria-label="Close navigation menu"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              display: "flex",
              alignItems: "center",
              width: "fit-content",
            }}
          >
            <CloseIcon
              whileHover={{
                scale: 1.1,
                rotate: 180,
                transition: {
                  type: "spring",
                  duration: 0.3,
                },
              }}
              whileTap={{
                scale: 1,
                rotate: 90,
              }}
            />
          </button>
        </div>

        <div className={classes.links}>
          <LinkWithProgress href="/" className={classes.link} onClick={() => setIsMainSidebar(false)}>
            Home
          </LinkWithProgress>

          <motion.div
            className={classes.dropdownWrapper}
            transition={{
              type: "spring",
              duration: 0.5,
            }}
          >
            {/* Button */}
            <button
              className={classes.dropdownBtn}
              onClick={handleDropdownClick}
              aria-expanded={isDropdown}
              aria-haspopup="true"
              aria-label="Toggle programs menu"
            >
              <motion.span
                animate={isDropdown ? { color: "var(--white)" } : null}
                transition={{ duration: 1 }}
              >
                Programs
              </motion.span>
              <AngleDown animate={isDropdown ? { rotate: 180 } : null} />
            </button>

            {/* Dropdown */}

            <AnimatePresence>
              {isDropdown && (
                <motion.ul
                  className={classes.dropdown}
                  initial={{ y: -10, opacity: 0 }}
                  animate={
                    isDropdown ? { y: 0, opacity: 1 } : { y: -10, opacity: 0 }
                  }
                  transition={{
                    type: "spring",
                    duration: 0.5,
                  }}
                  exit={{ y: -10, opacity: 0 }}
                >
                  <li>
                    <LinkWithProgress href="/programs/academy" onClick={() => setIsMainSidebar(false)}>
                      Academy
                    </LinkWithProgress>
                  </li>

                  <li>
                    <LinkWithProgress href="/programs/events" onClick={() => setIsMainSidebar(false)}>
                      Events
                    </LinkWithProgress>
                  </li>
                </motion.ul>
              )}
            </AnimatePresence>
          </motion.div>

          <LinkWithProgress href="/scholarships" className={classes.link} onClick={() => setIsMainSidebar(false)}>
            Scholarships
          </LinkWithProgress>

          <LinkWithProgress href="/services" className={classes.link} onClick={() => setIsMainSidebar(false)}>
            Services
          </LinkWithProgress>

          <LinkWithProgress href="/about" className={classes.link} onClick={() => setIsMainSidebar(false)}>
            About
          </LinkWithProgress>
          <LinkWithProgress href="/contact" className={classes.link} onClick={() => setIsMainSidebar(false)}>
            Contact
          </LinkWithProgress>
          <LinkWithProgress href="/gallery" className={classes.link} onClick={() => setIsMainSidebar(false)}>
            Gallery
          </LinkWithProgress>
        </div>
        {/* <div className={classes.right}>
          <Link href="#" className={classes.link}>
            Sign In
          </Link>
          <SmallButton className={classes.getStarted}>Get Started</SmallButton>
        </div> */}
      </motion.div>
    </>
  );
}
