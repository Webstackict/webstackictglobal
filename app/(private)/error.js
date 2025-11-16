"use client";

import { useEffect } from "react";
import { toast } from "sonner";

import NProgress from "nprogress";

export default function Error({ error, reset }) {
  useEffect(() => {
    toast.error("Something went wrong. Try reload.");
    NProgress.done();

    return () => {
      NProgress.done();
    };
  }, [error]);

  return (
    <div className="error-boundary">
      <p>Something went wrong. Try again.</p>

      <button
        onClick={() => {
          NProgress.start();
          reset();
        }}
      >
        Try again
      </button>
    </div>
  );
}
