import classes from "./footer.module.css";

import {
  socialLinks,
  footerSections,
  legalLinks,
} from "@/lib/contents/footerData";

import { iconsConfig } from "@/lib/icons/iconsConfig";

export default function Footer() {
  return (
    <footer className={classes.footer}>
      <div className={classes.container}>
        <div className={classes.grid}>
          <div className={classes.brandSection}>
            <div className={classes.brandTitle}>WEBSTACK</div>
            <p className={classes.brandText}>
              Empowering Africa&apos;s next generation of tech professionals with
              world-class training, mentorship, and career opportunities.
            </p>

            <div className={classes.socials}>
              {socialLinks.map((social, index) => {
                const SocialIcon = iconsConfig[social.icon];
                return (
                  <span key={index} className={classes.socialIcon}>
                    <SocialIcon className={classes.home} />
                  </span>
                );
              })}
            </div>
          </div>

          {footerSections.map((section, index) => (
            <div key={index} className={classes.section}>
              <h3>{section.title}</h3>
              <ul>
                {section.links.map((link, i) => (
                  <li key={i}>
                    <span>{link}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={classes.bottomBar}>
          <div className={classes.copy}>
            © 2024 WEBSTACK. All rights reserved.
          </div>
          <div className={classes.legalLinks}>
            {legalLinks.map((link, i) => (
              <span key={i}>{link}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
