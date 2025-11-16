"use client";
import { motion } from "framer-motion";
import classes from "./event-pricing-grid.module.css";
import { iconsConfig } from "@/lib/icons/iconsConfig";
import { currencyFormatter } from "@/util/util";
import {
  checkChildVarients,
  childVarients,
  containerVarients,
} from "@/lib/animations";
import { use, useEffect, useState, useTransition } from "react";
import { registerEvent } from "@/lib/db/register-event";
import { UserContext } from "@/store/user-context";
import { toast } from "sonner";
import { supabase } from "@/lib/db/supabaseClient";

const CheckIcon = iconsConfig["check"];
const FireIcon = iconsConfig["fire"];
const TicketIcon = iconsConfig["ticket"];

export default function EventPricingGrid({ event, isPassed, isRegistered }) {
  const { user } = use(UserContext);
  const { id: userId } = user;
  const [ispanding, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);
  // console.log('e',event);

  const stats = [
    {
      value: !isPassed
        ? event.number_of_registered_attendees
        : event.number_of_attendants,
      label: !isPassed ? "Already Registered" : "Attended",
    },
    { value: event.number_of_speakers, label: "Number Of Speakers" },
    { value: event.attendees_capacity, label: "Total Capacity" },
  ];
  useEffect(() => {
    const hash = window.location.hash;

    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        element.classList.add("highlight-section");
        setTimeout(() => element.classList.remove("highlight-section"), 5000);
      }
    }
  }, []);

  async function handleEventRegisterClick() {
    if (!user.id) {
      toast.error("You're only one step away. Sign in to enroll.");
      startTransition(() => router.push("/auth"));
      return;
    }

    setLoading(true);
    try {
      // console.log("userid",userId);

      const { data, error: dataError } = await supabase
        .from("event_registered_attendees")
        .select("*")
        .eq("user_id", userId)
        .eq("event_id", event.id);

      if (dataError) throw dataError;
      const isRegistered = data.length > 0;

      if (isRegistered) {
        return toast.warning("You are already registered for this event");
      }

      const res = await registerEvent(userId, event.id);
      if (res.error) {
        toast.error("Something went wrong, please try again later.");
        return;
      }

      const { data: notificationsData, error: errorNotificatiosData } =
        await supabase.from("notifications").insert({
          user_id: userId,
          title: "Event Registration",
          message:
            "You have successfully registered for this event, we hope to see you soon",
        });

      if (errorNotificatiosData) throw errorNotificatiosData;

      toast.success(
        "You have successfully registered for this event, we hope to see you soon"
      );
    } catch (err) {
      console.error(err);
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  }
  return (
    <motion.div
      className={classes.eventPricingGrid}
      variants={containerVarients}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {/* Included Section */}
      <motion.div className={classes.includedCard}>
        <h3 className={classes.title}>What&apos;s Included</h3>
        <div className={classes.list}>
          {event.included.map((item, index) => (
            <div key={index} className={classes.item}>
              <motion.div
                className={`${classes.iconWrapper} bluePurple-bg`}
                variants={checkChildVarients}
              >
                <CheckIcon />
              </motion.div>
              <p className={classes.text}>{item}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Pricing Section */}
      <div className={classes.pricingWrapper}>
        <div className={classes.pricingCard}>
          <div className={classes.priceContainer}>
            <span className={classes.price}>
              {currencyFormatter.format(event.fee)}
            </span>
            <span className={classes.perPerson}>/ person</span>
          </div>

          <div className={classes.availability}>
            <span className={`${classes.seatsLeft} closed`}>
              <FireIcon /> Secure your spot now!
              {/* <FireIcon /> Only {pricingInfo.seatsLeft} seats left! */}
            </span>
          </div>

          <motion.button
            className={classes.registerBtn}
            initial={{
              opacity: 0,
              scale: 0,
            }}
            whileInView={{
              opacity: 1,
              scale: 1,
              transition: { type: "spring", duration: 0.2, ease: "easeOut" },
            }}
            viewport={{ once: true, amount: 0.3 }}
            onClick={handleEventRegisterClick}
          >
            <TicketIcon />{" "}
            {!isRegistered
              ? loading
                ? "Registering"
                : "Register Now"
              : "Registered"}
          </motion.button>

          {event.fee !== 0 && (
            <p className={classes.note}>
              Secure payment via Paystack • Full refund if cancelled
            </p>
          )}
        </div>

        <div className={classes.statsRow}>
          {stats.map((stat, index) => (
            <motion.div key={index} variants={childVarients}>
              <div className={classes.statBlock}>
                <div className={classes.statValue}>{stat.value}</div>
                <div className={classes.statLabel}>{stat.label}</div>
              </div>
              {index < stats.length - 1 && (
                <div className={classes.divider}></div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
