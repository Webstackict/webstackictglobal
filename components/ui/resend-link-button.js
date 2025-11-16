"use client";

import { resendVerification } from "@/actions/resend-verificatiion";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ResendButton({
  userId,
  email,
  waitResend,
  lastResend,
  children,
  ...props
}) {
  const [wait, setWait] = useState(waitResend);
  const [lastSent, setLastSent] = useState(lastResend);

  const diff = lastSent
    ? Math.floor((Date.now() - new Date(lastSent)) / 1000)
    : 999;
  const initialCountdown = diff < 60 ? 60 - diff : 0;

  const [countDown, setCountDown] = useState(initialCountdown);

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = Math.floor((Date.now() - new Date(lastSent)) / 1000);
      const shouldWait = diff < 60;

      setWait(shouldWait);
      setCountDown(shouldWait ? 60 - diff : 0);
    }, 1000);

    return () => clearInterval(timer);
  }, [lastSent]);

  return (
    <button
      {...props}
      onClick={async () => {
        const res = await resendVerification(email, lastSent, userId);

        if (res.error) {
          console.log(res.error);

          toast.error(res.error);
          return;
        }

        toast.success("Confirmation link sent. Check your email!");

        const now = new Date().toISOString();
        setLastSent(now);
        setWait(true);
      }}
      disabled={wait}
    >
      {wait ? `Wait ${countDown}s` : children}
    </button>
  );
}
