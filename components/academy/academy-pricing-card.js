"use client";
import { motion } from "framer-motion";
import { iconsConfig } from "@/lib/icons/iconsConfig";
import Badge from "../ui/badge";
import classes from "./academy-pricing-card.module.css";
import { currencyFormatter } from "@/util/util";
import { toast } from "sonner";

const CheckIcon = iconsConfig["check"];

export default function AcademyPricingCard({
  pricingData,
  department,
  isEnrolled,
  paymentStatus,
  startPayment,
  continuePayment,
  loading,
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
            <span className={classes.price}>
              {currencyFormatter.format(department.fee)}
            </span>
            {/* <span className={classes.currency}>NGN</span> */}
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
            <button
              className={classes.paymentCard}
              disabled={loading || (isEnrolled && paymentStatus)}
              onClick={() => {
                if (isEnrolled) {
                  if (paymentStatus) {
                    toast.warning("You are already enrolled in this cohort");
                  } else {
                    continuePayment();
                  }
                } else {
                  startPayment();
                }
              }}
              type="button"
            >
              <p className={classes.paymentTitle}>
                {loading ? "Processing..." : isEnrolled && paymentStatus ? "Enrolled & Secured" : "Full Payment"}
              </p>
              <p className={classes.paymentHighlight}>
                {currencyFormatter.format(department.fee)}
              </p>
            </button>

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
