import Timeline from "@/components/about/timeline";
import TeamGrid from "@/components/cards/team-grid";
import PageBanner from "@/components/hero/page-banner";
import Section from "@/components/section";
import Tagline from "@/components/ui/tagline";
import classes from "./page.module.css";

import { leaders, teamMembers } from "@/lib/contents/teamData";
import ActivitiesGrid from "@/components/about/activities-grid";
import StatsBig from "@/components/stats-big";
import BenefitsGrid from "@/components/cards/benefits-grid";

import { coreValues } from "@/lib/contents/aboutData";
import ValueQuote from "@/components/cards/value-quote";
import SuccessStatsGrid from "@/components/cards/success-stats-grid";
import SuccessQuote from "@/components/about/success-quote";
import CTASection from "@/components/cta/call-to-action-section";
import { ctaABoutHighlights } from "@/lib/contents/call-to-actionData";

export const metadata = {
  title: "Our Story at Webstack",
  description:
    "WEBSTACK is pioneering the transformation of Africa's digital landscape through world-class training, innovation hubs,  and community-driven tech excellence. We're not just teaching code; we're building the next generation of tech leaders.",
};

export default function About() {
  return (
    <>
      <PageBanner
        title={
          <>
            Setting{" "}
            <span>
              Tech Innovation <br /> Standard in Africa
            </span>
          </>
        }
        subtitle="WEBSTACK is pioneering the transformation of Africa's digital landscape through world-class training, innovation hubs, 
                     and community-driven tech excellence. We're not just teaching code; we're building the next generation of tech leaders."
        tagline={
          <>
            <Tagline text="All About Us" icon="book" />
          </>
        }
        primaryBtnText="Explore Our Story"
        secondaryBtnText="See Our Community"
        primaryBtnRoute="timeline"
        secondaryBtnRoute="community"
      />

      <Section
        label="timeline"
        title={
          <>
            Our <span className="gradientText">Journey of Innovation</span>
          </>
        }
        subtitle="From a small training center to Africa's leading tech hub, our story is one of 
                  relentless pursuit of excellence, community building, and technological advancement."
      >
        <Timeline />
      </Section>
      <Section
        label="leaders"
        title={
          <>
            Our <span className="gradientText">Leaders</span>
          </>
        }
        subtitle="Our visionary leaders bring decades of combined experience from top global tech companies, 
                   prestigious universities, and successful startups to guide Africa's tech transformation."
        sectionBgColor="sectionLightBlue"
      >
        <TeamGrid team={leaders} />
      </Section>
      <Section
        label="staffs"
        title={
          <>
            Our <span className="gradientText">Expert Team Members</span>
          </>
        }
        subtitle="Meet the passionate educators, industry experts, and mentors who make WEBSTACK's transformative 
                   learning experience possible. Our team combines deep technical expertise with exceptional teaching abilities."
      >
        <TeamGrid team={teamMembers} className={classes.teamMembersGrid} />
      </Section>
      <Section
        label="community"
        title={
          <>
            Our <span className="gradientText">Vibrant Community</span>
          </>
        }
        subtitle="Experience the energy, collaboration, and innovation that defines the WEBSTACK community. 
                     From intensive training sessions to hackathons and networking events, we're building Africa's most dynamic tech ecosystem."
        sectionBgColor="sectionLightBlue"
      >
        <ActivitiesGrid />
        <StatsBig />
      </Section>

      <Section
        label="core values"
        title={
          <>
            Our <span className="gradientText">Core Values</span>
          </>
        }
        subtitle="These fundamental principles guide everything we do at WEBSTACK. They shape our 
         culture, drive our decisions, and inspire our mission to transform Africa's tech landscape."
      >
        <BenefitsGrid className={classes.coreValuesGrid} items={coreValues} />

        <ValueQuote
          title="Living Our Values Daily"
          text="These values aren't just words on a wall - they're the foundation of how
          we operate, teach, and build relationships within our community every
          single day."
        />
      </Section>
      <Section
        label="shaping futures"
        title={
          <>
            Transforming Lives,{" "}
            <span className="gradientText">Shaping Futures</span>
          </>
        }
        subtitle="Our impact extends far beyond training programs. We're creating sustainable career paths, building tech 
        ecosystems, and contributing to Africa's digital transformation."
        sectionBgColor="sectionLightBlue"
      >
        <SuccessStatsGrid />
        <SuccessQuote />
      </Section>

      <CTASection
        title={
          <>
            Ready{" "}
            <span className="gradientText">
              Ready to Join Africa&apos;s <br /> Tech Revolution?
            </span>
          </>
        }
        subtitle="Take the first step towards transforming your career and becoming part of Africa's most dynamic tech community. Your future in technology starts here."
        ctaHighlights={ctaABoutHighlights}
        primaryBtnText="Checkout Our Community"
        primaryBtnRoute="community"
      />
    </>
  );
}
