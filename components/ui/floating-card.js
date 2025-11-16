"use client";
import Image from "next/image";
import classes from "./floating-card.module.css";
import { motion } from "framer-motion";

function FloatingCard({ image }) {
  let cardStyle = `${classes.codingCard} glassmorphism`;
  if (image) {
    cardStyle = `${classes.eventCard} glassmorphism`;
  }
  return (
    <div className={classes.container}>
      <div className={classes.floating}>
        <motion.div
          className={cardStyle}
          initial={{
            opacity: 0,
            x: 20,
          }}
          animate={{
            opacity: 1,
            x: 0,
            transition: { duration: 0.4, ease: "easeOut" },
          }}
        >
          {!image ? (
            <>
              <div className={classes.cardHeader}>
                <h3>Live Coding Session</h3>
                <div className={classes.liveDot}></div>
              </div>
              <div className={classes.codeBox}>
                <div className={classes.codeBlue}>
                  const buildFuture = () =&gt; {"{"}
                </div>
                <div className={classes.codeWhite}>
                  return &apos;Success at WEBSTACK&apos;;
                </div>
                <div className={classes.codeBlue}>{"}"}</div>
              </div>
              <div className={classes.cardFooter}>
                <span className={classes.footerLeft}>124 students online</span>
                <span className={classes.footerRight}>
                  Next: Data Structures
                </span>
              </div>{" "}
            </>
          ) : (
            <Image
              src={image}
              alt="event-hero-image"
              className={classes.eventHero}
              fill
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default FloatingCard;
