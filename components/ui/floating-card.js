"use client";
import classes from "./floating-card.module.css";
import { motion } from "framer-motion";

function FloatingCard() {
  return (
    <div className={classes.container}>
      <div className={classes.floating}>
        <motion.div
          className={`${classes.codingCard} glassmorphism`}
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
            <span className={classes.footerRight}>Next: Data Structures</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default FloatingCard;
