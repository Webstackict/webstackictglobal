"use client";
import { iconsConfig } from "@/lib/icons/iconsConfig";

export default function IconRenderer({ iconName }) {
  const Icon = iconsConfig[iconName];

  if (!Icon) {
    console.warn(`IconRenderer: Icon "${iconName}" not found in iconsConfig.`);
    return null;
  }

  return <Icon />;
}
