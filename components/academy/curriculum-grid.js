"use client";
import React from "react";
import classes from "./curriculum-grid.module.css";

import { iconsConfig } from "@/lib/icons/iconsConfig";


export default function CurriculumGrid({ items, department }) {
  return (
    <div className={classes.grid}>
      {items.map((curriculum, idx) => {
        const CurriculumIcon = iconsConfig[curriculum.icon];
        return (
          <div key={idx} className="card">
            <div className={classes.header}>
              <div
                className={classes.iconBox}
                style={{
                  background: `linear-gradient(to right, ${curriculum.gradient[0]}, ${curriculum.gradient[1]})`,
                }}
              >
                <CurriculumIcon className={classes.icon} />
              </div>
              <div>
                <h3 className={classes.title}>{curriculum.title}</h3>
                <p className={classes.subtitle}>{curriculum.subtitle}</p>
              </div>
            </div>

            <div className={classes.topics}>
              {curriculum.topics.map((topic, i) => {
                return (
                  <div key={i} className={classes.topic}>
                    <div
                      className={classes.topicIcon}
                      style={{ backgroundColor: topic.bg }}
                    >
                      {topic.icon}
                    </div>
                    <div>
                      <h4 className={classes.topicTitle}>{topic.title}</h4>
                      <p className={classes.topicDesc}>{topic.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
