'use client'
import classes from "./footer.module.css";
import logoImg from "../assets/Webstack Logo white.png";

import {
  socialLinks,
  footerSections,
  legalLinks,
} from "@/lib/contents/footerData";

import { iconsConfig } from "@/lib/icons/iconsConfig";
import Image from "next/image";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className={classes.footer}>
      <div className={classes.container}>
        <div className={classes.grid}>
          <div className={classes.brandSection}>
            <Link href="/" className={classes.brandTitle}>
              <Image
                src={logoImg}
                alt="Webstack ICT Global Logo"
                fill
                sizes="200px"
                priority
              />
            </Link>
            <p className={classes.brandText}>
              Empowering Africa&apos;s next generation of tech professionals
              with world-class training, mentorship, and career opportunities.
            </p>

            <div className={classes.socials}>
              {socialLinks.map((social, index) => {
                const SocialIcon = iconsConfig[social.icon];
                return (
                  <a
                    key={index}
                    href={social.href || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={classes.socialIcon}
                    aria-label={`Follow us on ${social.icon}`}
                  >
                    <SocialIcon className={classes.home} />
                  </a>
                );
              })}
            </div>
          </div>

          {footerSections.map((section, index) => (
            <div key={index} className={`${classes.section} ${section.title === "Contact" ? classes.contactSection : ""}`}>
              <h3>{section.title}</h3>
              <ul>
                {section.links.map((link, i) => {
                  const Icon = link.icon ? iconsConfig[link.icon] : null;
                  return (
                    <li key={i}>
                      <Link href={link.href || "#"} className={classes.footerLink}>
                        {Icon && <Icon className={classes.footerIcon} />}
                        <span>{link.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className={classes.bottomBar}>
          <div className={classes.copy}>
            © {new Date().getFullYear()} WEBSTACK. All rights reserved.
          </div>
          <div className={classes.legalLinks}>
            {legalLinks.map((link, i) => (
              <Link key={i} href={link.href || "#"}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
