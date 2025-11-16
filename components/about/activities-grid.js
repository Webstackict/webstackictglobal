"use client";
import { motion } from "framer-motion";
import classes from "./activities-grid.module.css";

import { containerVarients, childVarients } from "@/lib/animations";
import Image from "next/image";
import SeeMoreButton from "../ui/see-more-button";
import { formatDate } from "@/util/util";
import nProgress from "nprogress";
import { useRouter } from "next/navigation";

export default function ActivitiesGrid({ activities = [] }) {
  const router = useRouter();

  if (activities.length === 0)
    return (
      <p className="no-data">
        No Events available! Events will be updated accordingly.
      </p>
    );

  function handleClick() {
    nProgress.start();
    router.push("/gallery#event-gallery");
  }

  return (
    <>
      <motion.div
        className={classes.activitiesGrid}
        variants={containerVarients}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id + index || index}
            className={classes.card}
            variants={childVarients}
          >
            <div className={classes.imageContainer}>
              <Image
                src={
                  activity.image ||
                  activity.event_thumbnails?.image_url ||
                  activity.highlight_images[0]?.image_url
                }
                alt="activity-image"
                fill
                sizes="(min-width: 1024px) 33.33vw, (min-width: 768px) 50vw, 100vw"
              />
            </div>
            <div className={classes.cardContent}>
              <h3>{activity.name || activity.title}</h3>
              <p>{activity.description}</p>
              <p style={{ fontSize: "1rem", fontWeight: "600" }}>
                {formatDate(activity.event_date)}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
      <SeeMoreButton onClick={handleClick}>View Full Gallery</SeeMoreButton>
    </>
  );
}
