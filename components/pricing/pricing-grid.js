"use client";
import { motion } from "framer-motion";
import classes from "./pricing-grid.module.css";
import { pricingData } from "@/lib/contents/pricingData";

import { iconsConfig } from "@/lib/icons/iconsConfig";
import { containerVarients, childVarients } from "@/lib/animations";

export default function PricingGrid() {
  const CheckIcon = iconsConfig["check"];

  return (
    <motion.div
      className={classes.pricingGrid}
      variants={containerVarients}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {pricingData.map((plan) => {
        let Icon = iconsConfig[plan.icon];
        return (
          <motion.div
            key={plan.id}
            className={classes.cardWrapper}
            variants={childVarients}
          >
            {plan.badge && (
              <span className={`${classes.badge} ${plan.theme.background}`}>
                {plan.badge}
              </span>
            )}

            <div className={classes.gradientBorder}>
              <div className={classes.inner}>
                <div
                  className={`${classes.iconWrapper} ${plan.theme.background}`}
                >
                  <Icon />
                </div>
                <h3 className={classes.title}>{plan.title}</h3>
                <p className={classes.subtitle}>{plan.subtitle}</p>

                <div className={classes.price}>
                  {plan.price}
                  <div className={classes.perMonth}>{plan.period}</div>
                </div>

                <div className={classes.features}>
                  {plan.features.map((feature, index) => (
                    <div key={index} className={classes.feature}>
                      <CheckIcon className={plan.theme.color} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  className={`${classes.button} ${plan.theme.background}`}
                >
                  {plan.buttonText}
                </button>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
