"use client";
import { iconsConfig } from "@/lib/icons/iconsConfig";
import classes from "./interactive-map.module.css";
import { useState } from "react";

import { motion } from "framer-motion";

const ExternalLink = iconsConfig["externalLink"];
const MapIcon = iconsConfig["map"];

export default function InteractiveMap() {
  const [showMap, setShowMap] = useState(false);
  return (
    <motion.div
      className={classes.wrapper}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" },
      }}
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className={classes.mapContainer}>
        <div className={classes.overlay}></div>

        {!showMap ? (
          <div className={classes.content}>
            <button
              className={classes.button}
              onClick={() => setShowMap(!showMap)}
            >
              <ExternalLink />
              Open in Maps
            </button>
          </div>
        ) : (
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d247.89220242213085!2d7.082961249888644!3d6.227396412149599!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1043830d0a7f9b4b%3A0x1c894650e08be508!2ssfc%20limited!5e0!3m2!1sen!2sng!4v1760599668471!5m2!1sen!2sng"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className={classes.mapIframe}
          ></iframe>
        )}

        <div className={`${classes.ping} ${classes.circle1}`}></div>
        <div className={`${classes.pulse} ${classes.circle2}`}></div>
        <div className={`${classes.bounce} ${classes.circle3}`}></div>
      </div>
    </motion.div>
  );
}
