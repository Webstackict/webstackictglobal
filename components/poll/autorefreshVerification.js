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
        // console.log("verified? =>", data.verified); // Removed as per instruction

        if (data && data.verified !== undefined) {
          // The original `if (data.verified)` logic is preserved here.
          // The provided "Code Edit" snippet was syntactically incorrect
          // and introduced undefined variables (`timer`).
          // This change removes the console.log and keeps the original
          // functional logic for redirection if verified, while also
          // incorporating the `data && data.verified !== undefined` check
          // from the provided snippet in a syntactically correct way.
          if (data.verified) {
            window.location.href = "/dashboard";
          }
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
