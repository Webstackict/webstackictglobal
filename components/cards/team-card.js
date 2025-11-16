"use client";
import { motion } from "framer-motion";
import classes from "./team-card.module.css";

import { iconsConfig } from "@/lib/icons/iconsConfig";
import Image from "next/image";

const SchoolIcon = iconsConfig["school"];
const CalendarIcon = iconsConfig["calendar"];
const AwardIcon = iconsConfig["award"];
const BriefcaseIcon = iconsConfig["briefcase"];
const ExperienceIcon = iconsConfig["motion"];

export default function TeamCard({ member, label = null, ...props }) {
  let BadgeIcon;

  if (!label) {
    BadgeIcon = iconsConfig[member.icon];
  }

  return (
    <motion.div {...props} className={classes.teamCard}>
      <div className={classes.imageWrapper}>
        <div className={classes.imageContainer}>
          <Image
            src={member.image_url || member.image}
            alt="avatar"
            className={classes.avatar}
            fill
            sizes="100px"
            priority
          />
        </div>
        {!label && (
          <div className={`${classes.iconBadge} ${member.badgeColor}`}>
            <BadgeIcon />
          </div>
        )}
      </div>
      <h3 className={classes.title}>{member.fullname}</h3>
      <p className={classes.role}>{member.role}</p>
      <div className={classes.details}>
        <p>
          <SchoolIcon /> {member.education}
        </p>
        <p>
          <BriefcaseIcon /> {member.profession}
        </p>
        <p>
          <ExperienceIcon /> {member.experience}
        </p>

        {member.award && (
          <p>
            <AwardIcon /> {member.awards}
          </p>
        )}

        <p>
          <CalendarIcon /> {member.experience_years} years of experience
        </p>
      </div>
      <p className={classes.description}>{member.bio}</p>
      <div className={classes.socials}>
        {member.socials?.map((social, i) => {
          const SocialIcon = iconsConfig[social.icon];
          return (
            <span key={i} className={classes.socialIcon}>
              <SocialIcon />
            </span>
          );
        })}
      </div>
    </motion.div>
  );
}
