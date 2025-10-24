import BenefitsGrid from "@/components/cards/benefits-grid";
import PageBanner from "@/components/hero/page-banner";
import Section from "@/components/section";
import Tagline from "@/components/ui/tagline";
import classes from "./page.module.css";
import CurriculumGrid from "@/components/academy/curriculum-grid";

import { departments } from "@/lib/contents/dept-and-cohorts";
import {
  getDepartmentHighlights,
  separateDepartmentName,
  getDepartmentCurriculum,
} from "@/util/util";

import PricingAndTimelineGrid from "@/components/academy/pricing-&-timeline-grid";
import PartnershipsGrid from "@/components/cards/partnerships-grid";
import { techStacks } from "@/lib/contents/tech-stacks";
import TestimonialGrid from "@/components/cards/testimonial-grid";
import StatsBig from "@/components/stats-big";
import FaqSection from "@/components/FAQ/faq";
import CTASection from "@/components/cta/call-to-action-section";
import { faqData } from "@/lib/contents/faqData";
import { graduateTestiomnials } from "@/lib/contents/testimonialData";
import { ctaHomeHighlights } from "@/lib/contents/call-to-actionData";

export async function generateMetadata({ params }) {
  const deptSlug = (await params).slug;
  const department = departments.find((dept) => dept.slug === deptSlug);

  return {
    title: `Study ${department.name} at WEBSTACK-ICT-GLOBAL`,
    description: department.description,
    openGraph: {
      title: `Registration is Ongoing for ${department.name} | WEBSTACK-ICT-GLOBAL`,
      description: department.description,
      url: `https://webstack-ict-global.vercel.app/programs/academy/${deptSlug}`,
      siteName: "WEBSTACK-ICT-GLOBAL",
      images: [
        {
          url: "https://webstack-ict-global.vercel.app/logo/webstack-logo-white.png",
          width: 160,
          height: 50,
          alt: "Webstack Banner",
        },
      ],
      locale: "en_US",
      type: "article",
    },
    twitter: {
      card: "summary",
      title: department.name,
      description: department.description,
    },
  };
}

export default async function DepartmentDetails({ params }) {
  const deptSlug = (await params).slug;

  const department = departments.find((dept) => dept.slug === deptSlug);

  const { firstDeptName, secondDeptName } = separateDepartmentName(
    department.name
  );

  const highlights = getDepartmentHighlights(department);

  const { curriculum, additionalSkills } = getDepartmentCurriculum(
    department.name
  );

  return (
    <>
      <PageBanner
        title={
          <>
            Learn{" "}
            <span>
              {firstDeptName} <br /> {secondDeptName}
            </span>
          </>
        }
        subtitle={department.description}
        tagline={
          <>
            <Tagline text={department.name} icon={department.icon} />
          </>
        }
        primaryBtnText="Pricing"
        secondaryBtnText="See Curriculum"
        primaryBtnRoute="pricing-and-timeline"
        secondaryBtnRoute="curriculum"
      />

      <Section label="highlights">
        <BenefitsGrid
          className={classes.departmentHighlightsGrid}
          items={highlights}
        />
      </Section>

      <Section
        label="curriculum"
        title={
          <>
            Complete <span className="gradientText">Learning Path</span>
          </>
        }
        subtitle="Our carefully crafted curriculum takes you from beginner to professional developer 
                 through hands-on projects and industry best practices."
      >
        <CurriculumGrid items={curriculum} department={department.name} />
        <BenefitsGrid
          className={classes.additionalSkillsGrid}
          items={additionalSkills}
        />
      </Section>
      <Section
        label="pricing-and-timeline"
        title={
          <>
            Pricing <span className="gradientText">&amp; Timeline</span>
          </>
        }
        subtitle="Transparent pricing with flexible payment options and upcoming cohort dates"
        sectionBgColor="sectionLightBlue"
      >
        <PricingAndTimelineGrid department={department} />
      </Section>

      <Section
        label="Technology Stack"
        title={
          <>
            Technology <span className="gradientText">Stack</span>
          </>
        }
        subtitle="Master the same tools used by top tech companies worldwide"
      >
        <PartnershipsGrid items={techStacks} label="tech-stack" />
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
        <StatsBig />
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
        primaryBtnText="Join the Next Cohort"
        primaryBtnRoute="pricing-and-timeline"
      />
    </>
  );
}
