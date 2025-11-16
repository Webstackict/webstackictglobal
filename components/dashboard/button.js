import { iconsConfig } from "@/lib/icons/iconsConfig";
import classes from "./button.module.css";
import { useTransition } from "react";
import nProgress from "nprogress";
import { useRouter } from "next/navigation";

export default function Button({ text, icon, href }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const ButtonIcon = iconsConfig[icon];
  return (
    <button
      className={classes.dashBoardButton}
      onClick={() => {
        nProgress.start();
        startTransition(() => {
          router.push(href);
        });
      }}
    >
      <ButtonIcon /> {text}
    </button>
  );
}
