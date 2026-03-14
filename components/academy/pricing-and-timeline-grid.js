"use client";
import { motion } from "framer-motion";
import { containerVarients, childVarients } from "@/lib/animations";
import { use, useEffect, useState, useTransition } from "react";
import AcademyPricingCard from "./academy-pricing-card";
import CohortTimelineCard from "./cohort-timeline-card";
import classes from "./pricing-and-timeline-grid.module.css";
import { pricingData, cohortDetails } from "@/lib/contents/academy-pricingData";
import { UserContext } from "@/store/user-context";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { supabase } from "@/lib/db/supabaseClient";
import { safeQuerySelector } from "@/util/util";

export default function PricingAndTimelineGrid({
  department,
  isEnrolled,
  paymentStatus,
}) {
  const router = useRouter();
  const [ispanding, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);
  const { user } = use(UserContext);
  const { id: userId, email } = user;
  const amount = department.fee;
  const departmentId = department.id;
  const nextCohortId = department.next_cohort_id;
  const cohortMaxSize = department.max_size;

  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash !== "#") {
      const element = safeQuerySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        element.classList.add("highlight-section");
        setTimeout(() => element.classList.remove("highlight-section"), 5000);
      }
    }
  });

  async function startPayment() {
    if (!user.id) {
      toast.error("You're only one step away. Sign in to enroll.");
      startTransition(() => router.push("/auth"));
      return;
    }

    if (!nextCohortId) {
      toast.error("Enrollment for this program is currently closed. Please check back later.");
      return;
    }

    setLoading(true);
    try {
      const { count, error } = await supabase
        .from("enrollments")
        .select("*", { count: "exact", head: true })
        .eq("cohort_id", nextCohortId)
        .eq("payment_status", "PAID");

      if (error) throw error;

      if (count >= cohortMaxSize) {
        toast.info(
          "Current cohort is full. Please wait till the next cohort enrollment begins"
        );
        return;
      }
      const res = await fetch("/api/paystack/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          departmentId,
          nextCohortId,
          email,
          amount,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Payment init failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  }

  async function continuePayment() {
    if (!user.id) {
      toast.error("You're only one step away. Sign in to enroll.");
      startTransition(() => router.push("/auth"));
      return;
    }

    if (!nextCohortId) {
      toast.error("Enrollment for this program is currently closed. Please check back later.");
      return;
    }

    setLoading(true);
    try {
      const { count, error } = await supabase
        .from("enrollments")
        .select("*", { count: "exact", head: true })
        .eq("cohort_id", nextCohortId)
        .eq("payment_status", "PAID");

      if (error) throw error;

      if (count >= cohortMaxSize) {
        toast.info(
          "Current cohort is full. Please wait till the next cohort enrollment begins"
        );

        const { data: deleteData, error: deleteDataError } = await supabase
          .from("enrollments")
          .delete()
          .eq("user_id", userId)
          .eq("department_id", departmentId)
          .eq("cohort_id", nextCohortId)
          .eq("payment_status", "PENDING");

        if (deleteDataError) throw deleteDataError;

        return;
      }

      const { data: paystackRefData, error: paystackRefError } = await supabase
        .from("enrollments")
        .select("paystack_auth_url, created_at")
        .eq("user_id", userId)
        .eq("department_id", departmentId)
        .eq("cohort_id", nextCohortId)
        .maybeSingle();

      if (paystackRefError) {
        console.error("Supabase enrollment lookup error:", {
          message: paystackRefError.message,
          code: paystackRefError.code,
          details: paystackRefError.details,
        });
        throw paystackRefError;
      }

      if (!paystackRefData) {
        toast.error("Enrollment record not found. Please restart the process.");
        return;
      }

      const authorizationUrl = paystackRefData.paystack_auth_url;
      const rawDate = paystackRefData.created_at;
      const createdAt = rawDate.split(".")[0];
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

      if (createdAt < twentyFourHoursAgo) {
        // URL expired, delete and initialize new transaction
        const { data: deleteData, error: deleteDataError } = await supabase
          .from("enrollments")
          .delete()
          .eq("user_id", userId)
          .eq("department_id", departmentId)
          .eq("cohort_id", nextCohortId)
          .eq("payment_status", "PENDING");

        if (deleteDataError) throw deleteDataError;

        const res = await fetch("/api/paystack/init", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            departmentId,
            nextCohortId,
            email,
            amount,
          }),
        });
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        } else {
          toast.error("Payment init failed");
        }
        return;
      }

      window.location.href = authorizationUrl;
    } catch (err) {
      console.error(err);
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      className={classes.container}
      variants={containerVarients}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {/* Pricing Card */}
      <AcademyPricingCard
        pricingData={pricingData}
        department={department}
        variants={childVarients}
        isEnrolled={isEnrolled}
        paymentStatus={paymentStatus}
        startPayment={startPayment}
        continuePayment={continuePayment}
        loading={loading}
      />

      {/* Cohort Timeline */}
      <CohortTimelineCard
        cohortDetails={cohortDetails}
        department={department}
        variants={childVarients}
      />
    </motion.div>
  );
}
