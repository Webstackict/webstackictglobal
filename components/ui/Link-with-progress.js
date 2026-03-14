"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import nProgress from "nprogress";
import { useTransition } from "react";

export default function LinkWithProgress({ href, children, ...props }) {
  const pathName = usePathname();
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  function handleClick(e) {
    e.preventDefault();
    const isAnchor = href?.startsWith("#");
    if (pathName === href || isAnchor || !href || href === "#") {
      try {
        nProgress.done();
      } catch (err) {
        // Ignore nProgress errors
      }
      return;
    }

    try {
      nProgress.start();
    } catch (err) {
      console.warn("nProgress failed to start:", err);
    }

    startTransition(() => {
      router.push(href);
    });
  }
  return (
    <Link href={href} {...props} onClick={handleClick}>
      {children}
    </Link>
  );
}
