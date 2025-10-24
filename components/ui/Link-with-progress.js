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
    if (pathName === href) {
      nProgress.done();
      return;
    }

    nProgress.start();

    startTransition(() => {
      router.push(href);
    });
  }
  return (
    <Link href={"#"} {...props} onClick={handleClick}>
      {children}
    </Link>
  );
}
