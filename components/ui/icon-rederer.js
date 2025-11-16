"use client";
import { iconsConfig } from "@/lib/icons/iconsConfig";

export default function IconRenderer({ iconName }) {
  const Icon = iconsConfig[iconName];
  return <Icon />;
}
