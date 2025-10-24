"use client";
import { motion } from "framer-motion";
import { iconsConfig } from "@/lib/icons/iconsConfig";
import Badge from "../ui/badge";
import classes from "./academy-pricing-card.module.css";

const CheckIcon = iconsConfig["check"];

export default function AcademyPricingCard({
  pricingData,
  department,
  ...props
}) {
  return (
    <motion.div className="card" {...props}>
      <div className={classes.gradientOverlay}></div>
      <div className={classes.innerContent}>
        <div className={classes.header}>
          <h3 className={classes.title}>Program Investment</h3>
          <Badge title="premium" />
        </div>

        <div className={classes.priceSection}>
          <div className={classes.priceRow}>
            <span className={classes.price}>{department.fee}</span>
            <span className={classes.currency}>NGN</span>
          </div>
          <p className={classes.priceSub}>
            Complete {department.duration} months intensive program
          </p>
        </div>

        <div className={classes.features}>
          {pricingData.features.map((feature, i) => (
            <div key={i} className={classes.featureItem}>
              <CheckIcon />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        <div className={classes.paymentOptions}>
          <h4>Payment Options</h4>
          <div className={classes.paymentGrid}>
            <div className={classes.paymentCard}>
              <p className={classes.paymentTitle}>Full Payment</p>
              <p className={classes.paymentHighlight}>{department.fee}</p>
            </div>

            {/* {pricingData.paymentOptions.map((option, i) => (
              <div key={i} className={classes.paymentCard}>
                <p className={classes.paymentTitle}>{option.title}</p>
                <p
                  className={
                    option.highlight
                      ? classes.paymentHighlight
                      : classes.paymentSub
                  }
                >
                  {option.price}
                </p>
              </div>
            ))} */}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
