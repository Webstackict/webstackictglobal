import PageBanner from "@/components/hero/page-banner";
import classes from "./page.module.css";

import React from "react";
import Tagline from "@/components/ui/tagline";
import CardGrid from "@/components/cards/card-grid";

import { departments, ongoingCohorts } from "@/lib/contents/dept-and-cohorts";
import { graduateTestiomnials } from "@/lib/contents/testimonialData";
import { faqData } from "@/lib/contents/faqData";

import Section from "@/components/section";
import OngoingCohortsGrid from "@/components/academy/ongoing-cohorts-grid";
import BenefitsGrid from "@/components/cards/benefits-grid";
import ImmersiveCardGrid from "@/components/cards/immersive-card-grid";
import TestimonialGrid from "@/components/cards/testimonial-grid";
import FaqSection from "@/components/FAQ/faq";
import CTASection from "@/components/cta/call-to-action-section";
import LearningModesGrid from "@/components/academy/learning-modes";
import ValueQuote from "@/components/cards/value-quote";
import { ctaHomeHighlights } from "@/lib/contents/call-to-actionData";

export default function Academy() {
  return (
    <>
      <PageBanner
        title={
          <>
            Learn the Skills{" "}
            <span>
              That Drive <br /> the Future
            </span>
          </>
        }
        subtitle="Explore our departments and enroll in your next cohort. 
                   Transform your career with Africa's most comprehensive tech training programs."
        tagline={
          <>
            <Tagline text="Join our Academy" icon="school" />
          </>
        }
        primaryBtnText="Explore Our Departments"
        secondaryBtnText="See Ongoing Cohorts"
        primaryBtnRoute="departments"
        secondaryBtnRoute="active-cohorts"
      />

      <Section
        label="departments"
        title={
          <>
            Choose Your <span className="gradientText">Tech Journey</span>
          </>
        }
        subtitle="Join our ongoing programs and start your journey to becoming a tech professional. Limited seats available."
      >
        <CardGrid
          className={classes.departmentsGrid}
          items={departments}
          label="departments"
        />
      </Section>
      <Section
        label="active-cohorts"
        title={
          <>
            Active <span className="gradientText">Cohorts</span>
          </>
        }
        subtitle="Currently running programs and their progress"
        sectionBgColor="sectionLightBlue"
      >
        <OngoingCohortsGrid ongoingCohorts={ongoingCohorts} />
      </Section>

      <Section
        label="learning approach"
        title={
          <>
            Our <span className="gradientText">Learning Approach</span>
          </>
        }
        subtitle="Experience hands-on learning with industry experts, real projects, and personalized mentorship"
      >
        <ImmersiveCardGrid />
      </Section>

      <Section
        label="learning modes"
        title={
          <>
            Flexible <span className="gradientText">Learning Options</span>
          </>
        }
        subtitle="Choose the format that fits your lifestyle and learning preferences"
      >
        <LearningModesGrid />
        <ValueQuote
          title="Hybrid Option Available"
          text="Ypu can combine physical and remote learning for maximum flexibility."
        />
      </Section>

      <Section
        label="testimonials"
        title={
          <>
            Successs <span className="gradientText">Stories</span>
          </>
        }
        subtitle="Real transformations from our alumni who are now leading tech innovation across Africa and beyond."
        sectionBgColor="sectionLightBlue"
      >
        <TestimonialGrid testimonials={graduateTestiomnials} />
      </Section>

      <Section
        label="FAQ "
        title={
          <>
            Frequently <span className="gradientText">Askes Questions</span>
          </>
        }
        subtitle="Everything you need to know about our services."
      >
        <FaqSection faqData={faqData} />
      </Section>

      <CTASection
        title={
          <>
            Ready{" "}
            <span className="gradientText">
              To Transform Your <br /> Business / Career?
            </span>
          </>
        }
        subtitle="Join thousands of professionals and companies whohave accelerated their growth with WEBSTACK. Let's build the future of African tech together."
        ctaHighlights={ctaHomeHighlights}
        primaryBtnText="Join Our Next Cohort"
        primaryBtnRoute="departments"
      />
    </>
  );
}
