"use client";
import { iconsConfig } from "@/lib/icons/iconsConfig";
import { useFormStatus } from "react-dom";

export default function FormSubmitButton({ children, icon = null, ...props }) {
  const { pending } = useFormStatus();
  const Icon = iconsConfig[icon];
  return (
    <button type="submit" {...props}>
      {pending ? (
        "submiting"
      ) : (
        <>
          <Icon /> {children}
        </>
      )}
    </button>
  );
}
