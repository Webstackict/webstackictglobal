"use client";
import { motion } from "framer-motion";
import classes from "./featured-event-card.module.css";

import Badge from "../ui/badge";
import { iconsConfig } from "@/lib/icons/iconsConfig";
import Image from "next/image";
import { formatDate } from "@/util/util";
import LinkWithProgress from "../ui/Link-with-progress";
const PlayIcon = iconsConfig["play"];

export default function FeaturedEvent({ featuredEvent }) {
  const eventYear = new Date(featuredEvent.event_date).getFullYear();
  const eventDetails = [
    { icon: "calendar", text: formatDate(featuredEvent.event_date) },
    { icon: "location", text: featuredEvent.venue },
    { icon: "group", text: `${featuredEvent.number_of_attendants}+ Attendees` },
  ];
  return (
    <motion.div
      className={classes.featuredContainer}
      initial={{
        y: 20,
        opacity: 0,
      }}
      whileInView={{
        y: 0,
        opacity: 1,
        transition: { duration: 1, ease: "easeOut" },
      }}
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className={classes.grid}>
        {/* Left Column */}
        <div className={classes.leftColumn}>
          <Badge title="featured event" eventBagdeStyle={classes.badge} />

          <h2 className={classes.title}>
            {featuredEvent.name} <br />
            <span className="gradientText">{eventYear}</span>
          </h2>

          <p className={classes.description}>{featuredEvent.description}</p>

          <div className={classes.infoRow}>
            {eventDetails.map((item, index) => {
              const Icon = iconsConfig[item.icon];
              return (
                <div className={classes.infoItem} key={index}>
                  <Icon />
                  <span>{item.text}</span>
                </div>
              );
            })}
          </div>

          <div className={classes.buttons}>
            <LinkWithProgress
              href={`/programs/events/${featuredEvent.id}`}
              className={classes.primaryBtn}
            >
              Learn More
            </LinkWithProgress>
            <LinkWithProgress href="#" className={classes.secondaryBtn}>
              Watch Highlights
            </LinkWithProgress>
          </div>
        </div>

        {/* Right Column */}
        <div className={classes.rightColumn}>
          <Image
            src={featuredEvent.image_url}
            alt="event-thumbnail"
            className={classes.image}
            fill
            sizes="(min-width: 1024px) 50vw,  100vw,"
          />
          <div className={classes.overlay}></div>

          <div className={classes.playButtonWrapper}>
            <div className={classes.playButton}>
              <PlayIcon />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
