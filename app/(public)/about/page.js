import Timeline from "@/components/about/timeline";
import TeamGrid from "@/components/cards/team-grid";
import PageBanner from "@/components/hero/page-banner";
import Section from "@/components/section";
import Tagline from "@/components/ui/tagline";
import classes from "./page.module.css";

import { leaders, teamMembers } from "@/lib/contents/teamData";
import StatsBig from "@/components/stats-big";
import BenefitsGrid from "@/components/cards/benefits-grid";

import {
  coreValues,
  successStats,
  timelineData,
  missionVision,
  ourApproach
} from "@/lib/contents/aboutData";
import SuccessStatsGrid from "@/components/cards/success-stats-grid";
import SuccessQuote from "@/components/about/success-quote";
import CTASection from "@/components/cta/call-to-action-section";
import { ctaAboutHighlights } from "@/lib/contents/call-to-actionData";
import { Suspense } from "react";
import PastEventsWrapper from "@/components/serverWrappers/past-events-wrapper";
import IconRenderer from "@/components/ui/icon-renderer";

export const metadata = {
  title: "About Webstack ICT Global | Empowering Africa Through Technology",
  description:
    "Founded in 2022, Webstack ICT Global is a fast-growing technology training and innovation hub committed to equipping individuals with the digital skills required to thrive in the modern economy.",
};

export default function About() {
  return (
    <>
      <PageBanner
        title={
          <>
            Empowering Africa <br /> <span>Through Technology</span>
          </>
        }
        subtitle="Webstack ICT Global is a fast-growing technology training and innovation hub committed to equipping individuals with the digital skills required to thrive in the modern economy. Founded in 2022, we are bridging Africa’s digital skills gap by providing practical, industry-relevant technology education."
        tagline={
          <>
            <Tagline text="Our Story" icon="book" />
          </>
        }
        primaryBtnText="Our Programs"
        secondaryBtnText="Contact Us"
        primaryBtnRoute="/programs/academy"
        secondaryBtnRoute="/contact"
      />

      <Section
        label="vision-mission"
        className={classes.visionMissionSection}
      >
        <div className={classes.visionMissionGrid} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div className="card" style={{ padding: '2.5rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ color: 'var(--blue-500)', marginBottom: '1.5rem' }}>
              <IconRenderer iconName={missionVision.vision.icon} sx={{ fontSize: 40 }} />
            </div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '1rem' }}>{missionVision.vision.title}</h3>
            <p style={{ color: 'var(--gray-text-400)', lineHeight: '1.7', fontSize: '1.1rem' }}>{missionVision.vision.text}</p>
          </div>
          <div className="card" style={{ padding: '2.5rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ color: 'var(--teal-500)', marginBottom: '1.5rem' }}>
              <IconRenderer iconName={missionVision.mission.icon} sx={{ fontSize: 40 }} />
            </div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '1rem' }}>{missionVision.mission.title}</h3>
            <p style={{ color: 'var(--gray-text-400)', lineHeight: '1.7', fontSize: '1.1rem' }}>{missionVision.mission.text}</p>
          </div>
        </div>
      </Section>

      <Section
        label="what-we-do"
        title={
          <>
            What <span className="gradientText">We Do</span>
          </>
        }
        subtitle="At Webstack ICT Global, we focus on practical training, real-world experience, and innovation. Beyond training, we provide ICT consultancy and technology solutions to help businesses leverage digital tools for growth."
        sectionBgColor="sectionLightBlue"
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
          {[
            "Website Development", "Data Analysis", "Cybersecurity",
            "Mobile App Development", "Digital Marketing", "AI Automation",
            "UI/UX Design", "Forex Trading"
          ].map((item, idx) => (
            <div key={idx} className="card" style={{ padding: '1.5rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600' }}>
              {item}
            </div>
          ))}
        </div>
      </Section>

      <Section
        label="our-approach"
        title={
          <>
            Our <span className="gradientText">Approach</span>
          </>
        }
        subtitle="What makes Webstack ICT Global different is our commitment to practical learning and mentorship. We believe technology cannot be mastered through theory alone."
      >
        <BenefitsGrid className={classes.coreValuesGrid} items={ourApproach} />
      </Section>

      <Section
        label="timeline"
        title={
          <>
            Our <span className="gradientText">Journey of Innovation</span>
          </>
        }
        subtitle="Since our founding in 2022, Webstack ICT Global has continued to grow, training aspiring tech professionals and supporting businesses with digital solutions."
        sectionBgColor="sectionLightBlue"
      >
        <Timeline timeline={timelineData} />
      </Section>

      <Section
        label="community"
        title={
          <>
            Building a <span className="gradientText">Tech Community</span>
          </>
        }
        subtitle="Webstack ICT Global is more than a training center. We are building a vibrant technology community that encourages collaboration, innovation, and growth through workshops, events, and mentorship."
      >
        <Suspense fallback={<p>Loading Upcoming Events</p>}>
          <PastEventsWrapper />
        </Suspense>
        <StatsBig />
      </Section>

      <Section
        label="leaders"
        title={
          <>
            Our <span className="gradientText">Leaders</span>
          </>
        }
        subtitle="Our visionary leaders bring decades of experience to guide Africa's tech transformation."
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
        subtitle="Meet the passionate educators and mentors who make WEBSTACK's transformative learning experience possible."
      >
        <TeamGrid team={teamMembers} className={classes.teamMembersGrid} />
      </Section>

      <Section
        label="shaping futures"
        title={
          <>
            Transforming Lives,{" "}
            <span className="gradientText">Shaping Futures</span>
          </>
        }
        subtitle="As we expand, our focus remains clear — to empower Africa’s next generation of innovators and technology leaders. The future is digital, and Webstack is helping Africa lead that future."
        sectionBgColor="sectionLightBlue"
      >
        <SuccessStatsGrid data={successStats} />
        <SuccessQuote />
      </Section>

      <CTASection
        title={
          <>
            Ready to Join <br />
            <span className="gradientText">
              Africa&apos;s Tech Revolution?
            </span>
          </>
        }
        subtitle="Take the first step towards transforming your career and becoming part of Africa's most dynamic tech community. Your future in technology starts here."
        ctaHighlights={ctaAboutHighlights}
        primaryBtnText="Explore Programs"
        primaryBtnRoute="/programs/academy"
      />
    </>
  );
}
