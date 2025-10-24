"use client";
import { motion } from "framer-motion";
import classes from "./team-card.module.css";

import { iconsConfig } from "@/lib/icons/iconsConfig";
import Image from "next/image";

const SchoolIcon = iconsConfig["school"];
const CalendarIcon = iconsConfig["calendar"];
const AwardIcon = iconsConfig["award"];
const BriefcaseIcon = iconsConfig["briefcase"];

export default function TeamCard({ member, size = null, ...props }) {
  const BadgeIcon = iconsConfig[member.icon];
  return (
    <motion.div
      className={`${classes.card} ${size ? size : undefined}`}
      {...props}
    >
      <div className={classes.imageWrapper}>
        <div className={classes.imageContainer}>
          <Image
            src={member.image}
            alt={member.name}
            className={classes.avatar}
            fill
            sizes="100px"
            priority
          />
        </div>
        <div className={`${classes.iconBadge} ${member.badgeColor}`}>
          <BadgeIcon />
        </div>
      </div>
      <h3 className={classes.title}>{member.name}</h3>
      <p className={classes.role}>{member.role}</p>
      <div className={classes.details}>
        <p>
          <SchoolIcon /> {member.education}
        </p>
        <p>
          <BriefcaseIcon /> {member.experience}
        </p>

        {member.award && (
          <p>
            <AwardIcon /> {member.award}
          </p>
        )}

        <p>
          <CalendarIcon /> {member.years}
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
