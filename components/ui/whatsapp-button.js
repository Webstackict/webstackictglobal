"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import classes from "./whatsapp-button.module.css";

export default function WhatsAppButton() {
    const phoneNumber = "+2349026902323";
    const message = "Hello Webstack ICT Global, I want to learn a tech skill.";
    const whatsappUrl = `https://wa.me/${phoneNumber.replace("+", "")}?text=${encodeURIComponent(message)}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={classes.whatsappFloat}
            aria-label="Contact us on WhatsApp"
        >
            <div className={classes.pulse}></div>
            <FontAwesomeIcon icon={faWhatsapp} className={classes.whatsappIcon} />
        </a>
    );
}
