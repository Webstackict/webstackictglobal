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
    function handleClick(event) {
      if (!event.target.closest(`.${classes.sidebar}`)) setIsMainSidebar(false);
    }
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <>
      <Backdrop />
      <motion.div
        className={classes.sidebar}
        initial={{
          x: 500,
          opacity: 0.5,
        }}
        animate={{
          x: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.5,
        }}
        exit={{
          x: 500,
          opacity: 0.5,
        }}
      >
        <CloseIcon
          onClick={() => setIsMainSidebar(false)}
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
        <div className={classes.links}>
          <LinkWithProgress href="/" className={classes.link}>
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
                    <LinkWithProgress href="/programs/academy">
                      Academy
                    </LinkWithProgress>
                  </li>

                  <li>
                    <LinkWithProgress href="/programs/events">
                      Events
                    </LinkWithProgress>
                  </li>
                </motion.ul>
              )}
            </AnimatePresence>
          </motion.div>

          <LinkWithProgress href="/services" className={classes.link}>
            Services
          </LinkWithProgress>

          <LinkWithProgress href="/about" className={classes.link}>
            About
          </LinkWithProgress>
          <LinkWithProgress href="/contact" className={classes.link}>
            Contact
          </LinkWithProgress>
          <LinkWithProgress href="/gallery" className={classes.link}>
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
