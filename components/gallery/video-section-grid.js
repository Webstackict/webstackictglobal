"use client";
import { motion } from "framer-motion";
import { iconsConfig } from "@/lib/icons/iconsConfig";
import classes from "./video-section-grid.module.css";
import { videosData } from "@/lib/contents/galleryData";
import { containerVarients, childVarients } from "@/lib/animations";

const EyeIcon = iconsConfig["eye"];
const PlayIcon = iconsConfig["play"];
const YoutubeIcon = iconsConfig["youtube"];

export default function VideosSectionGrid() {
  return (
    <motion.div
      className={classes.videoSectionGrid}
      variants={containerVarients}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {videosData.map((video, index) => (
        <motion.div
          key={index}
          className={classes.card}
          variants={childVarients}
        >
          <div className={classes.videoWrapper}>
            <img
              src={video.thumbnail}
              alt={video.alt}
              className={classes.thumbnail}
            />
            <div className={classes.overlay}>
              {/* <div className={classes.playButton}>
                  <PlayIcon />
              </div> */}

              <YoutubeIcon />
            </div>
            <div className={classes.duration}>{video.duration}</div>
          </div>

          <div className={classes.content}>
            <h3 className={classes.title}>{video.title}</h3>
            <p className={classes.description}>{video.description}</p>

            <div className={classes.footer}>
              <span className={classes.date}>{video.date}</span>
              <div className={classes.views}>
                <EyeIcon />
                <span>{video.views}</span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
