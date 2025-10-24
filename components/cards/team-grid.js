"use client";
import { motion } from "framer-motion";
import classes from "./team-grid.module.css";

import TeamCard from "./team-card";

import {containerVarients, childVarients } from "@/lib/animations";

export default function TeamGrid({ team, className }) {
  const gridTemplate = `${className} ${classes.teamGrid}`;
  return (
    <motion.div
      className={gridTemplate}
      variants={containerVarients}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {team.map((member, index) => {
        return (
          <TeamCard
            key={member.name + index}
            member={member}
            variants={childVarients}
          />
        );
      })}
    </motion.div>
  );
}
