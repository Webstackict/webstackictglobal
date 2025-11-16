import BenefitsGrid from "@/components/cards/benefits-grid";
import PageBanner from "@/components/hero/page-banner";
import Section from "@/components/section";
import Tagline from "@/components/ui/tagline";

import classes from "./page.module.css";

import { contactData } from "@/lib/contents/contact-optionsData";
import ContactForm from "@/components/contact/contact-form";
import AddressGrid from "@/components/contact/address";
import InteractiveMap from "@/components/interactive-map";
import FaqSection from "@/components/FAQ/faq";
import { faqDataContacts } from "@/lib/contents/faqData";

export const metadata = {
  title: "Let's Connect at Webstack",
  description:
    "Join Africa's premier tech community. Whether you're looking to learn, collaborate, or innovate, we're here to support your journey in technology.",
};

export default function Contact() {
  return (
    <>
      <PageBanner
        title={
          <>
            Let&apos;s{" "}
            <span>
              Connect and <br /> Innovate
            </span>
          </>
        }
        subtitle="Join Africa's premier tech community. Whether you're looking to learn, collaborate, or innovate, 
        we're here to support your journey in technology."
        tagline={
          <>
            <Tagline text="Contact Us" icon="phoneCall" />
          </>
        }
        primaryBtnText="Book a Visit"
        secondaryBtnText="View Our Details"
        primaryBtnRoute="contact-form"
        secondaryBtnRoute="contact-options"
      />

      <Section
        label="contact-options"
        title={
          <>
            Multiple <span className="gradientText">Ways to Reach Us</span>
          </>
        }
        subtitle="Choose the communication method that works best for you"
      >
        <BenefitsGrid
          className={classes.contactOptionsGrid}
          items={contactData}
        />
      </Section>
      <Section
        label="contact-form"
        title={
          <>
            Send <span className="gradientText">Us a Message</span>
          </>
        }
        subtitle="Fill out the form below and our team will get back to you within 24 hours"
        sectionBgColor="sectionLightBlue"
      >
        <ContactForm />
      </Section>
      <Section
        label="visit our tech hub"
        title={
          <>
            Visit <span className="gradientText">Our Tech Hub</span>
          </>
        }
        subtitle="Located in the heart of Awka, our modern facility is designed for collaboration and innovation."
      >
        <AddressGrid />
      </Section>
      <Section
        label="map"
        title={
          <>
            Find <span className="gradientText">Us on the Map</span>
          </>
        }
        subtitle="Located in the vibrant district of Aroma, High Tension, Ifite Road."
        sectionBgColor="sectionLightBlue"
      >
        <InteractiveMap />
      </Section>

      <Section
        label="FAQ "
        title={
          <>
            Frequently <span className="gradientText">Asked Questions</span>
          </>
        }
        subtitle="Everything you need to know about our services."
      >
        <FaqSection faqData={faqDataContacts} />
      </Section>
    </>
  );
}
