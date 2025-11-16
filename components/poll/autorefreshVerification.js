"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";


export default function AutoRefreshIfVerified({ email }) {
  const router = useRouter();
  const checking = useRef(false);

  useEffect(() => {
    const check = async () => {
      if (checking.current) return;
      checking.current = true;

      try {
        const res = await fetch("/api/check-verification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
          cache: "no-store",
        });

        const data = await res.json();
        console.log("verified? =>", data.verified);

        if (data.verified) {
          window.location.href = "/dashboard";
        }
      } catch (err) {
        console.log("Check failed:", err);
      }

      checking.current = false;
    };

    const interval = setInterval(check, 3000);
    return () => clearInterval(interval);
  }, [email, router]);

  return null;
}
